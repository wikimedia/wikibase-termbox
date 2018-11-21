<template>
	<div class="wikibase-entitytermsview">
		({{entityId}})
		<TermBox/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TermBox from './TermBox.vue';
import { mapState, Store } from 'vuex';
import { NS_ENTITY } from '../store/namespaces';
import TermboxRequest from '@/common/TermboxRequest';

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

	public static asyncData( store: Store<any>, request: TermboxRequest ) {
		return store.dispatch( `${NS_ENTITY}/entityInit`, request.entityId );
	}

}
</script>

<style lang="scss">
</style>
