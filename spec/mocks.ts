import { stub } from 'sinon';

export function createPlatformMock(callback?: (mock: any) => void) {

  const platform = {
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
