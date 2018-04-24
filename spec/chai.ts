import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';

// These imports are here because they are required for any test of code
// which uses RxJS operators, and most test files import this file,
// so this is a good central location to put it.
import '../src/app/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Extend Chai with assertions about promises
// (see https://github.com/domenic/chai-as-promised)
chai.use(chaiAsPromised);

// Extend Chai with Sinon assertions
// (see https://github.com/domenic/sinon-chai)
chai.use(sinonChai);

export const expect = chai.expect;
