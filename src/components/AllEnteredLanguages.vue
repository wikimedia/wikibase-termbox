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
import { defineComponent } from 'vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import { NS_ENTITY, NS_USER } from '@/store/namespaces';
import {
	mapGetters,
	mapState,
} from 'vuex';

interface AllEnteredLanguages {
	getAllEnteredLanguageCodes: string[];
	primaryLanguage: string;
	secondaryLanguages: string[];
}

export default defineComponent( {
	name: 'AllEnteredLanguages',
	components: { MonolingualFingerprintView },
	computed: {
		...mapGetters( NS_ENTITY, [ 'getAllEnteredLanguageCodes' ] ),
		...mapState( NS_USER, [ 'primaryLanguage', 'secondaryLanguages' ] ),
		allEnteredLanguagesWithoutUserLanguages( this: AllEnteredLanguages ): string[] {
			return this.getAllEnteredLanguageCodes.filter( ( languageKey ) => {
				return languageKey !== this.primaryLanguage && this.secondaryLanguages.indexOf( languageKey ) === -1;
			} );
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-all-entered-languages {
	padding-bottom: $padding-vertical-wide;
	padding-top: $padding-vertical-wide;
}
</style>
