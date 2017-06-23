'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/* vuex-i18n-store defines a vuex module to store locale translations. Make sure
** to also include the file vuex-i18n.js to enable easy access to localized
** strings in your vue components.
*/

// define a simple vuex module to handle locale translations
var i18nVuexModule = {
	state: {
		locale: null,
		fallback: null,
		translations: {}
	},
	mutations: {

		// set the current locale
		SET_LOCALE: function SET_LOCALE(state, payload) {
			state.locale = payload.locale;
		},


		// add a new locale
		ADD_LOCALE: function ADD_LOCALE(state, payload) {
			// reduce the given translations to a single-depth tree
			var translations = flattenTranslations(payload.translations);
			state.translations[payload.locale] = translations;

			// make sure to notify vue of changes (this might break with new vue versions)
			state.translations.__ob__.dep.notify();
		},


		// remove a new locale
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
				state.translations = translationCopy;
			}
		},
		SET_FALLBACK_LOCALE: function SET_FALLBACK_LOCALE(state, payload) {
			state.fallback = payload.locale;
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
		},
		setFallbackLocale: function setFallbackLocale(context, payload) {
			context.commit({
				type: 'SET_FALLBACK_LOCALE',
				locale: payload.locale
			});
		}
	}
};

// flattenTranslations will convert object trees for translations into a
// single-depth object tree
var flattenTranslations = function flattenTranslations(translations) {

	var toReturn = {};

	for (var i in translations) {

		// check if the property is present
		if (!translations.hasOwnProperty(i)) {
			continue;
		}

		// get the type of the property
		var objType = _typeof(translations[i]);

		// allow unflattened array of strings
		if (isArray(translations[i])) {

			var count = translations[i].length;

			for (var index = 0; index < count; index++) {
				var itemType = _typeof(translations[i][index]);

				if (itemType !== 'string') {
					console.warn('vuex-i18n:', 'currently only arrays of strings are fully supported', translations[i]);
					break;
				}
			}

			toReturn[i] = translations[i];
		} else if (objType == 'object' && objType !== null) {

			var flatObject = flattenTranslations(translations[i]);

			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;

				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = translations[i];
		}
	}
	return toReturn;
};

// check if the given object is an array
function isArray(obj) {
	return !!obj && Array === obj.constructor;
}

/* vuex-i18n defines the Vuexi18nPlugin to enable localization using a vuex
** module to store the translation information. Make sure to also include the
** file vuex-i18n-store.js to include a respective vuex module.
*/

// initialize the plugin object
var VuexI18nPlugin = {};

// internationalization plugin for vue js using vuex
VuexI18nPlugin.install = function install(Vue, store) {
	var moduleName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'i18n';
	var identifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ['{', '}'];


	store.registerModule(moduleName, i18nVuexModule);

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

	// initialize the replacement function
	var render = renderFn(identifiers);

	// get localized string from store
	var translate = function $t(key, options, pluralization) {

		// get the current language from the store
		var locale = store.state[moduleName].locale;

		return translateInLanguage(locale, key, options, pluralization);
	};

	// get localized string from store in a given language if available
	var translateInLanguage = function translateInLanguage(locale, key, options, pluralization) {

		// get the current language from the store
		var fallback = store.state[moduleName].fallback;
		var translations = store.state[moduleName].translations;

		// flag for translation to exist or not
		var translationExist = true;

		// check if the language exists in the store. return the key if not
		if (translations.hasOwnProperty(locale) === false) {
			translationExist = false;

			// check if the key exists in the store. return the key if not
		} else if (translations[locale].hasOwnProperty(key) === false) {
			translationExist = false;
		}

		// return the value from the store
		if (translationExist === true) {
			return render(translations[locale][key], options, pluralization);
		}

		// check if a vaild fallback exists in the store. return the key if not
		if (translations.hasOwnProperty(fallback) === false) {
			return render(key, options, pluralization);
		}

		// check if the key exists in the fallback in the store. return the key if not
		if (translations[fallback].hasOwnProperty(key) === false) {
			return render(key, options, pluralization);
		}

		return render(translations[fallback][key], options, pluralization);
	};

	// check if the given key exists in the current locale
	var checkKeyExists = function checkKeyExists(key) {

		// get the current language from the store
		var locale = store.state[moduleName].locale;
		var fallback = store.state[moduleName].fallback;
		var translations = store.state[moduleName].translations;

		// check if the language exists in the store.
		if (translations.hasOwnProperty(locale) === false) {

			// check if a fallback locale exists
			if (translations.hasOwnProperty(fallback) === false) {
				return false;
			}

			// check the fallback locale for the key
			return translations[fallback].hasOwnProperty(key);
		}

		// check if the key exists in the store
		return translations[locale].hasOwnProperty(key);
	};

	// set fallback locale
	var setFallbackLocale = function setFallbackLocale(locale) {
		store.dispatch({
			type: 'setFallbackLocale',
			locale: locale
		});
	};

	// set the current locale
	var setLocale = function setLocale(locale) {
		store.dispatch({
			type: 'setLocale',
			locale: locale
		});
	};

	// get the current locale
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

	// we are phasing out the exists function
	var phaseOutExistsFn = function phaseOutExistsFn(locale) {
		console.warn('$i18n.exists is depreceated. Please use $i18n.localeExists instead. It provides exatly the same functionality.');
		return checkLocaleExists(locale);
	};

	// check if the given locale is already loaded
	var checkLocaleExists = function checkLocaleExists(locale) {
		return store.state[moduleName].translations.hasOwnProperty(locale);
	};

	// register vue prototype methods
	Vue.prototype.$i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		fallback: setFallbackLocale,
		localeExists: checkLocaleExists,
		keyExists: checkKeyExists,

		exists: phaseOutExistsFn
	};

	// register global methods
	Vue.i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		fallback: setFallbackLocale,
		translate: translate,
		translateIn: translateInLanguage,
		localeExists: checkLocaleExists,
		keyExists: checkKeyExists,

		exists: phaseOutExistsFn
	};

	// register the translation function on the vue instance
	Vue.prototype.$t = translate;

	// register the specific language translation function on the vue instance
	Vue.prototype.$tlang = translateInLanguage;

	// register a filter function for translations
	Vue.filter('translate', translate);
};

// renderFn will initialize a function to render the variable substitutions in
// the translation string. identifiers specify the tags will be used to find
// variable substitutions, i.e. {test} or {{test}}, note that we are using a
// closure to avoid recompilation of the regular expression to match tags on
// every render cycle.
var renderFn = function renderFn(identifiers) {

	if (identifiers == null || identifiers.length != 2) {
		console.warn('You must specify the start and end character identifying variable substitutions');
	}

	// construct a regular expression ot find variable substitutions, i.e. {test}
	var matcher = new RegExp('' + identifiers[0] + '\\w+' + identifiers[1], 'g');

	// define the replacement function
	var replace = function replace(translation, replacements) {
		var warn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


		// check if the object has a replace property
		if (!translation.replace) {
			return translation;
		}

		return translation.replace(matcher, function (placeholder) {

			// remove the identifiers (can be set on the module level)
			var key = placeholder.replace(identifiers[0], '').replace(identifiers[1], '');

			if (replacements[key] !== undefined) {
				return replacements[key];
			}

			// warn user that the placeholder has not been found
			if (warn === true) {
				console.group('Not all placeholders found');
				console.warn('Text:', translation);
				console.warn('Placeholder:', placeholder);
				console.groupEnd();
			}

			// return the original placeholder
			return placeholder;
		});
	};

	// the render function will replace variable substitutions and prepare the
	// translations for rendering
	var render = function render(translation) {
		var replacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var pluralization = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


		// get the type of the property
		var objType = typeof translation === 'undefined' ? 'undefined' : _typeof(translation);
		var pluralizationType = typeof pluralization === 'undefined' ? 'undefined' : _typeof(pluralization);

		var replacedText = function replacedText() {

			if (isArray$1(translation)) {

				// replace the placeholder elements in all sub-items
				return translation.map(function (item) {
					return replace(item, replacements, false);
				});
			} else if (objType === 'string') {
				return replace(translation, replacements);
			}
		};

		// return translation item directly
		if (pluralization === null) {
			return replacedText();
		}

		// check if pluralization value is countable
		if (pluralizationType !== 'number') {
			console.warn('pluralization is not a number');
			return replacedText();
		}

		// check for pluralization and return the correct part of the string
		var translatedText = replacedText().split(':::');

		// return the left side on singular, the right side for plural
		// 0 has plural notation
		if (pluralization === 1) {
			return translatedText[0].trim();
		}

		// use singular version for -1 as well
		if (pluralization === -1) {
			return translatedText[0].trim();
		}

		if (translatedText.length > 1) {
			return translatedText[1].trim();
		}

		console.warn('no pluralized translation provided in ', translation);
		return translatedText[0].trim();
	};

	// return the render function to the caller
	return render;
};

// check if the given object is an array
function isArray$1(obj) {
	return !!obj && Array === obj.constructor;
}

// import the vuex module for localization
// import the corresponding plugin for vue
// export both modules as one file
var index = {
	store: i18nVuexModule,
	plugin: VuexI18nPlugin
};

module.exports = index;
