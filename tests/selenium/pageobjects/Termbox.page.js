'use strict';
const Page = require( 'wdio-mediawiki/Page' );
const LoginPage = require( 'wdio-mediawiki/LoginPage' );
const MWUtil = require( 'wdio-mediawiki/Util' );

class TermboxPage extends Page {
	static get TERMBOX_PAGE() {
		return '.wb-ui-termbox';
	}

	static get PRIMARY_LANGUAGES_SELECTORS() {
		return {
			LANGUAGE_NAME: '.wb-ui-termbox__primary .wb-ui-monolingualfingerprintview__language',
			LABEL: '.wb-ui-label--primary',
			DESCRIPTION: '.wb-ui-termbox__primary .wb-ui-description',
			ALIASES: '.wb-ui-termbox__primary .wb-ui-aliases',
			ALIAS: '.wb-ui-termbox__primary .wb-ui-aliases wb-ui-aliases__alias',
		};
	}

	static get IN_MORE_LANGUAGES_SELECTORS() {
		return {
			LANGUAGE_NAME: '.wb-ui-in-more-languages .wb-ui-monolingualfingerprintview__language',
			LABEL: '.wb-ui-in-more-languages .wb-ui-label',
			DESCRIPTION: '.wb-ui-in-more-languages .wb-ui-description',
			ALIASES: '.wb-ui-in-more-languages .wb-ui-aliases',
			ALIAS: '.wb-ui-in-more-languages .wb-ui-aliases wb-ui-aliases__alias',
		};
	}

	static get ALL_ENTERED_LANGUAGES_SELECTORS() {
		return {
			LANGUAGE_NAME: '.wb-ui-all-entered-languages .wb-ui-monolingualfingerprintview__language',
			LABEL: '.wb-ui-all-entered-languages .wb-ui-label',
			DESCRIPTION: '.wb-ui-all-entered-languages .wb-ui-description',
			ALIASES: '.wb-ui-all-entered-languages .wb-ui-aliases',
			ALIAS: '.wb-ui-all-entered-languages .wb-ui-aliases wb-ui-aliases__alias',
		};
	}

	static get EXPANDABLE_SECTION_BUTTONS() {
		return {
			IN_MORE_LANGUAGES: '.wb-ui-in-more-languages-expandable__switch',
			IN_ALL_ENTERED_LANGUAGES: '.wb-ui-all-entered-languages-expandable__switch',
		};
	}

	static get EDIT_TOOLS_SELECTORS() {
		return {
			ENTER_EDIT_MODE: '.wb-ui-event-emitting-button--edit',
			CANCEL_EDIT_MODE: '.wb-ui-event-emitting-button--cancel',
		};
	}

	static get USER_LOGOUT() {
		return '[href*="title=Special:UserLogout"]';
	}

	static get EXPANDABLE_SECTIONS() {
		return {
			IN_MORE_LANGUAGES: '.wb-ui-in-more-languages',
			ALL_ENTERED_LANGUAGES: '.wb-ui-all-entered-languages',
		};
	}

	static get EDIT_FIELDS_SECLECTORS() {
		return {
			LABEL: '.wb-ui-label-edit',
			DESCRIPTION: '.wb-ui-description-edit',
			ALIASES: '.wb-ui-aliases-edit',
		};
	}

	static get OVERLAYS() {
		return {
			IP_WARNING: '.wb-ui-modal__content .wb-ui-anon-edit-warning',
		};
	}

	static get IP_WARNING() {
		return {
			DISMISS: TermboxPage.OVERLAYS.IP_WARNING + ' .wb-ui-event-emitting-button--normal',
			CHECKBOX: TermboxPage.OVERLAYS.IP_WARNING + ' input + label',
		};
	}

	static get ENDOFPAGE() {
		return '#footer-places-privacy';
	}

	constructor() {
		super();
		this.isLoggedIn = false;
	}

	/**
	 * @param primaryLanguage Used to determine the language in which the language names will be read
	 */
	readLanguageData( primaryLanguage ) {
		super.openTitle( '', { uselang: primaryLanguage } );

		browser.waitUntil( () => {
			return browser.execute( () => {
				return ( typeof window.mw.loader === 'object' && typeof window.mw.loader.using === 'function' );
			} ).value === true;
		} );

		this.readAvailableLanguages();
		this.readUserLanguages();
		this.deriveOtherLanguages();
	}

	/**
	 * @private
	 */
	readAvailableLanguages() {
		this.availableLanguages = browser.executeAsync( ( done ) => {
			window.mw.loader.using( [ 'wikibase.WikibaseContentLanguages' ], () => {
				done( new window.wb.WikibaseContentLanguages().getAllPairs() );
			} );
		} ).value;
	}

	readUserLanguages() {
		this.preferredLanguages = browser.executeAsync( ( done ) => {
			window.mw.loader.using( [ 'ext.uls.mediawiki', 'wikibase.getUserLanguages' ], () => {
				done( window.wb.getUserLanguages() );
			} );
		} ).value;
	}

	getCurrentPreferredLanguages( limit = -1 ) {
		if ( limit < 0 ) {
			return [ ...this.preferredLanguages ];
		} else {
			return this.preferredLanguages.slice( 0, limit );
		}
	}

	deriveOtherLanguages() {
		const nonPreferredLanguages = Object.keys( this.availableLanguages );
		let index;
		this.preferredLanguages.forEach( ( key ) => {
			index = nonPreferredLanguages.indexOf( key );
			if ( index !== -1 ) {
				nonPreferredLanguages.splice( index, 1 );
			}
		} );
		this.nonPreferredLanguages = nonPreferredLanguages;
	}

	getCurrentNonPreferredLanguages( limit = -1 ) {
		if ( limit < 0 ) {
			return this.nonPreferredLanguages;
		} else {
			return this.nonPreferredLanguages.slice( 0, limit );
		}
	}

	makeTerm( language ) {
		return {
			language,
			value: MWUtil.getTestString(),
		};
	}

	makeEntityFingerprint( languageCodes ) {
		const monolingualFingerprint = {
			labels: {},
			descriptions: {},
			aliases: {},
		};

		let aliases;
		languageCodes.forEach( ( language ) => {
			monolingualFingerprint.labels[ language ] = this.makeTerm( language );
			monolingualFingerprint.descriptions[ language ] = this.makeTerm( language );
			aliases = [];
			aliases.push( this.makeTerm( language ) );
			aliases.push( this.makeTerm( language ) );
			aliases.push( this.makeTerm( language ) );
			monolingualFingerprint.aliases[ language ] = aliases;
		} );

		return monolingualFingerprint;
	}

	/**
	 * @var preferredLimit | int | it should be greater than 1
	 */
	createTestItem( mustContain = [], preferredLimit = 2, nonPreferredLimit = 2 ) {
		const languages = [ ...( new Set( [
			...( this.getCurrentPreferredLanguages( preferredLimit ) ),
			...( this.getCurrentNonPreferredLanguages( nonPreferredLimit ) ),
			...mustContain,
		] ) ) ];

		return [ this.makeEntityFingerprint( languages ), languages ];
	}

	openItemPage( entityId, primaryLanguage = 'en' ) {
		super.openTitle( `Item:${ entityId }`, { useformat: 'mobile', uselang: primaryLanguage } );
		browser.waitForVisible( TermboxPage.ENDOFPAGE );
	}

	wikiLogin() {
		if ( this.isLoggedIn ) {
			return;
		}

		LoginPage.open();
		$( TermboxPage.ENDOFPAGE ).waitForVisible( 3000 );

		if ( !$( '.warning' ).isVisible() ) {
			LoginPage.loginAdmin();
		}

		this.isLoggedIn = true;
	}

	loginAndOpen( entityId, primaryLanguage ) {
		this.wikiLogin();
		this.openItemPage( entityId, primaryLanguage );
	}

	wikiLogout() {
		if ( !this.isLoggedIn ) {
			return;
		}

		LoginPage.open();
		$( TermboxPage.ENDOFPAGE ).waitForVisible( 3000 );
		if ( $( '.warning' ).isVisible() ) {
			browser.url( $( TermboxPage.USER_LOGOUT ).getAttribute( 'href' ) );
		}

		this.isLoggedIn = false;
	}

	logoutAndOpen( entityId, primaryLanguage ) {
		this.wikiLogout();
		this.openItemPage( entityId, primaryLanguage );
	}

	get isTermboxPage() {
		return $( TermboxPage.TERMBOX_PAGE ).isExisting();
	}

	get primaryLanguageName() {
		return $( TermboxPage.PRIMARY_LANGUAGES_SELECTORS.LANGUAGE_NAME ).getText();
	}

	get primaryLabel() {
		return $( TermboxPage.PRIMARY_LANGUAGES_SELECTORS.LABEL ).getText();
	}

	get primaryDescription() {
		return $( TermboxPage.PRIMARY_LANGUAGES_SELECTORS.DESCRIPTION ).getText();
	}

	get primaryAliases() {
		return $( TermboxPage.PRIMARY_LANGUAGES_SELECTORS.ALIASES ).getText();
	}

	get inMoreLanguages() {
		return $( TermboxPage.EXPANDABLE_SECTIONS.IN_MORE_LANGUAGES );
	}

	get inMoreLanguagesButton() {
		return $( TermboxPage.EXPANDABLE_SECTION_BUTTONS.IN_MORE_LANGUAGES );
	}

	get hasInMoreLanguagesButton() {
		return this.inMoreLanguagesButton.isExisting() && this.inMoreLanguagesButton.isVisible();
	}

	get inMoreLanguagesIsExpanded() {
		return this.inMoreLanguages.isExisting() && this.inMoreLanguages.isVisible();
	}

	inMoreLanguagesLanguageName( index ) {
		return $$( TermboxPage.IN_MORE_LANGUAGES_SELECTORS.LANGUAGE_NAME )[ index ].getText();
	}

	inMoreLanguagesLabel( index ) {
		return $$( TermboxPage.IN_MORE_LANGUAGES_SELECTORS.LABEL )[ index ].getText();
	}

	inMoreLanguagesDescription( index ) {
		return $$( TermboxPage.IN_MORE_LANGUAGES_SELECTORS.DESCRIPTION )[ index ].getText();
	}

	inMoreLanguagesAliases( index ) {
		return $$( TermboxPage.IN_MORE_LANGUAGES_SELECTORS.ALIASES )[ index ].getText();
	}

	get allEnteredLanguages() {
		return $( TermboxPage.EXPANDABLE_SECTIONS.ALL_ENTERED_LANGUAGES );
	}

	get allEnteredLanguagesButton() {
		return $( TermboxPage.EXPANDABLE_SECTION_BUTTONS.IN_ALL_ENTERED_LANGUAGES );
	}

	get hasAllEnteredLanguagesButton() {
		return this.allEnteredLanguagesButton.isExisting() && this.allEnteredLanguagesButton.isVisible();
	}

	get allEnteredLanguagesIsExpanded() {
		return this.allEnteredLanguages.isExisting() && this.allEnteredLanguages.isVisible();
	}

	allEnteredLanguagesLanguageName( index ) {
		return $$( TermboxPage.ALL_ENTERED_LANGUAGES_SELECTORS.LANGUAGE_NAME )[ index ].getText();
	}

	allEnteredLanguagesLabel( index ) {
		return $$( TermboxPage.ALL_ENTERED_LANGUAGES_SELECTORS.LABEL )[ index ].getText();
	}

	allEnteredLanguagesDescription( index ) {
		return $$( TermboxPage.ALL_ENTERED_LANGUAGES_SELECTORS.DESCRIPTION )[ index ].getText();
	}

	allEnteredLanguagesAliases( index ) {
		return $$( TermboxPage.ALL_ENTERED_LANGUAGES_SELECTORS.ALIASES )[ index ].getText();
	}

	get editButton() {
		return $( TermboxPage.EDIT_TOOLS_SELECTORS.ENTER_EDIT_MODE );
	}

	get hasEditButton() {
		return this.editButton.isExisting() && this.editButton.isVisible();
	}

	get cancelButton() {
		return $( TermboxPage.EDIT_TOOLS_SELECTORS.CANCEL_EDIT_MODE );
	}

	get hasCancelButton() {
		return this.cancelButton.isExisting() && this.cancelButton.isVisible();
	}

	get isInEditmode() {
		return $( TermboxPage.EDIT_FIELDS_SECLECTORS.LABEL ).isExisting();
	}

	get isInReadmode() {
		return !this.isInEditmode;
	}

	get ipWarning() {
		return $( TermboxPage.OVERLAYS.IP_WARNING );
	}

	ipWarningEventuallyAppears() {
		return this.ipWarning.waitForExist( 3000 );
	}

	ipWarningDoesNotAppear() {
		return this.ipWarning.waitForExist( 1000, true );
	}

	get hasIPWarning() {
		return this.ipWarning.isExisting() && this.ipWarning.isVisible();
	}

	get withoutSignInButton() {
		return $( TermboxPage.IP_WARNING.DISMISS );
	}

	get ipWarningCheckbox() {
		return $( TermboxPage.IP_WARNING.CHECKBOX );
	}

	get hasIpWarningCheckbox() {
		return this.ipWarningCheckbox.isVisible();
	}

	clickInMoreLanguagesButton() {
		this.inMoreLanguagesButton.click();
	}

	clickAllEnteredLanguagesButton() {
		this.allEnteredLanguagesButton.click();
	}

	clickEditButton() {
		this.editButton.click();
	}

	clickCancelButton() {
		this.cancelButton.click();
	}

	clickWithoutSignIn() {
		this.withoutSignInButton.click();
	}

	clickIpWarningCheckbox() {
		this.ipWarningCheckbox.click();
	}

	switchToEditmode() {
		this.clickEditButton();
	}
}

module.exports = new TermboxPage();
