<template>
	<div class="wb-ui-message-banner">
		<div class="wb-ui-message-banner__content">
			<h4>
				<slot name="heading" />
			</h4>
			<div class="wb-ui-message-banner__message">
				<slot name="message" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'MessageBanner',
	data() {
		return { bannerHeight: 0 };
	},
	mounted(): void {
		this.bannerHeight = this.$el.scrollHeight;
		const currentPadding = parseInt( window.getComputedStyle( document.body ).getPropertyValue( 'padding-top' ) );
		document.body.style.paddingTop = `${currentPadding + this.bannerHeight}px`;
		window.scrollBy( 0, this.bannerHeight );
	},
	beforeUnmount(): void {
		const currentPadding = parseInt( window.getComputedStyle( document.body ).getPropertyValue( 'padding-top' ) );
		document.body.style.paddingTop = `${currentPadding - this.bannerHeight}px`;
		window.scrollBy( 0, -this.bannerHeight );
	},
} );
</script>

<style lang="scss">
.wb-ui-message-banner {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	z-index: 1;
	font-family: $font-family-sans;
	box-shadow: 0 2px 2px 0 rgba( 0, 0, 0, 0.25 );
	border-bottom: 1px solid $wmui-color-base50;

	h4 {
		text-align: center;
		font-weight: bold;
		margin-top: 10px;
	}

	&__content {
		width: 90%;
		max-width: 50em;
		margin: 0 auto 16px;
	}
}
</style>
