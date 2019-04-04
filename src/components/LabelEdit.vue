<template>
	<div>
		<textarea
			class="wb-ui-label-edit"
			v-inlanguage="language"
			v-model="value"
		></textarea>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { NS_ENTITY, NS_LANGUAGE } from '@/store/namespaces';
import Messages from '@/components/mixins/Messages';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Language from '@/datamodel/Language';
import Term from '@/datamodel/Term';
import { ENTITY_LABEL_EDIT } from '@/store/entity/actionTypes';

@Component
export default class LabelEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public label!: Term|null;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	@Prop( { required: false, default: false, type: Boolean } )
	public isPrimary!: boolean;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( language: string ) => Language;

	@namespace( NS_ENTITY ).Action( ENTITY_LABEL_EDIT )
	public editLabel!: ( value: Term ) => void;

	get value() {
		if ( !this.label ) {
			return '';
		} else {
			return this.label.value;
		}
	}

	set value( value ) {
		this.editLabel( { language: this.languageCode, value } );
	}

	get language() {
		return this.getLanguageByCode( this.languageCode );
	}
}
</script>
