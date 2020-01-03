import { UserPreference } from '@/common/UserPreference';

interface UserPreferenceRepository {
	setPreference( preference: UserPreference, value: unknown ): Promise<void>;

	getPreference( preference: UserPreference ): Promise<unknown>;
}

export default UserPreferenceRepository;
