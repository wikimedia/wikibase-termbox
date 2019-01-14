<template>
	<div class="wikibase-termbox-subsection-switch">
		<div class="wikibase-termbox-subsection-switch__switch">
			<a :href="link" @click.prevent="showAllLanguages()">{{ message( MESSAGE_KEYS.ALL_LANGUAGES ) }}</a>
		</div>
	</div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import Messages, { MessagesMixin } from './mixins/Messages';

@Component
export default class InAllLanguagesSwitch extends ( mixins( Messages ) as VueConstructor<MessagesMixin> ) {

	public link = '#';

	public showAllLanguages() {
		console.log( 'TODO flip all-languages.' );
	}
}
</script>

<style lang="scss">
</style>
