import EditPen from '@/components/EditPen.vue';
import { mount } from '@vue/test-utils';
import { createStore } from '@/store';
import { NS_USER } from '@/store/namespaces';
import { NS_MESSAGES } from '@/store/namespaces';
import { MessageKeys } from '@/common/MessageKeys';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';

describe( 'EditPen', () => {

	it( 'creates a link from its href prop', () => {
		const url = '/edit/Q123';
		const wrapper = mount( EditPen, {
			store: createStore(),
			propsData: {
				href: url,
			},
		} );

		expect( wrapper.find( 'a' ).attributes().href ).toBe( url );
	} );

	it( 'renders localized message explaining link', () => {
		const userLanguage = 'de';
		const editMessage = 'bearbeiten';

		const store = createStore();
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, userLanguage );
		store.commit( `${NS_MESSAGES}/${MESSAGES_INIT}`, {
			[ userLanguage ]: {
				[ MessageKeys.EDIT ]: editMessage,
			},
		} );

		const wrapper = mount( EditPen, {
			store,
			propsData: {
				href: '/edit/Q123',
			},
		} );

		const link = wrapper.find( 'a' );
		expect( link.text() ).toBe( editMessage );
		expect( link.attributes().title ).toBe( editMessage );
	} );

} );
