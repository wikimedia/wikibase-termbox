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
			[ { entity: 'Q2', language: 'de' } ],
			[ { entity: 'P1', language: 'en' } ],
			[ { entity: 'Q45121097', language: 'ru' } ],
			[ { entity: 'P999', language: 'zh' } ],
			[ { entity: 'Q4711', language: 'crh-Cyrl' } ],
			[ { entity: 'P8888', language: 'zh-hans-sg' } ],
			[ { entity: 'P999', language: 'zh', strayvalue: 'ignored' } ],
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
