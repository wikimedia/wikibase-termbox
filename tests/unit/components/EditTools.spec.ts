import EditTools from '@/components/EditTools.vue';
import Sectionedit from '@/components/Sectionedit.vue';
import { mount } from '@vue/test-utils';

describe( 'EditTools', () => {

	it( 'Wraps content in Sectionedit to ensure mediawiki can control visibility on a per-user level', () => {
		const wrapper = mount( EditTools, {
			propsData: {
				editMode: true,
			},
		} );

		const sectionEdit = wrapper.find( Sectionedit );
		expect( sectionEdit.exists() ).toBeTruthy();
		expect( sectionEdit.vm.$parent ).toBe( wrapper.vm );
	} );

	it( 'Shows edit slot if in reading mode', () => {
		const edit = 'edit';
		const wrapper = mount( EditTools, {
			propsData: {
				editMode: false,
			},
			slots: {
				edit,
				publish: 'not to be shown',
			},
		} );

		expect( wrapper.text() ).toBe( edit );
	} );

	it( 'Shows publish slot if in edit mode', () => {
		const publish = 'publish';
		const wrapper = mount( EditTools, {
			propsData: {
				editMode: true,
			},
			slots: {
				edit: 'not to be shown',
				publish,
			},
		} );

		expect( wrapper.text() ).toBe( publish );
	} );

} );
