import Cancel from '@/components/Cancel.vue';
import { mount } from '@vue/test-utils';
import { createStore } from '@/store';
import { NS_USER } from '@/store/namespaces';
import { NS_MESSAGES } from '@/store/namespaces';
import { MessageKeys } from '@/common/MessageKeys';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@/store/util';

describe( 'Cancel', () => {

	it( 'creates a link', () => {
		const wrapper = mount( Cancel, {
			store: createStore(),
		} );

		expect( wrapper.find( 'a' ).exists() ).toBeTruthy();
	} );

	it( 'emits a cancel event on link click', () => {
		const wrapper = mount( Cancel, {
			store: createStore(),
		} );

		wrapper.find( 'a' ).trigger( 'click' );

		expect( wrapper.emitted( 'cancel' ) ).toBeTruthy();
	} );

	it( 'renders localized message explaining link', () => {
		const userLanguage = 'de';
		const cancelMessage = 'abbrechen';

		const store = createStore();
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ userLanguage ]: {
				[ MessageKeys.CANCEL ]: cancelMessage,
			},
		} );

		const wrapper = mount( Cancel, {
			store,
		} );

		const link = wrapper.find( 'a' );
		expect( link.text() ).toBe( cancelMessage );
		expect( link.attributes().title ).toBe( cancelMessage );
	} );

} );
