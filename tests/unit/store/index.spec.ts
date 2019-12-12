import { createStore } from '@/store';
import emptyServices from '../emptyServices';

describe( 'store/index', () => {
	it( 'creates the store', () => {
		const store = createStore( emptyServices as any );
		expect( store.state.editMode ).toBeFalsy();
	} );

	it( 'injects the services', () => {
		createStore( emptyServices as any );
		expect( emptyServices.get ).toHaveBeenCalledWith( 'entityEditabilityResolver' );
		expect( emptyServices.get ).toHaveBeenCalledWith( 'entityRepository' );
		expect( emptyServices.get ).toHaveBeenCalledWith( 'languageRepository' );
		expect( emptyServices.get ).toHaveBeenCalledWith( 'languageTranslationRepository' );
		expect( emptyServices.get ).toHaveBeenCalledWith( 'messagesRepository' );
		expect( emptyServices.get ).toHaveBeenCalledWith( 'writingEntityRepository' );
		expect( emptyServices.get ).toHaveBeenCalledWith( 'userPreferenceRepository' );
	} );
} );
