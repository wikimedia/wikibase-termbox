<template>
	<component
		v-if="label"
		:is="isPrimary ? 'h2' : 'div'"
		class="wikibase-termbox-fingerprint__label"
		:class="{ 'wikibase-termbox-fingerprint__label--primary': isPrimary }"
		:lang="language.code"
		:dir="language.directionality">{{ label.value }}</component>
	<div
		v-else
		class="wikibase-termbox-fingerprint__label wikibase-termbox-fingerprint__label--missing"
		:class="{ 'wikibase-termbox-fingerprint__label--primary': isPrimary }">
		{{ message( MESSAGE_KEYS.MISSING_LABEL ) }}
	</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import { mapGetters } from 'vuex';
import Language from '@/datamodel/Language';
import { NS_LANGUAGE } from '@/store/namespaces';
import Messages from '@/components/mixins/Messages';
import Term from '@/datamodel/Term';

interface LabelBindings extends Vue {
	label: Term;
	getLanguageByCode( languageCode: string ): Language;
}

@Component( {
	props: {
		label: {
			required: true,
		},
		isPrimary: {
			required: false,
			default: false,
			type: Boolean,
		},
	},
	computed: {
		...mapGetters( NS_LANGUAGE, { getLanguageByCode: 'getByCode' } ),
	},
} )
export default class Label extends ( mixins( Messages ) as VueConstructor<LabelBindings> ) {

	get language() {
		return this.getLanguageByCode( this.label.language );
	}

}
</script>

<style lang="scss">
.wikibase-termbox-fingerprint .wikibase-termbox-fingerprint__label {
	color: $color-black;
	line-height: 1.3em;
	font-family: $font-family-serif;
	font-weight: bold;

	&--primary {
		@include fontSize( 23px );
	}

	&--missing {
		color: $color-moderate-red;
		font-weight: normal;
		font-family: $font-family-sansserif;
	}
}
</style>
