import { stub } from 'sinon';

/**
 * Returns a partial mock of Ionic's Platform object with methods that do not do anything.
 *
 * The `ready` method is a Sinon stub which returns a promise resolved with "READY" by default.
 *
 * @param callback An optional callback that will be passed the mock platform for customization
 */
export function createPlatformMock(callback?: (mock: any) => void) {

  const platform = {
    Css: {},
    doc: () => document,
    getQueryParam: () => true,
    raf: () => 1,
    ready: stub().resolves('READY'),
    registerBackButtonAction: () => (() => true),
    registerListener: () => (() => true),
    timeout: (callback: any, timer: number) => setTimeout(callback, timer),
    win: () => window
  };

  if (callback) {
    callback(platform);
  }

  return platform;
}
