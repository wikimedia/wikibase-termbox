import mockMessageMixin from '../../tests/unit/store/mockMessageMixin';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function stubMessagesMixin( component, messages ) {
	return {
		extends: component,
		mixins: [ mockMessageMixin( messages ) ],
	};
}
