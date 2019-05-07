import Vue, { ComponentOptions } from 'vue';

export interface ConfigOptions {
	textFieldCharacterLimit: number;
}

export default function newConfigMixin( config: ConfigOptions ): ComponentOptions<Vue> {
	return {
		computed: {
			config: () => config,
		},
	};
}
