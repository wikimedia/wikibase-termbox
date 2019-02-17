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
import { namespace } from 'vuex-class';

@Component( {
	components: { Fingerprint },
} )
export default class AllEnteredLanguages extends ( Vue as VueConstructor ) {

	@namespace( NS_ENTITY ).Getter( 'getAllEnteredLanguageCodes' )
	public getAllEnteredLanguageCodes!: string[];

	@namespace( NS_USER ).State( 'primaryLanguage' )
	public primaryLanguage!: string;

	@namespace( NS_USER ).Getter( 'topSecondaryLanguages' )
	public topSecondaryLanguages!: string[];

	get allEnteredLanguagesWithoutUserLanguages() {
		return this.getAllEnteredLanguageCodes.filter( ( languageKey ) => {
			return languageKey !== this.primaryLanguage && this.topSecondaryLanguages.indexOf( languageKey ) === -1;
		} );
	}
}
</script>

<style lang="scss"></style>
