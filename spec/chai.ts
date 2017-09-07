import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

// Extend Chai with assertions about promises
// (see https://github.com/domenic/chai-as-promised)
chai.use(chaiAsPromised);

export const expect = chai.expect;
