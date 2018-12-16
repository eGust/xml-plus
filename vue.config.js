const process = require('process');

const isNotProd = process.env.NODE_ENV !== 'production';

const pages = {
  content: isNotProd ? 'src/content/index.js' : {
    entry: 'src/content/index.js',
    filename: '/dev/null',
  },
  options: 'src/options/index.js',
};

if (isNotProd) {
  Object.assign(pages, {
    index: 'src/dev.js',
  });
}

module.exports = {
  filenameHashing: false,
  // Use VSCode lint instead of eslint-loader
  // lintOnSave: false,
  productionSourceMap: isNotProd,
  pages,
  css: {
    extract: true,
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
      chunkFilename: 'js/[name].js',
    },
  },
  chainWebpack: (config) => {
    if (isNotProd) return;

    config.optimization.delete('splitChunks');
    // don't copy `public/xml` folder which is just for testing
    config
      .plugin('copy')
      .tap((args) => {
        const arg0 = args[0][0];
        arg0.ignore.push('xml/**');
        return args;
      });
  },
};
