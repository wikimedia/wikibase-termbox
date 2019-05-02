/* eslint-disable no-underscore-dangle */
import { createStore } from '@/store';
import { StoreOptions } from 'vuex';

function getModuleOverrides(
	defaults: StoreOptions<any>,
	overrides: StoreOptions<any> = {},
) {
	return {
		namespaced: true,
		state: Object.assign( {}, defaults.state, overrides.state ),
		getters: Object.assign( {}, defaults.getters, overrides.getters ),
		mutations: Object.assign( {}, defaults.mutations, overrides.mutations ),
		actions: Object.assign( {}, defaults.actions, overrides.actions ),
	};
}

function assertOverride( defaultValue: any, override: any, message: string ) {
	const defaultKeys = Object.keys( defaultValue );

	if (
		override &&
		Object.keys( override ).every( ( m ) => { return defaultKeys.indexOf( m ) !== -1; } ) === false
	) {
		throw new Error( message + ' Valid options: ' + defaultKeys.join( ', ' ) );
	}
}

/**
 * creates a real store instance with individually overridable module properties
 */
export default function createMockableStore( overrides: StoreOptions<any> ) {
	const store = createStore();
	const storeModules = ( store as any )._modules.root._children;

	assertOverride(
		storeModules,
		overrides.modules,
		'You are trying to override parts of a module that does not exist.',
	);

	const storeOptions: StoreOptions<any> = {
		...getModuleOverrides( ( store as any )._modules.root._rawModule, overrides ),
		modules: {},
	};

	Object.entries( storeModules ).forEach( ( [ moduleName, module ] ) => {
		storeOptions.modules![ moduleName ] = getModuleOverrides(
			( module as any )._rawModule,
			overrides.modules ? overrides.modules[ moduleName ] : undefined,
		);
	} );

	store.hotUpdate( storeOptions );

	return store;
}
