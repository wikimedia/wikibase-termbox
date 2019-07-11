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
import Component, { mixins } from 'vue-class-component';
import Messages from '@/components/mixins/Messages';
import Term from '@/datamodel/Term';
import { Prop } from 'vue-property-decorator';

@Component
export default class Description extends mixins( Messages ) {

	@Prop( { required: true } )
	public description!: Term;

	get language() {
		return this.description.language;
	}

}
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
