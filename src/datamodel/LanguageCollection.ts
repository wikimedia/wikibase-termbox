import Language from './Language';

export default interface LanguageCollection {
	[code: string]: Language;
}
