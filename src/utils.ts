import { resolvePackageData, resolvePackageEntry } from 'vite';
import type { PackageData } from 'vite';
import type { GetManualChunk, GetManualChunkApi } from 'rollup';
import type { CustomChunkStrategy } from './interface';
import { isStyleAssets } from './file-type-validator';
import { scanAndCheckIsDepsIncluded } from './scanner';

export function resolveEntry(name: string): string {
  let finalEntry;
  try {
    finalEntry =
      resolvePackageEntry(
        name,
        resolvePackageData(name, process.cwd(), true) as PackageData,
        true,
        {
          isBuild: true,
          isProduction: process.env.NODE_ENV === 'production',
          isRequire: false,
          root: process.cwd(),
          preserveSymlinks: false,
        },
      ) || '';
  } catch (e) {
    finalEntry = '';
  }
  return finalEntry;
}

export function processCustomStrategyConfig(
  getManualChunk: GetManualChunk,
  customOptions: CustomChunkStrategy = {},
): GetManualChunk {
  const chunkNameList = Object.keys(customOptions);
  const chunkDeps: Record<string, Array<string>> = {};
  for (const chunkName of chunkNameList) {
    const packageInfo = customOptions[chunkName];
    const packageInfoWithString = packageInfo
      .filter((item) => typeof item === 'string')
      .map((item) => resolveEntry(item as string))
      .filter((item) => Boolean(item));
    chunkDeps[chunkName] = packageInfoWithString;
  }

  return (moduleId: string, getChunkApi: GetManualChunkApi) => {
    const { getModuleInfo } = getChunkApi;
    if (isStyleAssets(moduleId)) {
      return getManualChunk(moduleId, getChunkApi);
    }

    for (const chunkName of chunkNameList) {
      const deps = chunkDeps[chunkName];
      const packageInfo = customOptions[chunkName];
      if (
        moduleId.includes('node_modules') &&
        deps.length &&
        scanAndCheckIsDepsIncluded(moduleId, deps, [], getModuleInfo)
      ) {
        return chunkName;
      }

      for (const rule of packageInfo) {
        if (rule instanceof RegExp && rule.test(moduleId)) {
          return chunkName;
        }
      }
    }

    return getManualChunk(moduleId, getChunkApi);
  };
}
