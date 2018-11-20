<template>
	<div class="wikibase-termbox-primaryLanguage">
		<div>
			<div class="wikibase-termbox-term">
				<span class="wikibase-termbox-language">{{primaryLanguageName}}</span>
				<h2 class="wikibase-termbox-label">{{ label }}</h2>
				<p class="wikibase-termbox-description">{{ description }}</p>
				<ul v-if="hasAliases" class="wikibase-termbox-aliases">
					<li v-for="alias in aliases">
						{{ alias.value }}
					</li>
				</ul>
				<p class="wikibase-termbox-aliases" v-else>?</p>
			</div>
		</div>
		<div class="wikibase-termbox-action"></div>
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
</style>
