# Check 4 — A replica that is still starting gets no traffic

One replica is restarted under load. The service takes four seconds to be
ready and says so: `/health` answers `503` until it is, and so does everything
else it serves in that window.

Killing a server is the easy case — the connection is refused and that is
obvious. A server that is *up* and answering `503` is the one that quietly
ruins a deploy, because as far as the balancer is concerned it is a perfectly
healthy member of the pool returning a perfectly valid response.

So this check is about the difference between "the process is running" and
"the process is ready", and about telling the balancer which replies mean
*try someone else* rather than *give this to the client*.
