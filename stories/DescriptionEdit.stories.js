import { app, storiesOf } from '@storybook/vue3';
import DescriptionEdit from '@/components/DescriptionEdit.vue';
import { MessageKey } from '@/common/MessageKey';
import stubMessagesMixin from '../.storybook/helpers/stubMessagesMixin';
import newConfigMixin from '@/components/mixins/newConfigMixin';

storiesOf( 'DescriptionEdit', module )
	.addParameters( { component: DescriptionEdit } )
	.add( 'default', () => {
		app.mixin( newConfigMixin( {
			textFieldCharacterLimit: 100,
		} ) );

		const messages = {
			[ MessageKey.PLACEHOLDER_EDIT_DESCRIPTION ]: 'Placeholder text',
		};

		return {
			data: () => ( { description: { language: 'en', value: 'orange root vegetable' } } ),
			components: { DescriptionEdit: stubMessagesMixin( DescriptionEdit, messages ) },
			template: '<DescriptionEdit :description="description" language-code="en" @input="onEdit"  />',
			methods: {
				onEdit( description ) {
					this.description = description;
				},
			},
		};
	} );
