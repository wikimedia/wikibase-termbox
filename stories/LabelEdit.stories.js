import { app, storiesOf } from '@storybook/vue3';
import { boolean } from '@storybook/addon-knobs';
import LabelEdit from '@/components/LabelEdit.vue';
import { MessageKey } from '@/common/MessageKey';
import stubMessagesMixin from '../.storybook/helpers/stubMessagesMixin';
import newConfigMixin from '@/components/mixins/newConfigMixin';

storiesOf( 'LabelEdit', module )
	.addParameters( { component: LabelEdit } )
	.add( 'default', () => {

		app.mixin( newConfigMixin( {
			textFieldCharacterLimit: 100,
		} ) );

		const messages = {
			[ MessageKey.PLACEHOLDER_EDIT_LABEL ]: 'Placeholder text',
		};

		return {
			data: () => ( { label: { language: 'en', value: '' } } ),
			components: { LabelEdit: stubMessagesMixin( LabelEdit, messages ) },
			props: {
				isPrimary: {
					default: boolean( 'Is primary', false ),
				},
			},
			template: '<LabelEdit @input="onEdit" :label="label" :is-primary="isPrimary" language-code="de" />',
			methods: {
				onEdit( term ) {
					this.label = term;
				},
			},
		};
	} );
