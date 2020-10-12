const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const TermboxLanguages = require( '../TermboxLanguages' );
const createTermsInLanguages = require( '../createTermsInLanguages' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );

function assertMonolingualFingerprintHasTermsInLanguage( elements, expectedTerms, language ) {
	assert.strictEqual(
		elements.label.getText(),
		expectedTerms.labels[ language ].value
	);
	assert.strictEqual(
		elements.description.getText(),
		expectedTerms.descriptions[ language ].value
	);
	expectedTerms.aliases[ language ].forEach( ( { value: alias }, j ) => {
		assert.strictEqual(
			elements.aliases[ j ].getText().trim(),
			alias
		);
	} );
}

describe( 'Termbox: reading', () => {
	const useLangParam = 'de';
	let terms, id, termboxLanguages;

	before( () => {
		termboxLanguages = TermboxLanguages.initWithUseLang( useLangParam );
		terms = createTermsInLanguages(
			[ useLangParam ]
				.concat( termboxLanguages.getPreferredLanguages() )
				.concat( termboxLanguages.getNonPreferredLanguages().slice( 0, 2 ) )
		);
		id = browser.call( () => WikibaseApi.createItem( '', terms ) );
	} );

	beforeEach( () => {
		browser.deleteAllCookies();
		TermboxPage.openItemPage( id, useLangParam );
	} );

	it( 'is in reading mode when opening the item page', () => {
		assert.ok( TermboxPage.isInReadMode );
	} );

	describe( 'primary language terms', () => {
		it( 'contains the expected language with respective terms', () => {
			TermboxPage.openItemPage( id, useLangParam );

			const primaryFingerprint = TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.primaryMonolingualFingerprint
			)[ 0 ];

			assert.strictEqual(
				primaryFingerprint.language.getText(),
				termboxLanguages.getContentLanguages()[ useLangParam ]
			);
			assertMonolingualFingerprintHasTermsInLanguage(
				primaryFingerprint,
				terms,
				useLangParam
			);
		} );
	} );

	describe( '"in more languages" section', () => {
		beforeEach( () => {
			TermboxPage.openItemPage( id, useLangParam );
		} );

		it( 'has a collapse/expand button', () => {
			assert.ok( TermboxPage.inMoreLanguagesButton.isDisplayed() );
		} );

		it( 'is expanded by default', () => {
			assert.ok( TermboxPage.inMoreLanguages.isDisplayed() );
		} );

		it( 'is collapsible, also hiding the "all entered languages" section', () => {
			TermboxPage.inMoreLanguagesButton.click();

			assert.strictEqual( TermboxPage.inMoreLanguages.isDisplayed(), false );
			assert.strictEqual( TermboxPage.allEnteredLanguagesButton.isDisplayed(), false );
		} );

		it( 'expands again when clicking the button twice', () => {
			TermboxPage.inMoreLanguagesButton.click();
			TermboxPage.inMoreLanguagesButton.click();

			assert.ok( TermboxPage.inMoreLanguages.isDisplayed() );
		} );

		it( 'contains the expected languages with respective terms', () => {
			const expectedLanguages = termboxLanguages.getPreferredLanguages().slice( 1 );
			const monolingualFingerprints = TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.inMoreLanguages
			);

			expectedLanguages.forEach( ( language, i ) => {
				assert.strictEqual(
					monolingualFingerprints[ i ].language.getText(),
					termboxLanguages.getContentLanguages()[ language ]
				);
				assertMonolingualFingerprintHasTermsInLanguage(
					monolingualFingerprints[ i ],
					terms,
					language
				);
			} );
		} );
	} );

	describe( '"all entered languages" section', () => {
		beforeEach( () => {
			TermboxPage.openItemPage( id, useLangParam );
		} );

		it( 'is collapsed by default', () => {
			assert.strictEqual( TermboxPage.allEnteredLanguages.isDisplayed(), false );
		} );

		it( 'has a collapse/expand button', () => {
			assert.ok( TermboxPage.allEnteredLanguagesButton.isDisplayed() );
		} );

		it( 'is expandable', () => {
			TermboxPage.allEnteredLanguagesButton.click();
			assert.ok( TermboxPage.allEnteredLanguages.isDisplayed() );
		} );

		it( 'collapses again when clicking the button twice', () => {
			TermboxPage.allEnteredLanguagesButton.click();
			TermboxPage.allEnteredLanguagesButton.click();

			assert.strictEqual( TermboxPage.allEnteredLanguages.isDisplayed(), false );
		} );

		it( 'contains the expected languages with respective terms', () => {
			TermboxPage.allEnteredLanguagesButton.click();

			const expectedLanguages = termboxLanguages.getNonPreferredLanguages().slice( 0, 2 );
			const monolingualFingerprints = TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.allEnteredLanguages
			);

			expectedLanguages.forEach( ( language, i ) => {
				assert.strictEqual(
					monolingualFingerprints[ i ].language.getText(),
					termboxLanguages.getContentLanguages()[ language ]
				);
				assertMonolingualFingerprintHasTermsInLanguage(
					monolingualFingerprints[ i ],
					terms,
					language
				);
			} );
		} );
	} );
} );
