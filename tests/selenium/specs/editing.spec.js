const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );
const MWUtil = require( 'wdio-mediawiki/Util' );

describe( 'Termbox: editing', () => {
	let id;

	beforeEach( async () => {
		id = await WikibaseApi.createItem();
		await TermboxPage.openItemPage( id );
		await TermboxPage.editButton.click();
		await TermboxPage.anonEditWarningDismissButton.click();
	} );

	afterEach( async () => {
		await browser.deleteAllCookies();
	} );

	describe( 'edit mode', () => {
		it( 'is in edit mode after clicking the edit button', async () => {
			await expect( TermboxPage.isInEditMode ).toBe( true );
		} );

		it( 'switches back to reading mode when clicking the cancel button', async () => {
			await TermboxPage.cancelButton.click();
			await expect( TermboxPage.isInReadMode ).toBe( true );
		} );
	} );

	describe( 'editing', () => {
		it( 'can edit labels, descriptions, and aliases', async () => {
			const label = MWUtil.getTestString();
			const description = MWUtil.getTestString();
			const alias1 = MWUtil.getTestString();
			const alias2 = MWUtil.getTestString();
			const primaryTerms = await TermboxPage.getEditableMonolingualFingerprintsInSection(
				TermboxPage.primaryMonolingualFingerprint
			)[ 0 ];

			await primaryTerms.label.setValue( label );
			await primaryTerms.description.setValue( description );
			await primaryTerms.getNthAlias( 0 ).setValue( alias1 );
			await primaryTerms.getNthAlias( 1 ).setValue( alias2 );

			await TermboxPage.publishButton.click();
			await TermboxPage.licenseOverlaySaveButton.click();
			await TermboxPage.waitUntilSaved();

			const primaryFingerprint = await TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.primaryMonolingualFingerprint
			)[ 0 ];
			await expect( primaryFingerprint.label ).toHaveText( label );
			await expect( primaryFingerprint.description ).toHaveText( description );
			await expect( primaryFingerprint.aliases[ 0 ] ).toHaveText( alias1, { trim: true } );
			await expect( primaryFingerprint.aliases[ 1 ] ).toHaveText( alias2, { trim: true } );
		} );

		it( 'shows an error when an edit fails to save when the entity was protected while editing', async () => {
			await WikibaseApi.protectEntity( id );
			await TermboxPage.publishButton.click();
			await TermboxPage.licenseOverlaySaveButton.click();

			await expect( TermboxPage.errorBanner ).toExist();
		} );
	} );
} );
