const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const exclusionList = require('metro-config/src/defaults/exclusionList');
// const { exclusionList } = require('metro-config');
const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
      assetExts: [...defaultConfig.resolver.assetExts, 'lottie'], // Add 'lottie' to asset extensions
      // Modern replacement of blacklistRE
      blockList: [
        /node_modules\/.*\/node_modules\/.*/,
      ],
    },
    transformer: {
      enableFlipper: false,  // Disable Flipper for debugging
    },
    watchFolders: [
      './src', // Explicitly watch only the `src` directory (or your app code directory)
    ]
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
