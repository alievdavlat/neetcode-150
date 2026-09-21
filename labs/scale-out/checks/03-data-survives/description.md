# Check 3 — What was written is still there after a restart

Notes are posted through the balancer, counted, the store is restarted, and
they are counted again. The number has to be the same.

A container's filesystem dies with the container. Anything that has to outlive
a restart lives in a volume, and the store has to be told to actually write
there — Redis keeps everything in memory and only persists if you ask it to,
which is the whole point of putting it in this lab rather than a database that
persists by default.

Two things to get right, and the check fails differently for each: a named
volume mounted at the path the store uses, and the store configured to write
to it.
