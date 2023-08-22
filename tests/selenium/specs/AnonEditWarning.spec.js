const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );
const LoginPage = require( 'wdio-mediawiki/LoginPage' );

describe( 'Termbox: AnonEditWarning', () => {
	let id;

	before( async () => {
		id = await WikibaseApi.createItem();
	} );

	beforeEach( async () => {
		await TermboxPage.openItemPage( id );
		await TermboxPage.editButton.click();
	} );

	afterEach( async () => {
		await browser.deleteAllCookies();
	} );

	it( 'shows the warning overlay for anonymous users when clicking the edit button', async () => {
		await expect( TermboxPage.anonEditWarning ).toBeDisplayed();
		await expect( TermboxPage.anonEditWarningCheckbox ).toBeDisplayed();
	} );

	it( 'can be dismissed', async () => {
		await TermboxPage.anonEditWarningDismissButton.click();
		await expect( TermboxPage.anonEditWarning ).not.toExist();
	} );

	it( 'does not show the warning overlay again if the user opts out', async () => {
		await TermboxPage.anonEditWarningCheckbox.click();
		await TermboxPage.anonEditWarningDismissButton.click();

		await browser.refresh();
		await TermboxPage.waitForTermboxToLoad();
		await TermboxPage.editButton.click();

		await expect( TermboxPage.anonEditWarning ).not.toExist();
	} );

	it( 'never appears for logged in users', async () => {
		await LoginPage.loginAdmin();
		await TermboxPage.openItemPage( id );
		await TermboxPage.editButton.click();

		await expect( TermboxPage.anonEditWarning ).not.toExist();
	} );

} );
