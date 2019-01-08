<template>
	<Sectionedit>
		<div class="wikibase-termbox__edit-action">
			<a :href="href" :title="message( MESSAGE_KEYS.EDIT )">
				<span class="wikibase-termbox__edit-action-text">{{ message( MESSAGE_KEYS.EDIT ) }}</span>
			</a>
		</div>
	</Sectionedit>
</template>

<script lang="ts">
import Sectionedit from './Sectionedit.vue';
import { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import Messages, { MessagesMixin } from './mixins/Messages';

@Component( {
	components: {
		Sectionedit,
	},
	props: {
		href: String,
	},
} )
export default class EditPen extends ( mixins( Messages ) as VueConstructor<MessagesMixin> ) {}
</script>

<style lang="scss">
.wikibase-termbox { // for use as a prefix
	&__edit-action a {
		background: $svg-pen 50% 50% no-repeat;
		width: 48px;
		height: 48px;
		display: block;

		[dir='rtl'] & {
			transform: scaleX(-1);
		}
	}

	&__edit-action-text {
		@include sr-only();
	}
}
</style>
