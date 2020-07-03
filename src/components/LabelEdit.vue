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
import Component, { mixins } from 'vue-class-component';
import Messages from '@/components/mixins/Messages';
import { Prop } from 'vue-property-decorator';
import { Term } from '@wmde/wikibase-datamodel-types';
import { ResizingTextField } from '@wmde/wikibase-vuejs-components';

@Component( {
	components: { ResizingTextField },
} )
export default class LabelEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public label!: Term|null;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	@Prop( { required: false, default: false, type: Boolean } )
	public isPrimary!: boolean;

	public get value(): string {
		if ( !this.label ) {
			return '';
		} else {
			return this.label.value;
		}
	}

	public set value( value ) {
		this.$emit( 'input', { language: this.languageCode, value } );
	}

}
</script>

<style lang="scss">
.wb-ui-label-edit {
	@include labelFont( #{&}--primary );
	@include termInput();
	@include termInputStandaloneField();
}
</style>
