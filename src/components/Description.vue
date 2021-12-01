<template>
	<p
		v-if="description"
		class="wb-ui-description"
		v-inlanguage="language"
	>
		{{ description.value }}
	</p>
	<p
		v-else
		class="wb-ui-description wb-ui-description--missing"
	>
		{{ message( MESSAGE_KEYS.MISSING_DESCRIPTION ) }}
	</p>
</template>

<script lang="ts">
import {
	defineComponent,
	PropType,
} from 'vue';
import Messages from '@/components/mixins/Messages';
import { Term } from '@wmde/wikibase-datamodel-types';

export default defineComponent( {
	name: 'Description',
	mixins: [ Messages ],
	props: {
		description: { required: false, default: null, type: Object as PropType<Term> },
	},
	computed: {
		language(): string {
			return this.description.language;
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-description {
	@include descriptionFont();
	@include hyphens();

	&--missing {
		color: $color-moderate-red;
	}
}
</style>
