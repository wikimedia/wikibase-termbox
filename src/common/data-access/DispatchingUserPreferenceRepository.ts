import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';

export default class DispatchingUserPreferenceRepository implements UserPreferenceRepository {

	private repoMapping: { [preference in UserPreference]: UserPreferenceRepository };

	public constructor( mapping: { [preference in UserPreference]: UserPreferenceRepository } ) {
		this.repoMapping = mapping;
	}

	setPreference( preference: UserPreference, value: any ): Promise<void> {
		return this.repoMapping[ preference ].setPreference( preference, value );
	}

	getPreference( preference: UserPreference ): Promise<any> {
		return this.repoMapping[ preference ].getPreference( preference );
	}

}
