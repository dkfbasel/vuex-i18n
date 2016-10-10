/* vuex-i18n-store defines a vuex module to store locale translations. Make sure
** to also include the file vuex-i18n.js to enable easy access to localized
** strings in your vue components.
*/

// define a simple vuex module to handle locale translations
var i18nVuexModule = {
	state: {
		locale: null,
		translations: {}
	},
	mutations: {

		// set the current locale
		SET_LOCALE: function SET_LOCALE(state, payload) {
			state.locale = payload.locale;
		},


		// add a new locale
		ADD_LOCALE: function ADD_LOCALE(state, payload) {
			state.translations[payload.locale] = payload.translations;
		},


		// add a new locale
		REMOVE_LOCALE: function REMOVE_LOCALE(state, payload) {

			// check if the given locale is present in the state
			if (state.translations.hasOwnProperty(payload.locale)) {

				// check if the current locale is the given locale to remvoe
				if (state.locale === payload.locale) {
					// reset the current locale
					state.locale = null;
				}

				// create a copy of the translations object
				var translationCopy = Object.assign({}, state.translations);

				// remove the given locale
				delete translationCopy[payload.locale];

				// set the state to the new object
				state.translations = copy;
			}
		}
	},
	actions: {

		// set the current locale
		setLocale: function setLocale(context, payload) {
			context.commit({
				type: 'SET_LOCALE',
				locale: payload.locale
			});
		},


		// add a new locale with translations
		addLocale: function addLocale(context, payload) {
			context.commit({
				type: 'ADD_LOCALE',
				locale: payload.locale,
				translations: payload.translations
			});
		},


		// remove the given locale translations
		removeLocale: function removeLocale(context, payload) {
			context.commit({
				type: 'REMOVE_LOCALE',
				locale: payload.locale,
				translations: payload.translations
			});
		}
	}
};

/* vuex-i18n defines the Vuexi18nPlugin to enable localization using a vuex
** module to store the translation information. Make sure to also include the
** file vuex-i18n-store.js to include a respective vuex module.
*/

// initialize the plugin object
var VuexI18nPlugin = {};

// internationalization plugin for vue js using vuex
VuexI18nPlugin.install = function install(Vue, store) {
	var moduleName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'i18n';


	// check if the plugin was correctly initialized
	if (store.state.hasOwnProperty(moduleName) === false) {
		console.error('i18n vuex module is not correctly initialized. Please check the module name:', moduleName);

		// always return the key if module is not initialized correctly
		Vue.prototype.$i18n = function (key) {
			return key;
		};

		Vue.prototype.$getLanguage = function () {
			return null;
		};

		Vue.prototype.$setLanguage = function () {
			console.error('i18n vuex module is not correctly initialized');
		};

		return;
	}

	// get localized string from store
	Vue.prototype.$t = function $t(key, options) {

		// get the current language from the store
		var locale = store.state[moduleName].locale;

		// check if the language exists in the store. return the key if not
		if (store.state[moduleName].translations.hasOwnProperty(locale) === false) {
			return render(key, options);
		}

		// check if the key exists in the store. return the key if not
		if (store.state[moduleName].translations[locale].hasOwnProperty(key) === false) {
			return render(key, options);
		}

		// return the value from the store
		return render(store.state[moduleName].translations[locale][key], options);
	};

	var setLocale = function setLocale(locale) {
		store.dispatch({
			type: 'setLocale',
			locale: locale
		});
	};

	var getLocale = function getLocale() {
		return store.state[moduleName].locale;
	};

	// add predefined translations to the store
	var addLocale = function addLocale(locale, translations) {
		return store.dispatch({
			type: 'addLocale',
			locale: locale,
			translations: translations
		});
	};

	// remove the givne locale from the store
	var removeLocale = function removeLocale(locale) {
		if (store.state[moduleName].translations.hasOwnProperty(locale)) {
			store.dispatch({
				type: 'removeLocale',
				locale: locale
			});
		}
	};

	// check if the given locale is already loaded
	var checkLocaleExists = function checkLocaleExists(locale) {
		return store.state[moduleName].translations.hasOwnProperty(locale);
	};

	Vue.prototype.$i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		exists: checkLocaleExists
	};

	Vue.i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		exists: checkLocaleExists
	};
};

// render the given translation with placeholder replaced
var render = function render(translation) {
	var replacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	return translation.replace(/\{\w+\}/g, function (placeholder) {

		var key = placeholder.replace('{', '').replace('}', '');

		if (replacements[key] !== undefined) {
			return replacements[key];
		}

		// warn user that the placeholder has not been found
		console.group('Not all placeholder founds');
		console.warn('Text:', translation);
		console.warn('Placeholder:', placeholder);
		console.groupEnd();

		// return the original placeholder
		return placeholder;
	});
};

// import the vuex module for localization
// import the corresponding plugin for vue
// export both modules as one file
var index = {
	store: i18nVuexModule,
	plugin: VuexI18nPlugin
};

export default index;
