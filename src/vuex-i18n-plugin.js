/* vuex-i18n defines the Vuexi18nPlugin to enable localization using a vuex
** module to store the translation information. Make sure to also include the
** file vuex-i18n-store.js to include a respective vuex module.
*/

import module from './vuex-i18n-store';

// initialize the plugin object
let VuexI18nPlugin = {};

// internationalization plugin for vue js using vuex
VuexI18nPlugin.install = function install(Vue, store, moduleName = 'i18n', identifiers = ['{', '}']) {

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

	// get localized string from store
	let translate = function $t(key, options, pluralization) {

		// get the current language from the store
		let locale = store.state[moduleName].locale;

		return translateInLanguage(locale, key, options, pluralization);
	};

	// get localized string from store in a given language if available
	let translateInLanguage = function translateInLanguage(locale, key, options, pluralization) {

		// get the current language from the store
		let fallback = store.state[moduleName].fallback;
		let translations = store.state[moduleName].translations;

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
			return render(translations[locale][key], options, pluralization, identifiers);
		}

		// check if a vaild fallback exists in the store. return the key if not
		if (translations.hasOwnProperty(fallback) === false ) {
			return render(key, options, pluralization, identifiers);
		}

		// check if the key exists in the fallback in the store. return the key if not
		if (translations[fallback].hasOwnProperty(key) === false) {
			return render(key, options, pluralization, identifiers);
		}

		return render(translations[fallback][key], options, pluralization, identifiers);

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

	// add predefined translations to the store
	let addLocale = function addLocale(locale, translations) {
		return store.dispatch({
			type: 'addLocale',
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

	// check if the given locale is already loaded
	let checkLocaleExists = function checkLocaleExists(locale) {
		return store.state[moduleName].translations.hasOwnProperty(locale);
	};

	// register vue prototype methods
	Vue.prototype.$i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		fallback: setFallbackLocale,
		exists: checkLocaleExists
	};

	// register global methods
	Vue.i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale,
		remove: removeLocale,
		fallback: setFallbackLocale,
		exists: checkLocaleExists,
		translate: translate,
		translateIn: translateInLanguage
	};

	// register the translation function on the vue instance
	Vue.prototype.$t = translate;

	// register the specific language translation function on the vue instance
	Vue.prototype.$tlang = translateInLanguage;

	// register a filter function for translations
	Vue.filter('translate', translate);

};

// replace will replace the given replacements in the translation string
// it is possible to specify the identifiers that should be used for variable substitutions
let replace = function replace(translation, replacements, warn = true, identifiers = null) {

	if (identifiers == null || identifiers.length != 2) {
		console.warn('You must specify the start and end character identifying variable substitutions');
	}

	// check if the object has a replace property
	if (!translation.replace) {
		return translation;
	}

	// construct a regular expression ot find variable substitutions, i.e. {test}
	let matcher = new RegExp('' + identifiers[0] + '\\w+' + identifiers[1], 'g');

	return translation.replace(matcher, function(placeholder) {

		// remove the identifiers (can be set on the module level)
		let key = placeholder.replace(identifiers[0], '').replace(identifiers[1], '');

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

// render will return the given translation object
let render = function render(translation, replacements = {}, pluralization = null, identifiers = null) {

	// get the type of the property
	let objType = typeof translation;
	let pluralizationType = typeof pluralization;

	let replacedText = function() {

		if (isArray(translation)) {

			// replace the placeholder elements in all sub-items
			return translation.map((item) => {
				return replace(item, replacements, false, identifiers);
			});

		} else if (objType === 'string') {
			return replace(translation, replacements, true, identifiers);
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

// check if the given object is an array
function isArray(obj) {
	return !!obj && Array === obj.constructor;
}



export default VuexI18nPlugin;
