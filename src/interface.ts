import { ESplitChunkType } from './constants';

type ModuleIdentifier = string | RegExp;

/**
 * Custom chunk splitting strategy.
 * @description
 * Follow the rule of:
 * {
 *  chunkName: [moduleId1, moduleId2, ...]
 * }
 */
export type CustomChunkStrategy<T extends string = string> = Record<
  T,
  Array<ModuleIdentifier>
>;

export interface SplitChunkOptions {
  /**
   * Chunk splitting type
   */
  type?: ESplitChunkType;

  /**
   * User-defined chunk splitting strategy
   */
  customChunkStrategy?: CustomChunkStrategy;
}
