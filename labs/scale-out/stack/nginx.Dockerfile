# The load balancer. Your nginx/ directory is copied over the image's own
# conf.d, so `default.conf` is the whole configuration.
#
# The stack is rebuilt on every run, so an edit here or in nginx/default.conf
# is picked up by the next `npm run lab -- scale-out`.

FROM nginx:alpine

# The stock entrypoint runs `apk manifest nginx` to work out whether your
# default.conf is the packaged one - a package index lookup while the container
# is starting. When that lookup is slow or blocked, nginx never starts at all
# and the container sits there "running" with nothing listening. It is not
# worth depending on for a lab.
RUN rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

COPY nginx/ /etc/nginx/conf.d/
