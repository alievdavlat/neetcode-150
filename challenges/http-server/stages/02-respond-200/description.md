# Stage 2 — Answer with 200 OK

Read the request and write a response. For `GET /` the status line is:

```
HTTP/1.1 200 OK\r\n\r\n
```

Two things trip people here. The line endings are `\r\n`, not `\n`. And the
blank line after the headers is not optional — it is how the other side knows
the headers ended, so a response without it is read as an unfinished one.

The tester sends a real request and refuses anything that is not a status line.
