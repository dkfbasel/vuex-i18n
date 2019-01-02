# Vuex-i18n build directory

This directory contains the specifications and code to build the vuex-i18n 
plugin using rollup.

Building requires a current installation of yarn and nodejs.

1. Install all required node_modules with `yarn install`
2. Run the build script with `yarn run build`

The build script will create a symlink to the ../src directory in the build
directory. This is required to transpile the code with babeljs, as babeljs only
works well with directories that are in the same root as the babelrc file.