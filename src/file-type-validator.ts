const styleAssetsSuffixCandidates =
  '\\.(css|less|sass|scss|stylus|postcss)($|\\?)';

/**
 * Check if a module is CSS file
 * @param moduleId file module id
 * @returns If a module is CSS style file
 */
export function isStyleAssets(moduleId: string) {
  const regExp = new RegExp(styleAssetsSuffixCandidates);
  return regExp.test(moduleId);
}
