const addPackagePatch = require('./addPackagePatch');

const append = (scope, pattern, patch) =>
  scope.replace(pattern, `${pattern}${patch}`);

module.exports = function makeMainActivityPatch(androidConfig, params) {
  const importPattern = 'import com.facebook.react.ReactActivity;';
  const packagePattern = 'new MainReactPackage()';

  const packageInstance = androidConfig.packageInstance.replace(
    /\$\{(\w+)\}/g,
    (pattern, paramName) => params[paramName] ? `"${params[paramName]}"` : null
  );

  /**
   * Make a MainActivity.java program patcher
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  return function applyMainActivityPatch(content) {
    const patched = append(
      content,
      importPattern,
      '\n' + androidConfig.packageImportPath
    );

    return append(
      patched,
      packagePattern,
      addPackagePatch({packageInstance})
    );
  };
};
