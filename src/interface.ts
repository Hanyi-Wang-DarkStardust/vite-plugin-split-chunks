type ModuleIdentifier = string | RegExp;

export enum ESplitChunkType {
  /**
   * [Default] All modules expect for user-defined will be combined into one chunk.
   * Support user-defined strategy.
   */
  Custom = 'custom',

  /**
   * Each module expect for user-defined will be individual.
   * Support user-defined strategy.
   */
  CustomUnbundle = 'custom-unbundle',

  /**
   * Do not bundle and make each module a individual chunk.
   * Not support user-defined strategy.
   */
  Unbundle = 'unbundle',

  /**
   * Combine all modules into one single chunk.
   * Not support user-defined strategy.
   */
  Single = 'single',
}

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
