import Vue from 'vue';
import inlanguage from '@/client/directives/inlanguage';
import { Wrapper } from '@vue/test-utils';

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

Vue.directive( 'inlanguage', inlanguage );

expect.extend( {
	toHaveSlotWithContent( container: Wrapper<Vue>, slot: string, component: Wrapper<Vue>, at: number = 0 ) {
		return {
			pass: container.vm.$slots![ slot ]![ at * 2 ] === component.vm.$vnode,
			message: () => 'Failed asserting that the \'component\' resides in \'slot\' of \'container\'.',
		};
	},
} );

jest.spyOn( global.console, 'error' ).mockImplementation( ( ...args: any[] ) => {
	expect( args ).toBeUndefined(); // i.e. this should not have been called
} );
