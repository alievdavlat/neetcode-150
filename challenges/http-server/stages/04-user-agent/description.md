# Stage 4 — Read a request header

`GET /user-agent` answers with whatever the request's `User-Agent` header said:

```
GET /user-agent HTTP/1.1\r\n
Host: localhost\r\n
User-Agent: grape/1.2\r\n
\r\n
```

answers `200` with the body `grape/1.2`.

Headers are `Name: value` lines, and the name is case-insensitive — `user-agent`
and `User-Agent` are the same header, so looking for the exact string you expect
is a bug that only shows up against a different client.

The tester sends the name in a different case than the obvious one.
