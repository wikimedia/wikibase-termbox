import Vue from 'vue';
import '@/client/directives';
import newConfigMixin from '@/components/mixins/newConfigMixin';

beforeEach( () => {
	expect.hasAssertions();
} );

// Break on unhandled promise rejection (default warning might be overlooked)
// https://github.com/facebook/jest/issues/3251#issuecomment-299183885
// However...
// https://stackoverflow.com/questions/51957531/jest-how-to-throw-an-error-inside-a-unhandledrejection-handler
if ( typeof process.env.LISTENING_TO_UNHANDLED_REJECTION === 'undefined' ) {
	process.on( 'unhandledRejection', ( unhandledRejectionWarning ) => {
		throw unhandledRejectionWarning; // see stack trace for test at fault
	} );
	// Avoid memory leak by adding too many listeners
	process.env.LISTENING_TO_UNHANDLED_REJECTION = 'yes';
}

Vue.mixin( newConfigMixin( {
	textFieldCharacterLimit: 0,
	licenseAgreementInnerHtml: '',
	copyrightVersion: '',
} ) );

jest.spyOn( global.console, 'error' ).mockImplementation( ( ...args: any[] ) => {
	expect( args ).toBeUndefined(); // i.e. this should not have been called
} );
