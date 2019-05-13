<template>
	<div class="wb-ui-anon-edit-warning">
		<h4 class="wb-ui-anon-edit-warning__heading">
			{{ message( MESSAGE_KEYS.EDIT_WARNING_HEADING ) }}
		</h4>
		<p class="wb-ui-anon-edit-warning__message">
			{{ message( MESSAGE_KEYS.EDIT_WARNING_MESSAGE ) }}
		</p>
		<div class="wb-ui-anon-edit-warning__button-group">
			<EventEmittingButton
				type="primaryProgressive"
				:message="message( MESSAGE_KEYS.LOGIN )"
			/>
			<EventEmittingButton
				type="normal"
				:message="message( MESSAGE_KEYS.EDIT_WARNING_DISMISS_BUTTON )"
				@click="$emit( 'dismiss' )"
			/>
		</div>
		<div class="wb-ui-anon-edit-warning__button-group">
			<EventEmittingButton
				type="framelessProgressive"
				:message="message( MESSAGE_KEYS.CREATE_ACCOUNT )"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from '@/components/mixins/Messages';
import EventEmittingButton from '@/components/EventEmittingButton.vue';

@Component( {
	components: { EventEmittingButton },
} )
export default class AnonEditWarning extends mixins( Messages ) {

}
</script>

<style lang="scss">
.wb-ui-anon-edit-warning {
	$block: #{ & };

	&__heading {
		text-align: center;
		font-weight: bold;
		margin-top: 10px;
	}

	&__message {
		background: $warning-message-background $svg-warning no-repeat 16px 8px;
		border: 1px solid $warning-message-border;
		padding: 8px 8px 8px 48px;
		margin-top: 16px;
	}

	&__button-group {
		margin-top: 8px;

		> * {
			margin-top: 8px;

			&:not( :last-child ) {
				margin-right: 16px;
			}
		}
	}
}
</style>
