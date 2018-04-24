import { SinonSpy, SinonStub } from 'sinon';

/**
 * A Sinon spy or stub.
 */
export type SinonSpyOrStub = SinonSpy | SinonStub;

/**
 * A callback function that can be invoked with a Sinon spy or stub as argument.
 */
export type SinonSpyOrStubCallback<T extends SinonSpyOrStub> = (spyOrStub: T) => void;

/**
 * Returns the specified function typed as a Sinon spy.
 * An error is thrown if the function is in fact not a Sinon spy.
 *
 * @param func The Sinon spy function.
 * @param callbacks A series of callbacks that will be invoked sequentially with the spy if provided.
 * @returns The Sinon spy.
 */
export const asSpy = (func: Function, ...callbacks: SinonSpyOrStubCallback<SinonSpy>[]) => doWithSpy(func, ...callbacks);

/**
 * Returns the specified function typed as a Sinon stub.
 * An error is thrown if the function is in fact not a Sinon stub.
 *
 * @param func The Sinon stub function.
 * @param callbacks A series of callbacks that will be invoked sequentially with the stub if provided.
 * @returns The Sinon stub.
 */
export const asStub = (func: Function, ...callbacks: SinonSpyOrStubCallback<SinonStub>[]) => doWithStub(func, ...callbacks);

/**
 * Returns the specified function typed as a Sinon spy and with its history reset (i.e. any
 * previously spied calls are cleared).  An error is thrown if the function is in fact not a Sinon
 * spy.
 *
 *     // Create a spy and make some calls.
 *     const foo = spy();
 *     foo();
 *     foo.callCount; // 1
 *
 *     // Resetting a spy clears its call history.
 *     resetSpy(foo);
 *     foo.callCount; // 0
 *
 * @param func The Sinon spy function.
 * @param callbacks A series of callbacks that will be invoked sequentially with the spy if provided (after reset).
 * @returns The Sinon spy.
 */
export const resetSpy = (func: Function, ...callbacks: SinonSpyOrStubCallback<SinonSpy>[]) => doWithSpy(func, spy => spy.resetHistory(), ...callbacks);

/**
 * Returns the specified function typed as a Sinon stub and with both its behavior and history reset
 * (i.e. any previously configured behavior and spied calls are cleared).  An error is thrown if the
 * function is in fact not a Sinon stub.
 *
 *     const foo = stub();
 *
 *     // Configure a behavior and make some calls.
 *     foo.returns("bar");
 *     foo();          // "bar"
 *     foo.callCount;  // 1
 *
 *     // Resetting the stub clears its behavior and call history.
 *     resetStub(foo);
 *     foo.callCount;  // 0
 *     foo();          // undefined
 *
 * @param func The Sinon stub function.
 * @param callbacks A series of callbacks that will be invoked sequentially with the stub if provided (after reset).
 * @returns The Sinon stub.
 */
export const resetStub = (func: Function, ...callbacks: SinonSpyOrStubCallback<SinonStub>[]) => doWithStub(func, stub => stub.reset(), ...callbacks);

/**
 * Restores an object method spied with Sinon to its original behavior.
 * An error is thrown if the method is in fact not a Sinon spy.
 *
 *     // Replace an object's method with a spy.
 *     spy(service, "fetchAll");
 *     service.fetchAll(); // calls the spy
 *
 *     // Restoring the spy puts the original method back.
 *     restoreSpy(service.fetchAll);
 *     service.fetchAll(); // calls the original method
 *
 * @param method The Sinon spy method to restore.
 */
export const restoreSpy = (method: Function) => { doWithSpy(method, spy => spy.restore()); };

/**
 * Restores an object method stubbed with Sinon to its original behavior.
 * An error is thrown if the method is in fact not a Sinon stub.
 *
 *     // Replace an object's method with a stub.
 *     stub(service, "fetchAll");
 *     asStub(service.fetchAll).returns([]);
 *     service.fetchAll(); // []
 *
 *     // Restoring the stub puts the original method back.
 *     restoreStub(service.fetchAll);
 *     service.fetchAll(); // calls the original method
 *
 * @param method The Sinon stub method to restore.
 */
export const restoreStub = (method: Function) => { doWithStub(method, stub => stub.restore()); };

/**
 * Type guard to check that the specified function is a Sinon spy.
 *
 * @param func The function to check.
 * @returns True if the function is a Sinon spy, false otherwise.
 */
function ensureSpy(func: Function): func is SinonSpy {
  return typeof(func) === 'function' && typeof(func['callCount']) === 'number';
}

/**
 * Type guard to check that the specified function is a Sinon stub.
 *
 * @param func The function to check.
 * @returns True if the function is a Sinon stub, false otherwise.
 */
function ensureStub(func: Function): func is SinonStub {
  return ensureSpy(func) && typeof(func['resetBehavior']) === 'function';
}

/**
 * Ensures the specified function is a Sinon spy and sequentially invoke each provided callback with it.
 *
 * @param func A Sinon spy.
 * @param callbacks Callbacks to invoke with the Sinon spy as argument.
 * @returns The Sinon spy.
 */
function doWithSpy(func: Function, ...callbacks: SinonSpyOrStubCallback<SinonSpy>[]): SinonSpy {
  if (!ensureSpy(func)) {
    throw new Error('Function is not a Sinon spy');
  } else {
    callbacks.forEach(callback => callback(func));
    return func;
  }
}

/**
 * Ensures the specified function is a Sinon stub and sequentially invoke each provided callback with it.
 *
 * @param func A Sinon stub.
 * @param callbacks Callbacks to invoke with the Sinon stub as argument.
 * @returns The Sinon stub.
 */
function doWithStub(func: Function, ...callbacks: SinonSpyOrStubCallback<SinonStub>[]): SinonStub {
  if (!ensureStub(func)) {
    throw new Error('Function is not a Sinon stub');
  } else {
    callbacks.forEach(callback => callback(func));
    return func;
  }
}
