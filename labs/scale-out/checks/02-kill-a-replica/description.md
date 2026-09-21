# Check 2 — Killing a replica loses nothing

Requests are sent for several seconds, and part way through one replica is
killed — not stopped politely, killed. Not one request may fail.

This is the difference between "there are two servers" and "there is
redundancy". By default nginx will keep handing requests to a server that is
no longer there, and the client sees the error.

What decides it: how many failures put a server out of the pool, for how long,
and which kinds of failure are worth retrying on the next server rather than
returning.

The killed container is started again before the next check, so you do not
have to clean up.
