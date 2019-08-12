const Page = require( 'wdio-mediawiki/Page' );

module.exports = class TermboxLanguages {

	constructor( preferredLanguages, contentLanguages ) {
		this.preferredLanguages = preferredLanguages;
		this.contentLanguages = contentLanguages;
	}

	static initWithUseLang( language ) {
		( new Page() ).openTitle( '', { uselang: language } );

		browser.waitUntil( () => {
			return browser.execute( () => {
				return ( typeof window.mw.loader === 'object' && typeof window.mw.loader.using === 'function' );
			} ).value === true;
		} );

		return new this(
			browser.executeAsync( ( done ) => {
				window.mw.loader.using( [ 'ext.uls.mediawiki', 'wikibase.getUserLanguages' ], () => {
					done( window.wb.getUserLanguages() );
				} );
			} ).value,
			browser.executeAsync( ( done ) => {
				window.mw.loader.using( [ 'wikibase.WikibaseContentLanguages' ], () => {
					done( new window.wb.WikibaseContentLanguages().getAllPairs() );
				} );
			} ).value
		);
	}

	getPreferredLanguages() {
		return this.preferredLanguages;
	}

	getNonPreferredLanguages() {
		return Object.keys( this.contentLanguages ).filter( ( lang ) => {
			return this.getPreferredLanguages().indexOf( lang ) === -1;
		} );
	}

	getContentLanguages() {
		return this.contentLanguages;
	}

};
