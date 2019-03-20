<template>
	<section class="wikibase-entitytermsview" :dir="directionality">
		<TermBox/>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TermBox from './TermBox.vue';
import { Store } from 'vuex';
import { NS_ENTITY, NS_LANGUAGE, NS_LINKS, NS_USER } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { LANGUAGE_PREFERENCE } from '@/store/user/actionTypes';
import TermboxRequest from '@/common/TermboxRequest';
import { LANGUAGE_INIT } from '@/store/language/actionTypes';
import { EDIT_LINK_URL_INIT } from '@/store/links/actionTypes';
import Language from '@/datamodel/Language';
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
			store.dispatch( action( NS_LINKS, EDIT_LINK_URL_INIT ), request.editLinkUrl ),
		] );
	}

	@namespace( NS_USER ).State( 'primaryLanguage' )
	public primaryLanguage!: string;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( code: string ) => Language;

	get directionality() {
		return this.getLanguageByCode( this.primaryLanguage ).directionality;
	}

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
