<template>
	<div class="wikibase-termbox__edit-action">
		<a :href="href"></a>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component( {
	props: {
		href: String,
	},
} )
export default class EditPen extends Vue {

}
</script>

<style lang="scss">
.wikibase-termbox { // for use as a prefix
	&__edit-action a {
		background: $svg-pen 50% 50% no-repeat;
		width: 48px;
		height: 48px;
		display: block;
	}
}
</style>
