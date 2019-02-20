import validate from 'validate.js';

const languagePattern = '[a-z]{2}[a-z-]*';

export default class QueryValidator {
	private errors = [];

	private CONSTRAINTS = {
		language: {
			presence: true,
			format: {
				pattern: new RegExp( `^${languagePattern}$`, 'i' ),
				message: ( value: any ) => {
					return validate.format( '^"%{value}" is not a valid language code', {
						value,
					} );
				},
			},
		},
		entity: {
			presence: true,
			format: {
				pattern: /^(Q|P)[1-9]\d{0,9}$/,
				message: ( value: any ) => {
					return validate.format( '^"%{value}" is not a valid entity id', {
						value,
					} );
				},
			},
		},
		revision: {
			presence: true,
			numericality: {
				onlyInteger: true,
				greaterThan: 0,
			},
		},
		preferredLanguages: {
			presence: true,
			format: {
				pattern: new RegExp( `^${languagePattern}(\\|${languagePattern})*$`, 'i' ),
				message: ( value: any ) => {
					return validate.format( '^"%{value}" is not a valid preferred language chain', {
						value,
					} );
				},
			},
		},
		editLink: {
			presence: true,
		},
	};

	public getErrors(): object[] {
		return this.errors;
	}

	public validate( query: object ): boolean {
		const result = validate.validate( query, this.CONSTRAINTS );

		if ( result === undefined ) {
			this.errors = [];
			return true;
		}

		this.errors = result;
		return false;
	}
}
