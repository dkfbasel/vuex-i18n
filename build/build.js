// Build script for vuex-i18n. To be run with node.js

const fs = require('fs');
const exec = require('child_process').exec;

// We need a symlink to the src directory, as babel can only transpile code
// that is under the same root as the .babelrc file
console.log('- symlink src directory');

fs.symlink('../src', './src', () => {

	// use rollup to bundle the content
	console.log('- bundle code');
	exec('yarn run rollup', (error) => {

		if (error) {
			console.error(`error: ${error}`);
			return;
		}

		// minify the code with uglifyjs
		console.log('- minify code');
		exec('yarn run minify', (error2) => {

			if (error2) {
				console.error(`error: ${error2}`);
				return;
			}
	
			// remove the symbolic link
			console.log('- remove symlink');
			fs.unlink('./src', () =>{
				console.log('- build finished');
			});


		});

	});

});
