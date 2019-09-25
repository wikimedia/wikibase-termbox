import { createStore } from '@/store';
import emptyServices from '../emptyServices';

describe( 'store/index', () => {
	it( 'creates the store', () => {
		const store = createStore( emptyServices as any );
		expect( store.state.editMode ).toBeFalsy();
	} );

	it( 'injects the services', () => {
		createStore( emptyServices as any );
		expect( emptyServices.getEntityEditabilityResolver ).toHaveBeenCalledTimes( 1 );
		expect( emptyServices.getEntityRepository ).toHaveBeenCalledTimes( 1 );
		expect( emptyServices.getLanguageRepository ).toHaveBeenCalledTimes( 1 );
		expect( emptyServices.getLanguageTranslationRepository ).toHaveBeenCalledTimes( 1 );
		expect( emptyServices.getMessagesRepository ).toHaveBeenCalledTimes( 1 );
		expect( emptyServices.getWritingEntityRepository ).toHaveBeenCalledTimes( 1 );
		expect( emptyServices.getUserPreferenceRepository ).toHaveBeenCalledTimes( 1 );
	} );
} );
