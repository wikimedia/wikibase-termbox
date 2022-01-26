<template>
	<div v-if="!isServerRendered" class="wb-ui-all-entered-languages-expandable">
		<a
			:href="link"
			class="wb-ui-all-entered-languages-expandable__switch"
			:class="{ 'wb-ui-all-entered-languages-expandable__switch--expanded': isExpanded }"
			@click.prevent="toggleShowAllLanguages()"
			ref="allEnteredLanguagesSwitch"
		>
			<span>{{ message( isExpanded ? MESSAGE_KEYS.FEWER_LANGUAGES : MESSAGE_KEYS.ALL_LANGUAGES ) }}</span>
		</a>

		<AllEnteredLanguages v-if="isExpanded" />

		<a
			v-if="isExpanded"
			:href="link"
			class="wb-ui-all-entered-languages-expandable__switch wb-ui-all-entered-languages-expandable__close"
			:class="{ 'wb-ui-all-entered-languages-expandable__switch--expanded': isExpanded }"
			@click.prevent="closeAllLanguages()"
		>
			<span>{{ message( isExpanded ? MESSAGE_KEYS.FEWER_LANGUAGES : MESSAGE_KEYS.ALL_LANGUAGES ) }}</span>
		</a>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Messages from './mixins/Messages';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';

export default defineComponent( {
	name: 'AllEnteredLanguagesExpandable',
	components: {
		AllEnteredLanguages,
	},
	mixins: [ Messages ],
	data() {
		return {
			isExpanded: false,
			link: '#',
			isServerRendered: true,
		};
	},
	methods: {
		toggleShowAllLanguages(): void {
			this.isExpanded = !this.isExpanded;
		},
		closeAllLanguages(): void {
			this.isExpanded = false;
			this.$nextTick( () => {
				const allEnteredLanguagesSwitch = this.$refs.allEnteredLanguagesSwitch as HTMLElement;
				allEnteredLanguagesSwitch.focus( { preventScroll: true } );
				allEnteredLanguagesSwitch.scrollIntoView( { block: 'center', behavior: 'smooth' } );
			} );
		},
	},
	mounted(): void {
		this.isServerRendered = false;
	},
} );
</script>

<style lang="scss">
.wb-ui-all-entered-languages-expandable {
	background-color: $wmui-color-base80;

	&__switch {
		@include toggle-button($svg-arrow-up-base20);
		padding-left: $content-padding-left;
	}
}
</style>
