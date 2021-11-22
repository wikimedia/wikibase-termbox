<template>
	<ResizingTextField
		class="wb-ui-label-edit"
		:class="{
			'wb-ui-label-edit--primary': isPrimary,
		}"
		:placeholder="message( MESSAGE_KEYS.PLACEHOLDER_EDIT_LABEL )"
		v-inlanguage="languageCode"
		v-model="value"
		:maxlength="config.textFieldCharacterLimit"
		autocapitalize="off"
	/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Messages from '@/components/mixins/Messages';
import { Term } from '@wmde/wikibase-datamodel-types';
import { ResizingTextField } from '@wmde/wikibase-vuejs-components';

export default Vue.extend( {
	name: 'LabelEdit',
	components: { ResizingTextField },
	mixins: [ Messages ],
	props: {
		label: { required: false, default: null, type: Object as PropType<Term> },
		languageCode: { required: true, type: String },
		isPrimary: { required: false, default: false, type: Boolean },
	},
	computed: {
		value: {
			get(): string {
				if ( !this.label ) {
					return '';
				} else {
					return this.label.value;
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
.wb-ui-label-edit {
	@include labelFont( #{&}--primary );
	@include termInput();
	@include termInputStandaloneField();
}
</style>
