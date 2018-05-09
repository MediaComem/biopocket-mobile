import chalk from 'chalk';
import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { join, resolve } from 'path';
import { platform } from 'process';

import { config } from '../../config/e2e.config';
import { getEnvInteger, isDebugEnabled } from '../utils';

export const ROOT = resolve(join(__dirname, '..', '..'));

/**
 * Returns the name of the npm executable depending on the platform.
 */
export function getNpmCommand() {
  return platform.toLowerCase() === 'win32' ? 'npm.cmd' : 'npm';
}

/**
 * Returns the number of milliseconds that the end-to-end tests will wait for a child process (e.g.
 * backend or mobile application) to spawn. This is taken from the `$IONIC_E2E_STANDALONE_TIMEOUT`
 * variable, or from the `standaloneTimeout` property in the `config/e2e.config.ts` file, and is set
 * to 30 seconds in the sample configuration.
 */
export function getStandaloneTimeout() {
  return getEnvInteger('IONIC_E2E_STANDALONE_TIMEOUT', config.standaloneTimeout, value => value >= 0);
}

/**
 * Separate process to be spawned for end-to-end tests, e.g. the backend or mobile application.
 *
 * This class includes the logic needed to spawn the child process and wait for it to start, but it
 * leaves the checking of whether it has started to the implementer (i.e. the `isRunning` method).
 */
export abstract class StandaloneProcess {
  readonly name: string;
  readonly command: string[];
  protected process: ChildProcess;

  /**
   * Constructs a new standalone process.
   *
   * @param name A name identifying the process (for logging purposes).
   * @param command The command to run to execute the process (e.g. `[ "npm", "start" ]`).
   */
  constructor(name: string, command: string[]) {
    this.name = name;
    this.command = command;
  }

  /**
   * Spawns the process and returns a promise that will be resolved when it has started successfully
   * (as determined by the `isRunning` method).
   */
  async spawn(): Promise<void> {

    // Spawn the child process.
    const command = this.command[0];
    const args = this.command.slice(1);
    const options = this.getSpawnOptions();
    this.process = spawn(command, args, options);
    console.log(chalk.magenta(`Spawned ${this.spawnDescription} (PID ${this.process.pid})...`))

    // Log the process's stdout and stderr streams if debug is enabled.
    if (isDebugEnabled()) {
      this.process.stdout.on('data', data => console.log(`${this.name} stdout: ${data.toString().replace(/\n$/, '')}`));
      this.process.stderr.on('data', data => console.warn(`${this.name} stderr: ${data.toString().replace(/\n$/, '')}`));
    }

    // Check whether it has started every second (until the configured maximum timeout, which
    // defaults to 30 seconds).
    let attempts = 0;
    const standaloneTimeout = getStandaloneTimeout();
    let start = new Date();
    while ((new Date().getTime() - start.getTime()) < standaloneTimeout) {
      const running = await this.isRunning();
      if (running) {
        const duration = new Date().getTime() - start.getTime();
        console.log(chalk.green(`Started ${this.name} in ${duration / 1000}s`));
        return;
      } else {
        console.log(chalk.yellow(`Waiting for ${this.name} to start... (${attempts++})`));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Kill the child process and throw an error if it could not be started within the expected time.
    this.kill();
    const duration = new Date().getTime() - start.getTime();
    throw new Error(`Could not start ${this.name} after ${duration / 1000}s`);
  }

  /**
   * Kills the process (if it was spawned).
   */
  kill(): void {
    if (this.process) {
      console.log(chalk.magenta(`Killing ${this.name} process ${this.process.pid}...`));
      this.process.kill();
      this.process = undefined;
    }
  }

  /**
   * Returns a description of the spawned process for logging purposes.
   */
  protected get spawnDescription(): string {
    return this.name;
  }

  /**
   * Returns a promise that will be resolved with true if the child process has started
   * successfully, or false if starting is still in progress.
   *
   * Note: this method is intended as an immediate check. It should perform the necessary work to
   * determine whether the process has started or not, and indicate that state immediately. The
   * returned promise should not wait for the child process to start before being resolved (that
   * waiting is implemented in the `spawn` method).
   */
  protected async abstract isRunning(): Promise<boolean>;

  /**
   * Returns the environment variables that should be provided to the child process.
   */
  protected getEnvironment(): { [key: string]: string } {
    return process.env;
  }

  /**
   * Returns the options used to spawn the child process.
   */
  protected getSpawnOptions(): SpawnOptions {
    return {
      cwd: ROOT,
      env: this.getEnvironment()
    };
  };
}
