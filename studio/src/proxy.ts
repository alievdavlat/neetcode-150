import { NextResponse, type NextRequest } from 'next/server';

const COOKIE = 'neetcode-studio-key';
const A_MONTH = 60 * 60 * 24 * 30;
const WRITES = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const READ_ONLY =
  'this deployment is read only - set STUDIO_PASSWORD on the deployment to save, run and trace';

const refuse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

/**
 * Saving a file and then running it is what this app is for, which on a public
 * URL is a stranger executing code on the host. So a deployment is one of two
 * things, and never anything in between:
 *
 * - `STUDIO_PASSWORD` set: the whole app, once `?key=<password>` has been
 *   visited and left a cookie behind.
 * - not set: reading only. Every write and every run is refused, which is what
 *   makes the app safe to link to.
 *
 * Locally there is nothing to protect - the app is the workspace, on the same
 * machine as the person using it - so neither rule applies unless a password
 * was deliberately set.
 *
 * `proxy` rather than `middleware`: Next 16 renamed the convention and warns on
 * the old name.
 */
export function proxy(request: NextRequest) {
  const password = process.env.STUDIO_PASSWORD;

  if (!password) {
    if (!process.env.VERCEL || !WRITES.has(request.method)) return NextResponse.next();
    return refuse(READ_ONLY, 403);
  }

  if (request.cookies.get(COOKIE)?.value === password) return NextResponse.next();

  if (request.nextUrl.searchParams.get('key') === password) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete('key');

    const response = NextResponse.redirect(clean);
    response.cookies.set(COOKIE, password, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: A_MONTH });

    return response;
  }

  return refuse('this studio is private - open it once with ?key=<password>', 401);
}

/** Static files and the Monaco bundle are not worth a check on every request. */
export const config = {
  matcher: ['/((?!_next/static|_next/image|monaco/|favicon.ico).*)'],
};
