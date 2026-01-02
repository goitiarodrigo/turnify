module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@api': './src/api',
          '@store': './src/store',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin', // Must be last
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};