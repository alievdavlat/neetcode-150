const HOW_MANY = 4;

export default {
  title: 'Serve four connections at once',

  async run({ port, connect, parseResponse, log }) {
    log(`opening ${HOW_MANY} connections`);
    const connections = await Promise.all(Array.from({ length: HOW_MANY }, () => connect(port, { timeoutMs: 5000 })));

    /** Every request goes out before any reply is read; that is what makes it concurrent. */
    log('sending a request on each of them before reading anything');
    for (const connection of connections) {
      connection.send('GET / HTTP/1.1\r\nHost: localhost\r\n\r\n');
    }

    try {
      const replies = await Promise.all(
        connections.map((connection, index) =>
          connection
            .readUntil('\r\n\r\n', 5000)
            .catch((error) => {
              throw new Error(`connection ${index + 1} of ${HOW_MANY} never answered - ${error.message}`);
            }),
        ),
      );

      replies.forEach((reply, index) => {
        const { status } = parseResponse(reply);
        if (status !== 200) throw new Error(`connection ${index + 1} answered ${status}, expected 200`);
      });

      log(`all ${HOW_MANY} answered`);
    } finally {
      for (const connection of connections) connection.close();
    }
  },
};
