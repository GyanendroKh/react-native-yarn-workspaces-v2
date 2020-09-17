import findYarnWorkspaceRoot from 'find-yarn-workspace-root';
import path from 'path';
import { getModuleSymlink } from './utils';

export default (
  projectPath: string
): { watchFolders: string[]; extraNodeModules: { [name: string]: string } } => {
  projectPath = path.resolve(projectPath);

  const watchFolders: string[] = [];
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
