<template>
	<ul
		class="wb-ui-aliases-edit"
		:class="{ 'wb-ui-aliases-edit--focus-within' : hasFocus }"
	>
		<li v-for="( value, index ) in aliasValues" :key="keys[ index ]" class="wb-ui-aliases-edit__item">
			<ResizingTextField
				class="wb-ui-aliases-edit__alias"
				v-inlanguage="languageCode"
				:value="value"
				@input="value => aliasInput( index, value )"
				@focus="setFocus()"
				@blur="removeAliasIfEmpty( index ); unsetFocus()"
				:placeholder="message( MESSAGE_KEYS.PLACEHOLDER_EDIT_ALIAS )"
				:max-length="config.textFieldCharacterLimit"
				autocapitalize="off"
			/>
		</li>
	</ul>
</template>

<script lang="ts">
import {
	defineComponent,
	PropType,
} from 'vue';
import { NS_ENTITY } from '@/store/namespaces';
import Messages from '@/components/mixins/Messages';
import { mapActions } from 'vuex';
import { Term } from '@wmde/wikibase-datamodel-types';
import ResizingTextField from '@/components/ResizingTextField.vue';
import { ENTITY_ALIAS_REMOVE, ENTITY_ALIASES_EDIT } from '@/store/entity/actionTypes';

interface AliasesEdit {
	editAliases: ( payload: { language: string; aliasValues: string[] } ) => void;
	removeAlias: ( payload: { languageCode: string; index: number } ) => void;
}

export default defineComponent( {
	name: 'AliasesEdit',
	components: { ResizingTextField },
	mixins: [ Messages ],
	props: {
		aliases: { required: false, default: null, type: Array as PropType<Term[]> },
		languageCode: { required: true, type: String },
	},
	data() {
		const keys = []; // keys of aliasValues (computed property not yet available)
		let key;
		for ( key = 0; this.aliases && key < this.aliases.length; key++ ) {
			keys.push( key );
		}
		keys.push( key ); // the final ''

		return {
			hasFocus: false,
			keys,
		};
	},
	computed: {
		aliasValues(): string[] {
			// data() has keys corresponding to this value
			return [ ...( this.aliases || [] ).map( ( alias: Term ) => alias.value ), '' ];
		},
	},
	methods: {
		...mapActions( NS_ENTITY, {
			editAliases: ENTITY_ALIASES_EDIT,
			removeAlias: ENTITY_ALIAS_REMOVE,
		} ),
		setFocus(): void {
			this.hasFocus = true;
		},
		unsetFocus(): void {
			this.hasFocus = false;
		},
		addAdditionalKey(): void {
			this.keys.push( this.keys[ this.keys.length - 1 ] + 1 );
		},
		aliasInput( index: number, value: string ): void {
			if ( this.isBottomBlankField( index ) ) {
				this.addNewAlias( value );
			} else {
				this.editAlias( index, value );
			}
		},
		addNewAlias( value: string ): void {
			if ( value.trim() === '' ) {
				return;
			}

			this.addAdditionalKey();

			( this as AliasesEdit ).editAliases( {
				language: this.languageCode,
				aliasValues: this.getValuesWithEdit( this.aliasValues.length - 1, value ),
			} );
		},
		editAlias( index: number, value: string ): void {
			const aliasValues = this.getValuesWithEdit( index, value );
			aliasValues.splice( aliasValues.length - 1, 1 );

			( this as AliasesEdit ).editAliases( {
				language: this.languageCode,
				aliasValues,
			} );
		},
		getValuesWithEdit( index: number, value: string ): string[] {
			const aliasValues = [ ...this.aliasValues ];
			aliasValues[ index ] = value;

			return aliasValues;
		},
		removeAliasIfEmpty( index: number ): void {
			if (
				this.aliasValues[ index ].trim() === '' &&
				!this.isBottomBlankField( index )
			) {
				( this as AliasesEdit ).removeAlias( { languageCode: this.languageCode, index } );
				this.keys.splice( index, 1 );
			}
		},
		isBottomBlankField( index: number ): boolean {
			return index === this.aliasValues.length - 1;
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-aliases-edit {
	@include termInputStandaloneField();
	background-color: $color-white;
	overflow-y: visible;
	padding: 1px 3px;

	&__item {
		margin-top: 8px;

		&:first-child {
			margin-top: 0;
		}
	}

	&__alias {
		@include aliasesFont();
		@include termInput();
		@include termInputGrouped();

		&:focus {
			color: $alias-edit-focus-color;
		}
	}
}
</style>
