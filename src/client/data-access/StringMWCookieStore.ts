import {
	CookieOptions,
	CookieStore,
} from '@/client/data-access/CookieStore';
import { MWCookie } from '@/client/mediawiki/MwWindow';

type ActualType = string;
type CookieStoreTypes = ActualType | null;

export default class StringMWCookieStore implements CookieStore<CookieStoreTypes> {
	private mwCookie: MWCookie;

	public constructor( mwCookie: MWCookie ) {
		this.mwCookie = mwCookie;
	}

	public set( name: string, value: CookieStoreTypes, options?: CookieOptions ): void {
		if ( value !== null ) {
			this.mwCookie.set( name, value, {
				expires: options && options.maxAge ? options.maxAge : undefined,
			} );
		} else {
			this.mwCookie.set( name, null );
		}
	}

	public get( name: string, defaultValue?: ActualType ): CookieStoreTypes {
		if ( defaultValue === undefined ) {
			return this.mwCookie.get( name );
		}

		return this.mwCookie.get( name, null, defaultValue );
	}

}
