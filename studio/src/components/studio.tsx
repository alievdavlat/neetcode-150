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
import type { Problem, ProblemSource, ProblemState, ProblemStatus, RunReport } from '@/lib/types';

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

const STORAGE_KEY = 'neetcode-studio:last-problem';

const EMPTY_COUNTS: Record<ProblemState, number> = {
  solved: 0,
  failing: 0,
  attempted: 0,
  'not-started': 0,
};

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function Studio({ problems, statuses: initialStatuses }: StudioProps) {
  const [statuses, setStatuses] = useState<Record<string, ProblemStatus>>(() =>
    Object.fromEntries(initialStatuses.map((status) => [status.number, status])),
  );
  const [activeNumber, setActiveNumber] = useState(problems[0]?.number ?? '');
  const [source, setSource] = useState<string | null>(null);
  const [savedSource, setSavedSource] = useState<string | null>(null);
  const [links, setLinks] = useState<Pick<ProblemSource, 'leetcode' | 'video'>>({ leetcode: null, video: null });
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<RunReport | null>(null);
  const busy = useRef(false);

  const active = problems.find((problem) => problem.number === activeNumber);
  const dirty = source !== null && source !== savedSource;
  const file = active?.file ?? '';

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && problems.some((problem) => problem.number === stored)) setActiveNumber(stored);
  }, [problems]);

  useEffect(() => {
    if (file === '') return;

    const controller = new AbortController();
    setSource(null);
    setSavedSource(null);
    setReport(null);
    window.localStorage.setItem(STORAGE_KEY, activeNumber);

    request<ProblemSource>(`/api/file?file=${encodeURIComponent(file)}`, { signal: controller.signal })
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
  }, [file, activeNumber]);

  const persist = () => {
    if (!active || source === null) return Promise.resolve(false);

    setSaving(true);
    return request<SaveResponse>('/api/file', {
      method: 'PUT',
      body: JSON.stringify({ file: active.file, source }),
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
      .then((ok) => ok && toast.success('Saved to disk'))
      .finally(() => {
        busy.current = false;
      });
  };

  const handleRun = () => {
    if (!active || busy.current) return;

    busy.current = true;
    setRunning(true);

    const number = active.number;
    const ready = dirty ? persist() : Promise.resolve(true);

    ready
      .then((ok) => {
        if (!ok) return null;
        return request<RunResponse>('/api/run', { method: 'POST', body: JSON.stringify({ number }) });
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
      <StudioHeader counts={counts} total={problems.length} />

      <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
        <ResizablePanel defaultSize="19" minSize="13">
          <ProblemRail
            problems={problems}
            statuses={statuses}
            activeNumber={active.number}
            onSelect={setActiveNumber}
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
                source={source}
                dirty={dirty}
                saving={saving}
                running={running}
                onChange={setSource}
                onSave={handleSave}
                onRun={handleRun}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize="38" minSize="15">
              <VerdictPanel report={report} running={running} problemTitle={active.title} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
