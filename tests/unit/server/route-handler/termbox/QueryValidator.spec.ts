import QueryValidator from '@/server/route-handler/termbox/QueryValidator';

describe( 'QueryValidator', () => {
	describe( 'validate', () => {
		test.each( [
			[
				{
					entity: 'Q3',
					revision: 31510,
					preferredLanguages: 'de|fe|zh|tw',
					editLink: '/somewhere/Q2',
				},
				{ language: [ 'Language can\'t be blank' ] },
			],
			[
				{
					revision: 31510,
					language: 'de',
					preferredLanguages: 'de|fe|zh|tw',
					editLink: '/somewhere/Q2',
				},
				{ entity: [ 'Entity can\'t be blank' ] },
			],
			[
				{
					entity: 'Q3',
					revision: 31510,
					language: 'de',
					editLink: '/somewhere/Q2',
				},
				{ preferredLanguages: [ 'Preferred languages can\'t be blank' ] },
			],
			[
				{ // empty strings
					entity: '',
					revision: '',
					language: '',
					preferredLanguages: '',
					editLink: '',
				},
				{
					entity: [ '"" is not a valid entity id' ],
					revision: [ 'Revision is not a number' ],
					language: [ '"" is not a valid language code' ],
					preferredLanguages: [ '"" is not a valid preferred language chain' ],
				},
			],
			[
				{ // evil strings
					entity: ' ',
					revision: '  ',
					language: '      ',
					preferredLanguages: '	',
					editLink: '',
				},
				{
					entity: [ '" " is not a valid entity id' ],
					revision: [ 'Revision is not a number' ],
					language: [ '"      " is not a valid language code' ],
					preferredLanguages: [ '"	" is not a valid preferred language chain' ],
				},
			],
			[
				{
					entity: [ 'bad', 'value' ], // off-type value
					revision: 31510,
					language: 'de',
					editLink: '/somewhere/Q2',
					preferredLanguages: 'de|en',
				},
				{
					entity: [ '"bad,value" is not a valid entity id' ],
				},
			],
			[
				{
					entity: 'Q0', // crafted entity
					revision: 31510,
					language: 'de',
					editLink: '/somewhere/Q2',
					preferredLanguages: 'de|en',
				},
				{
					entity: [ '"Q0" is not a valid entity id' ],
				},
			],
			[
				{ entity: 'Q2', language: 'de', editLink: '/somewhere/Q2', preferredLanguages: 'de|en' },
				{ revision: [ 'Revision can\'t be blank' ] },
			],
			[
				{ entity: 'Q2', revision: 'foo', language: 'de', editLink: '/somewhere/Q2', preferredLanguages: 'de|en' },
				{ revision: [ 'Revision is not a number' ] },
			],
		] )(
			'rejects invalid request #%# (%o) for known reasons (%o)',
			( query: object, reason: object ) => {
				const queryValidator = new QueryValidator();
				expect( queryValidator.validate( query ) ).toBe( false );
				expect( queryValidator.getErrors() ).toEqual( reason );
			},
		);

		test.each( [
			[ {
				entity: 'Q2',
				revision: 31510,
				language: 'de',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'de|fe|zh|tw',
			} ],
			[ {
				entity: 'P1',
				revision: 55550,
				language: 'en',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'de|fe|wtf|tw',
			} ],
			[ {
				entity: 'Q45121097',
				revision: 1,
				language: 'ru',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'de|fe-elem|zh|tw',
			} ],
			[ {
				entity: 'P999',
				revision: 4444,
				language: 'zh',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'desm-hgtr|fe|zh|tw',
			} ],
			[ {
				entity: 'Q4711',
				revision: 2,
				language: 'crh-Cyrl',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'crh-Cyrl|en',
			} ],
			[ {
				entity: 'P8888',
				revision: 31,
				language: 'zh-hans-sg',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'zh-hans-sg|foo',
			} ],
			[ {
				entity: 'P999',
				revision: 4711,
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
