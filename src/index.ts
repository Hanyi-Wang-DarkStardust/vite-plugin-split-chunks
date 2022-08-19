import path from 'path';
import { normalizePath, Plugin } from 'vite';
import type { CustomChunkStrategy, SplitChunkOptions } from './interface';
import { ESplitChunkType } from './constants';
import { scanAndCheckStaticImported } from './scanner';
import { processCustomStrategyConfig } from './utils';
import { isStyleAssets } from './file-type-validator';

function createChunksFactory(customChunkStrategy: CustomChunkStrategy) {
  return {
    // Default Strategy:
    // 1. Apply custom strategy
    // 2. All static imported modules from node_modules (except for CSS) will be in 'vendor'
    // 3. All dynamic import from node_modules will be in 'async-vendor'
    // 4. Each dynamic non-node_module module wil be bundled seperately
    [ESplitChunkType.Custom]: processCustomStrategyConfig(
      (id, { getModuleInfo }): string | undefined => {
        if (id.includes('node_modules') && !isStyleAssets(id)) {
          if (scanAndCheckStaticImported(id, [], getModuleInfo)) {
            return 'vendor';
          }
        }
        const cwd = process.cwd();
        if (!id.includes('node_modules') && !isStyleAssets(id)) {
          const extname = path.extname(id);
          return normalizePath(path.relative(cwd, id).replace(extname, ''));
        }
      },
      customChunkStrategy,
    ),
    // 1. Apply custom strategy
    // 2. Each will be bundled seperately
    // 4. Each dynamic non-node_module module wil be bundled seperately
    [ESplitChunkType.CustomUnbundle]: processCustomStrategyConfig(
      () => null,
      customChunkStrategy,
    ),
    // All will be bundled into 'main'
    [ESplitChunkType.Single]: processCustomStrategyConfig(() => 'main'),
    // Each will be bundled seperately
    [ESplitChunkType.Unbundle]: processCustomStrategyConfig(() => null),
  };
}

export function splitChunksPlugin(pluginOptions: SplitChunkOptions): Plugin {
  const { type = ESplitChunkType.Custom, customChunkStrategy = {} } =
    pluginOptions;
  const chunkFactory = createChunksFactory(customChunkStrategy);
  const manualChunks = chunkFactory[type];

  return {
    name: 'vite-plugin-split-chunks',
    config() {
      return {
        build: {
          rollupOptions: {
            output: {
              manualChunks,
            },
          },
        },
      };
    },
  };
}

export { ESplitChunkType } from './constants';
export * from './interface';
export default splitChunksPlugin;
