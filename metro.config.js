const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
      // Exclude certain paths or unnecessary files from being watched
      blacklistRE: exclusionList([
        /node_modules\/.*\/node_modules\/.*/, // Prevent nested `node_modules` from being watched
      ]),
    },
    watchFolders: [
      './src', // Explicitly watch only the `src` directory (or your app code directory)
    ],
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
