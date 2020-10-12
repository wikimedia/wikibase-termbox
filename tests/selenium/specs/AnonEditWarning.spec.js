const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );
const LoginPage = require( 'wdio-mediawiki/LoginPage' );

describe( 'Termbox: AnonEditWarning', () => {
	let id;

	before( () => {
		id = browser.call( () => WikibaseApi.createItem() );
	} );

	beforeEach( () => {
		TermboxPage.openItemPage( id );
		TermboxPage.editButton.click();
	} );

	afterEach( () => {
		browser.deleteAllCookies();
	} );

	it( 'shows the warning overlay for anonymous users when clicking the edit button', () => {
		assert.ok( TermboxPage.anonEditWarning.isDisplayed() );
		assert.ok( TermboxPage.anonEditWarningCheckbox.isDisplayed() );
	} );

	it( 'can be dismissed', () => {
		TermboxPage.anonEditWarningDismissButton.click();
		assert.strictEqual( TermboxPage.anonEditWarning.isExisting(), false );
	} );

	it( 'does not show the warning overlay again if the user opts out', () => {
		TermboxPage.anonEditWarningCheckbox.click();
		TermboxPage.anonEditWarningDismissButton.click();

		browser.refresh();
		TermboxPage.waitForTermboxToLoad();
		TermboxPage.editButton.click();

		assert.ok( TermboxPage.anonEditWarning.waitForExist( { reverse: true } ) );
	} );

	it( 'never appears for logged in users', () => {
		LoginPage.loginAdmin();
		TermboxPage.openItemPage( id );
		TermboxPage.editButton.click();

		assert.ok( TermboxPage.anonEditWarning.waitForExist( { reverse: true } ) );
	} );

} );
