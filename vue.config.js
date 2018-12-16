const process = require('process');

const isNotProd = process.env.NODE_ENV !== 'production';
const content = process.env.NODE_ENV === 'test' ? 'src/content/test.js' : {
  entry: 'src/content/index.js',
  filename: '/dev/null',
};

module.exports = {
  filenameHashing: false,
  // Use VSCode lint instead of eslint-loader
  // lintOnSave: false,
  productionSourceMap: isNotProd,
  pages: {
    content,
    options: 'src/options/index.js',
  },
  css: {
    extract: false,
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
      chunkFilename: 'js/[name].js',
    },
  },
  /*
  chainWebpack: (config) => {
    if (isNotProd) return;

    // don't copy `public/tests` folder which is just for testing
    config
      .plugin('copy')
      .tap((args) => {
        const arg0 = args[0][0];
        arg0.ignore.push('tests/**');
        return args;
      });
  },
  */
};
