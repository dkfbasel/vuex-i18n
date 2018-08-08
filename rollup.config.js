// note: this will require a install of the rollup utility to process
// our plugin code

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
	input: 'src/index.js',
	plugins: [
		babel({
			externalHelpers: false,
			exclude : 'node_modules/**'
		}),
		commonjs()
	],
	output: [
		{ file: 'dist/vuex-i18n.es.js', format: 'es' },
		{ file: 'dist/vuex-i18n.cjs.js', format: 'cjs' },
		{ file: 'dist/vuex-i18n.umd.js', format: 'umd', name: 'vuexI18n' }
	]
};
