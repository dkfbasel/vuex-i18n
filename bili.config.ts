// configuration for the bili bundler (based on rollup)
import { Config } from 'bili'

const config: Config = {
  // starting file
  input: 'src/index.ts',

  // modules to exclude
  externals: ['vue', 'vuex'],

  // output formats
  output: {
    format: ['cjs', 'esm', 'umd', 'umd-min'],
    moduleName: 'vuexI18n'
  },

  // special plugin configuration
  plugins: {
    typescript2: {
      // override the config in `tsconfig.json`
      tsconfigOverride: {
        // include all typescript files in the src directory
        include: ['src'],
        exclude: ['tests']
      }
    },
  },
}

export default config