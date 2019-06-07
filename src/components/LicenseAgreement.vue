<template>
	<div class="wb-ui-license-agreement" tabindex="-1" v-focus>
		<h4 class="wb-ui-license-agreement__heading">
			<!-- TODO license header goes here -->
		</h4>
		<p class="wb-ui-license-agreement__message" v-html="config.licenseAgreementInnerHtml" />
		<div class="wb-ui-license-agreement__button-group">
			<EventEmittingButton
				type="primaryProgressive"
				:message="message( MESSAGE_KEYS.PUBLISH )"
				@click="$emit( 'save' )"
			/>
			<EventEmittingButton
				type="normal"
				:message="message( MESSAGE_KEYS.CANCEL )"
				@click="$emit( 'cancel' )"
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

export default class LicenseAgreement extends mixins( Messages ) {}
</script>

<style lang="scss">
.wb-ui-license-agreement {
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
		line-height: 1.2;
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

	&__persist {
		margin: 16px 0;
	}
}
</style>
