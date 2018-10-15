# wikibase-termbox
User interface for managing terms in Wikibase

## Development
* `npm run test` runs all tests
* `npm run lint` for linting, `npm run fix` for fixing fixable lint errors

### Frontend
* `npm run serve` starts a development server for the frontend part in development mode
* `npm run build` builds the frontend code

### SSR Server
* set the server-specific environment variables: `cp src/server/.env.example src/server/.env` and modify `.env` accordingly
* `npm run build-server` builds the server-side manifest and the node entry point
    * after running this, use `node serverBuild/server.js` to start the SSR server
