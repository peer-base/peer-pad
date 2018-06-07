const autoprefixer = require('autoprefixer');

// "postcss" loader applies autoprefixer to our CSS.
// "css" loader resolves paths in CSS and adds assets as dependencies.
// "style" loader turns CSS into JS modules that inject <style> tags
// in development, but in production, we do something different.
// In production, we use a plugin to extract that CSS to a file, but
// in development "style" loader enables hot editing of CSS.
// This is moved out of rules so that the configuration can be shared across
// global/module css files and dev/prod configurations.
module.exports = ({ modules, test, env, shouldUseSourceMap }) => {
  const PROD = env.raw.NODE_ENV === 'production'
  if (!PROD) shouldUseSourceMap = true

  const otherLoaders = [
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: shouldUseSourceMap,
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-import'),
          require('postcss-css-variables'),
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
          }),
        ],
      },
    },
    test.source.endsWith('\.styl$') && {
      loader: require.resolve('stylus-loader'),
      options: {
        sourceMap: shouldUseSourceMap
      }
    }
  ].filter(Boolean)

  return {
    test,
    [modules ? 'include' : 'exclude']: (filename) =>
      new RegExp('\\.module' + test.source).test(filename),
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: Object.assign({
          importLoaders: otherLoaders.length,
          minimize: PROD,
          sourceMap: shouldUseSourceMap
        }, modules && {
          modules: true,
          localIdentName: PROD
            ? '[hash:base64:5]'
            : '[path][name]__[local]--[hash:base64:5]',
        }),
      },
      ...otherLoaders,
    ],
  }
}
