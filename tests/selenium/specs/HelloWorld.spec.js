'use strict';

const assert = require( 'assert' );
const SpecialPageVersion = require( '../pageobjects/SpecialPageVersion.page' );

describe( 'Special:Version', function () {
	before( () => {
		SpecialPageVersion.open();
	} );

	it( 'has MobileFrontend enabled', function () {
		assert( SpecialPageVersion.mobileFrontendLink.isVisible(), true );
	} );

	it( 'has UniversalLanguageSelector enabled', function () {
		assert( SpecialPageVersion.ulsLink.isVisible(), true );
	} );
} );
