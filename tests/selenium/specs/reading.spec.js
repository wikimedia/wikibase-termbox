import TermboxPage from '../pageobjects/Termbox.page.js';
import TermboxLanguages from '../TermboxLanguages.js';
import createTermsInLanguages from '../createTermsInLanguages.js';
import WikibaseApi from 'wdio-wikibase/wikibase.api.js';

async function assertMonolingualFingerprintHasTermsInLanguage( elements, expectedTerms, language ) {
	await expect( elements.label ).toHaveText( expectedTerms.labels[ language ].value );
	await expect( elements.description ).toHaveText( expectedTerms.descriptions[ language ].value );
	for ( const [ i, { value: alias } ] of expectedTerms.aliases[ language ].entries() ) {
		await expect( elements.aliases[ i ] ).toHaveText( alias, { trim: true } );
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
		await expect( await TermboxPage.isInReadMode ).toBe( true );
	} );

	describe( 'primary language terms', () => {
		it( 'contains the expected language with respective terms', async () => {
			const primaryFingerprint = await TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.primaryMonolingualFingerprint
			)[ 0 ];

			await expect( primaryFingerprint.language )
				.toHaveText( termboxLanguages.getContentLanguages()[ useLangParam ] );
			await assertMonolingualFingerprintHasTermsInLanguage(
				primaryFingerprint,
				terms,
				useLangParam
			);
		} );
	} );

	describe( '"in more languages" section', () => {
		it( 'has a collapse/expand button', async () => {
			await expect( TermboxPage.inMoreLanguagesButton ).toBeDisplayed();
		} );

		it( 'is expanded by default', async () => {
			await expect( TermboxPage.inMoreLanguages ).toBeDisplayed();
		} );

		it( 'is collapsible, also hiding the "all entered languages" section', async () => {
			await TermboxPage.inMoreLanguagesButton.click();

			await expect( TermboxPage.inMoreLanguages ).not.toBeDisplayed();
			await expect( TermboxPage.allEnteredLanguagesButton ).not.toBeDisplayed();
		} );

		it( 'expands again when clicking the button twice', async () => {
			await TermboxPage.inMoreLanguagesButton.click();
			await TermboxPage.inMoreLanguagesButton.click();

			await expect( TermboxPage.inMoreLanguages ).toBeDisplayed();
		} );

		it( 'contains the expected languages with respective terms', async () => {
			const expectedLanguages = termboxLanguages.getPreferredLanguages().slice( 1 );
			const monolingualFingerprints = await TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.inMoreLanguages
			);

			for ( const [ i, language ] of expectedLanguages.entries() ) {
				await expect( monolingualFingerprints[ i ].language )
					.toHaveText( termboxLanguages.getContentLanguages()[ language ] );
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
			await expect( TermboxPage.allEnteredLanguages ).not.toBeDisplayed();
		} );

		it( 'has a collapse/expand button', async () => {
			await expect( TermboxPage.allEnteredLanguagesButton ).toBeDisplayed();
		} );

		it( 'is expandable', async () => {
			await TermboxPage.allEnteredLanguagesButton.click();
			await expect( TermboxPage.allEnteredLanguages ).toBeDisplayed();
		} );

		it( 'collapses again when clicking the button twice', async () => {
			await TermboxPage.allEnteredLanguagesButton.click();
			await TermboxPage.allEnteredLanguagesButton.click();

			await expect( TermboxPage.allEnteredLanguages ).not.toBeDisplayed();
		} );

		it( 'contains the expected languages with respective terms', async () => {
			await TermboxPage.allEnteredLanguagesButton.click();

			const expectedLanguages = termboxLanguages.getNonPreferredLanguages().slice( 0, 2 );
			const monolingualFingerprints = await TermboxPage.getMonolingualFingerprintsInSection(
				TermboxPage.allEnteredLanguages
			);

			for ( const [ i, language ] of expectedLanguages.entries() ) {
				await expect( monolingualFingerprints[ i ].language )
					.toHaveText( termboxLanguages.getContentLanguages()[ language ] );
				await assertMonolingualFingerprintHasTermsInLanguage(
					monolingualFingerprints[ i ],
					terms,
					language
				);
			}
		} );
	} );
} );
