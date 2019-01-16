<template>
	<div>
		<Fingerprint v-for="language in allEnteredLanguagesWithoutUserLanguage" :languageCode="language" :key="language"/>
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
	getAllEnteredLanguageCodes: string[];

}

@Component( {
	components: { Fingerprint },
	computed: {
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
		...mapGetters( NS_ENTITY, [ 'getAllEnteredLanguageCodes' ] ),
	},
} )
export default class AllEnteredLanguages extends ( Vue as VueConstructor<AllEnteredLanguagesBinding> ) {

	get allEnteredLanguagesWithoutUserLanguage() {
		return this.getAllEnteredLanguageCodes.filter( ( languageKey ) => {
			return languageKey !== this.primaryLanguage;
		} );
	}
}
</script>

<style lang="scss">
</style>
