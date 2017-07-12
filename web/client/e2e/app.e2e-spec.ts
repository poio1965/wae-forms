import { WaeFormsPage } from './app.po';

describe('waeForms App', function() {
	let page: WaeFormsPage;

	beforeEach(() => {
		page = new WaeFormsPage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('app works!');
	});
});
