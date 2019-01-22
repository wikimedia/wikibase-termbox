import QueryValidator from '@/server/route-handler/termbox/QueryValidator';

describe( 'QueryValidator', () => {
	describe( 'validate', () => {
		test.each( [
			[ { entity: 'Q3', preferredLanguages: 'de|fe|zh|tw' } ], // language missing
			[ { language: 'de', preferredLanguages: 'de|fe|zh|tw' } ], // entity missing
			[ { entity: 'Q1', language: 'de' } ], // preferredLanguages missing
			[ { entity: '', language: '', preferredLanguages: '' } ], // empty strings
			[ { entity: '  ', language: '      ', preferredLanguages: '	' } ], // evil strings
			[ { entity: [ 'off', 'type' ], language: 'de', preferredLanguages: 'de|fe|zh|tw' } ], // off-type value
			[ { entity: 'randomstring', language: 'de', preferredLanguages: 'de|fe|zh|tw' } ], // random entity
			[ { entity: 'Q0', language: 'de', preferredLanguages: 'de|fe|zh|tw' } ], // crafted entity
		] )(
			'rejects invalid request #%# (%o)',
			( query: object ) => {
				const queryValidator = new QueryValidator();
				expect( queryValidator.validate( query ) ).toBe( false );
				expect( queryValidator.getErrors() ).not.toEqual( [] );
			},
		);

		test.each( [
			[ { entity: 'Q2', language: 'de', editLink: '/somewhere/Q2', preferredLanguages: 'de|fe|zh|tw' } ],
			[ { entity: 'P1', language: 'en', editLink: '/somewhere/Q2', preferredLanguages: 'de|fe|wtf|tw' } ],
			[ { entity: 'Q45121097', language: 'ru', editLink: '/somewhere/Q2', preferredLanguages: 'de|fe-elem|zh|tw' } ],
			[ { entity: 'P999', language: 'zh', editLink: '/somewhere/Q2', preferredLanguages: 'desm-hgtr|fe|zh|tw' } ],
			[ { entity: 'Q4711', language: 'crh-Cyrl', editLink: '/somewhere/Q2', preferredLanguages: 'crh-Cyrl|en' } ],
			[ { entity: 'P8888', language: 'zh-hans-sg', editLink: '/somewhere/Q2', preferredLanguages: 'zh-hans-sg|foo' } ],
			[ {
				entity: 'P999',
				language: 'zh',
				strayvalue: 'ignored',
				editLink: '/somewhere/Q2' ,
				preferredLanguages: 'de|fe|zh|tw',
			} ],
		] )(
			'accepts valid request #%# (%o)',
			( query: object ) => {
				const queryValidator = new QueryValidator();
				expect( queryValidator.validate( query ) ).toBe( true );
				expect( queryValidator.getErrors() ).toEqual( [] );
			},
		);
	} );
} );
