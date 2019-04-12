<template>
	<div class="wb-ui-all-entered-languages">
		<MonolingualFingerprintView
			v-for="language in allEnteredLanguagesWithoutUserLanguages"
			:language-code="language"
			:key="language"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import { NS_ENTITY, NS_USER } from '@/store/namespaces';
import { namespace } from 'vuex-class';

@Component( {
	components: { MonolingualFingerprintView },
} )
export default class AllEnteredLanguages extends Vue {

	@namespace( NS_ENTITY ).Getter( 'getAllEnteredLanguageCodes' )
	public getAllEnteredLanguageCodes!: string[];

	@namespace( NS_USER ).State( 'primaryLanguage' )
	public primaryLanguage!: string;

	@namespace( NS_USER ).State( 'secondaryLanguages' )
	public secondaryLanguages!: string[];

	get allEnteredLanguagesWithoutUserLanguages() {
		return this.getAllEnteredLanguageCodes.filter( ( languageKey ) => {
			return languageKey !== this.primaryLanguage && this.secondaryLanguages.indexOf( languageKey ) === -1;
		} );
	}
}
</script>

<style lang="scss"></style>
