<template>
	<textarea
		class="wb-ui-description-edit"
		v-inlanguage="language"
		:value="value"
	></textarea>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { NS_LANGUAGE } from '@/store/namespaces';
import Messages from '@/components/mixins/Messages';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Language from '@/datamodel/Language';
import Term from '@/datamodel/Term';

@Component
export default class DescriptionEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public description!: Term|null;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( language: string ) => Language;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	get language() {
		return this.getLanguageByCode( this.languageCode );
	}

	get value() {
		if ( !this.description ) {
			return '';
		} else {
			return this.description.value;
		}
	}
}
</script>
