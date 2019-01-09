<template>
	<section class="wikibase-entitytermsview" :dir="directionality">
		<TermBox/>
		<InAllLanguagesSwitch/>
	</section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import TermBox from './TermBox.vue';
import InAllLanguagesSwitch from '@/components/InAllLanguagesSwitch.vue';
import { mapGetters, mapState, Store } from 'vuex';
import { NS_ENTITY, NS_USER, NS_LANGUAGE, NS_LINKS } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { LANGUAGE_PREFERENCE } from '@/store/user/actionTypes';
import TermboxRequest from '@/common/TermboxRequest';
import { LANGUAGE_INIT } from '@/store/language/actionTypes';
import { EDIT_LINK_URL_INIT } from '@/store/links/actionTypes';
import Language from '@/datamodel/Language';
import { action } from '@/store/util';

interface AppBindings extends Vue {
	primaryLanguage: string;
	getLanguageByCode: ( code: string ) => Language;
}

@Component( {
	components: {
		TermBox,
		InAllLanguagesSwitch,
	},
	computed: {
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
		...mapGetters( NS_LANGUAGE, { getLanguageByCode: 'getByCode' } ),
	},
} )
export default class App extends ( Vue as VueConstructor<AppBindings> ) {

	get directionality() {
		return this.getLanguageByCode( this.primaryLanguage ).directionality;
	}

	public static asyncData( store: Store<any>, request: TermboxRequest ): Promise<any> {
		return Promise.all( [
			store.dispatch( action( NS_LANGUAGE, LANGUAGE_INIT ) ),
			store.dispatch( action( NS_ENTITY, ENTITY_INIT ), request.entityId ),
			store.dispatch( action( NS_USER, LANGUAGE_PREFERENCE ), request.language ),
			store.dispatch( action( NS_LINKS, EDIT_LINK_URL_INIT ), request.editLinkUrl ),
		] );
	}

}
</script>

<style lang="scss">
.wikibase-entitytermsview {
	@import '~reset-css/sass/_reset';
}
</style>
