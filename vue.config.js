const { join } = require('path');
const { env } = require('process');
const { exec } = require('child_process');

// some strange errors when `public` folder not existing
exec('mkdir public');

const CompressionWebpackPlugin = require('compression-webpack-plugin');

const EVENT = env.npm_lifecycle_event;
const IS_PROD = env.NODE_ENV === 'production';
const FOR_WEB = EVENT === 'dev' || EVENT === 'website';

const content = {
  entry: 'src/content/index.js',
  template: 'src/content/index.html',
};

if (IS_PROD) {
  content.filename = join(__dirname, 'tmp/content.html');
}

const index = {
  entry: 'src/website/index.js',
  template: 'src/website/index.html',
};

const options = {
  entry: 'src/website/index.js',
  template: 'src/website/options.html',
};

const pages = FOR_WEB ? { index } : { content, options };

const plugins = EVENT === 'website' ? [
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp('\\.(js|css)$'),
  }),
] : [];

module.exports = {
  filenameHashing: false,
  outputDir: FOR_WEB ? 'public' : 'dist',
  // Use VSCode lint instead of eslint-loader
  // lintOnSave: false,
  productionSourceMap: !IS_PROD,
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
  devServer: {
    contentBase: [
      join(__dirname, FOR_WEB ? 'public' : 'dist'),
      join(__dirname, 'tests'),
    ],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    config
      .plugin('define')
      .tap((defs) => {
        Object.assign(defs[0], { PROXY: JSON.stringify(env.PROXY || null) });
        return defs;
      });

    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
      });

    if (FOR_WEB) {
      config
        .plugin('copy')
        .tap(() => [[
          {
            from: 'src/extension/icons/logo-48.png',
            to: 'favicon.png',
            toType: 'file',
          },
        ]]);
    } else {
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
          IS_PROD || EVENT === 'watch' ? [extension] : [extension, xmlFiles],
        ]);

      config.optimization.delete('splitChunks');
    }
  },
};
