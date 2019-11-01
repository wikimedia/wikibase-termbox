import CachingMethodDecorator from '@/server/data-access/CachingMethodDecorator';

class FakeCache {

	private contents: { [ key: string ]: any } = {};

	public has( key: string ) {
		return this.contents[ key ] !== undefined;
	}

	public set( key: string, value: any ) {
		this.contents[ key ] = value;
	}

	public get( key: string ) {
		return this.contents[ key ];
	}

}

function generateCacheKey( ...args: unknown[] ) {
	return JSON.stringify( args );
}

function newTestService( methodSpy: Function ) {
	return {
		methodToBeDecorated( ...args: unknown[] ) {
			return methodSpy.apply( this, args );
		},
	};
}

describe( 'CachingMessagesRepository', () => {

	it( 'returns the cached value on a hit', () => {
		const arg1 = 'foo';
		const arg2 = 'bar';
		const cache = new FakeCache();
		const cachedValue = { some: 'object' };
		cache.set( generateCacheKey( arg1, arg2 ), cachedValue );

		const decoratedMethod = jest.fn();
		const service = newTestService( decoratedMethod );
		const decorator = new CachingMethodDecorator<object>(
			cache as any,
			service,
			service.methodToBeDecorated,
		);

		return ( decorator as any ).methodToBeDecorated( arg1, arg2 ).then( ( value: any ) => {
			expect( value ).toBe( cachedValue );
			expect( decoratedMethod ).not.toHaveBeenCalled();
		} );
	} );

	it( 'delegates to its decoratee on a miss and sets the cache value', () => {
		const arg1 = 'foo';
		const arg2 = 'bar';
		const cache = new FakeCache();
		const fetchedValue = { some: 'object' };

		const decoratedMethod = jest.fn();
		decoratedMethod.mockResolvedValue( fetchedValue );
		const service = newTestService( decoratedMethod );

		const decorator = new CachingMethodDecorator<object>(
			cache as any,
			service,
			service.methodToBeDecorated,
		);

		return ( decorator as any ).methodToBeDecorated( arg1, arg2 ).then( ( value: any ) => {
			expect( value ).toBe( fetchedValue );
			expect( decoratedMethod ).toHaveBeenCalledWith( arg1, arg2 );
			expect( cache.get( generateCacheKey( arg1, arg2 ) ) ).toBe( fetchedValue );
		} );
	} );

} );
