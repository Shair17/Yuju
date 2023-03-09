module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@yuju': './src',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
