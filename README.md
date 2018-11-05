# wikibase-termbox
User interface for managing terms in Wikibase

## Installation
* `docker-compose run --rm node npm install`

## Configuring
* set the server-specific environment variables: `cp .env.example .env` and modify `.env` accordingly
  * `SSR_PORT` is the port at which you can reach the node server performing server-side vue rendering
  * `MEDIAWIKI_NETWORK_TO_JOIN` is the (local docker) network the SSR service should also be attached to in order to make it available to wikibase. The SSR service can be reached inside of this network at http://node-ssr:<SSR_PORT from your .env file>. This can be used in conjunction with e.g. https://github.com/addshore/mediawiki-docker-dev/
    > ⚠ Some versions of `docker-compose` insist this network exists. Make sure to set this value to an existing docker network (either created by another `docker-compose` project or you manually) - check via `docker network ls`
  * `CSR_PORT` is the port at which you can reach the development server
  * `NODE_ENV` is the environment to set for node.js

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
