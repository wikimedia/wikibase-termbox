'use strict';

const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
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
	const primaryLanguage = 'de';
	let fingerprint, allEnteredLanguages, id;

	before( () => {
		LoginPage.loginAdmin();
		TermboxPage.readLanguageData( primaryLanguage );
		[ fingerprint, allEnteredLanguages ] = TermboxPage.createTestItem( [ primaryLanguage ] );
		id = browser.call( () => WikibaseApi.createItem( '', fingerprint ) );
	} );

	beforeEach( () => {
		browser.deleteCookie();
	} );

	describe( 'Readmode', () => {
		describe( 'on entry', () => {
			before( () => {
				TermboxPage.openItemPage( id, primaryLanguage );
			} );

			it( 'is in Readmode', () => {
				assert.ok( TermboxPage.isInReadMode );
			} );

			it( 'has a edit button', () => {
				assert.ok( TermboxPage.editButton.isVisible() );
			} );

			describe( 'Primary Monolingualfingerprint', () => {
				before( () => {
					TermboxPage.openItemPage( id, primaryLanguage );
				} );

				it( 'has a language name', () => {
					assert.strictEqual(
						TermboxPage.primaryLanguageName.getText(),
						TermboxPage.availableLanguages[ primaryLanguage ]
					);
				} );

				it( 'has an item label', () => {
					assert.strictEqual(
						TermboxPage.primaryLabel.getText(),
						fingerprint.labels[ primaryLanguage ].value
					);
				} );

				it( 'has a item description', () => {
					assert.strictEqual(
						TermboxPage.primaryDescription.getText(),
						fingerprint.descriptions[ primaryLanguage ].value
					);
				} );

				it( 'has item aliases', () => {
					assert.strictEqual(
						TermboxPage.primaryAliases.getText(),
						getAliasValues( fingerprint.aliases[ primaryLanguage ] )
					);
				} );
			} );

			describe( 'In More Languages', () => {
				const preferredLanguages = [];
				const limit = 4;

				before( () => {
					TermboxPage.openItemPage( id, primaryLanguage );
					const currentPreferredLanguages = TermboxPage.getCurrentPreferredLanguages( 3 );
					// we have to remove the primary language, which is the first item in the chain
					currentPreferredLanguages.shift();

					// this might happen depending on your geolocation and the configured primaryLanguage
					if ( currentPreferredLanguages.length === 0 ) {
						// eslint-disable-next-line no-console, max-len
						console.warn( 'There are no preferred languages, therefore the testset will fail. Please adjust the wdio config, which runs on this tests.' );
					}

					currentPreferredLanguages.forEach( ( language ) => {
						if ( allEnteredLanguages.indexOf( language ) !== -1 ) {
							preferredLanguages.push( language );
						}
					} );
				} );

				it( 'has a button', () => {
					assert.ok( TermboxPage.inMoreLanguagesButton.isVisible() );
				} );

				it( 'is expanded', () => {
					assert.ok( TermboxPage.inMoreLanguages.isVisible() );
				} );

				it( 'contains language names', () => {
					verifyMonolingualFingerprintSection(
						TermboxPage.availableLanguages,
						preferredLanguages,
						TermboxPage.inMoreLanguagesLanguageName,
						getLanguageName,
						limit
					);
				} );

				it( 'contains item labels', () => {
					verifyMonolingualFingerprintSection(
						fingerprint.labels,
						preferredLanguages,
						TermboxPage.inMoreLanguagesLabel,
						getLabelOrDescritpionValues,
						limit
					);
				} );

				it( 'contains item descriptions', () => {
					verifyMonolingualFingerprintSection(
						fingerprint.descriptions,
						preferredLanguages,
						TermboxPage.inMoreLanguagesDescription,
						getLabelOrDescritpionValues,
						limit
					);
				} );

				it( 'contains item aliases', () => {
					verifyMonolingualFingerprintSection(
						fingerprint.aliases,
						preferredLanguages,
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
						TermboxPage.openItemPage( id, primaryLanguage );
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
						TermboxPage.openItemPage( id, primaryLanguage );
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
					const selectedAllEnteredLanguages = [];

					before( () => {
						TermboxPage.openItemPage( id, primaryLanguage );
						TermboxPage.allEnteredLanguagesButton.click();
						allEnteredLanguages.forEach( ( language ) => {
							if ( TermboxPage.nonPreferredLanguages.indexOf( language ) !== -1 ) {
								selectedAllEnteredLanguages.push( language );
							}
						} );
						// this might happen depending on your geolocation and the configured primaryLanguage
						if ( selectedAllEnteredLanguages.length === 0 ) {
							// eslint-disable-next-line no-console, max-len
							console.warn( 'There are no non prefrred languages, therefore the testset will fail. Please adjust the wdio config, which runs on this tests.' );
						}
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
							TermboxPage.availableLanguages,
							selectedAllEnteredLanguages,
							TermboxPage.allEnteredLanguagesLanguageName,
							getLanguageName,
							limit
						);
					} );

					it( 'contains item labels', () => {
						verifyMonolingualFingerprintSection(
							fingerprint.labels,
							selectedAllEnteredLanguages,
							TermboxPage.allEnteredLanguagesLabel,
							getLabelOrDescritpionValues,
							limit
						);
					} );

					it( 'contains item descriptions', () => {
						verifyMonolingualFingerprintSection(
							fingerprint.descriptions,
							selectedAllEnteredLanguages,
							TermboxPage.allEnteredLanguagesDescription,
							getLabelOrDescritpionValues,
							limit
						);
					} );

					it( 'contains item aliases', () => {
						verifyMonolingualFingerprintSection(
							fingerprint.aliases,
							selectedAllEnteredLanguages,
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
