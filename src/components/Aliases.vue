<template>
	<ul v-if="aliases"
		class="wikibase-termbox-fingerprint__aliases"
		:lang="language.code"
		:dir="language.directionality">
		<li v-for="alias in aliases"
			class="wikibase-termbox-fingerprint__alias"
			:data-separator="message( MESSAGE_KEYS.ALIAS_SEPARATOR )">{{ alias.value }}</li>
	</ul>
	<div class="wikibase-termbox-fingerprint__aliases wikibase-termbox-fingerprint__aliases--placeholder" v-else/>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { NS_ENTITY } from '@/store/namespaces';
import TermList from '@/datamodel/TermList';
import Language from '@/datamodel/Language';
import Messages from '@/components/mixins/Messages';

interface AliasesBindings extends Vue {
	language: Language;
	getAliasesByLanguage( language: string ): TermList;
}

@Component( {
	props: {
		language: {
			required: true,
			type: Object,
		},
	},
	computed: {
		...mapGetters( NS_ENTITY, [ 'getAliasesByLanguage' ] ),
	},
} )
export default class Aliases extends ( mixins( Messages ) as VueConstructor<AliasesBindings> ) {

	get aliases() {
		return this.getAliasesByLanguage( this.language.code );
	}

}
</script>

<style lang="scss">
.wikibase-termbox-fingerprint .wikibase-termbox-fingerprint__aliases {
	margin-left: 0.5em;
	margin-top: 0.5rem;
	color: $color-light-azureish-gray;
	line-height: 1.3em;
	font-family: $font-family-sansserif;

	.wikibase-termbox-fingerprint__alias {
		display: inline;
	}

	&--placeholder {
		height: 1.25em;
	}

	@include media-breakpoint-up(md) {
		margin-left: 0;
	}
}
</style>
