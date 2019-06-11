import { UserPreference } from '@/common/UserPreference';

interface UserPreferenceRepository {
	setPreference( preference: UserPreference, value: any ): Promise<void>;

	getPreference( preference: UserPreference ): Promise<any>;
}

export default UserPreferenceRepository;
