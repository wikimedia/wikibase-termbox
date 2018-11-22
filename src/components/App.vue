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
import { NS_ENTITY, NS_USER, NS_LANGUAGE } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { LANGUAGE_PREFERENCE } from '@/store/user/actionTypes';
import TermboxRequest from '@/common/TermboxRequest';
import { LANGUAGE_INIT } from '../store/language/actionTypes';

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

	public static asyncData( store: Store<any>, request: TermboxRequest ): Promise<any> {
		return Promise.all( [
			store.dispatch( `${NS_LANGUAGE}/${LANGUAGE_INIT}` ),
			store.dispatch( `${NS_ENTITY}/${ENTITY_INIT}`, request.entityId ),
			store.dispatch( `${NS_USER}/${LANGUAGE_PREFERENCE}`, request.language ),
		] );
	}

}
</script>

<style lang="scss">
</style>
