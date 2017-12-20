export const config = {

  /**
   * Database URL to which to connect the backend that is automatically
   * spawned for end-to-end tests.
   *
   * WARNING: do not use the same database as your development database, as it
   * is wiped clean every time the tests are run.
   *
   * NOTE: when the backend is run automatically as a child process, your
   * system username will not be automatically used as the PostgreSQL username
   * (which is usually the case). It is therefore recommended to explicitly
   * specify a username in this URL.
   */
  backendDatabaseUrl: 'postgres://user@localhost/biopocket',

  /**
   * Default number of milliseconds that the end-to-end tests will wait for a child process (e.g.
   * backend or mobile application) to spawn. Increase the value if they take more time to spawn on
   * your machine. This can be overridden at runtime with the `$IONIC_E2E_STANDALONE_TIMEOUT`
   * variable.
   */
  standaloneTimeout: 30000
}
