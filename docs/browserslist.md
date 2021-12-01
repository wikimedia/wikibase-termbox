This project uses [browserslist](https://github.com/browserslist/browserslist) to share target browser configuration between different front-end tools.

The tools in turn ensure that their output, during the build time, gets optimized for these browsers. One example use case for this is the [postcss autoprefixer](https://github.com/postcss/autoprefixer/).

As we want to provide "basic functionality" for as many devices as possible, styling the (server-side rendered) content correctly is important even if no JavaScript application (client-side) is [available](https://www.mediawiki.org/wiki/Compatibility#Browser_support_matrix) on them. Therefore the CSS autoprefixer is configured (`postcss.config.js`) to support a superset of the browserslist we support generally (`package.json`, `"browserslist"`). Technologically this is solved by importing the `package.json` file in the PostCSS config and extendings its `"browserslist"`.
