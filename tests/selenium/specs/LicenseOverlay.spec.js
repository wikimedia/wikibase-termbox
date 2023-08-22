const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );

describe( 'Termbox: LicenseOverlay', () => {
	let id;

	before( async () => {
		id = await WikibaseApi.createItem();
	} );

	beforeEach( async () => {
		await TermboxPage.openItemPage( id );
		await TermboxPage.switchToEditModeSkipWarning();
		await TermboxPage.publishButton.click();
	} );

	afterEach( async () => {
		await browser.deleteAllCookies();
	} );

	it( 'is shown when clicking publish', async () => {
		await expect( TermboxPage.licenseOverlay ).toExist();
	} );

	it( 'disappears when clicking cancel and goes back to edit mode', async () => {
		await TermboxPage.licenseOverlayCancelButton.click();

		await expect( TermboxPage.licenseOverlay ).not.toExist();
		await expect( await TermboxPage.isInEditMode ).toBe( true );
	} );

	it( 'disappears and saves when clicking publish', async () => {
		await TermboxPage.licenseOverlaySaveButton.click();

		await expect( TermboxPage.licenseOverlay ).not.toExist();
		await TermboxPage.waitUntilSaved();

		await expect( TermboxPage.isInReadMode ).toBe( true );
	} );

	it( 'does not reappear after saving by default', async () => {
		await TermboxPage.licenseOverlaySaveButton.click();

		await browser.refresh();
		await TermboxPage.waitForTermboxToLoad();

		await TermboxPage.switchToEditModeSkipWarning();
		await TermboxPage.publishButton.click();

		await expect( TermboxPage.licenseOverlay ).not.toExist();
	} );

	it( 'reappears after saving when unchecking the "remember my choice" checkbox', async () => {
		await TermboxPage.licenseOverlayCheckbox.click();
		await TermboxPage.licenseOverlaySaveButton.click();

		await browser.refresh();
		await TermboxPage.waitForTermboxToLoad();

		await TermboxPage.switchToEditModeSkipWarning();
		await TermboxPage.publishButton.click();

		await expect( TermboxPage.licenseOverlay ).toBeDisplayed();
	} );
} );
