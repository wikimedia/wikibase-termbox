import { config } from '@vue/test-utils';
import focus from '@/directives/focus';
import inlanguage from '@/directives/inlanguage';

config.global.directives = {
	focus,
	inlanguage,
};

beforeEach( () => {
	expect.hasAssertions();
} );
