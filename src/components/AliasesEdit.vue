<template>
	<div>
		<TermTextField
			v-for="( _alias, index ) in localAliases"
			:key="index"
			class="wb-ui-aliases-edit"
			v-inlanguage="language"
			v-model="localAliases[ index ]"
			@input="value => aliasInput( index, value )"
			@blur.native="removeEmptyAliases( index )"
		/>
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
import TermTextField from '@/components/TermTextField.vue';
@Component( {
	components: { TermTextField },
} )
export default class AliasesEdit extends mixins( Messages ) {
	@Prop( { required: true } )
	public aliases!: Term[]|null;

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( language: string ) => Language;

	public aliasInput( index: number, value: string ) {
		if ( this.isLastAlias( index ) && value !== '' ) {
			this.addNewAlias();
		}
	}

	public removeEmptyAliases( index: number ) {
		if ( this.localAliases[ index ].trim() === '' && !this.isLastAlias( index ) ) {
			this.localAliases.splice( index, 1 );
		}
	}

	private isLastAlias( index: number ) {
		return index === this.localAliases.length - 1;
	}

	public addNewAlias() {
		this.localAliases.push( '' );
	}

	// TODO Remove me once we wire up the actions to do the store binding
	// How will this play with the store?
	public localAliases = [ ...( this.aliases || [] ).map( ( alias ) => alias.value ), '' ];

	get language() {
		return this.getLanguageByCode( this.languageCode );
	}

}
</script>

<style lang="scss">
.wb-ui-aliases-edit {
	@include aliasesFont();
	@include termInput();
}
</style>
