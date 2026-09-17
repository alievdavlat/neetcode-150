'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { CommandPalette } from './command-palette';
import { SolutionDiff } from './solution-diff';
import { ProblemBrief } from './problem-brief';
import { ProblemRail } from './problem-rail';
import { SolutionEditor } from './solution-editor';
import { StudioHeader } from './studio-header';
import { TracePanel } from './trace-panel';
import { VerdictPanel } from './verdict-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UNKNOWN_STATUS } from '@/lib/meta';
import { request } from '@/lib/api';
import type {
  Collection,
  Problem,
  ProblemSource,
  ProblemState,
  ProblemStatus,
  RunReport,
  SolutionSnapshot,
  SourceMode,
  TraceResult,
  TypeMarker,
} from '@/lib/types';

interface StudioProps {
  problems: Problem[];
  statuses: ProblemStatus[];
  collections: Collection[];
}

interface SaveResponse {
  status: ProblemStatus;
}

interface RunResponse {
  report: RunReport;
  status: ProblemStatus;
}

interface SyncResponse {
  statuses: ProblemStatus[];
}

interface TypecheckResponse {
  markers: TypeMarker[];
}

interface NoteResponse {
  note: string;
}

interface SnapshotResponse {
  snapshots: SolutionSnapshot[];
}

const LAST_KEY = 'neetcode-studio:last-problem';
const MODE_KEY = 'neetcode-studio:mode';
const BIGO_KEY = 'neetcode-studio:big-o';
const COLLECTION_KEY = 'neetcode-studio:collection';
const ALL_COLLECTION = 'all';

const EMPTY_COUNTS: Record<ProblemState, number> = {
  solved: 0,
  failing: 0,
  attempted: 0,
  'not-started': 0,
};

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

const storedMode = (number: string): SourceMode =>
  window.localStorage.getItem(`${MODE_KEY}:${number}`) === 'scratch' ? 'scratch' : 'file';

export function Studio({ problems, statuses: initialStatuses, collections }: StudioProps) {
  const [statuses, setStatuses] = useState<Record<string, ProblemStatus>>(() =>
    Object.fromEntries(initialStatuses.map((status) => [status.number, status])),
  );
  const [activeNumber, setActiveNumber] = useState(problems[0]?.number ?? '');
  const [mode, setMode] = useState<SourceMode>('file');
  const [source, setSource] = useState<string | null>(null);
  const [savedSource, setSavedSource] = useState<string | null>(null);
  const [links, setLinks] = useState<Pick<ProblemSource, 'leetcode' | 'video'>>({ leetcode: null, video: null });
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [bigO, setBigO] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [runningCategory, setRunningCategory] = useState<string | null>(null);
  const [markers, setMarkers] = useState<TypeMarker[]>([]);
  const [collectionId, setCollectionId] = useState(ALL_COLLECTION);
  const [note, setNote] = useState('');
  const [snapshots, setSnapshots] = useState<SolutionSnapshot[]>([]);
  const [diffOpen, setDiffOpen] = useState(false);
  const [checkingTypes, setCheckingTypes] = useState(false);
  const [report, setReport] = useState<RunReport | null>(null);
  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [tracing, setTracing] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const busy = useRef(false);
  const synced = useRef(false);
  const checking = useRef(false);

  const active = problems.find((problem) => problem.number === activeNumber);
  const dirty = source !== null && source !== savedSource;
  const file = active?.file ?? '';

  useEffect(() => {
    const stored = window.localStorage.getItem(LAST_KEY);
    if (!stored || !problems.some((problem) => problem.number === stored)) return;

    setActiveNumber(stored);
    setMode(storedMode(stored));
  }, [problems]);

  useEffect(() => {
    setBigO(window.localStorage.getItem(BIGO_KEY) !== 'off');

    const storedCollection = window.localStorage.getItem(COLLECTION_KEY);
    if (storedCollection) setCollectionId(storedCollection);
  }, []);

  useEffect(() => {
    if (file === '') return;

    const controller = new AbortController();
    setSource(null);
    setSavedSource(null);
    setReport(null);
    setMarkers([]);
    setTrace(null);
    setActiveLine(null);
    setVariant(null);
    setCaseIndex(0);
    window.localStorage.setItem(LAST_KEY, activeNumber);

    const number = activeNumber;
    request<{ recorded: boolean }>('/api/open', { method: 'POST', body: JSON.stringify({ number }) }).catch(() => null);
    request<NoteResponse>(`/api/notes?number=${number}`).then((payload) => setNote(payload.note)).catch(() => setNote(''));
    request<SnapshotResponse>(`/api/solutions?number=${number}`)
      .then((payload) => setSnapshots(payload.snapshots))
      .catch(() => setSnapshots([]));

    request<ProblemSource>(`/api/file?file=${encodeURIComponent(file)}&source=${mode}`, {
      signal: controller.signal,
    })
      .then((payload) => {
        setSource(payload.source);
        setSavedSource(payload.source);
        setLinks({ leetcode: payload.leetcode, video: payload.video });
        checkTypes();
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        toast.error(messageOf(error));
      });

    return () => controller.abort();
  }, [file, activeNumber, mode]);

  const pending = Object.values(statuses).filter(
    (status) => status.state !== 'not-started' && (status.ranAt === null || status.stale),
  ).length;

  const sync = () => {
    setSyncing(true);
    return request<SyncResponse>('/api/sync', { method: 'POST' })
      .then((payload) => {
        setStatuses(Object.fromEntries(payload.statuses.map((status) => [status.number, status])));
        return payload.statuses.length;
      })
      .catch((error: unknown) => {
        toast.error(messageOf(error));
        return null;
      })
      .finally(() => setSyncing(false));
  };

  const handleSync = () => {
    if (syncing) return;

    const checking = pending;
    sync().then((ok) => {
      if (ok === null) return;
      toast.success(checking === 0 ? 'Everything was already checked' : `Rechecked ${checking} problems`);
    });
  };

  useEffect(() => {
    if (synced.current || pending === 0) return;

    synced.current = true;
    sync();
  }, [pending]);

  const checkTypes = () => {
    if (!active || mode === 'scratch' || checking.current) return;

    const target = active.file;
    checking.current = true;
    setCheckingTypes(true);
    request<TypecheckResponse>('/api/typecheck', { method: 'POST', body: JSON.stringify({ file: target }) })
      .then((payload) => setMarkers(payload.markers))
      .catch(() => setMarkers([]))
      .finally(() => {
        checking.current = false;
        setCheckingTypes(false);
      });
  };

  const persist = () => {
    if (!active || source === null) return Promise.resolve(false);

    setSaving(true);
    return request<SaveResponse>('/api/file', {
      method: 'PUT',
      body: JSON.stringify({ file: active.file, source, mode }),
    })
      .then((payload) => {
        setSavedSource(source);
        setStatuses((current) => ({ ...current, [payload.status.number]: payload.status }));
        checkTypes();
        return true;
      })
      .catch((error: unknown) => {
        toast.error(messageOf(error));
        return false;
      })
      .finally(() => setSaving(false));
  };

  const handleSave = () => {
    if (!dirty || busy.current) return;

    busy.current = true;
    persist()
      .then((ok) => ok && toast.success(mode === 'scratch' ? 'Saved to the practice copy' : 'Saved to disk'))
      .finally(() => {
        busy.current = false;
      });
  };

  const runWith = (probe: boolean) => {
    if (!active || busy.current) return;

    busy.current = true;
    setRunning(true);

    const number = active.number;
    const ready = dirty ? persist() : Promise.resolve(true);

    ready
      .then((ok) => {
        if (!ok) return null;
        return request<RunResponse>('/api/run', {
          method: 'POST',
          body: JSON.stringify({ number, mode, bigO: probe }),
        });
      })
      .then((payload) => {
        if (!payload) return;
        setReport(payload.report);
        seedTrace(payload.report);
        setStatuses((current) => ({ ...current, [payload.status.number]: payload.status }));

        return request<SnapshotResponse>(`/api/solutions?number=${number}`)
          .then((fresh) => setSnapshots(fresh.snapshots))
          .catch(() => null);
      })
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => {
        setRunning(false);
        busy.current = false;
      });
  };

  /** After a run, follow the first export, and the first case that failed if one did. */
  const seedTrace = (next: RunReport) => {
    const first = next.variants[0];
    setVariant(first?.name ?? null);
    const failingAt = first?.cases.findIndex((item) => !item.passed) ?? -1;
    setCaseIndex(failingAt === -1 ? 0 : failingAt);
    setTrace(null);
    setActiveLine(null);
  };

  const traceVariants = report?.variants.map((entry) => entry.name) ?? [];
  const traceCases =
    report?.variants
      .find((entry) => entry.name === variant)
      ?.cases.map((item) => ({ label: item.label, passed: item.passed })) ?? [];

  const handlePick = (pickedVariant: string, pickedCase: number) => {
    setVariant(pickedVariant);
    setCaseIndex(pickedCase);
    setTrace(null);
    setActiveLine(null);
  };

  const handleTrace = async () => {
    if (!active || !variant) {
      toast.error('Run it once first, so the tracer knows which export to follow');
      return;
    }

    setTracing(true);
    try {
      const answer = await request<{ trace: TraceResult }>('/api/trace', {
        method: 'POST',
        body: JSON.stringify({ number: active.number, variant, caseIndex, mode }),
      });
      setTrace(answer.trace);
    } catch (error) {
      toast.error(messageOf(error));
    } finally {
      setTracing(false);
    }
  };

  const handleRun = () => runWith(bigO);

  const handleBigOChange = (next: boolean) => {
    window.localStorage.setItem(BIGO_KEY, next ? 'on' : 'off');
    setBigO(next);
  };

  const handleMeasure = () => {
    handleBigOChange(true);
    runWith(true);
  };

  const handleNoteSave = (next: string) => {
    if (!active) return;

    const number = active.number;
    request<{ saved: boolean }>('/api/notes', { method: 'PUT', body: JSON.stringify({ number, note: next }) })
      .then(() => {
        setNote(next);
        toast.success('Note saved');
      })
      .catch((error: unknown) => toast.error(messageOf(error)));
  };

  const handleSnippet = (line: string) => {
    if (source === null) return;

    setSource(`${source.replace(/\s*$/, '')}
${line}
`);
    toast.success('Added to the end of the file — save when you are ready');
  };

  const handleCollectionChange = (id: string) => {
    window.localStorage.setItem(COLLECTION_KEY, id);
    setCollectionId(id);
  };

  const handleHint = (level: number) => {
    if (!active) return;

    const number = active.number;
    request<SaveResponse>('/api/hint', { method: 'POST', body: JSON.stringify({ number, level }) })
      .then((payload) => setStatuses((current) => ({ ...current, [payload.status.number]: payload.status })))
      .catch((error: unknown) => toast.error(messageOf(error)));
  };

  const handleRunCategory = (dir: string) => {
    if (runningCategory !== null) return;

    setRunningCategory(dir);
    request<SyncResponse>('/api/run-category', { method: 'POST', body: JSON.stringify({ dir }) })
      .then((payload) => {
        setStatuses(Object.fromEntries(payload.statuses.map((status) => [status.number, status])));
        toast.success(`Ran ${dir}`);
      })
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => setRunningCategory(null));
  };

  const handlePromote = () => {
    if (!active || busy.current) return;

    busy.current = true;
    setPromoting(true);

    const target = active.file;
    const ready = dirty ? persist() : Promise.resolve(true);

    ready
      .then((ok) => {
        if (!ok) return null;
        return request<SaveResponse>('/api/promote', { method: 'POST', body: JSON.stringify({ file: target }) });
      })
      .then((payload) => {
        if (!payload) return;
        setStatuses((current) => ({ ...current, [payload.status.number]: payload.status }));
        window.localStorage.setItem(`${MODE_KEY}:${activeNumber}`, 'file');
        setMode('file');
        toast.success('Practice copy is now your solution');
      })
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => {
        setPromoting(false);
        busy.current = false;
      });
  };

  const applySelection = (number: string) => {
    setActiveNumber(number);
    setMode(storedMode(number));
  };

  const warnUnsaved = (discard: () => void) =>
    toast('Unsaved changes', {
      description: `${file} has edits that were never saved.`,
      action: { label: 'Discard', onClick: discard },
    });

  const handleSelect = (number: string) => {
    if (number === activeNumber) return;
    if (dirty) return warnUnsaved(() => applySelection(number));

    applySelection(number);
  };

  const handleModeChange = (next: SourceMode) => {
    if (next === mode) return;

    const apply = () => {
      window.localStorage.setItem(`${MODE_KEY}:${activeNumber}`, next);
      setMode(next);
    };

    if (dirty) return warnUnsaved(apply);

    apply();
  };

  const step = (delta: number) => {
    const index = problems.findIndex((problem) => problem.number === activeNumber);
    const next = problems[index + delta];
    if (next) handleSelect(next.number);
  };

  const jumpToUnsolved = () => {
    const index = problems.findIndex((problem) => problem.number === activeNumber);
    const ordered = [...problems.slice(index + 1), ...problems.slice(0, index)];
    const next = ordered.find((problem) => (statuses[problem.number]?.state ?? 'not-started') !== 'solved');
    if (next) handleSelect(next.number);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;

      if (event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        step(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        step(-1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        jumpToUnsolved();
        return;
      }

      if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        handleSave();
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  if (!active) return null;

  const allCollections: Collection[] = [
    {
      id: ALL_COLLECTION,
      name: 'All',
      description: 'Every problem in the workspace',
      numbers: problems.map((problem) => problem.number),
    },
    ...collections,
  ];
  const picked = collections.find((entry) => entry.id === collectionId);
  const visible = picked ? problems.filter((problem) => picked.numbers.includes(problem.number)) : problems;

  const counts = Object.values(statuses).reduce(
    (totals, status) => ({ ...totals, [status.state]: totals[status.state] + 1 }),
    EMPTY_COUNTS,
  );

  return (
    <div className="flex h-dvh flex-col">
      <SolutionDiff
        open={diffOpen}
        title={active.title}
        current={source ?? ''}
        snapshots={snapshots}
        onOpenChange={setDiffOpen}
      />

      <CommandPalette
        open={paletteOpen}
        problems={problems}
        statuses={statuses}
        onOpenChange={setPaletteOpen}
        onSelect={handleSelect}
      />

      <StudioHeader
        counts={counts}
        total={problems.length}
        pending={pending}
        syncing={syncing}
        onSync={handleSync}
      />

      <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
        <ResizablePanel defaultSize="19" minSize="13">
          <ProblemRail
            problems={visible}
            statuses={statuses}
            collections={allCollections}
            collectionId={collectionId}
            onCollectionChange={handleCollectionChange}
            activeNumber={active.number}
            runningCategory={runningCategory}
            onSelect={handleSelect}
            onRunCategory={handleRunCategory}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize="32" minSize="20">
          <ProblemBrief
            problem={active}
            status={statuses[active.number] ?? UNKNOWN_STATUS}
            leetcode={links.leetcode ?? active.leetcode}
            video={links.video}
            note={note}
            onHint={handleHint}
            onNoteSave={handleNoteSave}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize="49" minSize="26">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="62" minSize="25">
              <SolutionEditor
                file={active.file}
                mode={mode}
                source={source}
                dirty={dirty}
                saving={saving}
                running={running}
                promoting={promoting}
                bigO={bigO}
                markers={markers}
                activeLine={activeLine}
                checkingTypes={checkingTypes}
                snapshots={snapshots.length}
                onCompare={() => setDiffOpen(true)}
                onChange={setSource}
                onModeChange={handleModeChange}
                onBigOChange={handleBigOChange}
                onSave={handleSave}
                onRun={handleRun}
                onPromote={handlePromote}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize="38" minSize="15">
              <Tabs defaultValue="verdict" className="flex h-full min-h-0 flex-col gap-0">
                <TabsList className="mx-3 mt-2 self-start">
                  <TabsTrigger value="verdict">Verdict</TabsTrigger>
                  <TabsTrigger value="trace">Simulation</TabsTrigger>
                </TabsList>

                <TabsContent value="verdict" className="min-h-0 flex-1">
                  <VerdictPanel
                    report={report}
                    running={running}
                    bigO={bigO}
                    problemTitle={active.title}
                    onMeasure={handleMeasure}
                    onSnippet={handleSnippet}
                  />
                </TabsContent>

                <TabsContent value="trace" className="min-h-0 flex-1">
                  <TracePanel
                    trace={trace}
                    tracing={tracing}
                    variants={traceVariants}
                    cases={traceCases}
                    variant={variant}
                    caseIndex={caseIndex}
                    onPick={handlePick}
                    onTrace={handleTrace}
                    onStep={setActiveLine}
                  />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
