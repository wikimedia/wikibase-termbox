import {
	NS_ENTITY,
	NS_LANGUAGE,
	NS_LINKS,
	NS_MESSAGES,
	NS_USER,
} from './namespaces';
import EntityState from '@/store/entity/EntityState';
import LanguageState from '@/store/language/LanguageState';
import LinksState from '@/store/links/LinksState';
import Messages from '@/store/messages/Messages';
import User from '@/store/user/User';

interface Root {
	editMode: boolean;
}

export default Root;

export interface InitializedRootState extends Root {
	[ NS_ENTITY ]: EntityState;
	[ NS_LANGUAGE ]: LanguageState;
	[ NS_LINKS ]: LinksState;
	[ NS_MESSAGES ]: Messages;
	[ NS_USER ]: User;
}
