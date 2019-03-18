<template>
	<div
		class="wb-ui-monolingualfingerprintview"
		:class="{ 'wb-ui-monolingualfingerprintview--primaryLanguage': isPrimary }">
		<LanguageNameInUserLanguage class="wb-ui-monolingualfingerprintview__language" :language="language"/>
		<div class="wb-ui-monolingualfingerprintview__terms">
			<Label :label="getLabelByLanguage( languageCode )" :isPrimary="isPrimary" class="wb-ui-monolingualfingerprintview__label-wrapper"/>
			<div class="wb-ui-monolingualfingerprintview__description-wrapper">
				<Description :description="getDescriptionByLanguage( languageCode )" class="wb-ui-monolingualfingerprintview__description-inner" />
			</div>
			<div class="wb-ui-monolingualfingerprintview__aliases-wrapper">
				<Aliases :aliases="getAliasesByLanguage( languageCode )" class="wb-ui-monolingualfingerprintview__aliases-inner" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from './mixins/Messages';
import { mapGetters } from 'vuex';
import { NS_ENTITY, NS_LANGUAGE } from '@/store/namespaces';
import LanguageNameInUserLanguage from '@/components/LanguageNameInUserLanguage.vue';
import Label from '@/components/Label.vue';
import Description from '@/components/Description.vue';
import Aliases from '@/components/Aliases.vue';
import Language from '@/datamodel/Language';
import { namespace } from 'vuex-class';
import { Prop } from 'vue-property-decorator';

@Component( {
	components: { Aliases, Description, Label, LanguageNameInUserLanguage },
	computed: {
		...mapGetters( NS_ENTITY, [ 'getLabelByLanguage', 'getDescriptionByLanguage', 'getAliasesByLanguage' ] ),
	},
} )
export default class MonolingualFingerprintView extends mixins( Messages ) {

	@Prop( { required: true, type: String } )
	public languageCode!: string;

	@Prop( { required: false, default: false, type: Boolean } )
	public isPrimary!: boolean;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( languageCode: string ) => Language;

	get language(): Language {
		return this.getLanguageByCode( this.languageCode );
	}
}
</script>

<style lang="scss">
.wb-ui-monolingualfingerprintview {
	margin-top: 32px;
	margin-right: 64px;

	&:first-child {
		margin-top: 0;
	}

	&__language {
		@include fontSize( 13px );
		color: $color-dark-azureish-gray;
		font-family: $font-family-sans;
	}

	&__label-wrapper,
	&__description-wrapper,
	&__aliases-wrapper {
		min-width: 244px;
		max-width: 420px;
		margin-top: 0.5rem;
		overflow-wrap: break-word;
		word-wrap: break-word;
		hyphens: auto;
	}

	&__description-inner,
	&__aliases-inner { // margin and min-width need to be on different elements for width calculation
		margin-left: 0.5em;
	}

	&:not( .wb-ui-monolingualfingerprintview--primaryLanguage ) {
		@include media-breakpoint-up(md) {
			.wb-ui-monolingualfingerprintview__terms {
				display: flex;
				flex: 1 1 0;
			}

			.wb-ui-monolingualfingerprintview__label-wrapper,
			.wb-ui-monolingualfingerprintview__description-wrapper,
			.wb-ui-monolingualfingerprintview__aliases-wrapper {
				flex: 1 1 100%;

				@include shrinking-flex-element();
			}

			.wb-ui-monolingualfingerprintview__description-wrapper,
			.wb-ui-monolingualfingerprintview__aliases-wrapper {
				margin-left: 16px;
			}

			.wb-ui-monolingualfingerprintview__description-inner,
			.wb-ui-monolingualfingerprintview__aliases-inner {
				margin-left: 0;
			}
		}

		@include media-breakpoint-up(lg) {
			display: flex;

			.wb-ui-monolingualfingerprintview__label-wrapper,
			.wb-ui-monolingualfingerprintview__description-wrapper,
			.wb-ui-monolingualfingerprintview__aliases-wrapper {
				margin-top: 0;
			}

			.wb-ui-monolingualfingerprintview__language {
				flex-basis: 128px;
				margin-right: 16px;
			}
		}
	}
}
</style>
