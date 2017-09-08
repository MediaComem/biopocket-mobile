import { expect } from '../spec/chai';
import { Page } from './app.po';

import { fr } from '../src/locales';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('default screen', () => {
    beforeEach(async () => {
      await page.navigateTo('/');
    });

    it('should have a title saying Page One', () => {
      expect(page.getTitle()).to.eventually.equal(fr.pages.home.title);
    });
  })
});
