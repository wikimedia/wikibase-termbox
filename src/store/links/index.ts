import { Module } from 'vuex';
import LinksState from '@/store/links/LinksState';
import { mutations } from '@/store/links/mutations';
import { actions } from '@/store/links/actions';

const state: LinksState = {
	editLinkUrl: '',
};

export const links: Module<LinksState, any> = {
	namespaced: true,
	state,
	mutations,
	actions,
};
