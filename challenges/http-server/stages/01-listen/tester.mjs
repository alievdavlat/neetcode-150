export default {
  title: 'Listen on port 4221',

  /**
   * Getting here already means the port answered - the runner waits for it
   * before a tester sees the program. What is checked here is that the
   * connection survives being opened, rather than a listener that accepts and
   * immediately dies.
   */
  async run({ port, connect, log }) {
    log(`opening a connection to 127.0.0.1:${port}`);
    const first = await connect(port);

    log('opening a second one, to be sure the first did not use it up');
    const second = await connect(port);

    first.close();
    second.close();
  },
};
