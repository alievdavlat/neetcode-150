import { NextResponse } from 'next/server';
import type { SourceMode } from '@/lib/types';

export const ok = <T>(data: T) => NextResponse.json({ success: true, data });

export const fail = (error: unknown, status = 400) =>
  NextResponse.json(
    { success: false, message: error instanceof Error ? error.message : String(error) },
    { status },
  );

/** Anything but an explicit practice request works on the real solution file. */
export const modeOf = (value: unknown): SourceMode => (value === 'scratch' ? 'scratch' : 'file');
