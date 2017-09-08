/**
 * Calls Sinon's `restore` method on a spy or stub.
 *
 * Using this utility function avoids TypeScript warnings
 * because functions don't have a `restore` property.
 *
 * @param spyOrStub A function that has been spied upon with `sinon.spy`
 *                  or stubbed with `sinon.stub`
 */
export function restoreSpyOrStub(spyOrStub: (...args: any[]) => any) {
  if (!spyOrStub) {
    throw new Error('A function that is a spy or a stub must be provided');
  } else if (typeof(spyOrStub['restore']) != 'function') {
    throw new Error('The provided function has not been spied upon or stubbed');
  }

  spyOrStub['restore']();
}

/**
 * Deferred object implementation for use in automated tests.
 * Sometimes we need a promise to be resolved when we want it to.
 *
 * Adapted from https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#backwards_forwards_compatible
 */
export function Deferred() {

  /*
   * A method to resolve the associated Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param {anything} value : This value is used to resolve the promise
   * If the value is a Promise then the associated promise assumes the state
   * of Promise passed as value.
   */
  this.resolve = null;

  /*
   * A method to reject the assocaited Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param {anything} reason: The reason for the rejection of the Promise.
   * Generally its an Error object. If however a Promise is passed, then the Promise
   * itself will be the reason for rejection no matter the state of the Promise.
   */
  this.reject = null;

  /*
   * A newly created Pomise object.
   * Initially in pending state.
   */
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });

  Object.freeze(this);
}
