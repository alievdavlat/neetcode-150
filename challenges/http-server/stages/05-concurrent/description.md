# Stage 5 — Four connections at once

The tester opens four connections, sends a request on all four **before**
reading any reply, and then expects four replies.

A server that handles one connection from start to finish before looking at the
next one can still pass this if it is quick about it. What fails is a server
that stops listening after the first connection, or one that blocks inside a
connection handler waiting for something.

If you built this with `net.createServer()` and answered inside the
`connection` event, you are probably already there — which is the point of the
stage: this is what an event loop buys you, and it is worth seeing that you did
not have to do anything for it.
