<template>
	<div>
		({{entityId}})
		<TermBox/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TermBox from './TermBox.vue';
import { mapState } from 'vuex';
import { NS_ENTITY } from '../store/namespaces';

@Component( {
	components: {
		TermBox,
	},
	computed: {
		...mapState( NS_ENTITY, {
			entityId: 'id',
		} ),
	},
} )
export default class App extends Vue {
}
</script>

<style lang="scss">
</style>
