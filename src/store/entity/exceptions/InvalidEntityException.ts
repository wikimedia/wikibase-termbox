import ParameterException from '@/common/exceptions/ParameterException';

export default class InvalidEntityException extends ParameterException {
	public constructor( message?: string ) {
		super( message );
	}
}
