import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';

type RepoMapping = {
	[ preference in UserPreference ]: UserPreferenceRepository
};

export default class DispatchingUserPreferenceRepository implements UserPreferenceRepository {

	private repoMapping: RepoMapping;

	public constructor( mapping: RepoMapping ) {
		this.repoMapping = mapping;
	}

	public setPreference( preference: UserPreference, value: any ): Promise<void> {
		return this.repoMapping[ preference ].setPreference( preference, value );
	}

	public getPreference( preference: UserPreference ): Promise<any> {
		return this.repoMapping[ preference ].getPreference( preference );
	}

}
