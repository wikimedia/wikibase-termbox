import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';
import {
	CookieOptions,
	CookieStore,
} from '@/client/data-access/CookieStore';

export default class CookieUserPreferenceRepository<T> implements UserPreferenceRepository {
	private cookieStore: CookieStore<T>;
	private cookieName: string;
	private options: CookieOptions;
	private defaultValue?: T;

	public constructor(
		cookieStore: CookieStore<T>,
		cookieName: string,
		options: CookieOptions = {},
		defaultValue?: T,
	) {
		this.cookieStore = cookieStore;
		this.cookieName = cookieName;
		this.options = options;
		this.defaultValue = defaultValue;
	}

	setPreference( _name: UserPreference, value: T ): Promise<void> {
		this.cookieStore.set( this.cookieName, value, this.options );
		return Promise.resolve();
	}

	getPreference( _name: UserPreference ): Promise<T> {
		return Promise.resolve( this.cookieStore.get( this.cookieName, this.defaultValue ) );
	}

}
