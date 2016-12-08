// note: this will require a global install of the rollup utility to process
// our plugin code

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'src/index.js',
	treeshake: true,
	plugins: [
		babel({
			externalHelpers: false,
			exclude : 'node_modules/**'
		}),
		commonjs()
	],
	targets: [
		{ dest: 'dist/vuex-i18n.es.js', format: 'es' },
		{ dest: 'dist/vuex-i18n.cjs.js', format: 'cjs' },
		{ dest: 'dist/vuex-i18n.min.js', format: 'umd', moduleName: 'vuexI18n' }
	]
};
