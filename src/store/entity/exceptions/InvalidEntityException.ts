import ParameterException from '@/common/exceptions/ParameterException';

export default class InvalidEntityException extends ParameterException {
	constructor( message?: string ) {
		super( message );
	}
}
