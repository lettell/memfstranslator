const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        'path': './node_modules/path-browserify',

        assert: './node_modules/assert',
        buffer: './node_modules/buffer',
        stream: './node_modules/readable-stream',
        url: './node_modules/url',
        util: './node_modules/util',
        process: "process/browser",

      },
    }],
  ],
};
