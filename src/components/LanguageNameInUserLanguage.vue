<template>
	<span>{{ languageName }}</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { NS_LANGUAGE, NS_USER } from '@/store/namespaces';
import Component from 'vue-class-component';
import Language from '@/datamodel/Language';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

@Component
export default class LanguageNameInUserLanguage extends Vue {
	@Prop( { required: true, type: Object } )
	public language!: Language;

	@namespace( NS_USER ).State( 'primaryLanguage' )
	public userLanguageCode!: string;

	@namespace( NS_LANGUAGE ).Getter( 'getTranslationByCode' )
	public getLanguageTranslation!: ( language: string, inLanguage: string ) => string;

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( languageCode: string ) => Language;

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

<style lang="scss"></style>
