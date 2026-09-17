'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ProblemBrief } from './problem-brief';
import { ProblemRail } from './problem-rail';
import { SolutionEditor } from './solution-editor';
import { StudioHeader } from './studio-header';
import { VerdictPanel } from './verdict-panel';
import { UNKNOWN_STATUS } from '@/lib/meta';
import { request } from '@/lib/api';
import type { Problem, ProblemSource, ProblemState, ProblemStatus, RunReport, SourceMode } from '@/lib/types';

interface StudioProps {
  problems: Problem[];
  statuses: ProblemStatus[];
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

const LAST_KEY = 'neetcode-studio:last-problem';
const MODE_KEY = 'neetcode-studio:mode';
const BIGO_KEY = 'neetcode-studio:big-o';

const EMPTY_COUNTS: Record<ProblemState, number> = {
  solved: 0,
  failing: 0,
  attempted: 0,
  'not-started': 0,
};

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

const storedMode = (number: string): SourceMode =>
  window.localStorage.getItem(`${MODE_KEY}:${number}`) === 'scratch' ? 'scratch' : 'file';

export function Studio({ problems, statuses: initialStatuses }: StudioProps) {
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
  const [report, setReport] = useState<RunReport | null>(null);
  const busy = useRef(false);
  const synced = useRef(false);

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
  }, []);

  useEffect(() => {
    if (file === '') return;

    const controller = new AbortController();
    setSource(null);
    setSavedSource(null);
    setReport(null);
    window.localStorage.setItem(LAST_KEY, activeNumber);

    request<ProblemSource>(`/api/file?file=${encodeURIComponent(file)}&source=${mode}`, {
      signal: controller.signal,
    })
      .then((payload) => {
        setSource(payload.source);
        setSavedSource(payload.source);
        setLinks({ leetcode: payload.leetcode, video: payload.video });
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
        setStatuses((current) => ({ ...current, [payload.status.number]: payload.status }));
      })
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => {
        setRunning(false);
        busy.current = false;
      });
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

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;

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

  const counts = Object.values(statuses).reduce(
    (totals, status) => ({ ...totals, [status.state]: totals[status.state] + 1 }),
    EMPTY_COUNTS,
  );

  return (
    <div className="flex h-dvh flex-col">
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
            problems={problems}
            statuses={statuses}
            activeNumber={active.number}
            onSelect={handleSelect}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize="32" minSize="20">
          <ProblemBrief
            problem={active}
            status={statuses[active.number] ?? UNKNOWN_STATUS}
            leetcode={links.leetcode ?? active.leetcode}
            video={links.video}
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
              <VerdictPanel
                report={report}
                running={running}
                bigO={bigO}
                problemTitle={active.title}
                onMeasure={handleMeasure}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
