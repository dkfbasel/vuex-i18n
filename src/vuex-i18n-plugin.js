/* vuex-i18n defines the Vuexi18nPlugin to enable localization using a vuex
** module to store the translation information. Make sure to also include the
** file vuex-i18n-store.js to include a respective vuex module.
*/

// initialize the plugin object
let VuexI18nPlugin = {};

// internationalization plugin for vue js using vuex
VuexI18nPlugin.install = function install(Vue, store, moduleName = 'i18n') {

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

		if (translationExist === false) {
			// check if a vaild fallback exists in the store. return the key if not
			if (translations.hasOwnProperty(fallback) === false ) {
				return render(key, options, pluralization);
			}

			// check if the key exists in the fallback in the store. return the key if not
			if (translations[fallback].hasOwnProperty(key) === false) {
				return render(key, options, pluralization);
			}
			return render(translations[fallback][key], options, pluralization);
		}

		// return the value from the store
		return render(translations[locale][key], options, pluralization);
	};

	// set fallback locale
	let setFallbackLocale = function setFallbackLocale(locale) {
		store.dispatch({
			type: 'setFallbackLocale',
			locale: locale
		});
	};

	let setLocale = function setLocale(locale) {
		store.dispatch({
			type: 'setLocale',
			locale: locale
		});
	};

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
let replace = function replace(translation, replacements, warn=true) {

	// check if the object has a replace property
	if (!translation.replace) {
		return translation;
	}

	return translation.replace(/\{\w+\}/g, function(placeholder) {

		let key = placeholder.replace('{', '').replace('}', '');

		if (replacements[key] !== undefined) {
			return replacements[key];
		}

		// warn user that the placeholder has not been found
		if (warn === true) {
			console.group('Not all placeholder founds');
			console.warn('Text:', translation);
			console.warn('Placeholder:', placeholder);
			console.groupEnd();
		}

		// return the original placeholder
		return placeholder;
	});
};

// render will return the given translation object
let render = function render(translation, replacements = {}, pluralization = null) {

	// get the type of the property
	let objType = typeof translation;

	let replacedText = function() {

		if (isArray(translation)) {

			// replace the placeholder elements in all sub-items
			return translation.map((item) => {
				return replace(item, replacements, false);
			});

		} else if (objType === 'string') {
			return replace(translation, replacements);
		}
	};

	// check for pluralization and return the correct part of the string
	if (pluralization !== null) {

		// return the left side on singular, the right side for plural
		// 0 has plural notation
		if (pluralization == 1) {
			return replacedText().split(':::')[0].trim();

		} else {
			return replacedText().split(':::')[1].trim();
		}
	}

	// return translation item directly
	return replacedText();

};

// check if the given object is an array
function isArray(obj) {
	return !!obj && Array === obj.constructor;
}



export default VuexI18nPlugin;
