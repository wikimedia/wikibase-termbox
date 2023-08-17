const Page = require( 'wdio-mediawiki/Page' );

module.exports = class TermboxLanguages {

	constructor( preferredLanguages, contentLanguages ) {
		this.preferredLanguages = preferredLanguages;
		this.contentLanguages = contentLanguages;
	}

	static async initWithUseLang( language ) {
		await ( new Page() ).openTitle(
			// We're intentionally opening an Item page that does not (need to) exist. This page is only opened to call
			// `wikibase.getUserLanguages` which accesses a JS config variable that only exists on pages that run
			// Wikibase's OutputPageBeforeHTML hook handler.
			'Item:Q123',
			{ uselang: language }
		);

		await browser.waitUntil( async () => {
			return await browser.execute( () => {
				return ( typeof window.mw.loader === 'object' && typeof window.mw.loader.using === 'function' );
			} ) === true;
		} );

		return new this(
			await browser.executeAsync( ( done ) => {
				window.mw.loader.using( [ 'ext.uls.mediawiki', 'wikibase.getUserLanguages' ], () => {
					done( window.wb.getUserLanguages() );
				} );
			} ),
			await browser.executeAsync( ( done ) => {
				window.mw.loader.using( [ 'wikibase.WikibaseContentLanguages' ], () => {
					done( window.wb.WikibaseContentLanguages.getTermLanguages().getLanguageNameMap() );
				} );
			} )
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
