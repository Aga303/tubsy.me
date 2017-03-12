import { TubsyPage } from './app.po';

describe('tubsy App', () => {
  let page: TubsyPage;

  beforeEach(() => {
    page = new TubsyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
