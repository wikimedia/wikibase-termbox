const mockTempUserConfigService = {
	get: jest.fn().mockImplementation( ( name ) => {
		if ( name === 'tempUserConfig' ) {
			/* tempUserConfig is called during the user state init.
			 * For any test that creates a store, we need to have this service
			 * return a value.
			 */
			return {
				isEnabled() {
					return false;
				},
			};
		}
		return null;
	} ),
};

export default mockTempUserConfigService;
