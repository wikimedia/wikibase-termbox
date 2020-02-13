const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );

describe( 'Termbox: LicenseOverlay', () => {
	let id;

	before( () => {
		id = browser.call( () => WikibaseApi.createItem() );
	} );

	beforeEach( () => {
		TermboxPage.openItemPage( id );
		TermboxPage.switchToEditModeSkipWarning();
		TermboxPage.publishButton.click();
	} );

	afterEach( () => {
		browser.deleteAllCookies();
	} );

	it( 'is shown when clicking publish', () => {
		assert.ok( TermboxPage.licenseOverlay.isExisting() );
	} );

	it( 'disappears when clicking cancel and goes back to edit mode', () => {
		TermboxPage.licenseOverlayCancelButton.click();

		assert.strictEqual( TermboxPage.licenseOverlay.isExisting(), false );
		assert.ok( TermboxPage.isInEditMode );
	} );

	it( 'disappears and saves when clicking publish', () => {
		TermboxPage.licenseOverlaySaveButton.click();

		assert.strictEqual( TermboxPage.licenseOverlay.isExisting(), false );
		TermboxPage.waitUntilSaved();

		assert.ok( TermboxPage.isInReadMode );
	} );

	it( 'does not reappear after saving by default', () => {
		TermboxPage.licenseOverlaySaveButton.click();

		browser.refresh();
		TermboxPage.waitForTermboxToLoad();

		TermboxPage.switchToEditModeSkipWarning();
		TermboxPage.publishButton.click();

		assert.strictEqual( TermboxPage.licenseOverlay.isExisting(), false );
	} );

	it( 'reappears after saving when unchecking the "remember my choice" checkbox', () => {
		TermboxPage.licenseOverlayCheckbox.click();
		TermboxPage.licenseOverlaySaveButton.click();

		browser.refresh();
		TermboxPage.waitForTermboxToLoad();

		TermboxPage.switchToEditModeSkipWarning();
		TermboxPage.publishButton.click();

		assert.ok( TermboxPage.licenseOverlay.isDisplayed() );
	} );
} );
