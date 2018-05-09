import chalk from 'chalk';
import * as r2 from 'r2';

import { getNpmCommand, StandaloneProcess } from './utils';

export const IONIC_URL = 'http://localhost:8100';

/**
 * The `ionic serve` process spawned automatically to run end-to-end tests.
 *
 * Note that this should not be run at the same time as another `ionic serve` command used for
 * development, as the `ionic serve` command was not designed for this.
 */
export class StandaloneIonicProcess extends StandaloneProcess {
  private running: boolean;

  constructor() {
    super('Ionic', [ getNpmCommand(), 'run', 'start:e2e' ]);
  }

  async spawn(): Promise<void> {

    // Reject the promise if an Ionic dev server is already running.
    console.log(chalk.yellow(`Checking if ${this.name} is already running at ${IONIC_URL}...`));
    if (await r2(IONIC_URL).text.then(() => true, () => false)) {
      throw new Error(`${this.name} is already running at ${IONIC_URL}`);
    }

    const spawnPromise = super.spawn();

    // The best solution to determine whether the `ionic serve` command is done starting seems to be
    // to look for the "dev server running" string in its output. Making HTTP calls on
    // `http://localhost:8100` doesn't work, as that starts responding long before the application
    // is done compiling (up to 10 seconds before).
    this.process.stdout.on('data', data => {
      if (data.toString().match(/dev server running/)) {
        this.running = true;
      }
    });

    await spawnPromise;
  }

  kill(): void {
    this.running = false;
    return super.kill();
  }

  protected get spawnDescription(): string {
    return `${this.name} at ${IONIC_URL}`;
  }

  async isRunning(): Promise<boolean> {
    return this.running;
  }
}
