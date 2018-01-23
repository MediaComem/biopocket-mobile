import { expect } from '../spec/chai';
import { Page } from './app.po';

import { fr } from '../src/locales';

describe('App', function() {
  let page: Page;

  beforeEach(function() {
    page = new Page();
  });

  describe('default screen', function() {
    this.timeout(5000);

    beforeEach(async function() {
      await page.navigateTo('/');
    });

    it('should have the correct title', async function() {
      await expect(page.getTitle()).to.eventually.equal('BioPocket');
    });
  })
});
