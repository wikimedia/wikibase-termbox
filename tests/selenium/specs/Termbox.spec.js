'use strict';

const assert = require( 'assert' );
const TermboxPage = require( '../pageobjects/Termbox.page' );
const WikibaseApi = require( '../../../../../../repo/tests/selenium/wdio-wikibase/wikibase.api' );

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
			verifier( counter ),
			getter( fingerprintSection[ language ] )
		);

		counter++;
	} );
}

describe( 'Termbox', () => {
	const primaryLanguage = 'de';
	let fingerprint, allEnteredLanguages, id;

	before( () => {
		TermboxPage.wikiLogin();
		TermboxPage.readLanguageData( primaryLanguage );
		[ fingerprint, allEnteredLanguages ] = TermboxPage.createTestItem( [ primaryLanguage ] );
		id = browser.call( () => WikibaseApi.createItem( '', fingerprint ) );
		TermboxPage.wikiLogout();
	} );

	afterEach( () => {
		TermboxPage.clearStorage();
	} );

	describe( 'Readmode', () => {
		describe( 'on entry', () => {
			before( () => {
				TermboxPage.openItemPage( id, primaryLanguage );
			} );

			it( 'is in Readmode', () => {
				assert.ok( TermboxPage.isInReadmode );
			} );

			it( 'has a edit button', () => {
				assert.ok( TermboxPage.hasEditButton );
			} );

			describe( 'Primary Monolingualfingerprint', () => {
				before( () => {
					TermboxPage.openItemPage( id, primaryLanguage );
				} );

				it( 'has a language name', () => {
					assert.strictEqual(
						TermboxPage.primaryLanguageName,
						TermboxPage.availableLanguages[ primaryLanguage ]
					);
				} );

				it( 'has an item label', () => {
					assert.strictEqual(
						TermboxPage.primaryLabel,
						fingerprint.labels[ primaryLanguage ].value
					);
				} );

				it( 'has a item description', () => {
					assert.strictEqual(
						TermboxPage.primaryDescription,
						fingerprint.descriptions[ primaryLanguage ].value
					);
				} );

				it( 'has item aliases', () => {
					assert.strictEqual(
						TermboxPage.primaryAliases,
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
					assert.ok( TermboxPage.hasInMoreLanguagesButton );
				} );

				it( 'is expanded', () => {
					assert.ok( TermboxPage.inMoreLanguagesIsExpanded );
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
					assert.ok( TermboxPage.hasAllEnteredLanguagesButton );
				} );
			} );

			describe( 'In All-Entered-Languages', () => {
				before( () => {
					TermboxPage.openItemPage( id );
				} );

				it( 'is collapsed', () => {
					assert.strictEqual( TermboxPage.allEnteredLanguagesIsExpanded, false );
				} );
			} );
		} );

		describe( 'Expandable/Collapsable Elements', () => {
			describe( 'In More Languages', () => {
				describe( 'is collapsed after clicking In-More-Languages button', () => {
					before( () => {
						TermboxPage.openItemPage( id, primaryLanguage );
						TermboxPage.clickInMoreLanguagesButton();
					} );

					it( 'has still a button after collapsing', () => {
						assert.ok( TermboxPage.hasInMoreLanguagesButton );
					} );

					it( 'is collapsed after clicking', () => {
						assert.strictEqual( TermboxPage.inMoreLanguagesIsExpanded, false );
					} );

					it( 'has no All-Entered-Languages button', () => {
						assert.strictEqual( TermboxPage.hasAllEnteredLanguagesButton, false );
					} );

				} );

				describe( 'is expanded after clicking In-More-Languages button twice', () => {
					before( () => {
						TermboxPage.openItemPage( id, primaryLanguage );
						TermboxPage.clickInMoreLanguagesButton();
						TermboxPage.clickInMoreLanguagesButton();
					} );

					it( 'has still a button after expanding', () => {
						assert.ok( TermboxPage.hasInMoreLanguagesButton );
					} );

					it( 'is expanded after clicking', () => {
						assert.ok( TermboxPage.inMoreLanguagesIsExpanded );
					} );

					it( 'has a All-Entered-Languages button', () => {
						assert.ok( TermboxPage.hasAllEnteredLanguagesButton );
					} );
				} );
			} );

			describe( 'All-Entered-Languages', () => {
				describe( 'is expanded after clicking All-Entered-Languages button', () => {
					const limit = 4;
					const selectedAllEnteredLanguages = [];

					before( () => {
						TermboxPage.openItemPage( id, primaryLanguage );
						TermboxPage.clickAllEnteredLanguagesButton();

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
						assert.ok( TermboxPage.hasInMoreLanguagesButton );
					} );

					it( 'has still a All-Entered-Languages button', () => {
						assert.ok( TermboxPage.hasAllEnteredLanguagesButton );
					} );

					it( 'has still a In-More-Languages section', () => {
						assert.ok( TermboxPage.inMoreLanguagesIsExpanded );
					} );

					it( 'has a All-Entered-Languages section', () => {
						assert.ok( TermboxPage.allEnteredLanguagesIsExpanded );
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
						TermboxPage.clickAllEnteredLanguagesButton();
						TermboxPage.clickAllEnteredLanguagesButton();
					} );

					it( 'has still a In-More-Languages button', () => {
						assert.ok( TermboxPage.hasInMoreLanguagesButton );
					} );

					it( 'has still a All-Entered-Languages button', () => {
						assert.ok( TermboxPage.hasAllEnteredLanguagesButton );
					} );

					it( 'has still a In-More-Languages section', () => {
						assert.ok( TermboxPage.inMoreLanguagesIsExpanded );
					} );

					it( 'has no All-Entered-Languages section', () => {
						assert.strictEqual( TermboxPage.allEnteredLanguagesIsExpanded, false );
					} );
				} );
			} );
		} );

		describe( 'switch to Editmode', () => {

			before( () => {
				TermboxPage.openItemPage( id );
			} );

			it( 'has switched to Editmode after clicking the EditButton', () => {
				TermboxPage.clickEditButton();
				assert.ok( TermboxPage.isInEditmode );
			} );
		} );
	} );

	describe( 'Editmode after clicking the edit button', () => {
		describe( 'as non logged in user', () => {
			before( () => {
				TermboxPage.logoutAndOpen( id );
				TermboxPage.switchToEditmode();
				TermboxPage.ipWarningEventuallyAppears();
			} );

			it( 'is in Editmode', () => {
				assert.ok( TermboxPage.isInEditmode );
			} );

			it( 'shows the ip warning overlay if user has not opted out (default)', () => {
				assert.ok( TermboxPage.hasIPWarning );
				assert.ok( TermboxPage.hasIpWarningCheckbox );
			} );

			it( 'does not show ip warning overlay again if user has opted out', () => {
				TermboxPage.clickIpWarningCheckbox();
				TermboxPage.clickWithoutSignIn();

				TermboxPage.logoutAndOpen( id );
				TermboxPage.clickEditButton();
				assert.ok( TermboxPage.ipWarningDoesNotAppear() );
			} );

			it( 'has a Cancel button', () => {
				assert.ok( TermboxPage.hasCancelButton );
			} );

			describe( 'ip warning overlay', () => {
				before( () => {
					TermboxPage.logoutAndOpen( id );
					TermboxPage.switchToEditmode();
					TermboxPage.ipWarningEventuallyAppears();
				} );

				it( 'disappears after clicking anonymous editing', () => {
					TermboxPage.clickWithoutSignIn();
					assert.strictEqual( TermboxPage.hasIPWarning, false );
				} );
			} );
		} );

		describe( 'as logged in user', () => {
			before( () => {
				TermboxPage.loginAndOpen( id );
				TermboxPage.switchToEditmode();
			} );

			it( 'is in Editmode', () => {
				assert.ok( TermboxPage.isInEditmode );
			} );

			it( 'shows no ip warning overlay', () => {
				assert.strictEqual( TermboxPage.hasIPWarning, false );
			} );

			it( 'has a Cancel button', () => {
				assert.ok( TermboxPage.hasCancelButton );
			} );
		} );

		describe( 'license agreement', () => {
			beforeEach( () => {
				TermboxPage.openItemPage( id );
				TermboxPage.switchToEditmodeSkipWarning();
			} );

			it( 'is shown, after clicking publish', () => {
				TermboxPage.clickPublishButton();
				TermboxPage.waitForLicenseOverlayToAppear();
				assert.ok( TermboxPage.hasLicenseAgreement );
			} );

			it( 'disappears, after clicking cancel and goes back to Editmode', () => {
				TermboxPage.clickPublishButton();
				TermboxPage.waitForLicenseOverlayToAppear();
				TermboxPage.clickCancelLicenseAgreement();
				assert.strictEqual( TermboxPage.hasLicenseAgreement, false );
				assert.ok( TermboxPage.isInEditmode );
			} );

			it( 'disappears, after clicking publish and goes to Readmode', () => {
				TermboxPage.clickPublishButton();
				TermboxPage.waitForLicenseOverlayToAppear();
				TermboxPage.clickSaveLicenseAgreement();
				assert.strictEqual( TermboxPage.hasLicenseAgreement, false );
				TermboxPage.waitUntilSaved();
				assert.ok( TermboxPage.isInReadmode );
			} );

			it( 'does not appear a second time by default', () => {
				TermboxPage.clickPublishButton();
				TermboxPage.waitForLicenseOverlayToAppear();
				TermboxPage.clickSaveLicenseAgreement();

				browser.refresh();
				TermboxPage.waitForTermboxToLoad();

				TermboxPage.switchToEditmodeSkipWarning();
				TermboxPage.clickPublishButton();
				assert.strictEqual( TermboxPage.hasLicenseAgreement, false );
			} );

			it( 'gets shown again after reload when unchecking the "remember my choice" checkbox', () => {
				TermboxPage.clickPublishButton();
				TermboxPage.waitForLicenseOverlayToAppear();
				TermboxPage.licenseAgreementCheckbox.click();
				TermboxPage.clickSaveLicenseAgreement();

				browser.refresh();
				TermboxPage.waitForTermboxToLoad();

				TermboxPage.switchToEditmodeSkipWarning();
				TermboxPage.clickPublishButton();
				assert.strictEqual( TermboxPage.hasLicenseAgreement, true );
			} );
		} );

		describe( 'switch to Readmode', () => {
			before( () => {
				TermboxPage.loginAndOpen( id );
				TermboxPage.switchToEditmode();
				TermboxPage.ipWarningEventuallyAppears();
			} );

			it( 'has switched to Readmode after clicking the CancelButton', () => {
				TermboxPage.clickWithoutSignIn();
				TermboxPage.clickCancelButton();
				assert.ok( TermboxPage.isInReadmode );
			} );

			after( () => {
				TermboxPage.wikiLogout();
			} );
		} );
	} );
} );
