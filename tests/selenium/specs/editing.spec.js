const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );
const MWUtil = require( 'wdio-mediawiki/Util' );

describe( 'Termbox: editing', () => {
	let id;

	beforeEach( () => {
		id = browser.call( () => WikibaseApi.createItem() );
		TermboxPage.openItemPage( id );
		TermboxPage.editButton.click();
		TermboxPage.anonEditWarningDismissButton.click();
	} );

	afterEach( () => {
		browser.deleteAllCookies();
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
		it( 'can edit labels, descriptions, and aliases', () => {
			const label = MWUtil.getTestString();
			const description = MWUtil.getTestString();
			const alias1 = MWUtil.getTestString();
			const alias2 = MWUtil.getTestString();
			const primaryTerms = TermboxPage.getEditableMonolingualFingerprintsInSection(
				TermboxPage.primaryMonolingualFingerprint
			)[ 0 ];

			primaryTerms.label.setValue( label );
			primaryTerms.description.setValue( description );
			primaryTerms.getNthAlias( 0 ).setValue( alias1 );
			primaryTerms.getNthAlias( 1 ).setValue( alias2 );

			TermboxPage.publishButton.click();
			TermboxPage.licenseOverlaySaveButton.click();
			TermboxPage.waitUntilSaved();

			const primaryFingerprint = TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.primaryMonolingualFingerprint
			)[ 0 ];
			assert.strictEqual( primaryFingerprint.label.getText(), label );
			assert.strictEqual( primaryFingerprint.description.getText(), description );
			assert.strictEqual( primaryFingerprint.aliases[ 0 ].getText().trim(), alias1 );
			assert.strictEqual( primaryFingerprint.aliases[ 1 ].getText().trim(), alias2 );
		} );

		it( 'shows an error banner when an edit fails to save when the entity was protected while editing', () => {
			browser.call( () => WikibaseApi.protectEntity( id ) );
			TermboxPage.publishButton.click();
			TermboxPage.licenseOverlaySaveButton.click();

			assert.ok( TermboxPage.errorBanner.waitForExist() );
		} );
	} );
} );
