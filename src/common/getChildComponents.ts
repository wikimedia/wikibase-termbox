import Vue from 'vue';

/**
 * Get a uniquely identifying name for a component
 * Using .name is tempting but it may get optimized away in production builds.
 *
 * @param component A vue class component
 */
function getComponentIdentifier( component: any ) {
	return component.cid;
}

function getComponentsRecursively( root: any ) {
	let components = { [ getComponentIdentifier( root ) ]: root };
	const directChildren = root.options.components || {};

	for ( const componentIndex in directChildren ) {
		if ( directChildren[componentIndex].options ) {
			const componentIdentifier = getComponentIdentifier( directChildren[componentIndex] );
			if ( !( componentIdentifier in components ) ) {
				components = {
					[ componentIdentifier ]: directChildren[ componentIndex ],
					...components,
					...getComponentsRecursively( directChildren[ componentIndex ] ),
				};
			}
		}
	}

	return components;
}

export default ( root: Vue ) => {
	const rootClass = root.constructor;

	return Object.values( getComponentsRecursively( rootClass ) );
};
