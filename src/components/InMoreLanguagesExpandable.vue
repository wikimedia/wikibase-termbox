<template>
	<div class="wikibase-termbox-in-more-languages">
		<a
			class="wikibase-termbox-subsection-switch"
			:class="{
				'wikibase-termbox-subsection-switch--expanded': isExpanded,
				'wikibase-termbox-subsection-switch--unclickable': isServerRendered,
			}"
			@click.prevent="toggleShowMoreLanguages()"
			href="#"
		>
			<span>{{ message( MESSAGE_KEYS.IN_MORE_LANGUAGES ) }}</span>
		</a>

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

	public isServerRendered = true;

	public toggleShowMoreLanguages() {
		this.isExpanded = !this.isExpanded;
	}

	public beforeMount() {
		this.isServerRendered = false;
	}
}
</script>

<style lang="scss">
.wikibase-termbox-in-more-languages {
	.wikibase-termbox & > .wikibase-termbox-subsection-switch {
		@include toggle-button($svg-in-more-languages);
		margin-top: 32px;
	}
}
</style>
