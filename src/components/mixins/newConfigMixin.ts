import Vue, { ComponentOptions } from 'vue';

export interface ConfigOptions {
	textFieldCharacterLimit: number;
	licenseAgreementInnerHtml: string;
}

export default function newConfigMixin( config: ConfigOptions ): ComponentOptions<Vue> {
	return {
		computed: {
			config: () => config,
		},
	};
}
