/**
 * Build your own HTTP server
 *
 * Six stages, each one a tester that connects to port 4221 and talks to
 * whatever you have written. Nothing here is a framework: `node:net` gives you
 * a TCP socket and bytes, and HTTP is the format you write into it.
 *
 *   Run the next stage:   npm run stage -- http-server
 *   Run up to stage 3:    npm run stage -- http-server 3
 *
 * Stage 1 asks for a server listening on port 4221. The tester starts this
 * file and waits for that port; right now it exits instead, which is the
 * failure you should see first.
 *
 * A response is four things in order, and the blank line matters:
 *
 *   HTTP/1.1 200 OK\r\n
 *   Content-Type: text/plain\r\n
 *   Content-Length: 3\r\n
 *   \r\n
 *   abc
 *
 * Course: Networking & the OSI model - Sockets (1:50:22), HTTP (1:53:12)
 */

throw new Error('Not implemented');
