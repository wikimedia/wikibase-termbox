import mockMessageMixin from '../../tests/unit/store/mockMessageMixin';

export default function stubMessagesMixin( component, messages ) {
	return {
		extends: component,
		mixins: [ mockMessageMixin( messages ) ],
	};
}
