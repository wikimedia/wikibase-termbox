<template>
	<div class="wikibase-termbox-all-entered-languages">
		<div class="wikibase-termbox-subsection-switch">
			<a :href="link" @click.prevent="toggleShowAllLanguages()">{{ message( MESSAGE_KEYS.ALL_LANGUAGES ) }}</a>
		</div>

		<AllEnteredLanguages v-if="isExpanded"/>
	</div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import Messages, { MessagesMixin } from './mixins/Messages';
import { NS_USER } from '@/store/namespaces';
import { mapState } from 'vuex';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';

@Component( {
	components: { AllEnteredLanguages },
	computed: {
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
	},
} )
export default class AllEnteredLanguagesExpandable extends ( mixins( Messages ) as VueConstructor<MessagesMixin> ) {

	public isExpanded = false;

	public link = '#';

	public toggleShowAllLanguages() {
		this.isExpanded = !this.isExpanded;
	}
}
</script>

<style lang="scss">
</style>
