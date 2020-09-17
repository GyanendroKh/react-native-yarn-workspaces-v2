#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { symlinkPackage } = require('./utils');

const symlinkNecessaryPackages = projectPath => {
  /**
   * These are the packages which the react-native package use.
   */
  const necessaryPkgs = [
    'react-native',
    '@react-native-community/cli-platform-android',
    '@react-native-community/cli-platform-ios',
    'hermes-engine',
    'jsc-android'
  ];

  const extras = JSON.parse(
    fs.readFileSync(path.join(projectPath, 'package.json')).toString()
  )['workspaces-symlink'];
  if (extras) {
    necessaryPkgs.push(...extras);
  }

  for (const pkg of necessaryPkgs) {
    symlinkPackage(projectPath, pkg);
  }
};

if (module === require.main) {
  symlinkNecessaryPackages(path.resolve());
}
