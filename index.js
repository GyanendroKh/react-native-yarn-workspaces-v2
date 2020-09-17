const findYarnWorkspaceRoot = require('find-yarn-workspace-root');
const path = require('path');
const { getModuleSymlink } = require('./utils');

const getConfig = projectPath => {
  projectPath = path.resolve(projectPath);

  const watchFolders = [];
  let extraNodeModules = {
    ...getModuleSymlink(projectPath)
  };

  const workspaceRoot = findYarnWorkspaceRoot(projectPath);
  if (workspaceRoot) {
    watchFolders.push(workspaceRoot);
    extraNodeModules = {
      ...getModuleSymlink(workspaceRoot),
      ...extraNodeModules
    };
  }

  return {
    watchFolders,
    extraNodeModules
  };
};

module.exports = getConfig;
