const path = require("path");
const fs = require("fs");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDirectory = path.resolve(__dirname);
const { presets, plugins } = require(`${appDirectory}/babel.config.js`);
const compileNodeModules = [
  // Add every react-native package that needs compiling
  // 'react-native-gesture-handler',
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/, // Updated to include .jsx
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, "index.web.js"), // Entry to your application
    path.resolve(__dirname, "App.tsx"), // Updated to .jsx
    path.resolve(__dirname, "src"),
    path.resolve(__dirname, "component"),
    ...compileNodeModules,
  ],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets,
      plugins,
    },
  },
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: "@svgr/webpack",
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
    },
  },
};

const tsLoaderConfiguration = {
  test: /\.(ts)x?$/,
  exclude: /node_modules|\.d\.ts$/, // this line as well
  use: {
    loader: 'ts-loader',
    options: {
      compilerOptions: {
        noEmit: false, // this option will solve the issue
      },
    },
  },
};

module.exports = {
  mode: "development",
  entry: {
    app: path.join(__dirname, "index.web.js"),
    worker: path.join(__dirname, "worker.js"),

  },
  output: {
    path: path.resolve(appDirectory, "dist"),
    publicPath: "/",
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".web.js", ".js"],
    alias: {
      "react-native$": "react-native-web",
      process: "process/browser",
    },
    plugins: [
      new TsconfigPathsPlugin({
        /*configFile: "./path/to/tsconfig.json" */
      }),
    ],
    fallback: {
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      path: require.resolve('path-browserify'),
      // process: require.resolve('process'),
      stream: require.resolve('readable-stream'),
      url: require.resolve('url'),
      util: require.resolve('util'),
    },
  },
  externals: {
    fs: 'window.fs',
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      tsLoaderConfiguration,
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      __HOST__: JSON.stringify('https://tools.jarosius.lt'),
      "process.env.NODE_DEBUG": JSON.stringify(false),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  devServer: {
    // HTTPS is required for SharedArrayBuffer to work.
    server: 'https',
    allowedHosts: 'all',
    proxy: [{
      context: ['/lettell'],
      target: 'https://github.com',
      changeOrigin: true,
      secure: true,
    }],
    headers: {
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      // "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",  
      // These two headers are required for SharedArrayBuffer to work.
      // 'Cross-Origin-Opener-Policy': 'same-origin',
      // 'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    port: 9876,
    hot: false,
  },

};
