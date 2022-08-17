import { resolvePackageData, resolvePackageEntry } from 'vite';
import type { PackageData } from 'vite';

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
