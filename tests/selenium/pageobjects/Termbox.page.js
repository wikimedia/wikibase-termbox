'use strict';
const Page = require( 'wdio-mediawiki/Page' );

class TermboxPage extends Page {
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

	getMonolingualFingerprintsInSection( section ) {
		return section.$$( '.wb-ui-monolingualfingerprintview' ).map( ( monolingualFingerprint ) => {
			return {
				language: monolingualFingerprint.$( '.wb-ui-monolingualfingerprintview__language' ),
				label: monolingualFingerprint.$( '.wb-ui-label' ),
				description: monolingualFingerprint.$( '.wb-ui-description' ),
				aliases: monolingualFingerprint.$$( '.wb-ui-aliases__alias' ),
			};
		} );
	}

	getEditableMonolingualFingerprintsInSection( section ) {
		return section.$$( '.wb-ui-monolingualfingerprintview' ).map( ( monolingualFingerprint ) => {
			return {
				label: monolingualFingerprint.$( '.wb-ui-label-edit' ),
				description: monolingualFingerprint.$( '.wb-ui-description-edit' ),
				getNthAlias: ( n ) => monolingualFingerprint.$$( '.wb-ui-aliases-edit__alias' )[ n ],
			};
		} );
	}

	get primaryMonolingualFingerprint() {
		return $( '.wb-ui-termbox__primary' );
	}

	get allEnteredLanguages() {
		return $( '.wb-ui-all-entered-languages' );
	}

	get allEnteredLanguagesButton() {
		return $( '.wb-ui-all-entered-languages-expandable__switch' );
	}

	get inMoreLanguages() {
		return $( '.wb-ui-in-more-languages' );
	}

	get inMoreLanguagesButton() {
		return $( '.wb-ui-in-more-languages-expandable__switch' );
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

	get errorBanner() {
		return $( '.wb-ui-message-banner .wb-ui-icon-message-box--error' );
	}

	openItemPage( entityId, primaryLanguage = 'en' ) {
		super.openTitle( `Item:${entityId}`, { useformat: 'mobile', uselang: primaryLanguage } );
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
		this.editButton.waitForExist( { timeout: 20000 } );
	}

}

module.exports = new TermboxPage();
