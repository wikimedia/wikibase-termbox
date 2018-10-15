# wikibase-termbox
User interface for managing terms in Wikibase

## Installation
* `docker-compose run --rm node npm install`

## Configuring
* set the server-specific environment variables: `cp .env.example .env` and modify `.env` accordingly

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
