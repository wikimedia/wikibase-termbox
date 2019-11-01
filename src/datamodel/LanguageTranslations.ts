export interface StringTMap<T> { [key: string]: T }

interface LanguageTranslations extends StringTMap<StringTMap<string>> {}

export default LanguageTranslations;
