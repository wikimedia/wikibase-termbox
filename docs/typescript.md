This project uses [TypeScript](https://en.wikipedia.org/wiki/TypeScript).

The fact that different parts of this project are built for different target architectures, namely browsers and node servers, is reflected in the TypeScript configuration. The different targets are organized in individual files. Notable differences are the `src/` files included and libraries available.

* `tsconfig.base.json` The base configuration that is inherited by all other configurations
* `tsconfig.server.json` The configuration used to build for the server
* `tsconfig.json` The configuration used to build for the client
    > This file should really be called `tsconfig.client.json` but this not possible until the vue-cli typescript plugin allows for the tsconfig name to be configurable
* `tsconfig.all.json` A merged configuration used for house-keeping (e.g. linting) tasks - not to build code

The configuration of the `src/` files is such that code to be executed…
* **in the client** can make use of all files but the ones in`src/server` and use all types but the ones defined in `src/types/server`
* **on the server** can make use of all files but the ones in`src/client` and use all types but the ones defined in `src/types/client`
