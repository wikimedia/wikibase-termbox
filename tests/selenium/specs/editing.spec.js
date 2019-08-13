const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );

describe( 'Termbox: editing', () => {
	let id;

	beforeEach( () => {
		id = browser.call( () => WikibaseApi.createItem() );
		TermboxPage.openItemPage( id );
		TermboxPage.editButton.click();
		TermboxPage.anonEditWarningDismissButton.click();
	} );

	afterEach( () => {
		browser.deleteCookie();
	} );

	describe( 'edit mode', () => {
		it( 'is in edit mode after clicking the edit button', () => {
			assert.ok( TermboxPage.isInEditMode );
		} );

		it( 'switches back to reading mode when clicking the cancel button', () => {
			TermboxPage.cancelButton.click();
			assert.ok( TermboxPage.isInReadMode );
		} );
	} );

	describe( 'editing', () => {
		it( 'shows an error banner when an edit fails to save when the entity was protected while editing', () => {
			browser.call( () => WikibaseApi.protectEntity( id ) );
			TermboxPage.publishButton.click();
			TermboxPage.licenseOverlaySaveButton.click();

			assert.ok( TermboxPage.errorBanner.waitForExist() );
		} );
	} );
} );
