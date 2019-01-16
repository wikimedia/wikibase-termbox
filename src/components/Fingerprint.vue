<template>
	<div
		class="wikibase-termbox-fingerprint"
		:class="{ 'wikibase-termbox-fingerprint--primaryLanguage': isPrimary }"
		:lang="language.code"
		:dir="language.directionality">
		<LanguageNameInUserLanguage class="wikibase-termbox-fingerprint__language" :language="language"/>
		<h2 class="wikibase-termbox-fingerprint__label">{{ label }}</h2>
		<div class="wikibase-termbox-fingerprint__description-wrapper">
			<p class="wikibase-termbox-fingerprint__description">{{ description }}</p>
		</div>
		<div class="wikibase-termbox-fingerprint__aliases-wrapper">
			<ul v-if="hasAliases" class="wikibase-termbox-fingerprint__aliases">
				<li v-for="alias in aliases"
					class="wikibase-termbox-fingerprint__alias"
					:data-separator="message( MESSAGE_KEYS.ALIAS_SEPARATOR )">{{ alias.value }}</li>
			</ul>
			<p class="wikibase-termbox-fingerprint__aliases wikibase-termbox-fingerprint__aliases--placeholder" v-else>?</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import Messages, { MessagesMixin } from './mixins/Messages';
import { mapGetters } from 'vuex';
import {
	NS_ENTITY,
	NS_LANGUAGE,
} from '@/store/namespaces';
import Term from '@/datamodel/Term';
import Language from '@/datamodel/Language';
import LanguageNameInUserLanguage from '@/components/LanguageNameInUserLanguage.vue';
interface EntityBindings {
	entityLabel: ( languageCode: string ) => Term;
	entityDescription: ( languageCode: string ) => Term;
	entityAliases: ( languageCode: string ) => Term[];
}
interface FingerprintBindings extends Vue, EntityBindings, MessagesMixin {
	languageCode: string;
	isPrimary: boolean;
	getLanguageByCode( languageCode: string ): Language;
}
@Component( {
	components: { LanguageNameInUserLanguage },
	props: {
		languageCode: {
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
		...mapGetters( NS_ENTITY, {
			entityLabel: 'getLabelByLanguage',
			entityDescription: 'getDescriptionByLanguage',
			entityAliases: 'getAliasesByLanguage',
		} ),
		...mapGetters( NS_LANGUAGE, {
			getLanguageByCode: 'getByCode',
		} ),
	},
} )
export default class Fingerprint extends ( mixins( Messages ) as VueConstructor<FingerprintBindings> ) {

	get label(): string {
		const label: Term = this.entityLabel( this.language.code );
		if ( label === null ) {
			return '???';
		} else {
			return label.value;
		}
	}
	get description(): string {
		const description: Term = this.entityDescription( this.language.code );
		if ( description === null ) {
			return '??';
		} else {
			return description.value;
		}
	}
	get hasAliases(): boolean {
		return this.aliases.length > 0;
	}
	get aliases(): Term[] {
		const aliases: Term[] =  this.entityAliases( this.language.code );
		if ( aliases === null ) {
			return [];
		} else {
			return aliases;
		}
	}

	get language(): Language {
		return this.getLanguageByCode( this.languageCode );
	}
}
</script>

<style lang="scss">
.wikibase-termbox-fingerprint {
	.wikibase-termbox & { // this serves as strong selector to overcome reset.css
		margin-top: 32px;
		min-width: 0; // https://css-tricks.com/flexbox-truncated-text/

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
		&__description-wrapper,
		&__aliases-wrapper {
			min-width: 260px;
			max-width: 420px;
			overflow-wrap: break-word;
			word-wrap: break-word;
			hyphens: auto;
		}
		&__label {
			color: $color-black;
			line-height: 1.3em;
			font-family: $font-family-serif;
			font-weight: bold;
		}
		&__description-wrapper {
			margin-top: 0.5rem;
			color: $color-black;
			line-height: 1.3em;
			font-family: $font-family-sansserif;
		}
		&__aliases-wrapper {
			margin-top: 0.5rem;
			color: $color-light-azureish-gray;
			line-height: 1.3em;
			font-family: $font-family-sansserif;
		}

		&__description,
		&__aliases {
			margin-left: 0.5em;
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
			.wikibase-termbox-fingerprint__description-wrapper,
			.wikibase-termbox-fingerprint__aliases-wrapper {
				flex: 1;
			}
			.wikibase-termbox-fingerprint__description-wrapper,
			.wikibase-termbox-fingerprint__aliases-wrapper {
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
