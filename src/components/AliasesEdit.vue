<template>
	<textarea
		class="wb-ui-aliases-edit"
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
export default class AliasesEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public aliases!: Term[]|null;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( language: string ) => Language;

	get language() {
		return this.getLanguageByCode( this.languageCode );
	}

	get value() {
		if ( !this.aliases ) {
			return '';
		} else {

			const aliases: string[] = [];

			this.aliases.forEach( ( term: Term ) => {
				aliases.push( term.value );
			} );
			return aliases.join( '\n' );
		}
	}

}
</script>

<style lang="scss">
.wb-ui-aliases-edit {
	@include aliasesFont();
	@include termInput();
}
</style>
