# react-native-yarn-workspace

React Native support for Yarn Workspaces.

# Note

This package only run on `macOs` and `Linux` and haven't tested on `ios`.  
To use this package you have to create the react native project using `npx react-native init`. If you are using `expo`, use [expo-yarn-workspaces](https://github.com/expo/expo/tree/master/packages/expo-yarn-workspaces) instead.

**Inspired by** [expo-yarn-workspaces](https://github.com/expo/expo/tree/master/packages/expo-yarn-workspaces). The inner working of this package is same as `expo-yarn-workspaces`, check it for more details. This package is specifically tweaked to work with `bare react-native` project.

# Installation

Install the package as a dev dependency.

```console
foo@bar:~$ yarn add -D react-native-yarn-workspace
or
foo@bar:~$ npm i --save-dev react-native-yarn-workspace
```

# Usage

### Add a `postinstall` script to `package.json`

Add `"postinstall": "react-native-yarn-workspace"` under the script object in the app's `package.json`.

### Modify `metro.config.js`.

If the file does not exist, create it.

```js
const {
  extraNodeModules,
  watchFolders
} = require('react-native-yarn-workspace').default();

module.exports = {
  watchFolders,
  resolver: {
    extraNodeModules
  },
  // Generated by `react-native`.
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  }
  // end
};
```

This will tell the `metro bundler` to look for packages on the `yarn workspaces`' root `node_modules` directory and resolve all the `symlink` to their real path.

# LICENSE

- [Copyright (c) 2020 Gyanendro Kh](https://github.com/GyanendroKh/react-native-yarn-workspace/blob/master/LICENSE)
- [Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)](https://github.com/expo/expo/blob/master/LICENSE)
