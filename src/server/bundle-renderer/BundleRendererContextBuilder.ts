import BundleRendererServices from './BundleRendererServices';
import BundleRendererContext from './BundleRendererContext';
import TermboxRequest from '@/common/TermboxRequest';

export default class BundleRendererContextBuilder {
	private readonly services: BundleRendererServices;

	constructor( services: BundleRendererServices ) {
		this.services = services;
	}

	public passRequest( request: TermboxRequest ): BundleRendererContext {
		return new BundleRendererContext( this.services, request );
	}

}
