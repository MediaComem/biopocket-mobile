import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';

// Extend Chai with assertions about promises
// (see https://github.com/domenic/chai-as-promised)
chai.use(chaiAsPromised);

// Extend Chai with Sinon assertions
// (see https://github.com/domenic/sinon-chai)
chai.use(sinonChai);

export const expect = chai.expect;
