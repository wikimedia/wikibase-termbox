import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';
import { MWCookie, MWCookieOptions } from '@/client/mediawiki/MwWindow';

export default class MWCookieUserPreferenceRepository implements UserPreferenceRepository {
	private mwCookie: MWCookie;
	private cookieName: string;
	private options: MWCookieOptions;

	public constructor( mwCookie: MWCookie, cookieName: string, options: MWCookieOptions = {} ) {
		this.mwCookie = mwCookie;
		this.cookieName = cookieName;
		this.options = options;
	}

	setPreference( _name: UserPreference, value: string ): Promise<void> {
		this.mwCookie.set( this.cookieName, value, this.options );
		return Promise.resolve();
	}

	getPreference( _name: UserPreference ): Promise<string> {
		return Promise.resolve( this.mwCookie.get( this.cookieName ) );
	}

}
