/* vuex-i18n-store defines a vuex module to store locale translations. Make sure
** to also include the file vuex-i18n.js to enable easy access to localized
** strings in your vue components.
*/

// make sure the plugin can be used directly in the browser or with an es6 module
// loader. more information on this can be found here:
// http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/

(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		// support amd loaders
		define(['plugin'], function(plugin) {
			return (root.i18nVuexModule = factory(plugin));
		});

	} else if(typeof module === 'object' && module.exports) {
		// support commonjs loaders
		module.exports = (root.i18nVuexModule = factory(require('plugin')));

	} else {
		// support inclusion directly in the browser
		root.i18nVuexModule = factory(root.plugin);

	}

}(this, function(plugin) {

	// define a simple vuex module to handle locale translations
	return {
		state: {
			locale: null,
			translations: {}
		},
		mutations: {

			// set the current locale
			SET_LOCALE(state, payload) {
				state.locale = payload.locale;
			},

			// add a new locale
			ADD_LOCALE(state, payload) {
				state.translations[payload.locale] = payload.translations;
			}

		},
		actions: {

			// set the current locale
			setLocale(context, payload) {
				context.commit({
					type: 'SET_LOCALE',
					locale: payload.locale
				});
			},

			// add a new locale with translations
			addLocale(context, payload) {
				context.commit({
					type: 'ADD_LOCALE',
					locale: payload.locale,
					translations: payload.translations
				});
			}

		}
	};

}));
