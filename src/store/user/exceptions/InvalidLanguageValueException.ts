import ParameterException from '@/common/exceptions/ParameterException';

export default class InvalidLanguageValueException extends ParameterException {
	constructor( message?: string ) {
		super( message );
	}
}
