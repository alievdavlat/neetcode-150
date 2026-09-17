import { NextResponse } from 'next/server';

export const ok = <T>(data: T) => NextResponse.json({ success: true, data });

export const fail = (error: unknown, status = 400) =>
  NextResponse.json(
    { success: false, message: error instanceof Error ? error.message : String(error) },
    { status },
  );
