import { UserPreference } from '@/common/UserPreference';

interface UserPreferenceRepository {

	getPreference( name: UserPreference ): Promise<any>;

	setPreference( name: UserPreference, value: any ): Promise<void>;

}

export default UserPreferenceRepository;
