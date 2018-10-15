const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'

const target = TARGET_NODE
  ? 'server'
  : 'client'

module.exports = {
  outputDir: TARGET_NODE ? 'serverDist' : 'dist',
  configureWebpack: () => ({
    entry: `./src/${target}-entry.ts`,
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    plugins: [
      TARGET_NODE
        ? new VueSSRServerPlugin()
        : new VueSSRClientPlugin()
    ],
    output: {
      libraryTarget: TARGET_NODE
        ? 'commonjs2'
        : undefined
    },
    optimization: {
      splitChunks: undefined
    }
  }),
  chainWebpack: config => {
    config.module
    .rule('vue')
    .use('vue-loader')
    .tap(options =>
      Object.assign(options, {
        optimizeSSR: false
      })
    )
  }
}
