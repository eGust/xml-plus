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
    // dev can also hot-reload style changes
    extract: process.env.npm_lifecycle_event !== 'dev',
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
      chunkFilename: 'js/[name].js',
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    config
      .plugin('copy')
      .tap((args) => {
        const [params] = args;
        params.push({
          from: 'extension',
          toType: 'dir',
        });
        return args;
      });

    if (isNotProd) {
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
      return;
    }

    config.optimization.delete('splitChunks');
    // don't copy `public/xml` folder which is just for testing
  },
};
