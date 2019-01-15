<template>
	<div
		class="wikibase-termbox-fingerprint"
		:class="{ 'wikibase-termbox-fingerprint--primaryLanguage': isPrimary }">
		<span class="wikibase-termbox-fingerprint__language">{{ languageName }}</span>
		<h2 class="wikibase-termbox-fingerprint__label">{{ label }}</h2>
		<p class="wikibase-termbox-fingerprint__description">{{ description }}</p>
		<ul v-if="hasAliases" class="wikibase-termbox-fingerprint__aliases">
			<li v-for="alias in aliases"
				class="wikibase-termbox-fingerprint__alias"
				:data-separator="message( MESSAGE_KEYS.ALIAS_SEPARATOR )">{{ alias.value }}</li>
		</ul>
		<p class="wikibase-termbox-fingerprint__aliases wikibase-termbox-fingerprint__aliases--placeholder" v-else>?</p>
	</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import Messages, { MessagesMixin } from './mixins/Messages';
import {
	mapState,
	mapGetters,
} from 'vuex';
import {
	NS_ENTITY,
	NS_LANGUAGE,
	NS_USER,
} from '@/store/namespaces';
import Term from '@/datamodel/Term';
interface EntityBindings {
	entityLabel: ( languageCode: string ) => Term;
	entityDescription: ( languageCode: string ) => Term;
	entityAliases: ( languageCode: string ) => Term[];
}
interface FingerprintBindings extends Vue, EntityBindings, MessagesMixin {
	language: string;
	isPrimary: boolean;
	getLanguageTranslation( language: string, inLanguage: string ): string;
}
@Component( {
	props: {
		language: {
			type: String,
			required: true,
		},
		isPrimary: {
			type: Boolean,
			default: false,
			required: false,
		},
	},
	computed: {
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
		...mapGetters( NS_ENTITY, {
			entityLabel: 'getLabelByLanguage',
			entityDescription: 'getDescriptionByLanguage',
			entityAliases: 'getAliasesByLanguage',
		} ),
		...mapGetters( NS_LANGUAGE, {
			getLanguageTranslation: 'getTranslationByCode',
		} ),
	},
} )
export default class Fingerprint extends ( mixins( Messages ) as VueConstructor<FingerprintBindings> ) {
	get label(): string {
		const label: Term = this.entityLabel( this.language );
		if ( label === null ) {
			return '???';
		} else {
			return label.value;
		}
	}
	get description(): string {
		const description: Term = this.entityDescription( this.language );
		if ( description === null ) {
			return '??';
		} else {
			return description.value;
		}
	}
	get hasAliases(): boolean {
		return !( this.entityAliases( this.language ) == null );
	}
	get aliases(): Term[] {
		const aliases: Term[] =  this.entityAliases( this.language );
		if ( aliases === null ) {
			return [];
		} else {
			return aliases;
		}
	}
	get languageName(): string {
		const name = this.getLanguageTranslation( this.language, this.primaryLanguage );
		if ( name === null ) {
			return '????';
		} else {
			return name;
		}
	}
}
</script>

<style lang="scss">
.wikibase-termbox-fingerprint {

	.wikibase-termbox & { // this serves as strong selector to overcome reset.css
		margin-top: 32px;

		&:first-child {
			margin-top: 0;
		}
	}

	.wikibase-termbox-fingerprint { // for use as a prefix
		&__language {
			color: $color-dark-azureish-gray;
			@include fontSize( 13px );
			font-family: $font-family-sansserif;
		}

		&__label,
		&__description,
		&__aliases {
			min-width: 260px;
			max-width: 420px;
		}

		&__label {
			color: $color-black;
			line-height: 1.3em;
			font-family: $font-family-serif;
			font-weight: bold;
		}

		&__description {
			margin-top: 0.5rem;
			margin-left: 0.5em;
			color: $color-black;
			line-height: 1.3em;
			font-family: $font-family-sansserif;
		}

		&__aliases {
			margin-top: 0.5rem;
			margin-left: 0.5em;
			color: $color-light-azureish-gray;
			line-height: 1.3em;
			font-family: $font-family-sansserif;
		}

		&__alias {
			display: inline;
		}

		&__alias:not( :last-child )::after {
			content: attr( data-separator );
			white-space: nowrap;
			padding: 0 0.4em;
		}
	}

	&--primaryLanguage {
		.wikibase-termbox-fingerprint__label {
			@include fontSize( 23px );
		}
	}
	&:not(&--primaryLanguage) {

		@include media-breakpoint-up(md) {
			display: flex;
			flex-wrap: wrap;

			.wikibase-termbox-fingerprint__language {
				flex-basis: 100%;
				margin-bottom: 8px;
			}

			.wikibase-termbox-fingerprint__label,
			.wikibase-termbox-fingerprint__description,
			.wikibase-termbox-fingerprint__aliases {
				flex: 1;
			}
			.wikibase-termbox-fingerprint__description,
			.wikibase-termbox-fingerprint__aliases {
				margin-left: 16px;
				margin-top: 0;
			}
		}

		@include media-breakpoint-up(lg) {
			.wikibase-termbox-fingerprint__language {
				flex-basis: 128px;
				margin-right: 16px;
				margin-bottom: 0;
			}
		}
	}
}
</style>
