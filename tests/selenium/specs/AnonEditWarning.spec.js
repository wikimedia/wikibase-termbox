const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );
const LoginPage = require( 'wdio-mediawiki/LoginPage' );

/**
 * TODO use LoginPage.loginAdmin() compatible w/ wdio 5 from wdio-mediawiki v1.0.0+
 */
function loginAdmin() {
	LoginPage.open();
	$( '#wpName1' ).setValue( browser.config.username );
	$( '#wpPassword1' ).setValue( browser.config.password );
	$( '#wpLoginAttempt' ).click();
}

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

		assert.ok( TermboxPage.anonEditWarning.waitForExist( null, true ) );
	} );

	it( 'never appears for logged in users', () => {
		loginAdmin();
		TermboxPage.openItemPage( id );
		TermboxPage.editButton.click();

		assert.ok( TermboxPage.anonEditWarning.waitForExist( null, true ) );
	} );

} );
