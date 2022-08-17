const styleAssetsSuffixCandidates =
  '\\.(css|less|sass|scss|stylus|postcss)($|\\?)';

export function isStyleAssets(fileName: string) {
  const regExp = new RegExp(styleAssetsSuffixCandidates);
  return regExp.test(fileName);
}
