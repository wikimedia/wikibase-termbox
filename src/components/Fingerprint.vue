<template>
	<div
		class="wikibase-termbox-fingerprint"
		:class="{ 'wikibase-termbox-fingerprint--primaryLanguage': isPrimary }">
		<LanguageNameInUserLanguage class="wikibase-termbox-fingerprint__language" :language="language"/>
		<div class="wikibase-termbox-fingerprint__terms">
			<Label :label="getLabelByLanguage( languageCode )" :isPrimary="isPrimary" class="wikibase-termbox-fingerprint__label-wrapper"/>
			<div class="wikibase-termbox-fingerprint__description-wrapper">
				<Description :description="getDescriptionByLanguage( languageCode )" class="wikibase-termbox-fingerprint__description-inner" />
			</div>
			<div class="wikibase-termbox-fingerprint__aliases-wrapper">
				<Aliases :aliases="getAliasesByLanguage( languageCode )" class="wikibase-termbox-fingerprint__description-inner" />
			</div>
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
import LanguageNameInUserLanguage from '@/components/LanguageNameInUserLanguage.vue';
import Label from '@/components/Label.vue';
import Description from '@/components/Description.vue';
import Aliases from '@/components/Aliases.vue';
import Language from '@/datamodel/Language';

interface FingerprintBindings extends Vue, MessagesMixin {
	languageCode: string;
	isPrimary: boolean;
	getLanguageByCode( languageCode: string ): Language;
}
@Component( {
	components: { Aliases, Description, Label, LanguageNameInUserLanguage },
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
		...mapGetters( NS_ENTITY, [ 'getLabelByLanguage', 'getDescriptionByLanguage', 'getAliasesByLanguage' ] ),
		...mapGetters( NS_LANGUAGE, {
			getLanguageByCode: 'getByCode',
		} ),
	},
} )
export default class Fingerprint extends ( mixins( Messages ) as VueConstructor<FingerprintBindings> ) {

	get language(): Language {
		return this.getLanguageByCode( this.languageCode );
	}
}
</script>

<style lang="scss">
.wikibase-termbox-fingerprint {
	margin-top: 32px;
	margin-right: 64px;
	min-width: 0; // https://css-tricks.com/flexbox-truncated-text/

	&:first-child {
		margin-top: 0;
	}

	&__language {
		@include fontSize( 13px );
		color: $color-dark-azureish-gray;
		font-family: $font-family-sansserif;
	}

	&__label-wrapper,
	&__description-wrapper,
	&__aliases-wrapper {
		min-width: 260px;
		max-width: 420px;
		overflow-wrap: break-word;
		word-wrap: break-word;
		hyphens: auto;
	}

	&__description-inner,
	&__aliases-inner { // margin and min-width need to be of different elements for width calculation
		margin-left: 0.5em;
		margin-top: 0.5rem;
	}

	&:not( .wikibase-termbox-fingerprint--primaryLanguage ) {
		@include media-breakpoint-up(md) {
			.wikibase-termbox-fingerprint__terms {
				display: flex;
				flex: 1 1 0;
			}

			.wikibase-termbox-fingerprint__language {
				margin-bottom: 8px;
			}

			.wikibase-termbox-fingerprint__label-wrapper,
			.wikibase-termbox-fingerprint__description-wrapper,
			.wikibase-termbox-fingerprint__aliases-wrapper {
				flex: 1 1 100%;
			}

			.wikibase-termbox-fingerprint__description-wrapper,
			.wikibase-termbox-fingerprint__aliases-wrapper {
				margin-left: 16px;
			}

			.wikibase-termbox-fingerprint__description-inner,
			.wikibase-termbox-fingerprint__aliases-inner {
				margin-left: 0;
				margin-top: 0;
			}
		}

		@include media-breakpoint-up(lg) {
			display: flex;

			.wikibase-termbox-fingerprint__language {
				flex-basis: 128px;
				margin-right: 16px;
				margin-bottom: 0;
			}
		}
	}
}
</style>
