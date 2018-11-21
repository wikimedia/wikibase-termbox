<template>
	<div class="termbox">
		<div class="primary-language">{{primaryLanguageName}}</div>
	</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import { factory } from '@/common/TermboxFactory';
import { mapState } from 'vuex';
import { NS_USER } from '@/store/namespaces';

interface TermboxBindings extends Vue {

	primaryLanguage: string;

}

@Component( {
	computed: mapState( NS_USER, {
		primaryLanguage: 'primaryLanguage',
	} ),
} )
export default class TermBox extends ( Vue as VueConstructor<TermboxBindings> ) {
	public primaryLanguageName = '';

	public created() {
		factory.getLanguageRepository()
			.getLanguageName( this.primaryLanguage, this.primaryLanguage )
			.then( ( languageName ) => {
				this.primaryLanguageName = languageName;
			} );
	}

}
</script>

<style lang="scss">
</style>
