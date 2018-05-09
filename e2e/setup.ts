import chalk from 'chalk';
import { compact } from 'lodash';
import { browser } from 'protractor';

// DO NOT MOVE these lines.
// Environment variables MUST be set BEFORE backend files are imported.
import { config } from '../config/e2e.config';
process.env.DATABASE_URL = config.backendDatabaseUrl;

import { cleanDatabase, setUp as setUpBackend } from '../backend/server/spec/utils';
import { ENV } from '../src/environments/environment.test';
import { StandaloneBackendProcess } from './standalone/backend';
import { IONIC_URL, StandaloneIonicProcess } from './standalone/ionic';
import { getStandaloneTimeout, StandaloneProcess } from './standalone/utils';
import { getEnvBoolean, isDebugEnabled } from './utils';

let backendProcess, ionicProcess, setupDone, teardownDone;

/**
 * Sets up global test suite hooks for the end-to-end tests:
 *
 * * Call the backend's own setup method which makes sure that the database connection is closed
 *   once the tests are done running.
 * * Run a standalone backend process and a standalone `ionic serve` process. This is done by
 *   default but can be disabled with the `$IONIC_E2E_STANDALONE_BACKEND`,
 *   `$IONIC_E2E_STANDALONE_IONIC` and `$IONIC_E2E_STANDALONE` environment variables. See the
 *   [development guide](../DEVELOPMENT.md#end-to-end-tests).
 * * Wipe the backend's database before each test.
 * * Kill the standalone processes once the tests are done running (if they were started).
 */
export function setUp() {
  setUpBackend();

  // Global hook to run standalone processes before the test suite starts.
  before(async function() {
    if (setupDone) {
      return;
    }

    setupDone = true;

    const standalone = getEnvBoolean('IONIC_E2E_STANDALONE', true);
    const standaloneBackendEnabled = getEnvBoolean('IONIC_E2E_STANDALONE_BACKEND', standalone);
    const standaloneIonicEnabled = getEnvBoolean('IONIC_E2E_STANDALONE_IONIC', standalone);

    // Configure the hook's timeout depending on whether child processes have to
    // be spawned or not.
    const setupTimeout = standaloneBackendEnabled || standaloneIonicEnabled ? getStandaloneTimeout() + 15000 : 5000;
    this.timeout(setupTimeout);

    // Log end-to-end tests configuration if debug is enabled.
    if (isDebugEnabled()) {
      console.log(chalk.cyan('End-to-end tests configuration'));
      console.log(`${chalk.bold('Debug enabled:')} true (change with $IONIC_E2E_DEBUG)`);
      console.log(`${chalk.bold('Backend will be spawned:')} ${standaloneBackendEnabled} (change with $IONIC_E2E_STANDALONE_BACKEND)`);
      console.log(`${chalk.bold('Ionic will be spawned:')} ${standaloneIonicEnabled} (change with $IONIC_E2E_STANDALONE_IONIC)`);
      console.log(`${chalk.bold('Child process timeout:')} ${getStandaloneTimeout()}ms (change with $IONIC_E2E_STANDALONE_TIMEOUT)`);
      console.log(`${chalk.bold('Setup timeout:')} ${setupTimeout}ms`);
      console.log();
    }

    const standalonePromises = [];

    // Run a standalone backend process (unless disabled with environment variables).
    if (standaloneBackendEnabled) {
      backendProcess = new StandaloneBackendProcess();
      standalonePromises.push(backendProcess.spawn());
    } else {
      console.log(chalk.magenta(`Backend is assumed to be already running at ${ENV.backendUrl}`));
    }

    // Run a standalone `ionic serve` process (unless disabled with environment variables).
    if (standaloneIonicEnabled) {
      ionicProcess = new StandaloneIonicProcess();
      standalonePromises.push(ionicProcess.spawn());
    } else {
      console.log(chalk.magenta(`Ionic is assumed to be already running at ${IONIC_URL}`));
    }

    // Wait for standalone processes to start before running the tests.
    await Promise.all(standalonePromises);

    // Log an additional line for prettier output.
    console.log();
  });

  // Global hook to kill standalone processes once the test suite is done.
  after(function() {
    if (teardownDone) {
      return;
    }

    teardownDone = true;

    const processes: StandaloneProcess[] = compact([ backendProcess, ionicProcess ]);

    // If standalone processes were started and need to be killed, log an additional line for prettier output.
    if (processes.length) {
      console.log();
    }

    processes.forEach(process => process.kill());
  });

  // Hook run before each test to set the window size and wipe the database.
  beforeEach(async function() {
    await browser.driver.manage().window().setSize(1440, 900);
    await cleanDatabase();
  });
}
