import EditTools from '@/components/EditTools.vue';
import Sectionedit from '@/components/Sectionedit.vue';
import {
	mount,
	shallowMount,
} from '@vue/test-utils';

describe( 'EditTools', () => {

	it( 'Wraps content in Sectionedit to ensure mediawiki can control visibility on a per-user level', () => {
		const wrapper = mount( EditTools, {
			props: {
				editMode: true,
			},
		} );

		const sectionEdit = wrapper.findComponent( Sectionedit );
		expect( sectionEdit.exists() ).toBeTruthy();
		expect( sectionEdit.vm.$parent ).toBe( wrapper.vm );
	} );

	it( 'Shows read slot if in reading mode', () => {
		const read = 'read';
		const wrapper = shallowMount( EditTools, {
			props: {
				editMode: false,
			},
			slots: {
				read,
				edit: 'not to be shown',
			},
			global: { renderStubDefaultSlot: true },
		} );

		expect( wrapper.text() ).toBe( read );
	} );

	it( 'Shows edit slot if in edit mode', () => {
		const edit = 'edit';
		const wrapper = shallowMount( EditTools, {
			props: {
				editMode: true,
			},
			slots: {
				read: 'not to be shown',
				edit,
			},
			global: { renderStubDefaultSlot: true },
		} );

		expect( wrapper.text() ).toBe( edit );
	} );

} );
