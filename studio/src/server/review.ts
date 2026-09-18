import type { ProblemStatus } from '@/lib/types';

/**
 * Everything waiting, most overdue first. A leech is out of the rotation on
 * purpose, so it can never be the thing strict mode locks you behind.
 */
export function dueQueue(statuses: ProblemStatus[]): ProblemStatus[] {
  return statuses
    .filter((status) => status.history.due && !status.history.leech)
    .sort((left, right) => (left.history.dueInDays ?? 0) - (right.history.dueInDays ?? 0));
}
