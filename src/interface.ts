type ModuleIdentifier = string | RegExp;

export enum ESplitChunkType {
  Default = 'default',
  NoBundle = 'no-bundle',
  Custom = 'custom',
  Single = 'single',
}

export type CustomChunkStrategy<T extends string = string> = Record<
  T,
  Array<ModuleIdentifier>
>;

export interface SplitChunkOptions {
  type?: ESplitChunkType;
  customChunkStrategy?: CustomChunkStrategy;
}
