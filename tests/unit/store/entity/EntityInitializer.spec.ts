import EntityInitializer from '@/store/entity/EntityInitializer';
import Entity from '@/common/Entity';
import * as MockData from '@/mock-data/data/Q64_data.json';

describe( '/store/Entity/EntityStripper.ts', () => {
	it( 'throws an error when the entity has no id', () => {
		expect( () => {
			EntityInitializer.initializeEntity( '' );
		} ).toThrowError( SyntaxError );

		expect( () => {
			EntityInitializer.initializeEntity( '{}' );
		} ).toThrowError( 'Missing entityid' );

		expect( () => {
			EntityInitializer.initializeEntity( 'justATest' );
		} ).toThrowError( SyntaxError );

		expect( () => {
			EntityInitializer.initializeEntity( ( '{"type": "item"}' ) );
		} ).toThrowError( 'Missing entityid' );
	} );

	it( 'throws an error when the entity has no type', () => {
		expect( () => {
			( EntityInitializer.initializeEntity( '{"id": "Q123"}' ) );
		} ).toThrowError( 'Missing type on entiy Q123' );
	} );

	it( 'has a id', () => {
		const entity: Entity = EntityInitializer.initializeEntity( '{"id":"Q123", "type":"item" }' );
		expect( entity.id ).toMatch( 'Q123' );
	} );

	it( 'has a entity type', () => {
		const entity: Entity = EntityInitializer.initializeEntity( '{"id":"Q123", "type":"item" }' );
		expect( entity.type ).toMatch( 'item' );
	} );

	it( 'has labels', () => {
		const entity: Entity = EntityInitializer.initializeEntity( MockData.default );
		expect( entity.labels ).toStrictEqual(
			JSON.parse( /* tslint:disable-next-line:max-line-length */
			'{"en":"Berlin","ru":"\u0411\u0435\u0440\u043b\u0438\u043d","fr":"Berlin","it":"Berlino","es":"Berl\u00edn","en-gb":"Berlin","de":"Berlin","nl":"Berlijn","be-tarask":"\u0411\u044d\u0440\u043b\u0456\u043d","nan":"Berlin","pl":"Berlin","ar":"\u0628\u0631\u0644\u064a\u0646","lt":"Berlynas","fi":"Berliini","mk":"\u0411\u0435\u0440\u043b\u0438\u043d","nn":"Berlin","sv":"Berlin","da":"Berlin","af":"Berlyn","eo":"Berlino","bn":"\u09ac\u09be\u09b0\u09cd\u09b2\u09bf\u09a8","mg":"Berlin","ur":"\u0628\u0631\u0644\u0646","ab":"\u0411\u0435\u0440\u043b\u0438\u043d","ace":"Berlin","am":"\u1260\u122d\u120a\u1295","an":"Berl\u00edn","ang":"Berlin","arc":"\u0712\u072a\u0720\u071d\u0722","arz":"\u0628\u064a\u0631\u0644\u064a\u0646","ast":"Berl\u00edn","ay":"Berlin","az":"Berlin","ba":"\u0411\u0435\u0440\u043b\u0438\u043d","bar":"Berlin","be":"\u0411\u0435\u0440\u043b\u0456\u043d","bg":"\u0411\u0435\u0440\u043b\u0438\u043d","bi":"Berlin","bo":"\u0f54\u0f7a\u0f62\u0f0b\u0f63\u0f72\u0f53 \u0f0d","br":"Berlin","bs":"Berlin","bxr":"\u0411\u0435\u0440\u043b\u0438\u043d","ca":"Berl\u00edn","ckb":"\u0628\u06d5\u0631\u0644\u06cc\u0646","co":"Berlinu","cs":"Berl\u00edn","csb":"Berl\u00ebno","cu":"\u0411\u0454\u0440\u043b\u0438\u043d\u044a","cv":"\u0411\u0435\u0440\u043b\u0438\u043d","cy":"Berlin","diq":"Berlin","dsb":"Barli\u0144","ee":"Berlin","el":"\u0392\u03b5\u03c1\u03bf\u03bb\u03af\u03bd\u03bf","et":"Berliin","eu":"Berlin","ext":"Berl\u00edn","fa":"\u0628\u0631\u0644\u06cc\u0646","fo":"Berlin","frp":"B\u00e8rlin","frr":"Berlin","fur":"Berlin","fy":"Berlyn","ga":"Beirl\u00edn","gag":"Berlin","gan":"\u67cf\u6797","gd":"Berlin","gl":"Berl\u00edn","gn":"Berlin","gv":"Berleen","ha":"Berlin","haw":"Pelelina","he":"\u05d1\u05e8\u05dc\u05d9\u05df","hi":"\u092c\u0930\u094d\u0932\u093f\u0928","hif":"Berlin","hr":"Berlin","hsb":"Berlin","ht":"B\u00e8len","hu":"Berlin","hy":"\u0532\u0565\u057c\u056c\u056b\u0576","ia":"Berlin","id":"Berlin","ie":"Berlin","ilo":"Berlin","io":"Berlin","is":"Berl\u00edn","iu":"\u1431\u1550\u14d6\u14d0","ja":"\u30d9\u30eb\u30ea\u30f3","jbo":"berlin","jv":"Berlin","ka":"\u10d1\u10d4\u10e0\u10da\u10d8\u10dc\u10d8","kaa":"Berlin","kab":"Berlin","kbd":"\u0411\u0435\u0440\u043b\u0438\u043d","kk":"\u0411\u0435\u0440\u043b\u0438\u043d","kl":"Berlin","kn":"\u0cac\u0cb0\u0ccd\u0cb2\u0cbf\u0ca8\u0ccd","ko":"\ubca0\ub97c\ub9b0","koi":"\u0411\u0435\u0440\u043b\u0438\u043d","ksh":"B\u00e4lihn","ku":"Berl\u00een","kv":"\u0411\u0435\u0440\u043b\u0438\u043d","kw":"Berlin","ky":"\u0411\u0435\u0440\u043b\u0438\u043d","la":"Berolinum","lad":"Berlin","lb":"Berlin","lez":"\u0411\u0435\u0440\u043b\u0438\u043d","lg":"Berlin","li":"Berlien","lij":"Berlin","lmo":"Berlin","ln":"Berlin","ltg":"Berlins","lv":"Berl\u012bne","mhr":"\u0411\u0435\u0440\u043b\u0438\u043d","mi":"Pear\u012bni","ml":"\u0d2c\u0d46\u0d7c\u0d32\u0d3f\u0d7b","mn":"\u0411\u0435\u0440\u043b\u0438\u043d","mr":"\u092c\u0930\u094d\u0932\u093f\u0928","mrj":"\u0411\u0435\u0440\u043b\u0438\u043d","ms":"Berlin","mt":"Berlin","mwl":"Berlin","my":"\u1018\u102c\u101c\u1004\u103a\u1019\u103c\u102d\u102f\u1037","myv":"\u0411\u0435\u0440\u043b\u0438\u043d \u043e\u0448","mzn":"\u0628\u0631\u0644\u06cc\u0646","na":"Berlin","nah":"Berlin","nap":"Berlino","nds":"Berlin","nov":"Berlin","nrm":"B\u00e8rl\u00een","oc":"Berlin","os":"\u0411\u0435\u0440\u043b\u0438\u043d","pam":"Berlin","pap":"Berlin","pcd":"Berlin","pdc":"Berlin","pfl":"Balin","pih":"Berlin","pms":"Berlin","pnb":"\u0628\u0631\u0644\u0646","pnt":"\u0392\u03b5\u03c1\u03bf\u03bb\u03af\u03bd\u03bf\u03bd","ps":"\u0628\u0631\u0644\u064a\u0646","pt":"Berlim","qu":"Berlin","rm":"Berlin","rmy":"Berlin","rn":"Berlin","ro":"Berlin","rue":"\u0411\u0435\u0440\u043b\u0456\u043d","rw":"Berlin","sah":"\u0411\u0435\u0440\u043b\u0438\u043d","sc":"Berlino","scn":"Birlinu","sco":"Berlin","se":"Berlin","sh":"Berlin","si":"\u0db6\u0dbb\u0dca\u0dbd\u0dd2\u0db1\u0dba","sk":"Berl\u00edn","sl":"Berlin","so":"Baarliin","sq":"Berlin","sr":"\u0411\u0435\u0440\u043b\u0438\u043d","srn":"Berlin","stq":"Berlin","sw":"Berlin","szl":"Berlin","ta":"\u0baa\u0bc6\u0bb0\u0bcd\u0bb2\u0bbf\u0ba9\u0bcd","te":"\u0c2c\u0c46\u0c30\u0c4d\u0c32\u0c3f\u0c28\u0c4d","tet":"Berl\u00edn","tg":"\u0411\u0435\u0440\u043b\u0438\u043d","th":"\u0e40\u0e1a\u0e2d\u0e23\u0e4c\u0e25\u0e34\u0e19","tk":"Berlin","tl":"Berlin","tpi":"Berlin","tr":"Berlin","tt":"\u0411\u0435\u0440\u043b\u0438\u043d","tum":"Berlin","tw":"Berlin","ty":"Berlin","udm":"\u0411\u0435\u0440\u043b\u0438\u043d","ug":"B\u00e9rlin","uk":"\u0411\u0435\u0440\u043b\u0456\u043d","uz":"Berlin","vec":"Berlin","vep":"Berlin","vi":"Berlin","vls":"Berlyn","vo":"Berlin","war":"Berlin","wo":"Berlin","xmf":"\u10d1\u10d4\u10e0\u10da\u10d8\u10dc\u10d8","yi":"\u05d1\u05e2\u05e8\u05dc\u05d9\u05df","yo":"Berlin","zea":"Berlijn","zh":"\u67cf\u6797","zh-cn":"\u67cf\u6797","zh-hans":"\u67cf\u6797","zh-hant":"\u67cf\u6797","zu":"IBerlini","cbk-zam":"Berl\u00edn","nds-nl":"Berlien","roa-tara":"Berline","fj":"Berlin","pt-br":"Berlim","yue":"\u67cf\u6797","nb":"Berlin","zh-sg":"\u67cf\u6797","zh-my":"\u67cf\u6797","zh-hk":"\u67cf\u6797","zh-tw":"\u67cf\u6797","zh-mo":"\u67cf\u6797","new":"\u092c\u0930\u094d\u0932\u093f\u0928","ak":"Berlin","or":"\u0b2c\u0b30\u0b4d\u0b32\u0b3f\u0b28","pa":"\u0a2c\u0a30\u0a32\u0a3f\u0a28","ne":"\u092c\u0930\u094d\u0932\u093f\u0928","tokipona":"ma tomo Pelin","ce":"\u0411\u0435\u0440\u043b\u0438\u043d","kg":"Berlin (kizunga)","gsw":"Berlin","ceb":"Berlin","en-ca":"Berlin","hak":"Pak-l\u00ecm","de-at":"Berlin","sr-ec":"\u0411\u0435\u0440\u043b\u0438\u043d","sr-el":"Berlin","crh-latn":"Berlin","sgs":"Berl\u012bns","lzh":"\u67cf\u6797","rup":"Berlin","vro":"Berliin","bm":"Berlin","cdo":"B\u00e1ik-l\u00ecng","brh":"Barlin","om":"Barliin","sa":"\u092c\u0930\u094d\u0932\u093f\u0928","bcl":"Berlin","lrc":"\u0628\u0626\u0631\u0644\u06cc\u0646","sd":"\u0628\u0631\u0644\u0646\u060c \u062c\u0631\u0645\u0646\u064a","azb":"\u0628\u0631\u0644\u06cc\u0646","xal":"\u0411\u0435\u0440\u043b\u0438\u043d \u0431\u0430\u043b\u04bb\u0441\u043d","eml":"Berl\u00ee\u1e45","sm":"Perelini","ady":"\u0411\u0435\u0440\u043b\u0438\u043d","ny":"Berlin","wuu":"\u67cf\u6797","jam":"Boerlin","ti":"\u1260\u1228\u120a\u1295","ch":"Berlin","olo":"Berlin","kk-cyrl":"\u0411\u0435\u0440\u043b\u0438\u043d","gu":"\u0aac\u0ab0\u0acd\u0ab2\u0abf\u0aa8","tg-cyrl":"\u0411\u0435\u0440\u043b\u0438\u043d","st":"Berlin","xh":"I-Berlin","ff":"Berlin","mai":"\u092c\u0930\u094d\u0932\u093f\u0928","dty":"\u092c\u0930\u094d\u0932\u093f\u0928","kbp":"P\u025br\u0269l\u025b\u025b","av":"\u0411\u0435\u0440\u043b\u0438\u043d"}',
			),
		);
	} );

	it( 'returns empty dict if there are no labels', () => {
		const entity: Entity = EntityInitializer.initializeEntity( { id: 'Q123', type: 'item' } );
		expect( entity.labels ).toStrictEqual( {} );
	} );

	it( 'has descriptions', () => {
		const entity: Entity = EntityInitializer.initializeEntity( MockData.default );
		expect( entity.descriptions ).toStrictEqual(
			JSON.parse( /* tslint:disable-next-line:max-line-length */
				`{"en":"capital city of Germany","it":"capitale della Germania","es":"ciudad capital de Alemania","de":"Hauptstadt und Land der Bundesrepublik Deutschland","fr":"capitale et ville-\u00c9tat de l'Allemagne","nl":"hoofdstad en deelstaat van Duitsland","pl":"stolica Niemiec","en-gb":"capital of Germany","nb":"Tysklands hovedstad","ru":"\u0441\u0442\u043e\u043b\u0438\u0446\u0430 \u0438 \u043e\u0434\u043d\u0430 \u0438\u0437 \u0444\u0435\u0434\u0435\u0440\u0430\u043b\u044c\u043d\u044b\u0445 \u0437\u0435\u043c\u0435\u043b\u044c \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u0438","zh":"\u5fb7\u570b\u9996\u90fd","zh-hans":"\u5fb7\u56fd\u9996\u90fd","zh-hant":"\u5fb7\u570b\u9996\u90fd","zh-cn":"\u5fb7\u56fd\u9996\u90fd","zh-sg":"\u5fb7\u56fd\u9996\u90fd","zh-my":"\u5fb7\u56fd\u9996\u90fd","zh-hk":"\u5fb7\u570b\u9996\u90fd","zh-tw":"\u5fb7\u570b\u9996\u90fd","zh-mo":"\u5fb7\u570b\u9996\u90fd","ca":"capital i ciutat m\u00e9s gran d'Alemanya","sv":"huvudstad i Tyskland","hi":"\u091c\u0930\u094d\u092e\u0928\u0940 \u0915\u093e \u0930\u093e\u091c\u0927\u093e\u0928\u0940","fi":"Saksan p\u00e4\u00e4kaupunki","el":"\u03a0\u03c1\u03c9\u03c4\u03b5\u03cd\u03bf\u03c5\u03c3\u03b1 \u03ba\u03b1\u03b9 \u03b7 \u03bc\u03b5\u03b3\u03b1\u03bb\u03cd\u03c4\u03b5\u03c1\u03b7 \u03c3\u03b5 \u03ad\u03ba\u03c4\u03b1\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c0\u03bb\u03b7\u03b8\u03c5\u03c3\u03bc\u03cc \u03c0\u03cc\u03bb\u03b7 \u03c4\u03b7\u03c2 \u0393\u03b5\u03c1\u03bc\u03b1\u03bd\u03af\u03b1\u03c2","cs":"m\u011bsto v N\u011bmecku","ilo":"kapitolio a siudad ti Alemania","uz":"Olmoniya poytaxti","nds":"H\u00f6\u00f6ftstadt vun D\u00fc\u00fctschland un en Bundsland","la":"caput Germaniae","pt-br":"capital e estado da Alemanha","ta":"\u0b9a\u0bc6\u0bb0\u0bc1\u0bae\u0ba9\u0bbf\u0baf\u0bbf\u0ba9\u0bcd \u0ba4\u0bb2\u0bc8\u0ba8\u0b95\u0bb0\u0bae\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0bae\u0bbe\u0ba8\u0bbf\u0bb2\u0bae\u0bcd","ko":"\ub3c5\uc77c\uc758 \uc218\ub3c4","lv":"V\u0101cijas galvaspils\u0113ta","sk":"mesto v Nemecku","eo":"\u0109efurbo kaj federacia lando de Germanio","hr":"Glavni grad Njema\u010dke","gl":"cidade capital de Alema\u00f1a","bar":"Hauptstod vo Deitschland","tokipona":"ma tomo lawa pi ma Tosi","ja":"\u30c9\u30a4\u30c4\u306e\u9996\u90fd","pt":"cidade e capital alem\u00e3","de-at":"Hauptstadt von Deutschland","bg":"\u0441\u0442\u043e\u043b\u0438\u0446\u0430 \u043d\u0430 \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f","be-tarask":"\u0441\u0442\u0430\u043b\u0456\u0446\u0430 \u041d\u044f\u043c\u0435\u0447\u0447\u044b\u043d\u044b","sr":"\u0433\u043b\u0430\u0432\u043d\u0438 \u0433\u0440\u0430\u0434 \u041d\u0435\u043c\u0430\u0447\u043a\u0435","sr-ec":"\u0433\u043b\u0430\u0432\u043d\u0438 \u0433\u0440\u0430\u0434 \u041d\u0435\u043c\u0430\u0447\u043a\u0435","sr-el":"glavni grad Nema\u010dke","uk":"\u0441\u0442\u043e\u043b\u0438\u0446\u044f \u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u043e\u0457 \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0456\u043a\u0438 \u041d\u0456\u043c\u0435\u0447\u0447\u0438\u043d\u0430, \u043e\u043a\u0440\u0435\u043c\u0430 \u0444\u0435\u0434\u0435\u0440\u0430\u043b\u044c\u043d\u0430 \u0437\u0435\u043c\u043b\u044f","hu":"N\u00e9metorsz\u00e1g f\u0151v\u00e1rosa, egyben tartom\u00e1nya is","sco":"caipital ceety an state o Germany","ro":"capitala Germaniei","ckb":"\u067e\u0627\u06cc\u062a\u06d5\u062e\u062a\u06cc\u00a0\u0626\u06d5\u06b5\u0645\u0627\u0646\u06cc\u0627\u06cc\u06d5","ne":"\u091c\u0930\u094d\u092e\u0928\u0940\u0915\u094b \u0930\u093e\u091c\u0927\u093e\u0928\u0940 \u0930 \u0930\u093e\u091c\u094d\u092f","eu":"Alemaniako hiriburua","kn":"\u0c9c\u0cb0\u0ccd\u0cae\u0ca8\u0cbf \u0ca6\u0cc7\u0cb6\u0ca6 \u0cb0\u0cbe\u0c9c\u0ca7\u0cbe\u0ca8\u0cbf","id":"ibu kota Jerman","fa":"\u067e\u0627\u06cc\u062a\u062e\u062a \u06a9\u0634\u0648\u0631 \u0622\u0644\u0645\u0627\u0646","he":"\u05d1\u05d9\u05e8\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05d4","pa":"\u0a1c\u0a30\u0a2e\u0a28\u0a40 \u0a26\u0a40 \u0a30\u0a3e\u0a1c\u0a27\u0a3e\u0a28\u0a40","hsb":"stolica a zwjazkowy kraj N\u011bmskeje","kk-cyrl":"\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f\u043d\u044b\u04a3 \u0430\u0441\u0442\u0430\u043d\u0430\u0441\u044b \u0436\u04d9\u043d\u0435 \u0444\u0435\u0434\u0435\u0440\u0430\u043b\u0434\u044b \u0430\u0439\u043c\u0430\u049b\u0442\u0430\u0440\u044b\u043d\u044b\u04a3 \u0431\u0456\u0440\u0456","ka":"\u10d2\u10d4\u10e0\u10db\u10d0\u10dc\u10d8\u10d8\u10e1 \u10d3\u10d4\u10d3\u10d0\u10e5\u10d0\u10da\u10d0\u10e5\u10d8","xmf":"\u10d2\u10d4\u10e0\u10db\u10d0\u10dc\u10d8\u10d0\u10e8 \u10dc\u10d0\u10dc\u10d0\u10dc\u10dd\u10e6\u10d0","sw":"mji mkuu wa Ujerumani","da":"Tysklands hovedstad","th":"\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2b\u0e25\u0e27\u0e07\u0e02\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e40\u0e22\u0e2d\u0e23\u0e21\u0e31\u0e19\u0e19\u0e35","sq":"kryeqyteti  i Gjermanis\u00eb","vi":"Th\u1ee7 \u0111\u00f4 c\u1ee7a C\u1ed9ng h\u00f2a Li\u00ean bang \u0110\u1ee9c","tr":"Almanya'n\u0131n ba\u015fkenti","lb":"Haaptstad a Land vun der Bundesrepublik D\u00e4itschland","ar":"\u0639\u0627\u0635\u0645\u0629 \u062c\u0645\u0647\u0648\u0631\u064a\u0629 \u0623\u0644\u0645\u0627\u0646\u064a\u0627 \u0627\u0644\u0627\u062a\u062d\u0627\u062f\u064a\u0629","hy":"\u0533\u0565\u0580\u0574\u0561\u0576\u056b\u0561\u0575\u056b \u0574\u0561\u0575\u0580\u0561\u0584\u0561\u0572\u0561\u0584","az":"Almaniyan\u0131n paytaxt\u0131","bn":"\u099c\u09be\u09b0\u09cd\u09ae\u09be\u09a8\u09bf\u09b0 \u09b0\u09be\u099c\u09a7\u09be\u09a8\u09c0 \u09b6\u09b9\u09b0","br":"k\u00earbenn ha stad Alamagn"}`,
			),
		);
	} );

	it( 'returns empty dict if there are no descriptions', () => {
		const entity: Entity = EntityInitializer.initializeEntity( { id: 'Q123', type: 'item' } );
		expect( entity.descriptions ).toStrictEqual( {} );
	} );

	it( 'has aliases', () => {
		const entity: Entity = EntityInitializer.initializeEntity( MockData.default );
		expect( entity.aliases ).toStrictEqual(
			JSON.parse( /* tslint:disable-next-line:max-line-length */
				`{"zh":["\u67cf\u6797\u5e02"],"zh-hans":["\u67cf\u6797\u5e02"],"zh-hant":["\u67cf\u6797\u5e02"],"zh-cn":["\u67cf\u6797\u5e02"],"zh-sg":["\u67cf\u6797\u5e02"],"zh-my":["\u67cf\u6797\u5e02"],"zh-hk":["\u67cf\u6797\u5e02"],"zh-tw":["\u67cf\u6797\u5e02"],"zh-mo":["\u67cf\u6797\u5e02"],"de":["Stadt Berlin","Berlin, Deutschland","Bundeshauptstadt Berlin","Land Berlin","DE-BE"],"be":["\u0413\u043e\u0440\u0430\u0434 \u0411\u0435\u0440\u043b\u0456\u043d"],"en":["Berlin, Germany"],"ta":["\u0baa\u0bc7\u0bb0\u0bcd\u0bb2\u0bbf\u0ba9\u0bcd"],"cs":["Berlin"],"es":["Berlin"],"ksh":["Berlin"],"fa":["\u0628\u0631\u0644\u06cc\u0646\u060c \u0622\u0644\u0645\u0627\u0646"],"kk-cyrl":["\u0411\u0435\u0440\u043b\u0438\u043d, \u0413\u0414\u0420","\u0411\u0435\u0440\u043b\u0438\u043d, \u0411\u0456\u0440\u0456\u043a\u043a\u0435\u043d \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f"],"si":["\u0db6\u0dbb\u0dca\u0dbd\u0dd2\u0db1\u0dca"],"sq":["Berlini"],"vi":["B\u00e9c-lin"],"bn":["\u09ac\u09c7\u09b0\u09cd\u09b2\u09bf\u09a8"],"ar":["\u0628\u0631\u0644\u064a\u0646 \u0623\u0644\u0645\u0627\u0646\u064a\u0627","\u0648\u0644\u0627\u064a\u0629 \u0628\u0631\u0644\u064a\u0646","\u0645\u062f\u064a\u0646\u0629 \u0628\u0631\u0644\u064a\u0646","\u0639\u0627\u0635\u0645\u0629 \u0623\u0644\u0645\u0627\u0646\u064a\u0627"]}`,
			),
		);
	} );

	it( 'returns empty dict if there are no aliases', () => {
		const entity: Entity = EntityInitializer.initializeEntity( { id: 'Q123', type: 'item' } );
		expect( entity.aliases ).toStrictEqual( {} );
	} );
} );
