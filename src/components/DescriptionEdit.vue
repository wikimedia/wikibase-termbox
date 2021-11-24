<template>
	<ResizingTextField
		class="wb-ui-description-edit"
		v-inlanguage="languageCode"
		v-model="value"
		:placeholder="message( MESSAGE_KEYS.PLACEHOLDER_EDIT_DESCRIPTION )"
		:max-length="config.textFieldCharacterLimit"
		autocapitalize="off"
	/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Messages from '@/components/mixins/Messages';
import { Term } from '@wmde/wikibase-datamodel-types';
import ResizingTextField from '@/components/ResizingTextField.vue';

export default Vue.extend( {
	name: 'DescriptionEdit',
	components: { ResizingTextField },
	mixins: [ Messages ],
	props: {
		description: { required: false, default: null, type: Object as PropType<Term> },
		languageCode: { required: true, type: String },
	},
	computed: {
		value: {
			get(): string {
				if ( !this.description ) {
					return '';
				} else {
					return this.description.value;
				}
			},
			set( value: string ) {
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
