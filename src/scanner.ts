import { GetModuleInfo } from 'rollup';
import { normalizePath } from 'vite';

function scanAndCheckIsDepsIncluded(
  moduleId: string,
  targetDeps: Array<string>,
  depsOfModule: Array<string>,
  getModuleInfo: GetModuleInfo,
): boolean {
  const id = normalizePath(moduleId);

  if (depsOfModule.includes(id)) {
    return false;
  }

  if (targetDeps.includes(id)) {
    return true;
  }

  const moduleInfo = getModuleInfo(id);
  if (!moduleInfo?.importers) {
    return false;
  }

  return moduleInfo.importers.some((importer) => {
    const depsOfModuleImporter = depsOfModule.concat(id);
    return scanAndCheckIsDepsIncluded(
      importer,
      targetDeps,
      depsOfModuleImporter,
      getModuleInfo,
    );
  });
}

function scanAndCheckStaticImported(
  moduleId: string,
  depsOfModule: Array<string>,
  getModuleInfo: GetModuleInfo,
): boolean {
  if (depsOfModule.includes(moduleId)) {
    return false;
  }

  const moduleInfo = getModuleInfo(moduleId);
  if (!moduleInfo) {
    return false;
  }
  if (moduleInfo.isEntry) {
    return true;
  }
  return (
    moduleInfo.importers.some((importer) => {
      const depsOfModuleImporter = depsOfModule.concat(moduleId);
      return scanAndCheckStaticImported(
        importer,
        depsOfModuleImporter,
        getModuleInfo,
      );
    }) || false
  );
}

export { scanAndCheckIsDepsIncluded, scanAndCheckStaticImported };
