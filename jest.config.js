module.exports = {
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.all.json',
		},
	},
	moduleFileExtensions: [
		'js',
		'json',
		'jsx',
		'ts',
		'tsx',
		'vue',
	],
	modulePathIgnorePatterns: [
		// serverBuild/ contains files that are only relevant for the SSR service, but isn't used in tests.
		// The duplicated package.json in serverBuild/ also caused issues with jest's module loader:
		// jest-haste-map: @providesModule naming collision:
		//  Duplicate module name: wikibase-termbox
		//  Paths: /app/package.json collides with /app/serverBuild/package.json
		'<rootDir>/serverBuild/',
	],
	transform: {
		'^.+\\.vue$': '@vue/vue3-jest',
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
		'^.+\\.tsx?$': 'ts-jest',
		'node_modules/lodash-es/.*\\.js$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'<rootDir>/node_modules/(?!lodash-es/)',
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	setupFilesAfterEnv: [ '<rootDir>/tests/config/setup.ts' ],
	testEnvironment: '<rootDir>/tests/config/JestCustomEnvironment.js',
	testEnvironmentOptions: {
		customExportConditions: [ 'node', 'node-addons' ],
		url: 'http://localhost/',
	},
	snapshotSerializers: [
		'jest-serializer-vue',
	],
	testMatch: [
		'**/tests/(unit|edge-to-edge)/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
	],
	clearMocks: true,
};
