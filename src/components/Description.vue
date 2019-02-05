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
import { NS_ENTITY } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import Term from '@/datamodel/Term';

interface DescriptionBindings extends Vue {
	language: Language;
	getDescriptionByLanguage( languageCode: string ): Term;
}

@Component( {
	props: {
		language: {
			required: true,
			type: Object,
		},
	},
	computed: {
		...mapGetters( NS_ENTITY, [ 'getDescriptionByLanguage' ] ),
	},
} )
export default class Description extends ( mixins( Messages ) as VueConstructor<DescriptionBindings> ) {

	get description() {
		return this.getDescriptionByLanguage( this.language.code );
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
