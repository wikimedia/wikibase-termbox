import createMockableStore from './createMockableStore';
import Vuex from 'vuex';
import { action } from '@/store/util';

describe( 'tests/createMockableStore', () => {

	it( 'returns a Vuex.Store', () => {
		expect( createMockableStore( {} ) ).toBeInstanceOf( Vuex.Store );
	} );

	it( 'can add a getter to the root store', () => {
		const myGetterName = 'fictional';
		const myGetterReturnValue = 'bar';
		const myGetter = jest.fn().mockReturnValue( myGetterReturnValue );
		const store = createMockableStore( {
			getters: {
				[ myGetterName ]: myGetter,
			},
		} );

		expect( store.getters[ myGetterName ] ).toBe( myGetterReturnValue );
	} );

	it( 'can add an action to a store module', () => {
		const realModuleName = 'messages'; // this must exist in the real store

		const myActionName = 'fictional';
		const myActionResolveValue = 'yes';
		const myAction = jest.fn().mockResolvedValue( myActionResolveValue );
		const store = createMockableStore( {
			modules: {
				[ realModuleName ]: {
					actions: {
						[ myActionName ]: myAction,
					},
				},
			},
		} );

		expect( store.dispatch( action( realModuleName, myActionName ) ) ).resolves.toEqual( myActionResolveValue );
	} );

	it( 'throws when trying to override a store module not existing in reality', () => {
		expect( () => {
			createMockableStore( {
				modules: {
					sausage: {
						getters: {
							ketchup: jest.fn(),
						},
					},
				},
			} );
		} ).toThrow( /You are trying to override parts of a module that does not exist/ );
	} );
} );
