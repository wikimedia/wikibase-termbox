<template>
	<div class="termbox">
		<div class="primary-language">{{primaryLanguageName}}</div>
	</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import { mapState, mapGetters } from 'vuex';
import { NS_USER, NS_LANGUAGE } from '@/store/namespaces';

interface TermboxBindings extends Vue {

	primaryLanguage: string;

	getLanguageTranslation( language: string, inLanguage: string ): string;
}

@Component( {
	computed: {
		...mapState( NS_USER, {
			primaryLanguage: 'primaryLanguage',
		} ),
		...mapGetters( NS_LANGUAGE, {
			getLanguageTranslation: 'getTranslationByCode',
		} ),
	},
} )
export default class TermBox extends ( Vue as VueConstructor<TermboxBindings> ) {
	get primaryLanguageName() {
		return this.getLanguageTranslation( this.primaryLanguage, this.primaryLanguage );
	}

}
</script>

<style lang="scss">
</style>
