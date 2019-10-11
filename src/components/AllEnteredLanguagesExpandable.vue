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
			class="wb-ui-all-entered-languages-expandable__switch"
			:class="{ 'wb-ui-all-entered-languages-expandable__switch--expanded': isExpanded }"
			@click.prevent="closeAllLanguages()"
			ref="allEnteredLanguagesClose"
		>
			<span>{{ message( isExpanded ? MESSAGE_KEYS.FEWER_LANGUAGES : MESSAGE_KEYS.ALL_LANGUAGES ) }}</span>
		</a>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from './mixins/Messages';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';

@Component( {
	components: { AllEnteredLanguages },
} )
export default class AllEnteredLanguagesExpandable extends mixins( Messages ) {
	$refs!: {
		allEnteredLanguagesSwitch: HTMLElement,
		allEnteredLanguagesClose: HTMLElement
	}

	public isExpanded = false;

	public link = '#';

	public isServerRendered = true;

	public toggleShowAllLanguages() {
		this.isExpanded = !this.isExpanded;
	}

	public closeAllLanguages() {
		this.isExpanded = false;
		this.$nextTick( () => {
			this.$refs.allEnteredLanguagesSwitch.focus( { preventScroll: true } );
			this.$refs.allEnteredLanguagesSwitch.scrollIntoView( { block: 'center', behavior: 'smooth' } );
		} );
	}

	public beforeMount() {
		this.isServerRendered = false;
	}
}
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
