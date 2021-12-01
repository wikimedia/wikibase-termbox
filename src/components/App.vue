<template>
	<section class="wikibase-entitytermsview" v-inlanguage="primaryLanguage">
		<TermBox />
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TermBox from './TermBox.vue';
import { mapState } from 'vuex';
import { NS_USER } from '@/store/namespaces';

export default defineComponent( {
	name: 'App',
	components: {
		TermBox,
	},
	computed: {
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
	},
} );
</script>

<style lang="scss">
/**
 * All components' CSS selectors are prefixed by postcss-prefixwrap. This both
 * * ensures the following reset is restricted to the inside of our application
 * * allows component styles to overcome this reset
 */
@import '~reset-css/sass/_reset';

ul,
ol { // overcome very strong selector, e.g. .content ul li
	li {
		margin: 0;
	}
}
</style>
