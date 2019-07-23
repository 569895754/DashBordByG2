const { override, fixBabelImports, addDecoratorsLegacy, addLessLoader, loaderOptions  } = require('customize-cra');

module.exports = override(
    addDecoratorsLegacy(),
    addLessLoader(loaderOptions),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
    }),
);