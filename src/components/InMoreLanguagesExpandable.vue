<template>
	<div class="wb-ui-in-more-languages-expandable">
		<a
			class="wb-ui-in-more-languages-expandable__switch"
			:class="{
				'wb-ui-in-more-languages-expandable__switch--expanded': isExpanded,
				'wb-ui-in-more-languages-expandable__switch--unclickable': isServerRendered,
			}"
			@click.prevent="toggleShowMoreLanguages()"
			href="#"
		>
			<span>{{ message( MESSAGE_KEYS.IN_MORE_LANGUAGES ) }}</span>
		</a>

		<InMoreLanguages v-if="isExpanded" />
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import InMoreLanguages from '@/components/InMoreLanguages.vue';
import Messages from '@/components/mixins/Messages';

@Component( {
	components: { InMoreLanguages },
} )
export default class InMoreLanguagesExpandable extends mixins( Messages ) {
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
.wb-ui-in-more-languages-expandable {
	&__switch {
		@include toggle-button($svg-in-more-languages);
		margin-top: 32px;
	}
}
</style>
