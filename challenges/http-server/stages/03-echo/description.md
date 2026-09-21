# Stage 3 — Echo back part of the path

`GET /echo/abc` answers `200` with `abc` as the body:

```
HTTP/1.1 200 OK\r\n
Content-Type: text/plain\r\n
Content-Length: 3\r\n
\r\n
abc
```

So the request line has to be split — method, target, version — and the target
read as a path rather than compared to a string.

`Content-Length` is the byte count of the body. Get it wrong and the reader
either waits forever for bytes that never come or cuts your body short; the
tester checks it rather than trusting the body it received.

The word changes on every run, so it cannot be answered with a constant.
