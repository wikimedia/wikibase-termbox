<template>
	<ul v-if="aliases && aliases.length > 0"
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
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import Term from '@/datamodel/Term';
import Messages from '@/components/mixins/Messages';

interface AliasesBindings extends Vue {
	aliases: Term[];
	getLanguageByCode( language: string ): Language;
}

@Component( {
	props: {
		aliases: {
			required: true,
		},
	},
	computed: {
		...mapGetters( NS_LANGUAGE, { getLanguageByCode: 'getByCode' } ),
	},
} )
export default class Aliases extends ( mixins( Messages ) as VueConstructor<AliasesBindings> ) {

	get language() {
		return this.getLanguageByCode( this.aliases[ 0 ].language );
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
