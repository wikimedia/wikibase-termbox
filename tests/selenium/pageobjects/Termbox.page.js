'use strict';
const Page = require( 'wdio-mediawiki/Page' );

class TermboxPage extends Page {
	get isTermboxPage() {
		return $( '.wb-ui-termbox' ).isExisting();
	}

	get editButton() {
		return $( '.wb-ui-event-emitting-button--edit' );
	}

	get cancelButton() {
		return $( '.wb-ui-event-emitting-button--cancel' );
	}

	get publishButton() {
		return $( '.wb-ui-event-emitting-button--publish' );
	}

	get isInEditMode() {
		return this.publishButton.isExisting();
	}

	get isInReadMode() {
		return !this.isInEditMode;
	}

	get primaryLanguageName() {
		return $( '.wb-ui-termbox__primary .wb-ui-monolingualfingerprintview__language' );
	}

	get primaryLabel() {
		return $( '.wb-ui-label--primary' );
	}

	get primaryDescription() {
		return $( '.wb-ui-termbox__primary .wb-ui-description' );
	}

	get primaryAliases() {
		return $( '.wb-ui-termbox__primary .wb-ui-aliases' );
	}

	inMoreLanguagesLanguageName( index ) {
		return $$( '.wb-ui-in-more-languages .wb-ui-monolingualfingerprintview__language' )[ index ];
	}

	inMoreLanguagesLabel( index ) {
		return $$( '.wb-ui-in-more-languages .wb-ui-label' )[ index ];
	}

	inMoreLanguagesDescription( index ) {
		return $$( '.wb-ui-in-more-languages .wb-ui-description' )[ index ];
	}

	inMoreLanguagesAliases( index ) {
		return $$( '.wb-ui-in-more-languages .wb-ui-aliases' )[ index ];
	}

	allEnteredLanguagesLanguageName( index ) {
		return $$( '.wb-ui-all-entered-languages .wb-ui-monolingualfingerprintview__language' )[ index ];
	}

	allEnteredLanguagesLabel( index ) {
		return $$( '.wb-ui-all-entered-languages .wb-ui-label' )[ index ];
	}

	allEnteredLanguagesDescription( index ) {
		return $$( '.wb-ui-all-entered-languages .wb-ui-description' )[ index ];
	}

	allEnteredLanguagesAliases( index ) {
		return $$( '.wb-ui-all-entered-languages .wb-ui-aliases' )[ index ];
	}

	get allEnteredLanguages() {
		return $( '.wb-ui-all-entered-languages' );
	}

	get allEnteredLanguagesButton() {
		return $( '.wb-ui-all-entered-languages-expandable__switch' );
	}

	get licenseOverlay() {
		return $( '.wb-ui-modal .wb-ui-license-agreement' );
	}

	get licenseOverlaySaveButton() {
		return this.licenseOverlay.$( '.wb-ui-event-emitting-button--primaryProgressive' );
	}

	get licenseOverlayCancelButton() {
		return this.licenseOverlay.$( '.wb-ui-event-emitting-button--normal' );
	}

	get licenseOverlayCheckbox() {
		return this.licenseOverlay.$( 'input + label' );
	}

	get anonEditWarning() {
		return $( '.wb-ui-modal .wb-ui-anon-edit-warning' );
	}

	get anonEditWarningCheckbox() {
		return this.anonEditWarning.$( 'input + label' );
	}

	get anonEditWarningDismissButton() {
		return this.anonEditWarning.$( '.wb-ui-event-emitting-button--normal' );
	}

	get inMoreLanguages() {
		return $( '.wb-ui-in-more-languages' );
	}

	get inMoreLanguagesButton() {
		return $( '.wb-ui-in-more-languages-expandable__switch' );
	}

	openItemPage( entityId, primaryLanguage = 'en' ) {
		super.openTitle( `Item:${ entityId }`, { useformat: 'mobile', uselang: primaryLanguage } );
		this.waitForTermboxToLoad();
	}

	waitForTermboxToLoad() {
		// The "all entered languages" section only exists in the client-side rendered markup,
		// and is omitted from the server-side markup. Once it exists Termbox should be fully interactive.
		this.allEnteredLanguagesButton.waitForExist();
	}

	switchToEditModeSkipWarning() {
		this.editButton.click();
		if ( this.anonEditWarning.isExisting() ) {
			this.anonEditWarningDismissButton.click();
		}
	}

	waitUntilSaved() {
		this.editButton.waitForExist( 3000 );
	}

}

module.exports = new TermboxPage();
