import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { EnvInterface } from '@app/environments/environment.interface';

/**
 * Incorporates the ENV variable and provides an interface on this variable.
 * This pattern allows easily mocking the ENV variable inside Unit Test.
 */
@Injectable()
export class EnvService implements EnvInterface {

  private readonly envData: EnvInterface;

  constructor() {
    this.envData = ENV;
  }

  /**
   * Access the current environment's backend URL
   */
  get backendUrl(): string {
    return this.envData.backendUrl;
  }

  /**
   * Access the current environment's name
   */
  get environment(): string {
    return this.envData.environment;
  }

}
