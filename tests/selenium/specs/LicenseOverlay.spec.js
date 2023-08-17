const assert = require( 'assert' );
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
		assert.ok( await TermboxPage.licenseOverlay.isExisting() );
	} );

	it( 'disappears when clicking cancel and goes back to edit mode', async () => {
		await TermboxPage.licenseOverlayCancelButton.click();

		assert.strictEqual( await TermboxPage.licenseOverlay.isExisting(), false );
		assert.ok( await TermboxPage.isInEditMode );
	} );

	it( 'disappears and saves when clicking publish', async () => {
		await TermboxPage.licenseOverlaySaveButton.click();

		assert.strictEqual( await TermboxPage.licenseOverlay.isExisting(), false );
		await TermboxPage.waitUntilSaved();

		assert.ok( await TermboxPage.isInReadMode );
	} );

	it( 'does not reappear after saving by default', async () => {
		await TermboxPage.licenseOverlaySaveButton.click();

		await browser.refresh();
		await TermboxPage.waitForTermboxToLoad();

		await TermboxPage.switchToEditModeSkipWarning();
		await TermboxPage.publishButton.click();

		assert.strictEqual( await TermboxPage.licenseOverlay.isExisting(), false );
	} );

	it( 'reappears after saving when unchecking the "remember my choice" checkbox', async () => {
		await TermboxPage.licenseOverlayCheckbox.click();
		await TermboxPage.licenseOverlaySaveButton.click();

		await browser.refresh();
		await TermboxPage.waitForTermboxToLoad();

		await TermboxPage.switchToEditModeSkipWarning();
		await TermboxPage.publishButton.click();

		assert.ok( await TermboxPage.licenseOverlay.isDisplayed() );
	} );
} );
