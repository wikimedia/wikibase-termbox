# wikibase-termbox
User interface for managing terms in Wikibase.

This file can be considered a quick setup guide.
To dive into the development documentation please refer to the [docs folder](./docs).

## Installation
```
# ensure the node user uses your user id, so you own generated files
docker-compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) node
```

```
# install npm dependencies
docker-compose run --rm node npm install
  ```

## Configuring
* set the server-specific environment variables: `cp .env.example .env` and modify `.env` accordingly
  * `SSR_PORT` is the port at which you can reach the node server performing server-side vue rendering
  * `MEDIAWIKI_NETWORK_TO_JOIN` is the (local docker) network the SSR service should also be attached to in order to make it available to wikibase and vice-versa.

    Recommendation is to use this in conjunction with [addshore/mediawiki-docker-dev](https://github.com/addshore/mediawiki-docker-dev/).

    The SSR service can be reached inside of this network at http://node-ssr:<SSR_PORT from your .env file>, in turn the SSR services retrieves some information from <WIKIBASE_REPO_API>.
    > ⚠ Some versions of `docker-compose` insist this network exists. Make sure to set this value to an existing docker network (either created by another `docker-compose` project or you manually) - check via `docker network ls`
  * `CSR_PORT` is the port at which you can reach the development server
  * `NODE_ENV` is the environment to set for node.js
  * `WIKIBASE_REPO_API` is the wikibase installation used as information authority (e.g. to load entity information)

## Building
* `docker-compose run --rm node npm run build` builds the frontend code
* `docker-compose run --rm node npm run build-server` builds the server-side manifest and the node entry point

## Starting the server
* `docker-compose up` starts two servers
  * the SSR server at http://localhost:<SSR_PORT from your .env file>
  * a development server for the frontend part in development mode reachable at http://localhost:<CSR_PORT from your .env file>

## Development
* `docker-compose run --rm node npm run test` runs all tests
* `docker-compose run --rm node npm run lint` for linting, `docker-compose run --rm node npm run fix` for fixing fixable lint errors

## Blubber build

This project can be build with [blubber](https://wikitech.wikimedia.org/wiki/Blubber), configuration is located in the `.pipeline` directory.

Instructions above will gradually be migrated to use blubber.

Beware, for the time being, blubber generated Dockerfiles conflict with the hand-crafted, earlier version.

Running tests
```
blubber .pipeline/blubber.yaml test > Dockerfile
docker build -t wmde/wikibase-termbox-test .
docker run --rm wmde/wikibase-termbox-test
```
