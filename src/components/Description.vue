<template>
	<p
		v-if="description"
		class="wikibase-termbox-fingerprint__description"
		:lang="language.code"
		:dir="language.directionality">{{ description.value }}</p>
	<p
		v-else
		class="wikibase-termbox-fingerprint__description wikibase-termbox-fingerprint__description--missing">
		{{ message( MESSAGE_KEYS.MISSING_DESCRIPTION ) }}
	</p>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import { mapGetters } from 'vuex';
import Messages from '@/components/mixins/Messages';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import Term from '@/datamodel/Term';

interface DescriptionBindings extends Vue {
	description: Term;
	getLanguageByCode( languageCode: string ): Language;
}

@Component( {
	props: {
		description: {
			required: true,
		},
	},
	computed: {
		...mapGetters( NS_LANGUAGE, { getLanguageByCode: 'getByCode' } ),
	},
} )
export default class Description extends ( mixins( Messages ) as VueConstructor<DescriptionBindings> ) {

	get language() {
		return this.getLanguageByCode( this.description.language );
	}

}
</script>

<style lang="scss">
.wikibase-termbox-fingerprint .wikibase-termbox-fingerprint__description {
	margin-left: 0.5em;
	margin-top: 0.5rem;
	color: $color-black;
	line-height: 1.3em;
	font-family: $font-family-sansserif;

	&--missing {
		color: $color-moderate-red;
	}

	@include media-breakpoint-up(md) {
		margin-left: 0;
	}
}
</style>
