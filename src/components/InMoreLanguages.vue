<template>
	<div class="wb-ui-in-more-languages">
		<MonolingualFingerprintView v-for="language in secondaryLanguages" :language-code="language" :key="language" />
		<AllEnteredLanguagesExpandable />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import { namespace } from 'vuex-class';
import { NS_USER } from '@/store/namespaces';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';

@Component( {
	components: { AllEnteredLanguagesExpandable, MonolingualFingerprintView },
} )
export default class InMoreLanguages extends Vue {
	@namespace( NS_USER ).State( 'secondaryLanguages' )
	public secondaryLanguages!: string[];
}
</script>

<style lang="scss"></style>
