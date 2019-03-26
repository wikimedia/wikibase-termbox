import Publish from '@/components/Publish.vue';
import { mount } from '@vue/test-utils';
import { createStore } from '@/store';
import { NS_USER } from '@/store/namespaces';
import { NS_MESSAGES } from '@/store/namespaces';
import { MessageKeys } from '@/common/MessageKeys';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@/store/util';

describe( 'Publish', () => {

	it( 'creates a link', () => {
		const wrapper = mount( Publish, {
			store: createStore(),
		} );

		expect( wrapper.find( 'a' ).exists() ).toBeTruthy();
	} );

	it( 'emits a publish event on link click', () => {
		const wrapper = mount( Publish, {
			store: createStore(),
		} );

		wrapper.find( 'a' ).trigger( 'click' );

		expect( wrapper.emitted( 'publish' ) ).toBeTruthy();
	} );

	it( 'renders localized message explaining link', () => {
		const userLanguage = 'de';
		const publishMessage = 'veröffentlichen';

		const store = createStore();
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ userLanguage ]: {
				[ MessageKeys.PUBLISH ]: publishMessage,
			},
		} );

		const wrapper = mount( Publish, {
			store,
		} );

		const link = wrapper.find( 'a' );
		expect( link.text() ).toBe( publishMessage );
		expect( link.attributes().title ).toBe( publishMessage );
	} );

} );
