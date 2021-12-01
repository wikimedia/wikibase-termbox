<template>
	<div
		class="wb-ui-monolingualfingerprintview"
		:class="{
			'wb-ui-monolingualfingerprintview--primaryLanguage': isPrimary,
			'wb-ui-monolingualfingerprintview--editing': editMode,
		}"
	>
		<span class="wb-ui-monolingualfingerprintview__language">
			{{ getLanguageTranslationInUserLanguage( languageCode ) }}
		</span>
		<div class="wb-ui-monolingualfingerprintview__terms">
			<component
				:is="editMode ? 'LabelEdit' : 'Label'"
				:label="getLabelByLanguage( languageCode )"
				@input="onEditLabel"
				:is-primary="isPrimary"
				:language-code="editMode ? languageCode : null"
				class="wb-ui-monolingualfingerprintview__label-wrapper"
			/>
			<div class="wb-ui-monolingualfingerprintview__description-wrapper">
				<component
					:is="editMode ? 'DescriptionEdit' : 'Description'"
					:description="getDescriptionByLanguage( languageCode )"
					@input="onEditDescription"
					:language-code="editMode ? languageCode : null"
					class="wb-ui-monolingualfingerprintview__description-inner"
				/>
			</div>
			<div class="wb-ui-monolingualfingerprintview__aliases-wrapper">
				<component
					:is="editMode ? 'AliasesEdit' : 'Aliases'"
					:aliases="getAliasesByLanguage( languageCode )"
					:language-code="editMode ? languageCode : null"
					class="wb-ui-monolingualfingerprintview__aliases-inner"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Messages from './mixins/Messages';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import { NS_ENTITY, NS_LANGUAGE } from '@/store/namespaces';
import Label from '@/components/Label.vue';
import LabelEdit from '@/components/LabelEdit.vue';
import Description from '@/components/Description.vue';
import DescriptionEdit from '@/components/DescriptionEdit.vue';
import Aliases from '@/components/Aliases.vue';
import AliasesEdit from '@/components/AliasesEdit.vue';
import { ENTITY_DESCRIPTION_EDIT, ENTITY_LABEL_EDIT } from '@/store/entity/actionTypes';

export default defineComponent( {
	name: 'MonolingualFingerprintView',
	components: {
		Label,
		LabelEdit,
		Description,
		DescriptionEdit,
		Aliases,
		AliasesEdit,
	},
	mixins: [ Messages ],
	props: {
		languageCode: { required: true, type: String },
		isPrimary: { required: false, default: false, type: Boolean },
	},
	computed: {
		...mapState( [ 'editMode' ] ),
		...mapGetters( NS_ENTITY, [
			'getLabelByLanguage',
			'getDescriptionByLanguage',
			'getAliasesByLanguage',
		] ),
		...mapGetters( NS_LANGUAGE, {
			getLanguageTranslationInUserLanguage: 'getTranslationInUserLanguage',
		} ),
	},
	methods: {
		...mapActions( NS_ENTITY, {
			onEditLabel: ENTITY_LABEL_EDIT,
			onEditDescription: ENTITY_DESCRIPTION_EDIT,
		} ),
	},
} );
</script>

<style lang="scss">
.wb-ui-monolingualfingerprintview {
	$block: #{&};
	margin-top: 32px;
	padding-left: $content-padding-left;

	&:first-child {
		margin-top: 0;
	}

	&__language {
		@include fontSize( 13px );
		color: $wmui-color-base20;
		font-family: $font-family-sans;
	}

	&__label-wrapper,
	&__description-wrapper,
	&__aliases-wrapper {
		min-width: 244px;
		max-width: 420px;
		margin-top: $base-font-size / 2;
	}

	&:not( &--editing ) {
		#{$block}__description-inner,
		#{$block}__aliases-inner {
			// margin and min-width need to be on different elements for width calculation
			margin-left: 0.5em;
		}
	}

	&--primaryLanguage {
		width: 100%;
	}

	&:not( &--primaryLanguage ) {
		margin-right: 64px;

		@include media-breakpoint-up(md) {
			#{$block}__terms {
				display: flex;
				flex: 1 1 0;
			}

			#{$block}__label-wrapper,
			#{$block}__description-wrapper,
			#{$block}__aliases-wrapper {
				flex: 1 1 100%;

				@include shrinking-flex-element();
			}

			#{$block}__description-wrapper,
			#{$block}__aliases-wrapper {
				margin-left: 16px;
			}

			#{$block}__description-inner,
			#{$block}__aliases-inner {
				margin-left: 0;
			}
		}

		@include media-breakpoint-up(lg) {
			display: flex;

			#{$block}__label-wrapper,
			#{$block}__description-wrapper,
			#{$block}__aliases-wrapper {
				margin-top: 0;
			}

			#{$block}__language {
				flex-basis: 128px;
				margin-right: 16px;
			}
		}
	}
}
</style>
