import QueryValidator from '@/server/route-handler/termbox/QueryValidator';

describe( 'QueryValidator', () => {
	describe( 'validate', () => {
		test.each( [
			[ { entity: 'Q3' } ], // language missing
			[ { language: 'de' } ], // entity missing
			[ { entity: '', language: '' } ], // empty strings
			[ { entity: '  ', language: '      ' } ], // evil strings
			[ { entity: [ 'off', 'type' ], language: 'de' } ], // off-type value
			[ { entity: 'randomstring', language: 'de' } ], // random entity
			[ { entity: 'Q0', language: 'de' } ], // crafted entity
		] )(
			'rejects invalid request #%# (%o)',
			( query: object ) => {
				const queryValidator = new QueryValidator();
				expect( queryValidator.validate( query ) ).toBe( false );
				expect( queryValidator.getErrors() ).not.toEqual( [] );
			},
		);

		test.each( [
			[ { entity: 'Q2', language: 'de', editLink: '/somewhere/Q2' } ],
			[ { entity: 'P1', language: 'en', editLink: '/somewhere/Q2' } ],
			[ { entity: 'Q45121097', language: 'ru', editLink: '/somewhere/Q2' } ],
			[ { entity: 'P999', language: 'zh', editLink: '/somewhere/Q2' } ],
			[ { entity: 'Q4711', language: 'crh-Cyrl', editLink: '/somewhere/Q2' } ],
			[ { entity: 'P8888', language: 'zh-hans-sg', editLink: '/somewhere/Q2' } ],
			[ { entity: 'P999', language: 'zh', strayvalue: 'ignored', editLink: '/somewhere/Q2' } ],
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
