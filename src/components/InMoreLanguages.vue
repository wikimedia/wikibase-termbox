<template>
	<div class="wb-ui-in-more-languages">
		<Fingerprint v-for="language in topSecondaryLanguages" :languageCode="language" :key="language"/>
		<AllEnteredLanguagesExpandable/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Fingerprint from '@/components/Fingerprint.vue';
import { namespace } from 'vuex-class';
import { NS_USER } from '@/store/namespaces';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';

@Component( {
	components: { AllEnteredLanguagesExpandable, Fingerprint },
} )
export default class InMoreLanguages extends Vue {
	@namespace( NS_USER ).Getter( 'topSecondaryLanguages' )
	public topSecondaryLanguages!: string[];

}
</script>

<style lang="scss"></style>
