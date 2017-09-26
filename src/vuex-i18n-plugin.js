/* vuex-i18n defines the Vuexi18nPlugin to enable localization using a vuex
** module to store the translation information. Make sure to also include the
** file vuex-i18n-store.js to include a respective vuex module.
*/

import module from './vuex-i18n-store';
import plurals from './vuex-i18n-plurals';

// initialize the plugin object
let VuexI18nPlugin = {};

// internationalization plugin for vue js using vuex
VuexI18nPlugin.install = function install(Vue, store, config) {
	// TODO: remove this block for next major update (API break)
	if (typeof arguments[2] === 'string' || typeof arguments[3] === 'string') {
		console.warn('VuexI18nPlugin: Registering the plugin with a string for `moduleName` or `identifiers` is deprecated. Use a configuration object instead.', 'https://github.com/dkfbasel/vuex-i18n#setup');
		config = {
			moduleName: arguments[2],
			identifiers: arguments[3]
		};
	}
	const { moduleName, identifiers, onNoTranslation } = Object.assign({
		moduleName: 'i18n',
		identifiers: ['{', '}']
	}, config);

	store.registerModule(moduleName, module);

	// check if the plugin was correctly initialized
	if (store.state.hasOwnProperty(moduleName) === false) {
		console.error('i18n vuex module is not correctly initialized. Please check the module name:', moduleName);

		// always return the key if module is not initialized correctly
		Vue.prototype.$i18n = function(key) {
			return key;
		};

		Vue.prototype.$getLanguage = function() {
			return null;
		};

		Vue.prototype.$setLanguage = function() {
			console.error('i18n vuex module is not correctly initialized');
		};

		return;
	};

	// initialize the replacement function
	let render = renderFn(identifiers);

	// get localized string from store. note that we pass the arguments passed
	// to the function directly to the translateInLanguage function
	let translate = function $t() {

		// get the current language from the store
		let locale = store.state[moduleName].locale;

		return translateInLanguage(locale, ...arguments);
	};

	// get localized string from store in a given language if available.
	// there are two possible signatures for the function.
	// we will check the arguments to make up the options passed.
	// 1: locale, key, options, pluralization
	// 2: locale, key, defaultValue, options, pluralization
	let translateInLanguage = function translateInLanguage(locale) {

		// read the function arguments
		let args = arguments;

		// initialize options
		let key = '';
		let defaultValue = '';
		let options = {};
		let pluralization = null;

		let count = args.length;

		// check if a default value was specified and fill options accordingly
		if (count >= 3 && typeof args[2] === 'string') {

			key = args[1];
			defaultValue = args[2];

			if (count > 3) {
				options = args[3];
			}

			if (count > 4) {
				pluralization = args[4];
			}

		} else {

			key = args[1];

			// default value was not specified and is therefore the same as the key
			defaultValue = key;

			if (count > 2) {
				options = args[2];
			}

			if (count > 3) {
				pluralization = args[3];
			}

		}

		// get the translations from the store
		let translations = store.state[moduleName].translations;

		// get the last resort fallback from the store
		let fallback = store.state[moduleName].fallback;

		// split locale by - to support partial fallback for regional locales
		// like de-CH, en-UK
		let localeRegional = locale.split('-');

		// flag for translation to exist or not
		let translationExist = true;

		// check if the language exists in the store. return the key if not
		if (translations.hasOwnProperty(locale) === false ) {
			translationExist = false;
		// check if the key exists in the store. return the key if not
		} else if (translations[locale].hasOwnProperty(key) === false) {
			translationExist = false;
		}

		// return the value from the store
		if (translationExist === true) {
			return render(locale, translations[locale][key], options, pluralization);
		} else {
			if (typeof onNoTranslation === 'function') {
				onNoTranslation(key, locale);
			}
		}

		// check if a regional locale translation would be available for the key
		// i.e. de for de-CH
		if (localeRegional.length > 1 &&
			translations.hasOwnProperty(localeRegional[0]) === true &&
			translations[localeRegional[0]].hasOwnProperty(key) === true) {
			return render(localeRegional[0], translations[localeRegional[0]][key], options, pluralization);
		}

		// check if a vaild fallback exists in the store.
		// return the default value if not
		if (translations.hasOwnProperty(fallback) === false ) {
			return render(locale, defaultValue, options, pluralization);
		}

		// check if the key exists in the fallback locale in the store.
		// return the default value if not
		if (translations[fallback].hasOwnProperty(key) === false) {
			return render(fallback, defaultValue, options, pluralization);
		}

		return render(locale, translations[fallback][key], options, pluralization);

	};

	// check if the given key exists in the current locale
	let checkKeyExists = function checkKeyExists(key) {

		// get the current language from the store
		let locale = store.state[moduleName].locale;
		let fallback = store.state[moduleName].fallback;
		let translations = store.state[moduleName].translations;

		// check if the language exists in the store.
		if (translations.hasOwnProperty(locale) === false ) {

			// check if a fallback locale exists
			if (translations.hasOwnProperty(fallback) === false ) {
				return false;
			}

			// check the fallback locale for the key
			return translations[fallback].hasOwnProperty(key);

		}

		// check if the key exists in the store
		return translations[locale].hasOwnProperty(key);
	};

	// set fallback locale
	let setFallbackLocale = function setFallbackLocale(locale) {
		store.dispatch({
			type: 'setFallbackLocale',
			locale: locale
		});
	};

	// set the current locale
	let setLocale = function setLocale(locale) {
		store.dispatch({
			type: 'setLocale',
			locale: locale
		});
	};

	// get the current locale
	let getLocale = function getLocale() {
		return store.state[moduleName].locale;
	};

	// add predefined translations to the store (keeping existing information)
	let addLocale = function addLocale(locale, translations) {
		return store.dispatch({
			type: 'addLocale',
			locale: locale,
			translations: translations
		});
	};

	// replace all locale information in the store
	let replaceLocale = function replaceLocale(locale, translations) {
		return store.dispatch({
			type: 'replaceLocale',
			locale: locale,
			translations: translations
		});
	};

	// remove the givne locale from the store
	let removeLocale = function removeLocale(locale) {
		if (store.state[moduleName].translations.hasOwnProperty(locale)) {
			store.dispatch({
				type: 'removeLocale',
				locale: locale
			});
		}
	};

	// we are phasing out the exists function
	let phaseOutExistsFn = function phaseOutExistsFn(locale) {
		console.warn('$i18n.exists is depreceated. Please use $i18n.localeExists instead. It provides exatly the same functionality.');
		return checkLocaleExists(locale);
	};

	// check if the given locale is already loaded
	let checkLocaleExists = function checkLocaleExists(locale) {
		return store.state[moduleName].translations.hasOwnProperty(locale);
	};

	// register vue prototype methods
	Vue.prototype.$i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		replace: replaceLocale,
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
		replace: replaceLocale,
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
let renderFn = function(identifiers) {

	if (identifiers == null || identifiers.length != 2) {
		console.warn('You must specify the start and end character identifying variable substitutions');
	}

	// construct a regular expression ot find variable substitutions, i.e. {test}
	let matcher = new RegExp('' + identifiers[0] + '\\w+' + identifiers[1], 'g');

	// define the replacement function
	let replace = function replace(translation, replacements, warn = true) {

		// check if the object has a replace property
		if (!translation.replace) {
			return translation;
		}

		return translation.replace(matcher, function(placeholder) {

			// remove the identifiers (can be set on the module level)
			let key = placeholder.replace(identifiers[0], '').replace(identifiers[1], '');

			if (replacements[key] !== undefined) {
				return replacements[key];
			}

			// warn user that the placeholder has not been found
			if (warn === true) {
				console.group ? console.group('Not all placeholders found') : console.warn('Not all placeholders found');
				console.warn('Text:', translation);
				console.warn('Placeholder:', placeholder);
				if(console.groupEnd) {
				console.groupEnd();
				}
			}

			// return the original placeholder
			return placeholder;
		});
	};

	// the render function will replace variable substitutions and prepare the
	// translations for rendering
	let render = function render(locale, translation, replacements = {}, pluralization = null) {
		// get the type of the property
		let objType = typeof translation;
		let pluralizationType = typeof pluralization;

		let replacedText = function() {

			if (isArray(translation)) {

				// replace the placeholder elements in all sub-items
				return translation.map((item) => {
					return replace(item, replacements, false);
				});

			} else if (objType === 'string') {
				return replace(translation, replacements, true);
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
		let translatedText = replacedText().split(':::');
		let index = plurals.getTranslationIndex(locale, pluralization);

		if(typeof translatedText[index] === 'undefined') {
			console.warn('no pluralized translation provided in ', translation);
			return translatedText[0].trim();
		}
		else {
			return translatedText[index].trim();
		}
	};

	// return the render function to the caller
	return render;

};

// check if the given object is an array
function isArray(obj) {
	return !!obj && Array === obj.constructor;
}

export default VuexI18nPlugin;

