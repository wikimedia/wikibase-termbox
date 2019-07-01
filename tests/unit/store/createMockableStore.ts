/* eslint-disable no-underscore-dangle */
import { createStore } from '@/store';
import { ActionTree, GetterTree, MutationTree, StoreOptions } from 'vuex';

type HotUpdatableStoreProperties = {
	getters?: GetterTree<any, any>;
	mutations?: MutationTree<any>;
	actions?: ActionTree<any, any>;

	modules?: Record<string, HotUpdatableStoreProperties>;
}

function getModuleOverrides(
	defaults: StoreOptions<any>,
	overrides: HotUpdatableStoreProperties = {},
) {
	return {
		namespaced: true,
		state: defaults.state,
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
export default function createMockableStore( overrides: HotUpdatableStoreProperties ) {
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
