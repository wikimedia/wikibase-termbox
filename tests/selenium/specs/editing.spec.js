const assert = require( 'assert' );
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
			assert.ok( await TermboxPage.isInEditMode );
		} );

		it( 'switches back to reading mode when clicking the cancel button', async () => {
			await TermboxPage.cancelButton.click();
			assert.ok( await TermboxPage.isInReadMode );
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
			assert.strictEqual( await primaryFingerprint.label.getText(), label );
			assert.strictEqual( await primaryFingerprint.description.getText(), description );
			assert.strictEqual( ( await primaryFingerprint.aliases[ 0 ].getText() ).trim(), alias1 );
			assert.strictEqual( ( await primaryFingerprint.aliases[ 1 ].getText() ).trim(), alias2 );
		} );

		it( 'shows an error when an edit fails to save when the entity was protected while editing', async () => {
			await WikibaseApi.protectEntity( id );
			await TermboxPage.publishButton.click();
			await TermboxPage.licenseOverlaySaveButton.click();

			assert.ok( await TermboxPage.errorBanner.waitForExist() );
		} );
	} );
} );
