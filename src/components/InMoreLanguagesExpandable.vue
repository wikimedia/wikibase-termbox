<template>
	<div class="wikibase-termbox-in-more-languages">
		<div class="wikibase-termbox-subsection-switch">
			<a href="#" @click.prevent="toggleShowMoreLanguages()">
				{{ message( MESSAGE_KEYS.IN_MORE_LANGUAGES ) }}
			</a>
		</div>

		<InMoreLanguages v-if="isExpanded"/>
	</div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import InMoreLanguages from '@/components/InMoreLanguages.vue';
import Messages, { MessagesMixin } from '@/components/mixins/Messages';

@Component( {
	components: { InMoreLanguages },
} )
export default class InMoreLanguagesExpandable extends ( mixins( Messages ) as VueConstructor<MessagesMixin> ) {
	public isExpanded = true;

	public toggleShowMoreLanguages() {
		this.isExpanded = !this.isExpanded;
	}
}
</script>

<style lang="scss">
</style>
