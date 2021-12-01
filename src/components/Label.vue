<template>
	<component
		v-if="label"
		:is="isPrimary ? 'h2' : 'div'"
		class="wb-ui-label"
		:class="{ 'wb-ui-label--primary': isPrimary }"
		v-inlanguage="language"
	>
		{{ label.value }}
	</component>
	<div
		v-else
		class="wb-ui-label wb-ui-label--missing"
		:class="{ 'wb-ui-label--primary': isPrimary }"
	>
		{{ message( MESSAGE_KEYS.MISSING_LABEL ) }}
	</div>
</template>

<script lang="ts">
import {
	defineComponent,
	PropType,
} from 'vue';
import Messages from '@/components/mixins/Messages';
import { Term } from '@wmde/wikibase-datamodel-types';

export default defineComponent( {
	name: 'Label',
	mixins: [ Messages ],
	props: {
		label: { required: false, default: null, type: Object as PropType<Term> },
		isPrimary: { required: false, default: false, type: Boolean },
	},
	computed: {
		language(): string {
			return this.label.language;
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-label {
	@include labelFont( #{&}--primary );
	@include hyphens();

	&--missing {
		color: $color-moderate-red;
		font-weight: normal;
		font-family: $font-family-sans;
	}
}
</style>
