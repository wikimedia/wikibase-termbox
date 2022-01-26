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
import { defineComponent } from 'vue';
import InMoreLanguages from '@/components/InMoreLanguages.vue';
import Messages from '@/components/mixins/Messages';

export default defineComponent( {
	name: 'InMoreLanguagesExpandable',
	components: { InMoreLanguages },
	mixins: [ Messages ],
	data() {
		return {
			isExpanded: true,
			isServerRendered: true,
		};
	},
	methods: {
		toggleShowMoreLanguages(): void {
			this.isExpanded = !this.isExpanded;
		},
	},
	mounted(): void {
		this.isServerRendered = false;
	},
} );
</script>

<style lang="scss">
.wb-ui-in-more-languages-expandable {
	background-color: $wmui-color-base90;

	&__switch {
		@include toggle-button($svg-arrow-up-base20);
		margin-top: 32px;
		padding-left: $content-padding-left;
	}
}
</style>
