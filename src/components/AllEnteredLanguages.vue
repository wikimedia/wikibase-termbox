<template>
	<div class="wb-ui-all-entered-languages">
		<Fingerprint v-for="language in allEnteredLanguagesWithoutUserLanguages" :languageCode="language" :key="language"/>
	</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import Fingerprint from '@/components/Fingerprint.vue';
import { NS_ENTITY, NS_USER } from '@/store/namespaces';
import { mapGetters, mapState } from 'vuex';

interface AllEnteredLanguagesBinding extends Vue {

	primaryLanguage: string;
	secondaryLanguages: string[];
	getAllEnteredLanguageCodes: string[];

}

@Component( {
	components: { Fingerprint },
	computed: {
		...mapState( NS_USER, [ 'primaryLanguage', 'secondaryLanguages' ] ),
		...mapGetters( NS_ENTITY, [ 'getAllEnteredLanguageCodes' ] ),
	},
} )
export default class AllEnteredLanguages extends ( Vue as VueConstructor<AllEnteredLanguagesBinding> ) {

	get allEnteredLanguagesWithoutUserLanguages() {
		return this.getAllEnteredLanguageCodes.filter( ( languageKey ) => {
			return languageKey !== this.primaryLanguage && this.secondaryLanguages.indexOf( languageKey ) === -1;
		} );
	}
}
</script>

<style lang="scss"></style>
