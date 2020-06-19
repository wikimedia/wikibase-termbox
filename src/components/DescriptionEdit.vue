<template>
	<ResizingTextField
		class="wb-ui-description-edit"
		v-inlanguage="languageCode"
		v-model="value"
		:placeholder="message( MESSAGE_KEYS.PLACEHOLDER_EDIT_DESCRIPTION )"
		:maxlength="config.textFieldCharacterLimit"
		autocapitalize="off"
	/>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from '@/components/mixins/Messages';
import { Prop } from 'vue-property-decorator';
import Term from '@/datamodel/Term';
import { ResizingTextField } from '@wmde/wikibase-vuejs-components';

@Component( {
	components: { ResizingTextField },
} )
export default class DescriptionEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public description!: Term|null;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	public get value(): string {
		if ( !this.description ) {
			return '';
		} else {
			return this.description.value;
		}
	}

	public set value( value ) {
		this.$emit( 'input', { language: this.languageCode, value } );
	}
}
</script>

<style lang="scss">
.wb-ui-description-edit {
	@include descriptionFont();
	@include termInput();
	@include termInputStandaloneField();
}
</style>
