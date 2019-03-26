<template>
	<div>
		<textarea
			class="wb-ui-label-edit"
			v-inlanguage="language"
			:value="value"
		></textarea>
	</div>
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
export default class LabelEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public label!: Term|null;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( language: string ) => Language;

	get value() {
		if ( !this.label ) {
			return '';
		} else {
			return this.label.value;
		}
	}

	get language() {
		return this.getLanguageByCode( this.languageCode );
	}
}
</script>
