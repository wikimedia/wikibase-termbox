<template>
	<ResizingTextField
		class="wb-ui-description-edit"
		v-inlanguage="languageCode"
		:value="value"
		@input="value = $event"
		:placeholder="message( MESSAGE_KEYS.PLACEHOLDER_EDIT_DESCRIPTION )"
		:max-length="config.textFieldCharacterLimit"
		autocapitalize="off"
	/>
</template>

<script lang="ts">
import {
	PropType,
	ComponentPublicInstance,
	defineComponent,
} from 'vue';
import Messages from '@/components/mixins/Messages';
import { Term } from '@wmde/wikibase-datamodel-types';
import ResizingTextField from '@/components/ResizingTextField.vue';

interface DescriptionEdit extends ComponentPublicInstance {
	description?: Term;
	languageCode: string;
}

export default defineComponent( {
	name: 'DescriptionEdit',
	components: { ResizingTextField },
	mixins: [ Messages ],
	props: {
		description: { required: false, default: null, type: Object as PropType<Term> },
		languageCode: { required: true, type: String },
	},
	emits: [ 'input' ],
	computed: {
		value: {
			get( this: DescriptionEdit ): string {
				if ( !this.description ) {
					return '';
				} else {
					return this.description.value;
				}
			},
			set( this: DescriptionEdit, value: string ): void {
				this.$emit( 'input', { language: this.languageCode, value } );
			},
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-description-edit {
	@include descriptionFont();
	@include termInput();
	@include termInputStandaloneField();
}
</style>
