import { expect } from '../spec/chai';

import { Page } from './app.po';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have a title saying Page One', () => {
      expect(page.getTitle()).to.eventually.equal('Page One');
    });
  })
});
