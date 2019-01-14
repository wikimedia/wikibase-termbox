This project constitutes an application written in [typescript](./typescript.md) that is compiled for different target architectures, client (the users' browsers) and server (a server-side service).

While using different data sources in client and server code is the norm, we generally strive for feature parity. There are a few known differences (for various reasons) however - this is list which tries to collect them.

* (HTML) **language directionality** is [read from a JS API](../src/client/data-access/UlsLanguageRepository.ts) provided by mediawiki in client-side code, yet [determined using a library](../src/server/data-access/ContentLanguagesLanguageRepo.ts) in the server side
* **editability status** is [read from a config entry](../src/client-entry.ts) provided by mediawiki in client-side code, yet [hard coded true](../src/src/server-entry.ts) in the server side and enforced through [propriatary mark-up](../src/components/Sectionedit.vue) possible through use of wikibase as a middleware when delivering the SSR result to the clients.

