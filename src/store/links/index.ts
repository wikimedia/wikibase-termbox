import { Module } from 'vuex';
import LinksState from '@/store/links/LinksState';
import { mutations } from '@/store/links/mutations';
import { actions } from '@/store/links/actions';

export default function (): Module<LinksState, any> {
	const state: LinksState = {
		editLinkUrl: '',
		loginLinkUrl: '',
		signUpLinkUrl: '',
	};

	return {
		namespaced: true,
		state,
		mutations,
		actions,
	};
}
