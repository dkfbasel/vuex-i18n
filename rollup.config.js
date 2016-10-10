// note: this will require a global install of the rollup utility to process
// our plugin code

import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/index.js',
	treeshake: false,
	plugins: [babel({
		exclude: 'node_modules/**'
	})],
	targets: [
		{ dest: 'dist/vuex-i18n.es.js', format: 'es'},
		{ dest: 'dist/vuex-i18n.min.js', format: 'iife', moduleName: 'vuexI18n' }
	]
};
