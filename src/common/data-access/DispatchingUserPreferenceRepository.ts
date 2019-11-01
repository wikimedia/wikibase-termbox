import SingleUserPreferenceRepository from '@/common/data-access/SingleUserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';
import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';

type RepoMapping = {
	[ Preference in UserPreference ]: SingleUserPreferenceRepository<unknown>
};

export default class DispatchingUserPreferenceRepository implements UserPreferenceRepository {

	private repoMapping: RepoMapping;

	public constructor( mapping: RepoMapping ) {
		this.repoMapping = mapping;
	}

	public setPreference( preference: UserPreference, value: unknown ): Promise<void> {
		return this.repoMapping[ preference ].setPreference( value );
	}

	public getPreference( preference: UserPreference ): Promise<unknown> {
		return this.repoMapping[ preference ].getPreference();
	}

}
