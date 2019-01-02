import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
	input: './src/index.js',
	treeshake: true,
	plugins: [
		babel({
			externalHelpers: true,
			exclude : 'node_modules/**'
		}),
		commonjs()
	],
	output: [
		{ file: '../dist/vuex-i18n.es.js', format: 'es' },
		{ file: '../dist/vuex-i18n.cjs.js', format: 'cjs' },
		{ file: '../dist/vuex-i18n.umd.js', format: 'umd', name: 'vuexI18n' }
	]
};
