const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig('C:\\Users\\Thusi\\HEALProject2');

defaultConfig.resolver.assetExts.push('bin','json');

module.exports = defaultConfig;