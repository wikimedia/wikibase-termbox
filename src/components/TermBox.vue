<template>
	<!-- TODO dynamize wikibase-termbox--primaryLanguage for T205261 -->
	<div class="wikibase-termbox wikibase-termbox--primaryLanguage">
		<div>
			<div class="wikibase-termbox__term">
				<span class="wikibase-termbox__language">{{primaryLanguageName}}</span>
				<h2 class="wikibase-termbox__label">{{ label }}</h2>
				<p class="wikibase-termbox__description">{{ description }}</p>
				<ul v-if="hasAliases" class="wikibase-termbox__aliases">
					<li v-for="alias in aliases"
						class="wikibase-termbox__alias"
						:data-separator="'wikibase-termbox-alias-separator' | message">{{ alias.value }}</li>
				</ul>
				<p class="wikibase-termbox__aliases-placeholder" v-else>?</p>
			</div>
		</div>
		<div class="wikibase-termbox__action"></div>
	</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import {
	mapState,
	mapGetters,
} from 'vuex';
import {
	NS_ENTITY,
	NS_USER,
	NS_LANGUAGE,
} from '@/store/namespaces';
import Term from '@/datamodel/Term';
import message from '@/filter/message';

Vue.filter( 'message', message );

interface EntityBindings {
	entityLabel: ( languageCode: string ) => Term;
	entityDescription: ( languageCode: string ) => Term;
	entityAliases: ( languageCode: string ) => Term[];
}

interface TermboxBindings extends Vue, EntityBindings {
	primaryLanguage: string;

	getLanguageTranslation( language: string, inLanguage: string ): string;
}

@Component( {
	computed: {
		...mapState( NS_USER, [
			'primaryLanguage',
		] ),
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

export default class TermBox extends ( Vue as VueConstructor<TermboxBindings> ) {
	get label(): string {
		const label: Term = this.entityLabel( this.primaryLanguage );
		if ( label === null ) {
			return '???';
		} else {
			return label.value;
		}
	}

	get description(): string {
		const description: Term = this.entityDescription( this.primaryLanguage );
		if ( description === null ) {
			return '??';
		} else {
			return description.value;
		}
	}

	get hasAliases(): boolean {
		return !( this.entityAliases( this.primaryLanguage ) == null );
	}

	get aliases(): Term[] {
		const aliases: Term[] =  this.entityAliases( this.primaryLanguage );
		if ( aliases === null ) {
			return [];
		} else {
			return aliases;
		}
	}

	get primaryLanguageName(): string {
		const name = this.getLanguageTranslation( this.primaryLanguage, this.primaryLanguage );
		if ( name === null ) {
			return '????';
		} else {
			return name;
		}
	}
}
</script>

<style lang="scss">
.wikibase-termbox { // container - need a strong selector chain to reliably override reset css
	.wikibase-termbox { // for use as a prefix
		&__language {
			color: $color-dark-azureish-gray;
			font-size: 0.9rem;
		}

		&__label {
			color: $color-black;
			line-height: 1.3em;
			font-weight: bold;
		}

		&__description {
			margin-top: 0.5rem;
			margin-left: 0.5em;
			color: $color-black;
			line-height: 1.3em;
		}

		&__aliases {
			margin-top: 0.5rem;
			margin-left: 0.5em;
			color: $color-light-azureish-gray;
			line-height: 1.3em;
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

	// unless we find another difference we should move the primaryLanguage modifier to the label
	&.wikibase-termbox--primaryLanguage {
		.wikibase-termbox__label {
			font-size: 1.5rem;
		}
	}
}
</style>
