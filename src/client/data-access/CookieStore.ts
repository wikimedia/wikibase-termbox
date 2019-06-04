export interface CookieOptions {
	maxAge?: number;
}

export interface CookieStore<T> {
	set( name: string, value: T, options?: CookieOptions ): void;
	get( name: string, defaultValue?: T ): T;
}
