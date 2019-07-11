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
import Component, { mixins } from 'vue-class-component';
import Messages from '@/components/mixins/Messages';
import Term from '@/datamodel/Term';
import { Prop } from 'vue-property-decorator';

@Component
export default class Label extends mixins( Messages ) {
	@Prop( { required: true } )
	public label!: Term;

	@Prop( { required: false, default: false, type: Boolean } )
	public isPrimary!: boolean;

	get language() {
		return this.label.language;
	}

}
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
