import { lockState } from '../lockState';
import User from '@/store/user/User';

export default function ( user: any = null ): User {
	let state = {
		primaryLanguage: '',
		secondaryLanguages: [],
		name: null,
		preferences: {},
	};

	if ( user !== null ) {
		state = { ...state, ...user };
		lockState( state );
	}

	return state;
}
