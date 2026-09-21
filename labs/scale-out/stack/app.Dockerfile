# The service, baked into an image rather than mounted from the host.
#
# A bind mount would be the shorter way to write this, but Docker Desktop on
# the Hyper-V backend has to add every new host directory to its file sharing
# list first, and on a machine where that prompt does not appear the container
# hangs while being created. A build context is sent to the daemon over its
# API instead, so it works on any machine - and it is how an image is really
# made, which the Docker course spends a chapter on.

FROM node:22-alpine

WORKDIR /app
COPY app/ /app/

CMD ["node", "server.mjs"]
