'use client';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DIFFICULTY_META, duration, STATE_META, UNKNOWN_STATUS } from '@/lib/meta';
import type { Course, Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  problems: Problem[];
  statuses: Record<string, ProblemStatus>;
  courses?: Course[];
  onOpenChange: (open: boolean) => void;
  onSelect: (number: string) => void;
  onCourse?: (id: string) => void;
}

export function CommandPalette({
  open,
  problems,
  statuses,
  courses = [],
  onOpenChange,
  onSelect,
  onCourse,
}: CommandPaletteProps) {
  const handleSelect = (number: string) => {
    onSelect(number);
    onOpenChange(false);
  };

  const handleCourse = (id: string) => {
    onCourse?.(id);
    onOpenChange(false);
  };

  const renderCourse = (course: Course) => (
    <CommandItem
      key={course.id}
      value={`${course.name} ${course.title} ${course.channel} ${course.track}`}
      onSelect={() => handleCourse(course.id)}
      className="gap-3"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-cool" />
      <span className="flex-1 truncate">{course.name}</span>
      <span className="truncate text-[11px] opacity-60">{course.channel}</span>
      <span className="font-mono text-[10px] opacity-60">{duration(course.seconds)}</span>
    </CommandItem>
  );

  const renderItem = (problem: Problem) => {
    const status = statuses[problem.number] ?? UNKNOWN_STATUS;

    return (
      <CommandItem
        key={problem.number}
        value={`${problem.number} ${problem.title} ${problem.category} ${problem.pattern}`}
        onSelect={() => handleSelect(problem.number)}
        className="gap-3"
      >
        <span className={cn('size-1.5 shrink-0 rounded-full', STATE_META[status.state].dot)} />
        <span className="font-mono text-[11px] opacity-60">{problem.number}</span>
        <span className="flex-1 truncate">{problem.title}</span>
        {status.history.due && <span className="text-[10px] text-medium">due</span>}
        <span className={cn('text-[10px]', DIFFICULTY_META[problem.difficulty].text)}>{problem.difficulty}</span>
      </CommandItem>
    );
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Jump to a problem or a course"
      description="Search by number, title, category, pattern or course"
    >
      <Command key={open ? 'open' : 'closed'}>
        <CommandInput placeholder="Jump to a problem…" />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          <CommandGroup heading="Problems">{problems.map(renderItem)}</CommandGroup>
          {courses.length > 0 && <CommandGroup heading="Courses">{courses.map(renderCourse)}</CommandGroup>}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
