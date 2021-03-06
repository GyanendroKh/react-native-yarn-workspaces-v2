const fs = require('fs');
const findYarnWorkspaceRoot = require('find-yarn-workspace-root');
const path = require('path');
const mkdirp = require('mkdirp');

const listDir = dir => {
  try {
    return fs.readdirSync(dir);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return [];
    }
    throw e;
  }
};

const getFileStats = filePath => {
  try {
    return fs.statSync(filePath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return null;
    }
    throw e;
  }
};

const symlinkPackage = (rootPath, pkgName) => {
  const nodeModulesPath = path.join(rootPath, 'node_modules');
  const packagePath = path.join(
    nodeModulesPath,
    pkgName.replace('/', path.sep)
  );

  let stats = getFileStats(packagePath);
  if (stats) {
    return;
  }

  const workspaceRootPath = findYarnWorkspaceRoot(rootPath);
  if (!workspaceRootPath) {
    return;
  }

  const workspacePackagePath = path.join(
    workspaceRootPath,
    'node_modules',
    pkgName.replace('/', path.sep)
  );

  if (pkgName.startsWith('@')) {
    const [scope, name] = pkgName.split('/');
    const scopePath = path.join(nodeModulesPath, scope);
    const relativePackagePath = path.relative(scopePath, workspacePackagePath);

    mkdirp.sync(scopePath);
    fs.symlinkSync(relativePackagePath, path.join(scopePath, name));
  } else {
    const relativePackagePath = path.relative(
      nodeModulesPath,
      workspacePackagePath
    );

    mkdirp.sync(nodeModulesPath);
    fs.symlinkSync(relativePackagePath, path.join(nodeModulesPath, pkgName));
  }
};

const getModuleSymlink = packagePath => {
  const nodeModulesPath = path.join(packagePath, 'node_modules');
  const dirs = listDir(nodeModulesPath);

  const modules = {};

  for (let dir of dirs) {
    if (dir.startsWith('@')) {
      const scopePath = path.join(nodeModulesPath, dir);
      let scopedDirs = listDir(scopePath);

      for (let scopedDir of scopedDirs) {
        const dependencyName = `${dir}/${scopedDir}`;
        const dependencyPath = path.join(scopePath, scopedDir);

        if (fs.lstatSync(dependencyPath).isSymbolicLink()) {
          modules[dependencyName] = fs.realpathSync(dependencyPath);
        }
      }
    } else {
      const dependencyName = dir;
      const dependencyPath = path.join(nodeModulesPath, dir);

      if (fs.lstatSync(dependencyPath).isSymbolicLink()) {
        modules[dependencyName] = fs.realpathSync(dependencyPath);
      }
    }
  }

  return modules;
};

module.exports = {
  listDir,
  getFileStats,
  symlinkPackage,
  getModuleSymlink
};
