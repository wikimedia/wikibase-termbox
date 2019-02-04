<template>
	<div>
		<Fingerprint v-for="language in secondaryLanguages" :languageCode="language" :key="language"/>
		<AllEnteredLanguagesExpandable/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Fingerprint from '@/components/Fingerprint.vue';
import { mapState } from 'vuex';
import { NS_USER } from '@/store/namespaces';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';

@Component( {
	components: { AllEnteredLanguagesExpandable, Fingerprint },
	computed: {
		...mapState( NS_USER, [ 'secondaryLanguages' ] ),
	},
} )
export default class InMoreLanguages extends Vue {

}
</script>

<style lang="scss"></style>
