import hotUpdateDeep from './hotUpdateDeep';
import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { action } from '@/store/util';

Vue.use( Vuex );

describe( 'hotUpdateDeep', () => {

	it( 'returns a Vuex.Store', () => {
		const realStore = new Store<any>( {} );
		expect( hotUpdateDeep( realStore, {} ) ).toBeInstanceOf( Store );
	} );

	it( 'can add a getter to the root store', () => {
		const myGetterName = 'fictional';
		const myGetterReturnValue = 'bar';
		const myGetter = jest.fn().mockReturnValue( myGetterReturnValue );
		const realStore = new Store<any>( {} );
		const store = hotUpdateDeep( realStore, {
			getters: {
				[ myGetterName ]: myGetter,
			},
		} );

		expect( store.getters[ myGetterName ] ).toBe( myGetterReturnValue );
	} );

	it( 'can add an action to a store module', () => {
		const realModuleName = 'messages'; // this must exist in the real store
		const realActionName = 'read';
		const realActionValue = 'value';

		const myActionName = 'fictional';
		const myActionResolveValue = 'yes';
		const myAction = jest.fn().mockResolvedValue( myActionResolveValue );
		const realStore = new Store<any>( {
			modules: {
				[ realModuleName ]: {
					namespaced: true,
					actions: {
						[ realActionName ]: () => Promise.resolve( realActionValue ),
					},
				},
			},
		} );
		const store = hotUpdateDeep( realStore, {
			modules: {
				[ realModuleName ]: {
					actions: {
						[ myActionName ]: myAction,
					},
				},
			},
		} );

		expect( store.dispatch( action( realModuleName, realActionName ) ) ).resolves.toEqual( realActionValue );
		expect( store.dispatch( action( realModuleName, myActionName ) ) ).resolves.toEqual( myActionResolveValue );
	} );

	it( 'throws when trying to override a store module not existing in reality', () => {
		expect( () => {
			const realStore = new Store<any>( {} );
			hotUpdateDeep( realStore, {
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
