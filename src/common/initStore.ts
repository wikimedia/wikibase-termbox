import { Store } from 'vuex';
import { NS_ENTITY, NS_LANGUAGE, NS_LINKS, NS_USER } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import {
	LANGUAGE_PREFERENCE,
	USER_NAME_SET,
	USER_PREFERENCES_INIT,
} from '@/store/user/actionTypes';
import TermboxRequest from '@/common/TermboxRequest';
import { LANGUAGE_INIT } from '@/store/language/actionTypes';
import { LINKS_INIT } from '@/store/links/actionTypes';
import { action } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import Root from '@/store/Root';

export default function initStore(
	store: Store<Root>,
	request: TermboxRequest,
): Promise<unknown[]> {
	return Promise.all( [
		store.dispatch( action( NS_LANGUAGE, LANGUAGE_INIT ) ),
		store.dispatch(
			action( NS_ENTITY, ENTITY_INIT ),
			{ entity: request.entityId, revision: request.revision },
		),
		store.dispatch(
			action( NS_USER, LANGUAGE_PREFERENCE ),
			{ primaryLanguage: request.language, preferredLanguages: request.preferredLanguages },
		),
		store.dispatch( action( NS_LINKS, LINKS_INIT ), request.links ),
		store.dispatch( action( NS_USER, USER_NAME_SET ), request.userName ),
		store.dispatch( action( NS_USER, USER_PREFERENCES_INIT ) ),
	] );
}
