# wikibase-termbox
User interface for managing terms in Wikibase.

This file can be considered a quick setup guide.
To dive into the development documentation please refer to the [docs folder](./docs).

In a nutshell, this project provides the following functionalities:

1. when run as server ("SSR") provides an HTTP API that is consumed by Wikibase [TermboxRemoteRenderer](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/Wikibase/+/master/view/src/Termbox/Renderer/TermboxRemoteRenderer.php) to shows the HTML result on Wikibase entity pages
2. contains a `dist/` folder with auto-generated JavaScript and CSS files, that are consumed by a MediaWiki component called [ResourceLoader](https://www.mediawiki.org/wiki/ResourceLoader), to be used in the frontend on Wikibase entity pages. The configuration for this can be seen in [resources.php](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/Wikibase/+/master/view/resources.php).
3. contains the tools to facilitate development of the termbox application and components used inside of it

## How this connects to Wikibase
This code can be found as a git submodule of Wikibase at the following relative path: `extensions/Wikibase/view/lib/wikibase-termbox/`

The commit of this submodule on Wikibase master may not be the latest development version of this code so to get the latest development version you may need to run:
```sh
git checkout master
```

Since the Wikidata runs a weekly snapshot of Wikibase master we can be explicit about which version of termbox we run by changing the commit of the submodule rather than always having to use master of termbox.

### JavaScript in MediaWiki

Wikibase is an extension to MediaWiki and as such uses [its JavaScript delivery mechanism](https://www.mediawiki.org/wiki/ResourceLoader). In order to reduce the amount of bytes transferred to users, libraries used in multiple sub-products, like vue in termbox, are [externalized](https://cli.vuejs.org/guide/build-targets.html#library) on build and [shipped through MediaWiki](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/Wikibase/+/26fe53d/view/resources.php#893). For this to work successfully, it is important that the same version of the libraries are used. As a consequence, some libraries are pinned to specific versions in dependency management (see `package.json`). Their update must be coordinated with the update of the library in MediaWiki.

## Installation

### Configuring

As this project only comes to full fruition in integration with wikibase some configuration is required to make them collaborate.
Set the user-specific environment variables: `cp .env.example .env` and modify `.env` according to your setup.

These environment variables can be distinguished in two groups - some are relevant configuring how the SSR service works ("production level"), some add to this for the development context ("development level"). **Set all of them**. Reasonable defaults are in place where it is possible but this needs your attention to get a working setup.

* **Production level** environment variables
  * `SSR_PORT` is the port at which the node server performing server-side vue rendering can be reached (by mediawiki to render entity pages, or your browser to try it in isolation)
  * `WIKIBASE_REPO` is the wikibase installation used as information authority (e.g. to load entity information), including the path (where both `index.php` and `api.php` are located)
  * `WIKIBASE_REPO_HOSTNAME_ALIAS` is used to replace the hostname in WIKIBASE_REPO. Added to help with deployment in the WMF cluster. It must be set but in can be the same as the WIKIBASE_REPO hostname. In most cases setting them to be the same is what non-WMF installs will desire.
  * `MEDIAWIKI_REQUEST_TIMEOUT` is the duration ( in milliseconds ) after which the ssr-server terminates any request to mediawiki in any case. This parameter is optional and will be set by default to 3000.
  * `MESSAGES_CACHE_MAX_AGE` is the maximum age of entries in the messages cache in ms. This parameter is set to 1 minute by default. Setting this to a negative value will effectively disable this cache.
  * `LANGUAGES_CACHE_MAX_AGE` is the maximum age of entries in the languages cache in milliseconds. This parameter is set to 5 minutes by default. Setting this to a negative value will effectively disable this cache.
  * `HEALTHCHECK_QUERY` is the query string for the OpenAPI `x-amples` healthcheck. Note that the revision and entity id must refer to an existing entity revision on the corresponding Wikibase installation. If this is not set, no healthchecks will be performed, i.e. `x-monitor` will be set to false in the OpenAPI spec.

* **Development level** environment variables
  * `MEDIAWIKI_NETWORK_TO_JOIN` is the (local docker) network of **your mediawiki development setup**. The SSR service will attach itself to it in order to make it available to wikibase and vice-versa.

    Recommendation is to use termbox in conjunction with [addshore/mediawiki-docker-dev](https://github.com/addshore/mediawiki-docker-dev/).

    Check via `docker network ls` for the name, [by default](https://docs.docker.com/compose/networking/) it is derived from your mediawiki development project, e.g. `mediawiki-docker-dev_dps`.

    The SSR service can be reached inside of this network at http://node-ssr:<SSR_PORT from your .env file> to get HTML, in turn the SSR services calls <WIKIBASE_REPO> to [get essential information](./src/server/data-access).

  * `CSR_PORT` is the port at which you can reach the development server on your machine to live-preview changes to the termbox application. This allows development outside of MediaWiki, using a simulated environment as configured in `src/dev-entry.ts`.
  * `STORYBOOK_PORT` is the port at which you can reach the storybook server on your machine to live-preview changes in the component library
  * `NODE_ENV` is the environment to set for node.js

### Building Docker image

```sh
# ensure the node user uses your user id, so you own generated files
docker-compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) node

# install npm dependencies
docker-compose run --rm node npm install
```

### Configuring Wikibase
In order to have this termbox displayed in Wikibase entity pages Wikibase need to be configured.
For details see: [options.md](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/Wikibase/+/92be486/docs/topics/options.md#Termbox-SSR)

For development in particular set the following in your LocalSettings.php

```php
$wgWBRepoSettings['termboxEnabled'] = true;
$wgWBRepoSettings['termboxUserSpecificSsrEnabled'] = true;
$wgWBRepoSettings['ssrServerUrl'] = 'http://node-ssr:3030/termbox';
```

Right now the new termbox is also only visible with the MinervaNeue skin enabled which requires MobileFrontend. Hence you may need to clone and enable these in LocalSettings.php e.g.:


```php
wfLoadExtension( 'MobileFrontend' );
wfLoadSkin( 'MinervaNeue' );
```

Wikibase Termbox will only work if you have installed the [Universal Language Selector package](https://gerrit.wikimedia.org/r/admin/repos/mediawiki/extensions/UniversalLanguageSelector). Download to the `/extensions` folder and enable it as well in LocalSettings.php

```php
wfLoadExtension( 'UniversalLanguageSelector' );
```


## Building
* `docker-compose run --rm node npm run build` builds the frontend code
* `docker-compose run --rm node npm run build-server` builds the server-side manifest and the node entry point

## Starting it up
* `docker-compose up` starts three development servers
  1. an SSR server (HTTP endpoint to be hooked up to your wikibase), reachable at http://localhost:<SSR_PORT from your .env file>
  2. a server for the frontend part in development mode (akin to the `dist/` folder working on a dummy entity), reachable at http://localhost:<CSR_PORT from your .env file>
  3. a [storybook](docs/storybook.md) server for component development, reachable at http://localhost:<STORYBOOK_PORT from your .env file>
  > 🗯 These more or less mirror the individual project functionalities

## Development

### Run all code quality tools
* `docker-compose run --rm node npm test`

### Run code quality tools individually
* `docker-compose run --rm node npm run test:unit` runs all tests
* `docker-compose run --rm node npm run test:lint` for linting, `docker-compose run --rm node npm run fix` for fixing auto-fixable lint errors

## Blubber build

This project can be build with [blubber](https://wikitech.wikimedia.org/wiki/Blubber), configuration is located in the `.pipeline` directory.

Instructions above will gradually be migrated to use blubber.

### Running tests
```sh
blubber .pipeline/blubber.yaml test > Dockerfile
docker build -t wmde/wikibase-termbox-test .
docker run --rm wmde/wikibase-termbox-test
```

To read more about tests, and the intricacies of browser tests in particular, see [`docs/tests.md`](./docs/tests.md)

### Vue CLI

If you have worked with vue before you may be familiar with [vue cli](https://cli.vuejs.org/guide/). Given at time of writing our development workflows are all rather shell-centered we opted against adding its weight as a dependency but you can fire it up dynamically by invoking

```sh
docker-compose run --rm -p 8000:8000 node npx @vue/cli ui --port 8000 --host 0.0.0.0
```

Amongst others it provides a neat [(webpack) analysis of the build artifacts](http://localhost:8000/tasks/%2Fapp:build).

### Running for production

E.g. with production wikidata configured as the backend (`WIKIBASE_REPO`).

#### Using a custom build

```sh
blubber .pipeline/blubber.yaml production > Dockerfile
docker build -t wmde/wikibase-termbox-production .
docker run --rm -p "3030:3030" -e WIKIBASE_REPO=https://www.wikidata.org/w -e WIKIBASE_REPO_HOSTNAME_ALIAS=www.wikidata.org -e SSR_PORT=3030 wmde/wikibase-termbox-production
```

#### Using official, automatically created images

Changes to this project that are successfully merged into the main line (master) are automatically run through a so called [service pipeline job](https://integration.wikimedia.org/ci/job/service-pipeline-test-and-publish/) which builds the production variant and publishes the resulting image under a descriptive name as a [tag in the docker registry](https://docker-registry.wikimedia.org/v2/wikimedia/wikibase-termbox/tags/list).

You can reference these tags directly when spinning up a container - the simplest conceivable way to reproduce a production setup at a given moment in time; e.g. to reproduce a reported bug. Note that in the command below, a service-runner `config.yaml` is mounted into the container to get logs and metrics printed to stdout. Otherwise the service would attempt to connect to statsd and logstash, and fail if they're not available.

```sh
docker run --rm -v $(pwd)/config.debug.yaml:/srv/service/config.yaml -p "3030:3030" -e WIKIBASE_REPO=https://www.wikidata.org/w -e WIKIBASE_REPO_HOSTNAME_ALIAS=www.wikidata.org -e SSR_PORT=3030 docker-registry.wikimedia.org/wikimedia/wikibase-termbox:2019-08-24-040743-production
```

### Asserting service health

We can use the release engineering docker image to assert if our service passes the monitoring x-amples it defines in `openapi.json`.

Assuming you are running the SSR service through docker-compose and have it exposed to your host system at port 3030, run

```sh
docker run --rm -it --network host docker-registry.wikimedia.org/service-checker 127.0.0.1 http://ssr:3030
```
This should yield: "All endpoints are healthy."

To make the most of this, make sure to set a `HEALTHCHECK_QUERY` inside your `.env` file which matches your system (i.e. mentioning an entity-revision-combination present in your database).
