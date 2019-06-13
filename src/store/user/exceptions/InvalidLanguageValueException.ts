import ParameterException from '@/common/exceptions/ParameterException';

export default class InvalidLanguageValueException extends ParameterException {
	public constructor( message?: string ) {
		super( message );
	}
}
