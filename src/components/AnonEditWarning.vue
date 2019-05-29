<template>
	<div class="wb-ui-anon-edit-warning" tabindex="-1" v-focus>
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
				:href="loginLinkUrl"
				:prevent-default="false"
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
				:href="signUpLinkUrl"
				:prevent-default="false"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from '@/components/mixins/Messages';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import { namespace } from 'vuex-class';
import { NS_LINKS } from '@/store/namespaces';

@Component( {
	components: { EventEmittingButton },
} )
export default class AnonEditWarning extends mixins( Messages ) {

	@namespace( NS_LINKS ).State( 'loginLinkUrl' )
	public loginLinkUrl!: string;

	@namespace( NS_LINKS ).State( 'signUpLinkUrl' )
	public signUpLinkUrl!: string;

}
</script>

<style lang="scss">
.wb-ui-anon-edit-warning {
	$block: #{ & };
	margin: 0 8px;

	&__heading {
		text-align: center;
		font-weight: bold;
		margin-top: 10px;
	}

	&__message {
		background: $warning-message-background $svg-warning no-repeat 16px 8px;
		border: 1px solid $warning-message-border;
		padding: 8px 8px 8px 48px;
		margin: 16px -8px 0 -8px;
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

	&:focus {
		outline: 0;
		border: 0;
	}
}
</style>
