# Stage 1 — Listen on port 4221

Open a TCP server on port `4221` and accept a connection. Nothing has to be
answered yet: the tester only checks that something is listening and that a
connection is not refused.

`node:net` is the whole toolbox here — `net.createServer()` and `.listen(4221)`.

The tester starts your program and waits up to ten seconds for the port. If the
program exits first, it says so instead of waiting.
