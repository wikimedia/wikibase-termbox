const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const TermboxLanguages = require( '../TermboxLanguages' );
const createTermsInLanguages = require( '../createTermsInLanguages' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );

async function assertMonolingualFingerprintHasTermsInLanguage( elements, expectedTerms, language ) {
	assert.strictEqual(
		await elements.label.getText(),
		expectedTerms.labels[ language ].value
	);
	assert.strictEqual(
		await elements.description.getText(),
		expectedTerms.descriptions[ language ].value
	);
	for ( const [ i, { value: alias } ] of expectedTerms.aliases[ language ].entries() ) {
		assert.strictEqual(
			( await elements.aliases[ i ].getText() ).trim(),
			alias
		);
	}
}

describe( 'Termbox: reading', () => {
	const useLangParam = 'de';
	let terms, id, termboxLanguages;

	before( async () => {
		termboxLanguages = await TermboxLanguages.initWithUseLang( useLangParam );
		terms = createTermsInLanguages(
			[ useLangParam ]
				.concat( await termboxLanguages.getPreferredLanguages() )
				.concat( await termboxLanguages.getNonPreferredLanguages().slice( 0, 2 ) )
		);
		id = await WikibaseApi.createItem( '', terms );
	} );

	beforeEach( async () => {
		await browser.deleteAllCookies();
		await TermboxPage.openItemPage( id, useLangParam );
	} );

	it( 'is in reading mode when opening the item page', async () => {
		assert.ok( await TermboxPage.isInReadMode );
	} );

	describe( 'primary language terms', () => {
		it( 'contains the expected language with respective terms', async () => {
			const primaryFingerprint = await TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.primaryMonolingualFingerprint
			)[ 0 ];

			assert.strictEqual(
				await primaryFingerprint.language.getText(),
				termboxLanguages.getContentLanguages()[ useLangParam ]
			);
			await assertMonolingualFingerprintHasTermsInLanguage(
				primaryFingerprint,
				terms,
				useLangParam
			);
		} );
	} );

	describe( '"in more languages" section', () => {
		it( 'has a collapse/expand button', async () => {
			assert.ok( await TermboxPage.inMoreLanguagesButton.isDisplayed() );
		} );

		it( 'is expanded by default', async () => {
			assert.ok( await TermboxPage.inMoreLanguages.isDisplayed() );
		} );

		it( 'is collapsible, also hiding the "all entered languages" section', async () => {
			await TermboxPage.inMoreLanguagesButton.click();

			assert.strictEqual( await TermboxPage.inMoreLanguages.isDisplayed(), false );
			assert.strictEqual( await TermboxPage.allEnteredLanguagesButton.isDisplayed(), false );
		} );

		it( 'expands again when clicking the button twice', async () => {
			await TermboxPage.inMoreLanguagesButton.click();
			await TermboxPage.inMoreLanguagesButton.click();

			assert.ok( await TermboxPage.inMoreLanguages.isDisplayed() );
		} );

		it( 'contains the expected languages with respective terms', async () => {
			const expectedLanguages = termboxLanguages.getPreferredLanguages().slice( 1 );
			const monolingualFingerprints = await TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.inMoreLanguages
			);

			for ( const [ i, language ] of expectedLanguages.entries() ) {
				assert.strictEqual(
					await monolingualFingerprints[ i ].language.getText(),
					termboxLanguages.getContentLanguages()[ language ]
				);
				await assertMonolingualFingerprintHasTermsInLanguage(
					monolingualFingerprints[ i ],
					terms,
					language
				);
			}
		} );
	} );

	describe( '"all entered languages" section', () => {
		it( 'is collapsed by default', async () => {
			assert.strictEqual( await TermboxPage.allEnteredLanguages.isDisplayed(), false );
		} );

		it( 'has a collapse/expand button', async () => {
			assert.ok( await TermboxPage.allEnteredLanguagesButton.isDisplayed() );
		} );

		it( 'is expandable', async () => {
			await TermboxPage.allEnteredLanguagesButton.click();
			assert.ok( await TermboxPage.allEnteredLanguages.isDisplayed() );
		} );

		it( 'collapses again when clicking the button twice', async () => {
			await TermboxPage.allEnteredLanguagesButton.click();
			await TermboxPage.allEnteredLanguagesButton.click();

			assert.strictEqual( await TermboxPage.allEnteredLanguages.isDisplayed(), false );
		} );

		it( 'contains the expected languages with respective terms', async () => {
			await TermboxPage.allEnteredLanguagesButton.click();

			const expectedLanguages = termboxLanguages.getNonPreferredLanguages().slice( 0, 2 );
			const monolingualFingerprints = await TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.allEnteredLanguages
			);

			for ( const [ i, language ] of expectedLanguages.entries() ) {
				assert.strictEqual(
					await monolingualFingerprints[ i ].language.getText(),
					termboxLanguages.getContentLanguages()[ language ]
				);
				await assertMonolingualFingerprintHasTermsInLanguage(
					monolingualFingerprints[ i ],
					terms,
					language
				);
			}
		} );
	} );
} );
