import Vue from 'vue';
import Vuex from 'vuex';
import Messages from '@/components/mixins/Messages';
import {
	NS_MESSAGES,
	NS_USER,
} from '@/store/namespaces';

Vue.use( Vuex );

function mockStore( primaryLanguage: string, messageGetter: any ) {
	const state = {
		primaryLanguage,
	};
	const getters = {
		getMessageInLanguage: () => messageGetter,
	};

	return new Vuex.Store( {
		modules: {
			[ NS_USER ]: { state, namespaced: true },
			[ NS_MESSAGES ]: { getters, namespaced: true },
		},
	} );
}

describe( 'Messages', () => {

	it( 'returns the message for a given message key', () => {
		const language = 'en';
		const messageKey = 'wikibase-edit';
		const message = 'edit';

		const getter = jest.fn();
		getter.mockReturnValue( message );

		const messages = new Messages();
		messages.$store = mockStore( language, getter );

		expect( messages.message( messageKey ) ).toBe( message );
		expect( getter ).toBeCalledWith( language, messageKey );
	} );

	it( 'returns the message key if no message is set in the store', () => {
		const language = 'en';
		const messageKey = 'this-message-does-not-exist';
		const message = null;

		const getter = jest.fn();
		getter.mockReturnValue( message );

		const messages = new Messages();
		messages.$store = mockStore( language, getter );

		expect( messages.message( messageKey ) ).toBe( messageKey );
		expect( getter ).toBeCalledWith( language, messageKey );
	} );
} );
