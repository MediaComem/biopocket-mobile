import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

export {

  /**
   * Creates and returns an observable that will emit the specified value (or values) and complete.
   *
   *     observableOf("foo");     // => "foo"
   *     observableOf(1, 2, 3);   // => 1, 2, 3
   *     observableOf([ 4, 5 ]);  // => 4, 5
   *
   * @param {any} values - The values to emit (as an array or as variadic arguments).
   * @returns {Observable<any>} An observable.
   * @see http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-of
   */
  of as observableOf,

  /**
   * Creates and returns an observable that will emit the specified error.
   *
   * @param {any} error - The error.
   * @returns {Observable<any>} An observable.
   * @see http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-throw
   */
  _throw as observableThatThrows
};
