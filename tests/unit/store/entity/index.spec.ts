import createEntity from '@/store/entity';

describe( 'store/entity/index', () => {
	it( 'creates an entity store', () => {
		const module = createEntity();
		expect( module.state ).toEqual( {
			id: '',
			baseRevision: 0,

			labels: {},
			descriptions: {},
			aliases: {},

			isEditable: false,

			baseRevisionFingerprint: null,
		} );
	} );
} );
