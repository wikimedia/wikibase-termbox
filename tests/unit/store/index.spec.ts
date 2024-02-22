import { createStore } from '@/store';
import mockTempUserConfigService from '../mockTempUserConfigService';

describe( 'store/index', () => {
	it( 'creates the store', () => {
		const store = createStore( mockTempUserConfigService as any );
		expect( store.state.editMode ).toBeFalsy();
	} );

	it( 'injects the services', () => {
		createStore( mockTempUserConfigService as any );
		expect( mockTempUserConfigService.get ).toHaveBeenCalledWith( 'entityEditabilityResolver' );
		expect( mockTempUserConfigService.get ).toHaveBeenCalledWith( 'entityRepository' );
		expect( mockTempUserConfigService.get ).toHaveBeenCalledWith( 'languageRepository' );
		expect( mockTempUserConfigService.get ).toHaveBeenCalledWith( 'languageTranslationRepository' );
		expect( mockTempUserConfigService.get ).toHaveBeenCalledWith( 'messagesRepository' );
		expect( mockTempUserConfigService.get ).toHaveBeenCalledWith( 'writingEntityRepository' );
		expect( mockTempUserConfigService.get ).toHaveBeenCalledWith( 'userPreferenceRepository' );
	} );
} );
