# Check 1 — Every replica takes traffic

The check counts the app containers that are running, sends a few seconds of
requests, and looks at which container answered each one. Every running replica
has to appear.

Two servers behind a balancer that only ever uses one is the most common way a
"highly available" setup turns out to be a single server with extra steps.

This is also where horizontal scaling is practised: add `app3` to the compose
file, put it in the pool, and the check will demand that it takes traffic too.
Nothing here is written for exactly two.

Worth trying once it passes: change the policy in the `upstream` block to
`least_conn`, or give one server `weight=3`, and watch the split in the check's
log change.
