#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { symlinkPackage } from './utils';

const symlinkNecessaryPackages = (projectPath: string) => {
  const necessaryPkgs = [
    'react-native',
    '@react-native-community/cli-platform-android',
    '@react-native-community/cli-platform-ios',
    'hermes-engine',
    'jsc-android'
  ];

  const extras: string[] = JSON.parse(
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
