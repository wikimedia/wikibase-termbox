<template>
	<ResizingTextField
		class="wb-ui-label-edit"
		:class="{
			'wb-ui-label-edit--primary': isPrimary,
		}"
		:placeholder="message( MESSAGE_KEYS.PLACEHOLDER_EDIT_LABEL )"
		v-inlanguage="languageCode"
		:value="value"
		@input="value = $event"
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

interface LabelEdit extends ComponentPublicInstance {
	label: Term | null;
	languageCode: string;
}

export default defineComponent( {
	name: 'LabelEdit',
	components: { ResizingTextField },
	mixins: [ Messages ],
	props: {
		label: { required: false, default: null, type: Object as PropType<Term> },
		languageCode: { required: true, type: String },
		isPrimary: { required: false, default: false, type: Boolean },
	},
	emits: [ 'input' ],
	computed: {
		value: {
			get( this: LabelEdit ): string {
				if ( !this.label ) {
					return '';
				} else {
					return this.label.value;
				}
			},
			set( this: LabelEdit, value: string ): void {
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
