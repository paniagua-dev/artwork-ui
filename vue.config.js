const chunkPrefix = require('./package.json').name

module.exports = {
  lintOnSave: false,
  css: {
    extract: {
      filename: `${chunkPrefix}.core.css`,
      chunkFilename: `${chunkPrefix}.css`,
    },
  },
  configureWebpack: {
    output: {
      filename: `${chunkPrefix}.core.js`,
      chunkFilename: `${chunkPrefix}.js`,
    }
  },
};
