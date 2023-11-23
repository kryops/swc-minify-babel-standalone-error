const { readFileSync } = require('fs')
const swc = require('@swc/core')

const originalBabelCode = readFileSync(require.resolve('@babel/standalone/babel.js'), 'utf-8');

function transpileCodeWithBabel(babelCode) {
  const exports = {};
  eval(babelCode);

  try {
    const transformResult = exports.transform(
      `
      if ('foo' in {}) {
        console.log('x');
      }
      `,
      { filename: '/index.ts' }
    )

    console.log('Babel transpilation successful')
    console.log(transformResult.code);
  } catch (error) {
    console.error('Babel transpilation error')
    console.error(error)
  }
}

console.log('Original Babel:\n')
transpileCodeWithBabel(originalBabelCode)

const swcResult = swc.minifySync(
  originalBabelCode,
  {
    compress: {
      // both of the following rules need to be set to false for the code to work as expected
      if_return: true,
      dead_code: true,
    }
  }
);

console.log('\n\nMinified Babel:\n')
transpileCodeWithBabel(swcResult.code)
