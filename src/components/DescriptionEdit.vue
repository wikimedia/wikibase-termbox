<template>
	<TermTextField
		class="wb-ui-description-edit"
		v-inlanguage="languageCode"
		v-model="value"
		:placeholder="message( MESSAGE_KEYS.PLACEHOLDER_EDIT_DESCRIPTION )"
		:maxlength="config.textFieldCharacterLimit"
	/>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { NS_ENTITY } from '@/store/namespaces';
import Messages from '@/components/mixins/Messages';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Term from '@/datamodel/Term';
import { ENTITY_DESCRIPTION_EDIT } from '@/store/entity/actionTypes';
import TermTextField from '@/components/TermTextField.vue';

@Component( {
	components: { TermTextField },
} )
export default class DescriptionEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public description!: Term|null;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	@namespace( NS_ENTITY ).Action( ENTITY_DESCRIPTION_EDIT )
	public editDescription!: ( value: Term ) => void;

	get value() {
		if ( !this.description ) {
			return '';
		} else {
			return this.description.value;
		}
	}

	set value( value ) {
		this.editDescription( { language: this.languageCode, value } );
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
