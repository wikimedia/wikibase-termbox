'use strict';

const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const TermboxLanguages = require( '../TermboxLanguages' );
const createTermsInLanguages = require( '../createTermsInLanguages' );
const LoginPage = require( 'wdio-mediawiki/LoginPage' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );

function getAliasValues( itemAliases ) {
	const aliases = [];
	itemAliases.forEach( ( monolingualFingerprintAliases ) => {
		aliases.push( monolingualFingerprintAliases.value );
	} );
	return aliases.join( ' ' );
}

function getLabelOrDescritpionValues( itemLabelOrDescription ) {
	return itemLabelOrDescription.value;
}

function getLanguageName( itemLanguageName ) {
	return itemLanguageName;
}

function verifyMonolingualFingerprintSection(
	fingerprintSection,
	languageCodes,
	verifier,
	getter,
	limit = -1
) {
	let counter = 0;
	languageCodes.forEach( ( language ) => {
		if ( limit > 0 && counter === limit ) {
			return;
		}

		assert.strictEqual(
			verifier( counter ).getText(),
			getter( fingerprintSection[ language ] )
		);

		counter++;
	} );
}

describe( 'Termbox', () => {
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
		browser.deleteCookie();
	} );

	describe( 'Readmode', () => {
		describe( 'on entry', () => {
			before( () => {
				TermboxPage.openItemPage( id, useLangParam );
			} );

			it( 'is in Readmode', () => {
				assert.ok( TermboxPage.isInReadMode );
			} );

			it( 'has a edit button', () => {
				assert.ok( TermboxPage.editButton.isVisible() );
			} );

			describe( 'Primary Monolingualfingerprint', () => {
				before( () => {
					TermboxPage.openItemPage( id, useLangParam );
				} );

				it( 'has a language name', () => {
					assert.strictEqual(
						TermboxPage.primaryLanguageName.getText(),
						termboxLanguages.getContentLanguages()[ useLangParam ]
					);
				} );

				it( 'has an item label', () => {
					assert.strictEqual(
						TermboxPage.primaryLabel.getText(),
						terms.labels[ useLangParam ].value
					);
				} );

				it( 'has a item description', () => {
					assert.strictEqual(
						TermboxPage.primaryDescription.getText(),
						terms.descriptions[ useLangParam ].value
					);
				} );

				it( 'has item aliases', () => {
					assert.strictEqual(
						TermboxPage.primaryAliases.getText(),
						getAliasValues( terms.aliases[ useLangParam ] )
					);
				} );
			} );

			describe( 'In More Languages', () => {
				const limit = 4;
				let inMoreLanguages;

				before( () => {
					inMoreLanguages = termboxLanguages.getPreferredLanguages().slice( 1 );
					TermboxPage.openItemPage( id, useLangParam );
				} );

				it( 'has a button', () => {
					assert.ok( TermboxPage.inMoreLanguagesButton.isVisible() );
				} );

				it( 'is expanded', () => {
					assert.ok( TermboxPage.inMoreLanguages.isVisible() );
				} );

				it( 'contains language names', () => {
					verifyMonolingualFingerprintSection(
						termboxLanguages.getContentLanguages(),
						inMoreLanguages,
						TermboxPage.inMoreLanguagesLanguageName,
						getLanguageName,
						limit
					);
				} );

				it( 'contains item labels', () => {
					verifyMonolingualFingerprintSection(
						terms.labels,
						inMoreLanguages,
						TermboxPage.inMoreLanguagesLabel,
						getLabelOrDescritpionValues,
						limit
					);
				} );

				it( 'contains item descriptions', () => {
					verifyMonolingualFingerprintSection(
						terms.descriptions,
						inMoreLanguages,
						TermboxPage.inMoreLanguagesDescription,
						getLabelOrDescritpionValues,
						limit
					);
				} );

				it( 'contains item aliases', () => {
					verifyMonolingualFingerprintSection(
						terms.aliases,
						inMoreLanguages,
						TermboxPage.inMoreLanguagesAliases,
						getAliasValues,
						limit
					);

				} );

				it( 'contains in All-Entered-Languages button', () => {
					assert.ok( TermboxPage.allEnteredLanguagesButton.isVisible() );
				} );
			} );

			describe( 'In All-Entered-Languages', () => {
				before( () => {
					TermboxPage.openItemPage( id );
				} );

				it( 'is collapsed', () => {
					assert.strictEqual( TermboxPage.allEnteredLanguages.isVisible(), false );
				} );
			} );
		} );

		describe( 'Expandable/Collapsable Elements', () => {
			describe( 'In More Languages', () => {
				describe( 'is collapsed after clicking In-More-Languages button', () => {
					before( () => {
						TermboxPage.openItemPage( id, useLangParam );
						TermboxPage.inMoreLanguagesButton.click();
					} );

					it( 'has still a button after collapsing', () => {
						assert.ok( TermboxPage.inMoreLanguagesButton.isVisible() );
					} );

					it( 'is collapsed after clicking', () => {
						assert.strictEqual( TermboxPage.inMoreLanguages.isVisible(), false );
					} );

					it( 'has no All-Entered-Languages button', () => {
						assert.strictEqual( TermboxPage.allEnteredLanguagesButton.isVisible(), false );
					} );

				} );

				describe( 'is expanded after clicking In-More-Languages button twice', () => {
					before( () => {
						TermboxPage.openItemPage( id, useLangParam );
						TermboxPage.inMoreLanguagesButton.click();
						TermboxPage.inMoreLanguagesButton.click();
					} );

					it( 'has still a button after expanding', () => {
						assert.ok( TermboxPage.inMoreLanguagesButton.isVisible() );
					} );

					it( 'is expanded after clicking', () => {
						assert.ok( TermboxPage.inMoreLanguages.isVisible() );
					} );

					it( 'has a All-Entered-Languages button', () => {
						assert.ok( TermboxPage.allEnteredLanguagesButton.isVisible() );
					} );
				} );
			} );

			describe( 'All-Entered-Languages', () => {
				describe( 'is expanded after clicking All-Entered-Languages button', () => {
					const limit = 4;
					let allEnteredLanguages;

					before( () => {
						allEnteredLanguages = termboxLanguages.getNonPreferredLanguages().slice( 0, 2 );
						TermboxPage.openItemPage( id, useLangParam );
						TermboxPage.allEnteredLanguagesButton.click();
					} );

					it( 'has still a In-More-Languages button', () => {
						assert.ok( TermboxPage.inMoreLanguagesButton.isVisible() );
					} );

					it( 'has still a All-Entered-Languages button', () => {
						assert.ok( TermboxPage.allEnteredLanguagesButton.isVisible() );
					} );

					it( 'has still a In-More-Languages section', () => {
						assert.ok( TermboxPage.inMoreLanguages.isVisible() );
					} );

					it( 'has a All-Entered-Languages section', () => {
						assert.ok( TermboxPage.allEnteredLanguages.isVisible() );
					} );

					it( 'contains language names', () => {
						verifyMonolingualFingerprintSection(
							termboxLanguages.getContentLanguages(),
							allEnteredLanguages,
							TermboxPage.allEnteredLanguagesLanguageName,
							getLanguageName,
							limit
						);
					} );

					it( 'contains item labels', () => {
						verifyMonolingualFingerprintSection(
							terms.labels,
							allEnteredLanguages,
							TermboxPage.allEnteredLanguagesLabel,
							getLabelOrDescritpionValues,
							limit
						);
					} );

					it( 'contains item descriptions', () => {
						verifyMonolingualFingerprintSection(
							terms.descriptions,
							allEnteredLanguages,
							TermboxPage.allEnteredLanguagesDescription,
							getLabelOrDescritpionValues,
							limit
						);
					} );

					it( 'contains item aliases', () => {
						verifyMonolingualFingerprintSection(
							terms.aliases,
							allEnteredLanguages,
							TermboxPage.allEnteredLanguagesAliases,
							getAliasValues,
							limit
						);
					} );
				} );

				describe( 'is collapsed after clicking All-Entered-Languages button twice', () => {
					before( () => {
						TermboxPage.openItemPage( id );
						TermboxPage.allEnteredLanguagesButton.click();
						TermboxPage.allEnteredLanguagesButton.click();
					} );

					it( 'has still a In-More-Languages button', () => {
						assert.ok( TermboxPage.inMoreLanguagesButton.isVisible() );
					} );

					it( 'has still a All-Entered-Languages button', () => {
						assert.ok( TermboxPage.allEnteredLanguagesButton.isVisible() );
					} );

					it( 'has still a In-More-Languages section', () => {
						assert.ok( TermboxPage.inMoreLanguages.isVisible() );
					} );

					it( 'has no All-Entered-Languages section', () => {
						assert.strictEqual( TermboxPage.allEnteredLanguages.isVisible(), false );
					} );
				} );
			} );
		} );

		describe( 'switch to Editmode', () => {

			before( () => {
				TermboxPage.openItemPage( id );
			} );

			it( 'has switched to Editmode after clicking the EditButton', () => {
				TermboxPage.editButton.click();
				assert.ok( TermboxPage.isInEditMode );
			} );
		} );
	} );

	describe( 'Editmode after clicking the edit button', () => {
		describe( 'as non logged in user', () => {
			beforeEach( () => {
				TermboxPage.openItemPage( id );
				TermboxPage.editButton.click();
			} );

			it( 'is in Editmode', () => {
				assert.ok( TermboxPage.isInEditMode );
			} );

			it( 'shows the ip warning overlay if user has not opted out (default)', () => {
				assert.ok( TermboxPage.anonEditWarning.isVisible() );
				assert.ok( TermboxPage.anonEditWarningCheckbox.isVisible() );
			} );

			it( 'does not show ip warning overlay again if user has opted out', () => {
				TermboxPage.anonEditWarningCheckbox.click();
				TermboxPage.anonEditWarningDismissButton.click();

				browser.refresh();
				TermboxPage.waitForTermboxToLoad();
				TermboxPage.editButton.click();

				assert.ok( TermboxPage.anonEditWarning.waitForExist( null, true ) );
			} );

			it( 'has a Cancel button', () => {
				TermboxPage.anonEditWarningDismissButton.click();

				assert.ok( TermboxPage.cancelButton.isVisible() );
			} );

			describe( 'ip warning overlay', () => {
				before( () => {
					TermboxPage.openItemPage( id );
					TermboxPage.editButton.click();
				} );

				it( 'disappears after clicking anonymous editing', () => {
					TermboxPage.anonEditWarningDismissButton.click();
					assert.strictEqual( TermboxPage.anonEditWarning.isExisting(), false );
				} );
			} );
		} );

		describe( 'as logged in user', () => {
			before( () => {
				LoginPage.loginAdmin();
				TermboxPage.openItemPage( id );
				TermboxPage.editButton.click();
			} );

			it( 'is in Editmode', () => {
				assert.ok( TermboxPage.isInEditMode );
			} );

			it( 'shows no ip warning overlay', () => {
				assert.strictEqual( TermboxPage.anonEditWarning.isExisting(), false );
			} );

			it( 'has a Cancel button', () => {
				assert.ok( TermboxPage.cancelButton.isVisible() );
			} );
		} );

		describe( 'license agreement', () => {
			beforeEach( () => {
				TermboxPage.openItemPage( id );
				TermboxPage.switchToEditModeSkipWarning();
			} );

			it( 'is shown, after clicking publish', () => {
				TermboxPage.publishButton.click();
				assert.ok( TermboxPage.licenseOverlay.waitForExist() );
			} );

			it( 'disappears, after clicking cancel and goes back to Editmode', () => {
				TermboxPage.publishButton.click();
				TermboxPage.licenseOverlay.waitForExist();
				TermboxPage.licenseOverlayCancelButton.click();

				assert.strictEqual( TermboxPage.licenseOverlay.isExisting(), false );
				assert.ok( TermboxPage.isInEditMode );
			} );

			it( 'disappears, after clicking publish and goes to Readmode', () => {
				TermboxPage.publishButton.click();
				TermboxPage.licenseOverlay.waitForExist();
				TermboxPage.licenseOverlaySaveButton.click();

				assert.strictEqual( TermboxPage.licenseOverlay.isExisting(), false );
				TermboxPage.waitUntilSaved();
				assert.ok( TermboxPage.isInReadMode );
			} );

			it( 'does not appear a second time by default', () => {
				TermboxPage.publishButton.click();
				TermboxPage.licenseOverlay.waitForExist();
				TermboxPage.licenseOverlaySaveButton.click();
				browser.refresh();
				TermboxPage.waitForTermboxToLoad();

				TermboxPage.switchToEditModeSkipWarning();
				TermboxPage.publishButton.click();

				assert.strictEqual( TermboxPage.licenseOverlay.isExisting(), false );
			} );

			it( 'gets shown again after reload when unchecking the "remember my choice" checkbox', () => {
				TermboxPage.publishButton.click();
				TermboxPage.licenseOverlay.waitForExist();
				TermboxPage.licenseOverlayCheckbox.click();
				TermboxPage.licenseOverlaySaveButton.click();
				browser.refresh();
				TermboxPage.waitForTermboxToLoad();

				TermboxPage.switchToEditModeSkipWarning();
				TermboxPage.publishButton.click();

				assert.ok( TermboxPage.licenseOverlay.isVisible() );
			} );
		} );

		describe( 'switch to Readmode', () => {
			before( () => {
				TermboxPage.openItemPage( id );
				TermboxPage.editButton.click();
			} );

			it( 'has switched to Readmode after clicking the CancelButton', () => {
				TermboxPage.anonEditWarningDismissButton.click();
				TermboxPage.cancelButton.click();
				assert.ok( TermboxPage.isInReadMode );
			} );
		} );
	} );
} );
