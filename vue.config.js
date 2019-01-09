const process = require('process');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const event = process.env.npm_lifecycle_event;
const isNotProd = process.env.NODE_ENV !== 'production';

const template = 'src/template.html';

const options = {
  entry: 'src/options/index.js',
  template,
};

const content = {
  entry: 'src/content/index.js',
  filename: '../tmp/content.html',
  template,
};

const index = {
  entry: 'src/website/index.js',
  template,
};

const pages = (() => {
  switch (event) {
    case 'dev':
      return { index, options };
    case 'dev_web':
    case 'website':
      return { index };
    default:
      return { content, options };
  }
})();

const outputDir = (() => {
  switch (event) {
    case 'dev_web':
    case 'website':
      return 'public';
    default:
      return 'extension';
  }
})();

const plugins = event === 'website' ? [
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp('\\.(js|css)$'),
  }),
] : [];

module.exports = {
  filenameHashing: false,
  outputDir,
  // Use VSCode lint instead of eslint-loader
  // lintOnSave: false,
  productionSourceMap: isNotProd,
  pages,
  css: {
    // dev can also hot-reload style changes
    extract: process.env.npm_lifecycle_event !== 'dev',
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
      chunkFilename: 'js/[name].js',
    },
    plugins,
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    switch (event) {
      case 'dev_ext':
      case 'build': {
        config
          .plugin('copy')
          .tap((args) => {
            const [params] = args;
            params.push({
              from: 'src/extension',
              toType: 'dir',
            });
            return args;
          });
        break;
      }
      case 'dev': {
        config
          .plugin('copy')
          .tap((args) => {
            const [params] = args;
            params.push({
              from: 'tests/xml',
              to: 'xml',
              toType: 'dir',
            });
            return args;
          });
        break;
      }
      case 'website': {
        config
          .plugin('copy')
          .tap(() => [[
            {
              from: 'src/extension/icons/logo-48.png',
              to: 'favicon.png',
              toType: 'file',
            },
          ]]);
        break;
      }
      default:
    }

    config.optimization.delete('splitChunks');
    // don't copy `public/xml` folder which is just for testing
  },
};
