import {
	CookieOptions,
	CookieStore,
} from '@/client/data-access/CookieStore';
import StringMWCookieStore from '@/client/data-access/StringMWCookieStore';

export const truthyCookieValue = '1';

export default class BooleanCookieStore implements CookieStore<boolean> {
	private readonly cookieStore: StringMWCookieStore;

	public constructor( cookieStore: StringMWCookieStore ) {
		this.cookieStore = cookieStore;
	}

	public set( name: string, value: boolean, options?: CookieOptions ): void {
		this.cookieStore.set( name, value ? truthyCookieValue : null, options );
	}

	public get( name: string ): boolean {
		return this.cookieStore.get( name ) !== null;
	}

}
