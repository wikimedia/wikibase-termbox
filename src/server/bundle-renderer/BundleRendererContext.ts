import BundleRendererServices from './BundleRendererServices';
import TermboxRequest from '@/common/TermboxRequest';

export default class BundleRendererContext {
	public readonly services: BundleRendererServices;
	/**
	 * currently the app only supports TermboxRequests
	 */
	public readonly request: TermboxRequest;

	public constructor( services: BundleRendererServices, request: TermboxRequest ) {
		this.services = services;
		this.request = request;
	}

}
