/* This file is directly require()d in vue.config.js, so it must be plain JS, no modules. */
const {
	createCompoundExpression,
	createObjectProperty,
	createSimpleExpression,
} = require( '@vue/compiler-core' );

/* Developers beware: this file has no unit tests! It is only covered by the edge-to-edge tests. */

/**
 * This DirectiveTransform (configured in vue.config.js) is used at build time
 * to transform a v-inlanguage directive into lang/dir props.
 * Since it runs at build time, it doesn’t have access to the v-inlanguage value, nor to the store;
 * instead, the value of each prop is *generated code* which becomes part of the render function,
 * and which *evaluates to* the correct values later at SSR time.
 * The call to the store getter is duplicated,
 * since there seems to be no way to extract it into a variable –
 * fortunately, it’s a very cheap getter.
 * The ?. in the code may be transpiled by a later build stage if necessary.
 */
module.exports = function inlanguage( dir, node, context, augmentor ) {
	let ret = {
		props: [
			createObjectProperty( 'lang',
				createCompoundExpression( [
					createSimpleExpression(
						// hard-coded getter( NS_LANGUAGE, 'getByCode' )
						'_ctx.$store.getters["language/getByCode"](',
						false,
					),
					dir.exp,
					createSimpleExpression(
						')?.code',
						false,
					),
				] ) ),
			createObjectProperty( 'dir',
				createCompoundExpression( [
					createSimpleExpression(
						'_ctx.$store.getters["language/getByCode"](',
						false,
					),
					dir.exp,
					createSimpleExpression(
						')?.directionality',
						false,
					),
				] ) ),
		],
	};

	if ( augmentor ) {
		ret = augmentor( ret );
	}

	return ret;
};
