const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
      CleanPlugin = require('clean-webpack-plugin'),
      LodashPlugin = require('lodash-webpack-plugin'),
      path = require('path'),
      webpack = require('webpack');

// Common configuration, with extensions in webpack.dev.js and webpack.prod.js.
module.exports = {
  bail: true,
  context: __dirname,
  entry: {
    main: './assets/js/app.js',
    head_async: ['lazysizes', 'lazysizes_parent_fit'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(assets\/js|assets\\js|stencil-utils)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-syntax-dynamic-import', // add support for dynamic imports (used in app.js)
              'lodash', // Tree-shake lodash
            ],
            presets: [
              ['@babel/preset-env', {
                loose: true, // Enable "loose" transformations for any plugins in this preset that allow them
                modules: false, // Don't transform modules; needed for tree-shaking
                useBuiltIns: 'usage', // Tree-shake babel-polyfill
                targets: '> 1%, last 2 versions, Firefox ESR',
              }],
            ],
          },
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-react'],
            },
        }
      },
      {
        test: /\.scss$/,
        use:  [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: true
                }
            },
            'sass-loader'
        ],
      },
    ],
  },
  output: {
    chunkFilename: 'theme-bundle.chunk.[name].js',
    filename: 'theme-bundle.[name].js',
    path: path.resolve(__dirname, 'assets/dist'),
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 1024 * 300,
    maxEntrypointSize: 1024 * 300,
  },
  plugins: [
      new CleanPlugin(['assets/dist'], {
        verbose: false,
        watch: false,
      }),
      new LodashPlugin, // Complements babel-plugin-lodash by shrinking its cherry-picked builds further.
      new webpack.ProvidePlugin({ // Provide jquery automatically without explicit import
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
  ],
  resolve: {
    alias: {
      jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
      eventemitter2: path.resolve(__dirname, 'node_modules/eventemitter2/lib/eventemitter2.js'),
      lazysizes: path.resolve(__dirname, 'node_modules/lazysizes/lazysizes.min.js'),
      lazysizes_parent_fit: path.resolve(__dirname, 'node_modules/lazysizes/plugins/parent-fit/ls.parent-fit')
    },
    extensions: ['.js', '.jsx']
  },
};
