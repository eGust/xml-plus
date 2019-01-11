const { env } = require('process');
const { exec } = require('child_process');

// some strange errors when `public` folder not existing
exec('mkdir public');

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { DefinePlugin } = require('webpack');

const event = env.npm_lifecycle_event;
const isProd = env.NODE_ENV === 'production';

const content = {
  entry: 'src/content/index.js',
  template: 'src/content/index.html',
};

if (isProd) {
  content.filename = '../tmp/content.html';
}

const index = {
  entry: 'src/website/index.js',
  template: 'src/website/index.html',
};

const options = {
  entry: 'src/website/index.js',
  template: 'src/website/options.html',
};

const pages = (() => {
  switch (event) {
    case 'web':
    case 'website':
      return { index };
    default:
      return { content, options };
  }
})();

const plugins = event === 'website' ? [
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp('\\.(js|css)$'),
  }),
] : [
  new DefinePlugin({
    PROXY: env.PROXY || null,
  }),
];

module.exports = {
  filenameHashing: false,
  // Use VSCode lint instead of eslint-loader
  // lintOnSave: false,
  productionSourceMap: !isProd,
  pages,
  css: {
    // dev can also hot-reload style changes
    extract: env.npm_lifecycle_event !== 'dev',
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
      case 'web':
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
      default: {
        const extension = {
          from: 'src/extension',
          toType: 'dir',
        };
        const xmlFiles = {
          from: 'tests/xml',
          to: 'xml',
          toType: 'dir',
        };
        config
          .plugin('copy')
          .tap(() => [
            isProd || event === 'watch' ? [extension] : [extension, xmlFiles],
          ]);
      }
    }

    config.optimization.delete('splitChunks');
    // don't copy `public/xml` folder which is just for testing
  },
};
