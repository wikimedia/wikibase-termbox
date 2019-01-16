<template>
	<span :lang="userLanguage.code" :dir="userLanguage.directionality">{{ languageName }}</span>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import {
	mapState,
	mapGetters,
} from 'vuex';
import {
	NS_LANGUAGE,
	NS_USER,
} from '@/store/namespaces';
import Component from 'vue-class-component';
import Language from '@/datamodel/Language';

interface LanguageNameInUserLanguageBindings extends Vue {
	userLanguageCode: string;
	language: Language;

	getLanguageTranslation( language: string, inLanguage: string ): string;
	getLanguageByCode( languageCode: string ): Language;
}

@Component( {
	props: {
		language: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapState( NS_USER, {
			userLanguageCode: 'primaryLanguage',
		} ),
		...mapGetters( NS_LANGUAGE, {
			getLanguageTranslation: 'getTranslationByCode',
			getLanguageByCode: 'getByCode',
		} ),
	},
} )
export default class LanguageNameInUserLanguage extends ( Vue as VueConstructor<LanguageNameInUserLanguageBindings> ) {
	get userLanguage(): Language {
		return this.getLanguageByCode( this.userLanguageCode );
	}

	get languageName(): string {
		const name = this.getLanguageTranslation( this.language.code, this.userLanguageCode );
		if ( name === null ) {
			return '????';
		} else {
			return name;
		}
	}
}
</script>


<style lang="scss">
</style>
