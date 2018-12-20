<template>
	<div class="edit-action">
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

<style type="text/scss">

</style>
