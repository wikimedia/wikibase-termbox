<template>
	<div class="wb-ui-in-more-languages">
		<div class="wb-ui-in-more-languages__terms">
			<MonolingualFingerprintView
				v-for="language in secondaryLanguages"
				:language-code="language"
				:key="language"
			/>
		</div>
		<AllEnteredLanguagesExpandable />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import { mapState } from 'vuex';
import { NS_USER } from '@/store/namespaces';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';

export default defineComponent( {
	name: 'InMoreLanguages',
	components: { AllEnteredLanguagesExpandable, MonolingualFingerprintView },
	computed: {
		...mapState( NS_USER, [ 'secondaryLanguages' ] ),
	},
} );
</script>

<style lang="scss">
.wb-ui-in-more-languages__terms {
	padding-bottom: $padding-vertical-wide;
	padding-top: $padding-vertical-wide;
}
</style>
