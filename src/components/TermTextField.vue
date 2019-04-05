<template>
	<textarea :value="value" @input="e => $emit( 'input', e.target.value )"></textarea>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';

@Component
export default class TermTextField extends Vue {
	@Prop()
	public value!: string;

	@Watch( 'value' )
	public onValueChange() {
		this.resizeTextField();
	}

	public mounted() {
		this.resizeTextField();
	}

	public resizeTextField() {
		const textarea = this.$el as HTMLTextAreaElement;

		textarea.style.height = '0';
		const border = this.getPropertyValueInPx( textarea, 'border-top-width' )
			+ this.getPropertyValueInPx( textarea, 'border-bottom-width' );
		textarea.style.height = ( this.$el.scrollHeight + border ) + 'px';
	}

	private getPropertyValueInPx( element: HTMLElement, property: string ) {
		return parseInt( window.getComputedStyle( element ).getPropertyValue( property ) );
	}

}
</script>
