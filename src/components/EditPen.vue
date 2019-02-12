<template>
	<Sectionedit>
		<div class="wb-ui-edit-pen">
			<a class="wb-ui-edit-pen__link" :href="href" :title="message( MESSAGE_KEYS.EDIT )">
				<span class="wb-ui-edit-pen__text">{{ message( MESSAGE_KEYS.EDIT ) }}</span>
			</a>
		</div>
	</Sectionedit>
</template>

<script lang="ts">
import Sectionedit from './Sectionedit.vue';
import Component, { mixins } from 'vue-class-component';
import Messages from './mixins/Messages';

@Component( {
	components: {
		Sectionedit,
	},
	props: {
		href: String,
	},
} )
export default class EditPen extends mixins( Messages ) {}
</script>

<style lang="scss">
.wb-ui-edit-pen {
	&__link {
		background: $svg-pen 50% 50% no-repeat;
		width: 48px;
		height: 48px;
		display: block;

		[ dir='rtl' ] & {
			transform: scaleX( -1 );
		}
	}

	&__text {
		@include sr-only();
	}
}
</style>
