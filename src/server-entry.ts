import buildApp from '@/common/buildApp';
import { instance } from './common/TermboxFactory';
import WikibaseApiLanguageRepository from './server/data-access/WikibaseApiLanguageRepository';

instance.setLanguageRepository( new WikibaseApiLanguageRepository() );

export default buildApp;
