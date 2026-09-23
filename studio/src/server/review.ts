import type { ProblemStatus } from '@/lib/types';

/**
 * Everything waiting, soonest first. It sorts on the due date itself rather
 * than the rounded day count: two problems a couple of hours apart both round
 * to "due now", and whichever the sort happened to pick first was the one
 * strict mode locked you behind.
 *
 * A leech is out of the rotation on purpose, so it can never be that problem.
 */
export function dueQueue(statuses: ProblemStatus[]): ProblemStatus[] {
  return statuses
    .filter((status) => status.history.due && !status.history.leech)
    .sort((left, right) => Date.parse(left.history.dueAt ?? '') - Date.parse(right.history.dueAt ?? ''));
}
