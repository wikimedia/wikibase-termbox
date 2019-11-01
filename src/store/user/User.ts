import { UserPreference } from '@/common/UserPreference';

interface User {
	name: string | null;
	primaryLanguage: string;
	secondaryLanguages: string[];

	preferences: { [ key in UserPreference ]?: unknown };
}

export default User;
