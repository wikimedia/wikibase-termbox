<template>
	<div>
		<TermTextField
			v-for="( value, index ) in aliasValues"
			:key="keys[ index ]"
			class="wb-ui-aliases-edit"
			v-inlanguage="language"
			:value="value"
			@input="value => aliasInput( index, value )"
			@blur.native="removeAliasIfEmpty( index )"
		/>
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
import TermTextField from '@/components/TermTextField.vue';
import { ENTITY_ALIAS_REMOVE, ENTITY_ALIASES_EDIT } from '@/store/entity/actionTypes';
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

	@namespace( NS_ENTITY ).Action( ENTITY_ALIASES_EDIT )
	public editAliases!: ( payload: { language: string, aliasValues: string[] } ) => void;

	@namespace( NS_ENTITY ).Action( ENTITY_ALIAS_REMOVE )
	public removeAlias!: ( payload: { languageCode: string, index: number } ) => void;

	get aliasValues() {
		return [ ...( this.aliases || [] ).map( ( alias ) => alias.value ), '' ];
	}

	private keys = [ ... this.aliasValues.keys() ];

	private addAdditionalKey() {
		this.keys.push( this.keys[ this.keys.length - 1 ] + 1 );
	}

	public aliasInput( index: number, value: string ) {
		if ( this.isBottomBlankField( index ) ) {
			this.addNewAlias( value );
		} else {
			this.editAlias( index, value );
		}
	}

	private addNewAlias( value: string ) {
		if ( value.trim() === '' ) {
			return;
		}

		this.addAdditionalKey();

		this.editAliases( {
			language: this.languageCode,
			aliasValues: this.getValuesWithEdit( this.aliasValues.length - 1, value ),
		} );
	}

	private editAlias( index: number, value: string ) {
		const aliasValues = this.getValuesWithEdit( index, value );
		aliasValues.splice( aliasValues.length - 1, 1 );

		this.editAliases( {
			language: this.languageCode,
			aliasValues,
		} );
	}

	private getValuesWithEdit( index: number, value: string ) {
		const aliasValues = [ ...this.aliasValues ];
		aliasValues[ index ] = value;

		return aliasValues;
	}

	public removeAliasIfEmpty( index: number ) {
		if (
			this.aliasValues[ index ].trim() === '' &&
			!this.isBottomBlankField( index )
		) {
			this.removeAlias( { languageCode: this.languageCode, index } );
			this.keys.splice( index, 1 );
		}
	}

	private isBottomBlankField( index: number ) {
		return index === this.aliasValues.length - 1;
	}

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
