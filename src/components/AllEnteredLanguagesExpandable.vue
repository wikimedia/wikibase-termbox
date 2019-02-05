<template>
	<div class="wikibase-termbox-all-entered-languages" v-if="!isServerRendered">
		<a
			:href="link"
			class="wikibase-termbox-subsection-switch"
			:class="{ 'wikibase-termbox-subsection-switch--expanded': isExpanded }"
			@click.prevent="toggleShowAllLanguages()"
		>
			<span>{{ message( MESSAGE_KEYS.ALL_LANGUAGES ) }}</span>
		</a>

		<AllEnteredLanguages v-if="isExpanded"/>
	</div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import Messages, { MessagesMixin } from './mixins/Messages';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';

@Component( {
	components: { AllEnteredLanguages },
} )
export default class AllEnteredLanguagesExpandable extends ( mixins( Messages ) as VueConstructor<MessagesMixin> ) {

	public isExpanded = false;

	public link = '#';

	public isServerRendered = true;

	public toggleShowAllLanguages() {
		this.isExpanded = !this.isExpanded;
	}

	public beforeMount() {
		this.isServerRendered = false;
	}
}
</script>

<style lang="scss">
.wikibase-termbox-all-entered-languages {
	.wikibase-termbox & > .wikibase-termbox-subsection-switch {
		@include toggle-button($svg-all-entered-languages);
	}
}
</style>
