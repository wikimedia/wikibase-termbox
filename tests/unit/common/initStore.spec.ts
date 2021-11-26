import initStore from '@/common/initStore';
import TermboxRequest from '@/common/TermboxRequest';
import { NS_ENTITY, NS_LANGUAGE, NS_USER, NS_LINKS } from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/language/actionTypes';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { LANGUAGE_PREFERENCE, USER_NAME_SET, USER_PREFERENCES_INIT } from '@/store/user/actionTypes';
import { LINKS_INIT } from '@/store/links/actionTypes';
import { action } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';

describe( 'initStore', () => {

	it( 'loads required data', () => {
		const entity = 'Q123';
		const revision = 31510;
		const primaryLanguage = 'en';
		const preferredLanguages = [ 'de', 'en', 'pl', 'it', 'zh' ];
		const links = {
			editLinkUrl: '/edit/Q123',
			loginLinkUrl: '/login',
			signUpLinkUrl: '/signUp',
		};
		const user = 'Lord Voldemort';

		const store = {
			dispatch: jest.fn(),
		};
		const request = new TermboxRequest( primaryLanguage, entity, revision, links, preferredLanguages, user );

		return initStore( store as any, request ).then( () => {
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_LANGUAGE, LANGUAGE_INIT ) );
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_ENTITY, ENTITY_INIT ),
				{ entity, revision },
			);
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_USER, LANGUAGE_PREFERENCE ),
				{ primaryLanguage, preferredLanguages },
			);
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_LINKS, LINKS_INIT ), links );
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_USER, USER_NAME_SET ), user );
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_USER, USER_PREFERENCES_INIT ) );
		} );
	} );

} );
