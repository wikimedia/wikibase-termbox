<template>
	<component
		v-if="label"
		:is="isPrimary ? 'h2' : 'div'"
		class="wb-ui-label"
		:class="{ 'wb-ui-label--primary': isPrimary }"
		v-inlanguage="language">{{ label.value }}</component>
	<div
		v-else
		class="wb-ui-label wb-ui-label--missing"
		:class="{ 'wb-ui-label--primary': isPrimary }">
		{{ message( MESSAGE_KEYS.MISSING_LABEL ) }}
	</div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import { NS_LANGUAGE } from '@/store/namespaces';
import Messages from '@/components/mixins/Messages';
import Term from '@/datamodel/Term';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Language from '@/datamodel/Language';

@Component
export default class Label extends ( mixins( Messages ) as VueConstructor ) {
	@Prop( { required: true } )
	public label!: Term;

	@Prop( { required: false, default: false, type: Boolean } )
	public isPrimary!: boolean;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( language: string ) => Language;

	get language() {
		return this.getLanguageByCode( this.label.language );
	}

}
</script>

<style lang="scss">
.wb-ui-label {
	color: $color-black;
	line-height: 1.3em;
	font-family: $font-family-serif;
	font-weight: bold;

	@include hyphens();

	&--primary {
		@include fontSize( 23px );
	}

	&--missing {
		color: $color-moderate-red;
		font-weight: normal;
		font-family: $font-family-sans;
	}
}
</style>
