import SingleUserPreferenceRepository from '@/common/data-access/SingleUserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';
import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';

type RepoMapping = {
	[ Preference in UserPreference ]: SingleUserPreferenceRepository<any>
};

export default class DispatchingUserPreferenceRepository implements UserPreferenceRepository {

	private repoMapping: RepoMapping;

	public constructor( mapping: RepoMapping ) {
		this.repoMapping = mapping;
	}

	public setPreference( preference: UserPreference, value: any ): Promise<void> {
		return this.repoMapping[ preference ].setPreference( value );
	}

	public getPreference( preference: UserPreference ): Promise<any> {
		return this.repoMapping[ preference ].getPreference();
	}

}
