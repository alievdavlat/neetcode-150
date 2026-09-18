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
import { ReviewBar, type ReviewSession } from './review-bar';
import { TracePanel } from './trace-panel';
import { VerdictPanel } from './verdict-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { ALL_BOARD, UNKNOWN_STATUS } from '@/lib/meta';
import { request } from '@/lib/api';
import type {
  Collection,
  Course,
  Problem,
  ProblemSource,
  ProblemState,
  ProblemStatus,
  OperationProbe,
  RunReport,
  Settings,
  SolutionSnapshot,
  SourceMode,
  TraceResult,
  TypeMarker,
} from '@/lib/types';

interface StudioProps {
  problems: Problem[];
  statuses: ProblemStatus[];
  collections: Collection[];
  courses: Course[];
  boardId: string;
  /** The problem the URL asked for, so the first paint is not a blank page. */
  initialNumber: string;
  settings: Settings;
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
const FOCUS_KEY = 'neetcode-studio:focus';

const EMPTY_COUNTS: Record<ProblemState, number> = {
  solved: 0,
  failing: 0,
  attempted: 0,
  'not-started': 0,
};

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

const storedMode = (number: string): SourceMode =>
  window.localStorage.getItem(`${MODE_KEY}:${number}`) === 'scratch' ? 'scratch' : 'file';

export function Studio({
  problems,
  statuses: initialStatuses,
  collections,
  courses,
  boardId,
  initialNumber,
  settings,
}: StudioProps) {
  const router = useRouter();
  const search = useSearchParams();
  const [statuses, setStatuses] = useState<Record<string, ProblemStatus>>(() =>
    Object.fromEntries(initialStatuses.map((status) => [status.number, status])),
  );
  const [activeNumber, setActiveNumber] = useState(initialNumber);
  const [mode, setMode] = useState<SourceMode>('file');
  const [source, setSource] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [links, setLinks] = useState<Pick<ProblemSource, 'leetcode' | 'video'>>({ leetcode: null, video: null });
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [bigO, setBigO] = useState(true);
  const [focus, setFocus] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [runningCategory, setRunningCategory] = useState<string | null>(null);
  const [runningBoard, setRunningBoard] = useState(false);
  const [markers, setMarkers] = useState<TypeMarker[]>([]);
  const [note, setNote] = useState('');
  const [snapshots, setSnapshots] = useState<SolutionSnapshot[]>([]);
  const [diffOpen, setDiffOpen] = useState(false);
  const [checkingTypes, setCheckingTypes] = useState(false);
  const [report, setReport] = useState<RunReport | null>(null);
  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [tracing, setTracing] = useState(false);
  const [ops, setOps] = useState<OperationProbe | null>(null);
  const [counting, setCounting] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const [panel, setPanel] = useState('verdict');
  const [jumpLine, setJumpLine] = useState<{ line: number; at: number } | null>(null);
  const [session, setSession] = useState<ReviewSession | null>(null);
  const draft = useRef('');
  const baseline = useRef('');
  const showing = useRef('');
  const busy = useRef(false);
  const opened = useRef<string | null>(null);
  const reviewStarted = useRef(false);
  const synced = useRef(false);
  const checking = useRef(false);

  const allCollections: Collection[] = [
    {
      id: ALL_BOARD,
      name: 'All Problems',
      description: 'Everything in this workspace',
      numbers: problems.map((problem) => problem.number),
    },
    ...collections,
  ];
  const board = allCollections.find((entry) => entry.id === boardId);
  const picked = collections.find((entry) => entry.id === boardId);
  const visible = picked ? problems.filter((problem) => picked.numbers.includes(problem.number)) : problems;

  const active = problems.find((problem) => problem.number === activeNumber);
  const file = active?.file ?? '';

  /** Hand a file to the editor: the live buffer, the baseline and the flag move together. */
  const loadSource = (next: string | null) => {
    draft.current = next ?? '';
    baseline.current = next ?? '';
    setSource(next);
    setDirty(false);
  };

  /**
   * Typing must not re-render the workspace — the rail alone is a thousand rows,
   * and a render that lands a keystroke late used to throw the caret to the end
   * of the file. The buffer lives in a ref; only the unsaved flag is state.
   */
  const handleChange = (next: string) => {
    draft.current = next;
    setDirty(next !== baseline.current);
  };

  /**
   * A link from the home search names its problem; otherwise pick up where he left
   * off, but only if that problem is in this board. Anything else opens at the top.
   */
  useEffect(() => {
    if (visible.length === 0 || opened.current === boardId) return;
    opened.current = boardId;

    const inBoard = (number: string | null) =>
      Boolean(number) && visible.some((problem) => problem.number === number);
    const wanted =
      [search.get('p'), window.localStorage.getItem(LAST_KEY)].find(inBoard) ?? visible[0].number;

    setActiveNumber(wanted);
    setMode(storedMode(wanted));
  }, [boardId, visible, search]);

  useEffect(() => {
    setBigO(window.localStorage.getItem(BIGO_KEY) !== 'off');
    setFocus(window.localStorage.getItem(FOCUS_KEY) === 'on');
  }, []);

  /**
   * Which problem the screen is actually showing. Every answer that arrives
   * later checks against this: switching problems while a request is in flight
   * used to paint the old problem's snapshots, report and note onto the new one.
   */
  useEffect(() => {
    showing.current = activeNumber;
  });

  /** A link from the review queue opens straight into a session. */
  const asked = search.get('review');
  useEffect(() => {
    if (asked !== '1' || !active || session || reviewStarted.current) return;
    reviewStarted.current = true;
    startReview(active.number);
  }, [asked, active, session]);

  useEffect(() => {
    if (file === '') return;

    const controller = new AbortController();
    loadSource(null);
    setReport(null);
    setMarkers([]);
    setTrace(null);
    setOps(null);
    setActiveLine(null);
    setVariant(null);
    setCaseIndex(0);
    setJumpLine(null);
    setNote('');
    setSnapshots([]);
    window.localStorage.setItem(LAST_KEY, activeNumber);

    const number = activeNumber;
    const mine = () => showing.current === number;

    request<{ recorded: boolean }>('/api/open', { method: 'POST', body: JSON.stringify({ number }) }).catch(() => null);
    request<NoteResponse>(`/api/notes?number=${number}`)
      .then((payload) => mine() && setNote(payload.note))
      .catch(() => null);
    request<SnapshotResponse>(`/api/solutions?number=${number}`)
      .then((payload) => mine() && setSnapshots(payload.snapshots))
      .catch(() => null);

    request<ProblemSource>(`/api/file?file=${encodeURIComponent(file)}&source=${mode}`, {
      signal: controller.signal,
    })
      .then((payload) => {
        loadSource(payload.source);
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
    const number = active.number;
    checking.current = true;
    setCheckingTypes(true);
    request<TypecheckResponse>('/api/typecheck', { method: 'POST', body: JSON.stringify({ file: target }) })
      .then((payload) => showing.current === number && setMarkers(payload.markers))
      .catch(() => null)
      .finally(() => {
        checking.current = false;
        setCheckingTypes(false);
      });
  };

  const persist = () => {
    if (!active || source === null) return Promise.resolve(false);

    const sent = draft.current;
    const number = active.number;
    setSaving(true);
    return request<SaveResponse>('/api/file', {
      method: 'PUT',
      body: JSON.stringify({ file: active.file, source: sent, mode }),
    })
      .then((payload) => {
        setStatuses((current) => ({ ...current, [payload.status.number]: payload.status }));
        if (showing.current !== number) return true;

        baseline.current = sent;
        setDirty(draft.current !== sent);
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
        setStatuses((current) => ({ ...current, [payload.status.number]: payload.status }));
        if (showing.current !== number) return;

        setReport(payload.report);
        seedTrace(payload.report);

        if (session) {
          const ran = { ...session, runs: session.runs + 1 };
          const green = payload.report.variants.some((entry) => entry.total > 0 && entry.passed === entry.total);
          if (green) finishReview(ran, true);
          else setSession(ran);
        }

        return request<SnapshotResponse>(`/api/solutions?number=${number}`)
          .then((fresh) => showing.current === number && setSnapshots(fresh.snapshots))
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
    if (pickedVariant !== variant) setOps(null);
  };

  const handleCount = () => {
    if (!active || !variant || counting) {
      if (!variant) toast.error('Run it once first, so the counter knows which export to follow');
      return;
    }

    const number = active.number;
    setCounting(true);
    request<{ ops: OperationProbe }>('/api/ops', {
      method: 'POST',
      body: JSON.stringify({ number, variant, mode }),
    })
      .then((answer) => showing.current === number && setOps(answer.ops))
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => setCounting(false));
  };

  const handleTrace = async (input?: unknown[]) => {
    if (!active || !variant || busy.current) {
      if (!variant) toast.error('Run it once first, so the tracer knows which export to follow');
      return;
    }

    busy.current = true;
    setTracing(true);
    try {
      const saved = dirty ? await persist() : true;
      if (!saved) return;

      const number = active.number;
      const answer = await request<{ trace: TraceResult }>('/api/trace', {
        method: 'POST',
        body: JSON.stringify({ number, variant, caseIndex, mode, input: input ?? null }),
      });
      if (showing.current === number) setTrace(answer.trace);
    } catch (error) {
      toast.error(messageOf(error));
    } finally {
      setTracing(false);
      busy.current = false;
    }
  };

  const handleGiveUp = () => {
    if (session) finishReview(session, false);
  };

  const handleLineClick = (line: number) => {
    setPanel('trace');
    setJumpLine({ line, at: Date.now() });
  };

  const startReview = async (number: string) => {
    const problem = problems.find((entry) => entry.number === number);
    if (!problem) return;

    try {
      const answer = await request<{ source: string }>('/api/review/start', {
        method: 'POST',
        body: JSON.stringify({ number }),
      });

      setActiveNumber(number);
      setMode('scratch');
      loadSource(answer.source);
      setSession({
        number,
        kind: 'solve',
        startedAt: Date.now(),
        runs: 0,
        revealed: false,
        baseline: statuses[number]?.history.solveMinutes ?? null,
      });
    } catch (error) {
      toast.error(messageOf(error));
    }
  };

  const finishReview = async (current: ReviewSession, passed: boolean) => {
    setSession(null);

    try {
      const answer = await request<{ grade: number; status: ProblemStatus }>('/api/review', {
        method: 'POST',
        body: JSON.stringify({
          number: current.number,
          kind: 'solve',
          passed,
          revealed: current.revealed,
          runs: current.runs,
          hints: 0,
          minutes: Math.max(1, Math.round((Date.now() - current.startedAt) / 60000)),
          baseline: current.baseline,
        }),
      });

      setStatuses((now) => ({ ...now, [answer.status.number]: answer.status }));

      const next = answer.status.history.reviewDays;
      if (answer.grade === 2) toast.success(`Clean recall — back in ${next} days`);
      else if (answer.grade === 1) toast.message(`Got there — back in ${next} days`);
      else toast.error('Marked for tomorrow');

      if (passed && !current.revealed && snapshots.length > 0) setDiffOpen(true);
    } catch (error) {
      toast.error(messageOf(error));
    }
  };

  const handleReveal = () => {
    if (!session) return;
    setSession({ ...session, revealed: true });
    setMode('file');
  };

  const handleRun = () => runWith(bigO);

  const handleBigOChange = (next: boolean) => {
    window.localStorage.setItem(BIGO_KEY, next ? 'on' : 'off');
    setBigO(next);
  };

  /** Focus mode drops the list and the brief; the editor and its verdict are the work. */
  const handleFocusChange = (next: boolean) => {
    window.localStorage.setItem(FOCUS_KEY, next ? 'on' : 'off');
    setFocus(next);
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

    const next = `${draft.current.replace(/\s*$/, '')}
${line}
`;
    draft.current = next;
    setSource(next);
    setDirty(next !== baseline.current);
    toast.success('Added to the end of the file — save when you are ready');
  };

  const handleCollectionChange = (id: string) => router.push(`/c/${id}`);

  const handleHint = (level: number) => {
    if (!active) return;

    const number = active.number;
    request<SaveResponse>('/api/hint', { method: 'POST', body: JSON.stringify({ number, level }) })
      .then((payload) => setStatuses((current) => ({ ...current, [payload.status.number]: payload.status })))
      .catch((error: unknown) => toast.error(messageOf(error)));
  };

  const handleRunBoard = () => {
    if (runningBoard || runningCategory !== null) return;

    setRunningBoard(true);
    request<SyncResponse>('/api/run-board', {
      method: 'POST',
      body: JSON.stringify({ numbers: visible.map((problem) => problem.number) }),
    })
      .then((payload) => {
        setStatuses(Object.fromEntries(payload.statuses.map((status) => [status.number, status])));
        toast.success(`Ran ${board?.name ?? 'this board'}`);
      })
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => setRunningBoard(false));
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

      if (event.key === '\\') {
        event.preventDefault();
        handleFocusChange(!focus);
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

  /** The header reports this board, not the whole workspace. */
  const counts = visible.reduce((totals, problem) => {
    const state = statuses[problem.number]?.state ?? 'not-started';
    return { ...totals, [state]: totals[state] + 1 };
  }, EMPTY_COUNTS);

  return (
    <div className="flex h-dvh flex-col">
      <SolutionDiff
        open={diffOpen}
        title={active.title}
        current={draft.current}
        snapshots={snapshots}
        onOpenChange={setDiffOpen}
      />

      <CommandPalette
        open={paletteOpen}
        problems={problems}
        statuses={statuses}
        courses={courses}
        onOpenChange={setPaletteOpen}
        onSelect={handleSelect}
        onCourse={(id) => router.push(`/courses/${id}`)}
      />

      <StudioHeader
        collections={allCollections}
        boardId={boardId}
        counts={counts}
        total={visible.length}
        pending={pending}
        syncing={syncing}
        focus={focus}
        runningBoard={runningBoard}
        onRunBoard={handleRunBoard}
        onCollectionChange={handleCollectionChange}
        onFocusChange={handleFocusChange}
        onSync={handleSync}
      />

      {session && (
        <ReviewBar
          session={session}
          title={active.title}
          onReveal={handleReveal}
          onGiveUp={handleGiveUp}
        />
      )}

      <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
        {!focus && (
          <ResizablePanel id="rail" defaultSize="19" minSize="13">
            <ProblemRail
              problems={visible}
              statuses={statuses}
              activeNumber={active.number}
              locked={settings.strictMode && session !== null}
              runningCategory={runningCategory}
              onSelect={handleSelect}
              onRunCategory={handleRunCategory}
            />
          </ResizablePanel>
        )}

        {!focus && <ResizableHandle withHandle />}

        {!focus && (
        <ResizablePanel id="brief" defaultSize="32" minSize="20">
          <ProblemBrief
            problem={active}
            status={statuses[active.number] ?? UNKNOWN_STATUS}
            leetcode={links.leetcode ?? active.leetcode}
            video={links.video}
            note={note}
            reviewing={session !== null}
            repeating={settings.reviewEnabled}
            onStartReview={() => startReview(active.number)}
            onHint={handleHint}
            onNoteSave={handleNoteSave}
          />
        </ResizablePanel>
        )}

        {!focus && <ResizableHandle withHandle />}

        <ResizablePanel id="editor" defaultSize="49" minSize="26">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="62" minSize="25">
              <SolutionEditor
                file={active.file}
                mode={mode}
                reviewing={session !== null}
                source={source}
                dirty={dirty}
                saving={saving}
                running={running}
                promoting={promoting}
                bigO={bigO}
                markers={markers}
                activeLine={panel === 'trace' ? activeLine : null}
                onLineClick={handleLineClick}
                checkingTypes={checkingTypes}
                snapshots={snapshots.length}
                onCompare={() => setDiffOpen(true)}
                onChange={handleChange}
                onModeChange={handleModeChange}
                onBigOChange={handleBigOChange}
                onSave={handleSave}
                onRun={handleRun}
                onPromote={handlePromote}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize="38" minSize="15">
              <Tabs
                value={panel}
                onValueChange={setPanel}
                className="flex h-full min-h-0 flex-col gap-0"
              >
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

                <TabsContent value="trace" forceMount className="min-h-0 flex-1 data-[state=inactive]:hidden">
                  <TracePanel
                    trace={trace}
                    tracing={tracing}
                    ops={ops}
                    counting={counting}
                    variants={traceVariants}
                    cases={traceCases}
                    variant={variant}
                    caseIndex={caseIndex}
                    jumpLine={jumpLine}
                    onPick={handlePick}
                    onTrace={handleTrace}
                    onCount={handleCount}
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
