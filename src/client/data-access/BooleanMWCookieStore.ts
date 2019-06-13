import {
	CookieOptions,
	CookieStore,
} from '@/client/data-access/CookieStore';
import { MWCookie } from '@/client/mediawiki/MwWindow';

export const truthyCookieValue = '1';

export default class BooleanMWCookieStore implements CookieStore<boolean> {
	private mwCookie: MWCookie;

	public constructor( mwCookie: MWCookie ) {
		this.mwCookie = mwCookie;
	}

	public set( name: string, value: boolean, options?: CookieOptions ): void {
		if ( value ) {
			this.mwCookie.set( name, truthyCookieValue, {
				expires: options && options.maxAge ? options.maxAge : undefined,
			} );
		} else {
			this.mwCookie.set( name, null );
		}
	}

	public get( name: string ): boolean {
		return this.mwCookie.get( name ) !== null;
	}

}
