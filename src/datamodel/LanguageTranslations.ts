export interface StringTMap<T> { [key: string]: T; }

export default interface LanguageTranslations extends StringTMap<StringTMap<string>> {}
