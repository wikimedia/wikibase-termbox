/* eslint-disable @typescript-eslint/no-explicit-any */

import LRUCache from 'lru-cache';

/**
 * Objects of this class can dynamically decorate a method and cache its return value.
 */
export default class CachingMethodDecorator<V> {

	private cache: LRUCache<string, V>;
	private fetch: ( ...args: any[] ) => Promise<V>;

	/**
	 * @param cache
	 * @param instance - instance to bind the method to
	 * @param method - method to be decorated
	 */
	public constructor(
		cache: LRUCache<string, V>,
		instance: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
		method: ( ...args: any[] ) => Promise<V>,
	) {
		this.cache = cache;
		this.fetch = method.bind( instance );

		( this as any )[ method.name ] = this.getFromCacheOrFetch;
	}

	private getFromCacheOrFetch( ...args: any[] ): Promise<V | undefined> {
		const cacheKey = this.generateKey( args );
		if ( this.cache.has( cacheKey ) ) {
			return Promise.resolve( this.cache.get( cacheKey ) );
		}

		return this.fetch.apply( null, args ).then( ( value ) => {
			this.cache.set( cacheKey, value );
			return value;
		} );
	}

	private generateKey( args: unknown[] ): string {
		return JSON.stringify( args );
	}

}
