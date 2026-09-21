# Stage 6 — Serve files from a directory

The tester starts your program with an extra argument:

```
node solution/main.ts --directory /some/path
```

`GET /files/notes.txt` then answers with the contents of `notes.txt` in that
directory:

```
HTTP/1.1 200 OK\r\n
Content-Type: application/octet-stream\r\n
Content-Length: 14\r\n
\r\n
hello from disk
```

A file that is not there is `404`, with no body needed.

Two things to be careful about. Read the directory from `process.argv`, not
from a constant — the tester uses a fresh temporary folder every run. And
`Content-Length` is a count of **bytes**, which is not the same as a count of
characters once anything outside ASCII is in the file; the tester puts a
non-ASCII character in there on purpose.
