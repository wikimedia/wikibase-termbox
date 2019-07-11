<template>
	<section class="wikibase-entitytermsview" v-inlanguage="primaryLanguage">
		<TermBox />
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TermBox from './TermBox.vue';
import { Store } from 'vuex';
import { NS_ENTITY, NS_LANGUAGE, NS_LINKS, NS_USER } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import {
	LANGUAGE_PREFERENCE,
	USER_NAME_SET,
	USER_PREFERENCES_INIT,
} from '@/store/user/actionTypes';
import TermboxRequest from '@/common/TermboxRequest';
import { LANGUAGE_INIT } from '@/store/language/actionTypes';
import { LINKS_INIT } from '@/store/links/actionTypes';
import { action } from '@/store/util';
import { namespace } from 'vuex-class';

@Component( {
	components: {
		TermBox,
	},
} )
export default class App extends Vue {

	public static asyncData( store: Store<any>, request: TermboxRequest ): Promise<any> {
		return Promise.all( [
			store.dispatch( action( NS_LANGUAGE, LANGUAGE_INIT ) ),
			store.dispatch(
				action( NS_ENTITY, ENTITY_INIT ),
				{ entity: request.entityId, revision: request.revision },
			),
			store.dispatch(
				action( NS_USER, LANGUAGE_PREFERENCE ),
				{ primaryLanguage: request.language, preferredLanguages: request.preferredLanguages },
			),
			store.dispatch( action( NS_LINKS, LINKS_INIT ), request.links ),
			store.dispatch( action( NS_USER, USER_NAME_SET ), request.userName ),
			store.dispatch( action( NS_USER, USER_PREFERENCES_INIT ) ),
		] );
	}

	@namespace( NS_USER ).State( 'primaryLanguage' )
	public primaryLanguage!: string;

}
</script>

<style lang="scss">
/**
 * All components' CSS selectors are prefixed by postcss-prefixwrap. This both
 * * ensures the following reset is restricted to the inside of our application
 * * allows component styles to overcome this reset
 */
@import '~reset-css/sass/_reset';

ul,
ol { // overcome very strong selector, e.g. .content ul li
	li {
		margin: 0;
	}
}
</style>
