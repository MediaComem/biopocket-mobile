import { SpawnOptions } from 'child_process';
import { extend } from 'lodash';
import { join } from 'path';
import * as r2 from 'r2';
import { parse, Url } from 'url';

import { config } from '../../config/e2e.config';
import { ENV } from '../../src/environments/environment.test';
import { getNpmCommand, ROOT, StandaloneProcess } from './utils';

/**
 * The backend process spawned automatically to run end-to-end tests.
 *
 * The source code used is included in this project in the `backend` directory which is a git
 * submodule. This ensures that a compatible version of the backend is used.
 */
export class StandaloneBackendProcess extends StandaloneProcess {
  private backendUrl: Url;

  constructor() {
    super('Backend', [ getNpmCommand(), 'start' ]);
    // Parse the backend URL in the configuration to extract the port number.
    this.backendUrl = parse(ENV.backendUrl);
  }

  async spawn(): Promise<void> {

    // Ensure the backend URL is local and that it has a port number.
    if (this.backendUrl.hostname != 'localhost' && this.backendUrl.hostname != '127.0.0.1') {
      throw new Error(`Unsupported backend URL "${ENV.backendUrl}"; hostname must be localhost or 127.0.0.1`);
    } else if (!this.backendUrl.port) {
      throw new Error(`Unsupported backend URL "${ENV.backendUrl}"; must have a port number`);
    }

    return super.spawn();
  }

  /**
   * Checks whether the backend process is running by trying to retrieve the version from the API.
   */
  isRunning(): Promise<boolean> {
    return r2(ENV.backendUrl).json.then(body => !!body.version).catch(() => false);
  }

  protected get spawnDescription(): string {
    return `${this.name} at ${ENV.backendUrl}`;
  }

  protected getEnvironment(): { [key: string]: string } {
    return extend(super.getEnvironment(), {
      CORS: 'true',
      DATABASE_URL: config.backendDatabaseUrl,
      NODE_ENV: 'test',
      PORT: this.backendUrl.port,
      SESSION_SECRET: 'secret'
    });
  }

  protected getSpawnOptions(): SpawnOptions {
    return extend(super.getSpawnOptions(), {
      cwd: join(ROOT, 'backend')
    });
  }
}
