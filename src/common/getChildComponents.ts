import Vue from 'vue';

function getComponentsRecursively( root: any ) {
	let components = { [root.name]: root };
	const directChildren = root.options.components || {};

	for ( const componentName in directChildren ) {
		if ( directChildren[componentName].options && !( componentName in components ) ) {
			components = {
				[componentName]: directChildren[componentName],
				...components,
				...getComponentsRecursively( directChildren[componentName] ),
			};
		}
	}

	return components;
}

export default ( root: Vue ) => {
	const rootClass = root.constructor;

	return Object.values( getComponentsRecursively( rootClass ) );
};
