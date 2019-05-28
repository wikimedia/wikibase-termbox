'use strict';

const Page = require( 'wdio-mediawiki/Page' );

class SpecialPageVersion extends Page {
	get mobileFrontendLink() {
		return browser.element( '#mw-version-ext-other-MobileFrontend' );
	}

	get ulsLink() {
		return browser.element( '#mw-version-ext-other-UniversalLanguageSelector' );
	}

	open() {
		super.openTitle( 'Special:Version' );
		$( '#footer' ).waitForVisible( 3000 );
	}
}

module.exports = new SpecialPageVersion();
