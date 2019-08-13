const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );

describe( 'Termbox: editing', () => {
	let id;

	beforeEach( () => {
		id = browser.call( () => WikibaseApi.createItem() );
		TermboxPage.openItemPage( id );
		TermboxPage.editButton.click();
	} );

	afterEach( () => {
		browser.deleteCookie();
	} );

	it( 'is in edit mode after clicking the edit button', () => {
		assert.ok( TermboxPage.isInEditMode );
	} );

	it( 'switches back to reading mode when clicking the cancel button', () => {
		TermboxPage.anonEditWarningDismissButton.click();
		TermboxPage.cancelButton.click();
		assert.ok( TermboxPage.isInReadMode );
	} );
} );
