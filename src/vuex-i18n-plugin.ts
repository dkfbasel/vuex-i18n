/* vuex-i18n defines the Vuexi18nPlugin to enable localization using a vuex
** module to store the translation information */

// import typescript definition for vue-plugins
import _Vue, { PluginObject } from 'vue';

// import method interfaces for i18n and $i18n (on components)
import * as types from './vuex-i18n-plugin-types';

// import the vuex module for vuex-i18n
import vuexI18nModule from './store/vuex-i18n-module';

// import function to find the required pluralization form
// given an number of items in a given language
import plurals from './store/vuex-i18n-plurals';

// add typescript definitions to extend the vue-instance and the global
// vue object with an i18n object
declare module 'vue/types/vue' {

  // declare additional properties avaiable in components
  interface Vue {
    $i18n: types.i18nMethods;
    $t: types.translateFn;
    $tlang: types.translateInFn;
  }

  // declare additional properties available in the
  // global vue instance
  interface VueConstructor {
    i18n: types.i18nMethods
  }
}


// define the options for the vuex-i18n plugin
interface vuexI18nOptions {
  store: any; // pointer to the main store
  warnings: boolean; // should warnings be emmited
  moduleName: string; // name of the vuex module
  identifiers: string[]; // identifiers to user for interpolation
  preserveState: boolean; // should the state be preserved (for server side rendering)
  translateFilterName: string; // custom name of the filter for the translate function
  translateInFilterName: string; // custom name of the filter for the translateIn function

  // custom function if no translation was found
  onTranslationNotFound: types.onTranslationNotFoundFn;
}

// initialize the plugin object
const VuexI18nPlugin: PluginObject<vuexI18nOptions> = {
  install: function install(Vue: typeof _Vue, options?: vuexI18nOptions) {
    if (!options) {
      console.error('vuex-i18n: store must now passed in options');
      return;
    }

    // merge default options with user supplied options
    const config: vuexI18nOptions = Object.assign({
      warnings: true,
      moduleName: 'i18n',
      identifiers: ['{', '}'],
      preserveState: false,
      translateFilterName: 'translate',
      translateInFilterName: 'translateIn',
      onTranslationNotFound() { },
    }, options);

    // define module name and identifiers as constants to prevent any changes
    const { moduleName } = config;
    const { identifiers } = config;
    const { translateFilterName } = config;
    const { translateInFilterName } = config;

    // add a shorthand to access the store
    const { store } = options;

    // initialize the onTranslationNotFound function and make sure it is actually
    // a function
    if (typeof config.onTranslationNotFound !== 'function') {
      console.error('vuex-i18n: i18n config option onTranslationNotFound must be a function');
      config.onTranslationNotFound = function onTranslationNotFound() { };
    }

    // register the i18n module in the vuex store
    // preserveState can be used via configuration if server side rendering is used
    store.registerModule(moduleName, vuexI18nModule, { preserveState: config.preserveState });

    // check if the plugin was correctly initialized
    if (store.state.hasOwnProperty(moduleName) === false) {
      console.error('vuex-i18n: i18n vuex module is not correctly initialized. Please check the module name:', moduleName);

      // always return the key if the vuex-i18n module is not initialized correctly
      Vue.prototype.$i18n = function i18n(key: string) {
        return key;
      };

      // do not return any language
      Vue.prototype.$getLanguage = function getLanguage() {
        return null;
      };

      // show a warning if trying to set the language
      Vue.prototype.$setLanguage = function setLanguage() {
        console.error('vuex-i18n: i18n vuex module is not correctly initialized');
      };

      return;
    }

    // initialize the replacement function
    const render = renderFn(identifiers, config.warnings);

    // get localized string from store. note that we pass the arguments passed
    // to the function directly to the translateInLanguage function
    const translate = function $t() {
      // get the current language from the store
      const { locale } = store.state[moduleName];

      return translateInLanguage(locale, ...arguments);
    };

    // get localized string from store in a given language if available.
    // there are two possible signatures for the function.
    // we will check the arguments to make up the options passed.
    // 1: locale, key, options, pluralization
    // 2: locale, key, defaultValue, options, pluralization
    let translateInLanguage = function translateInLanguage(
      locale: string, _key?: string, _args?: any[],
    ) {
      // read the function arguments
      const args = arguments;

      // initialize options
      let key = '';
      let defaultValue = '';
      let translateOptions = {};
      let pluralization = null;

      const count = args.length;

      // check if a default value was specified and fill options accordingly
      if (count >= 3 && typeof args[2] === 'string') {
        key = args[1];
        defaultValue = args[2];

        if (count > 3) {
          translateOptions = args[3];
        }

        if (count > 4) {
          pluralization = args[4];
        }
      } else {
        key = args[1];

        // default value was not specified and is therefore the same as the key
        defaultValue = key;

        if (count > 2) {
          translateOptions = args[2];
        }

        if (count > 3) {
          pluralization = args[3];
        }
      }

      // return the default value if the locale is not set (could happen on initialization)
      if (!locale) {
        if (config.warnings) console.warn('i18n: i18n locale is not set when trying to access translations:', key);
        return defaultValue;
      }

      // get the translations from the store
      const { translations } = store.state[moduleName];

      // get the last resort fallback from the store
      const { fallback } = store.state[moduleName];

      // split locale by - to support partial fallback for regional locales
      // like de-CH, en-UK
      const localeRegional = locale.split('-');

      // flag for translation to exist or not
      let translationExists = true;

      // check if the language exists in the store. return the key if not
      if (translations.hasOwnProperty(locale) === false) {
        translationExists = false;

        // check if the key exists in the store. return the key if not
      } else if (translations[locale].hasOwnProperty(key) === false) {
        translationExists = false;
      }

      // return the value from the store
      if (translationExists === true) {
        return render(locale, translations[locale][key], translateOptions, pluralization);
      }

      // check if a regional locale translation would be available for the key
      // i.e. de for de-CH
      if (localeRegional.length > 1
        && translations.hasOwnProperty(localeRegional[0]) === true
        && translations[localeRegional[0]].hasOwnProperty(key) === true) {
        return render(
          localeRegional[0], translations[localeRegional[0]][key],
          translateOptions, pluralization,
        );
      }

      // invoke a method if a translation is not found
      const asyncTranslation = config.onTranslationNotFound(locale, key, defaultValue);

      // resolve async translations by updating the store
      if (asyncTranslation) {
        Promise.resolve(asyncTranslation).then((value) => {
          const additionalTranslations: { [index: string]: any } = {};
          additionalTranslations[key] = value;
          addLocale(locale, additionalTranslations);
        });
      }

      // check if a valid fallback exists in the store.
      // return the default value if not
      if (translations.hasOwnProperty(fallback) === false) {
        return render(locale, defaultValue, translateOptions, pluralization);
      }

      // check if the key exists in the fallback locale in the store.
      // return the default value if not
      if (translations[fallback].hasOwnProperty(key) === false) {
        return render(fallback, defaultValue, translateOptions, pluralization);
      }

      return render(locale, translations[fallback][key], translateOptions, pluralization);
    };

    // add a filter function to translate in a given locale
    // (i.e. {{ 'something' | translateIn('en') }})
    const translateInLanguageFilter = function translateInLanguageFilter(
      key: string, locale: string, ...args: any[]
    ) {
      return translateInLanguage(locale, key, ...args);
    };

    // check if the given key exists in the current locale
    const checkKeyExists = function checkKeyExists(
      key: string, scope: string = 'fallback',
    ) {
      // get the current language from the store
      const { locale } = store.state[moduleName];
      const { fallback } = store.state[moduleName];
      const { translations } = store.state[moduleName];

      // check the current translation
      if (translations.hasOwnProperty(locale) && translations[locale].hasOwnProperty(key)) {
        return true;
      }

      if (scope === 'strict') {
        return false;
      }

      // check any localized translations
      const localeRegional = locale.split('-');

      if (localeRegional.length > 1
        && translations.hasOwnProperty(localeRegional[0])
        && translations[localeRegional[0]].hasOwnProperty(key)) {
        return true;
      }

      if (scope === 'locale') {
        return false;
      }

      // check if a fallback locale exists
      if (translations.hasOwnProperty(fallback) && translations[fallback].hasOwnProperty(key)) {
        return true;
      }

      // key does not exist in the store
      return false;
    };

    // set fallback locale
    const setFallbackLocale = function setFallbackLocale(locale: string) {
      store.dispatch({
        type: `${moduleName}/setFallbackLocale`,
        locale,
      });
    };

    // set the current locale
    const setLocale = function setLocale(locale: string) {
      store.dispatch({
        type: `${moduleName}/setLocale`,
        locale,
      });
    };

    // get the current locale
    const getLocale = function getLocale(): string {
      return store.state[moduleName].locale;
    };

    // get all available locales
    const getLocales = function getLocales(): string[] {
      return Object.keys(store.state[moduleName].translations);
    };

    // add predefined translations to the store (keeping existing information)
    let addLocale = function addLocale(locale: string, translations: object) {
      return store.dispatch({
        type: `${moduleName}/addLocale`,
        locale,
        translations,
      });
    };

    // replace all locale information in the store
    const replaceLocale = function replaceLocale(locale: string, translations: object) {
      return store.dispatch({
        type: `${moduleName}/replaceLocale`,
        locale,
        translations,
      });
    };

    // remove the givne locale from the store
    const removeLocale = function removeLocale(locale: string) {
      if (store.state[moduleName].translations.hasOwnProperty(locale)) {
        store.dispatch({
          type: `${moduleName}/removeLocale`,
          locale,
        });
      }
    };

    // we are phasing out the exists function
    const phaseOutExistsFn = function phaseOutExistsFn(locale: string) {
      if (config.warnings) console.warn('i18n: $i18n.exists is depreceated. Please use $i18n.localeExists instead. It provides exactly the same functionality.');
      return checkLocaleExists(locale);
    };

    // check if the given locale is already loaded
    let checkLocaleExists = function checkLocaleExists(locale: string): boolean {
      return store.state[moduleName].translations.hasOwnProperty(locale);
    };

    // reset the translations for the given locale
    const reset = function reset(locale?: string) {
      store.dispatch({
        type: `${moduleName}/reset`,
        locale,
      });
    };

    // define the i18n methods to be made available
    const i18n: types.i18nMethods = {
      locale: getLocale,
      locales: getLocales,
      set: setLocale,
      add: addLocale,
      replace: replaceLocale,
      remove: removeLocale,
      fallback: setFallbackLocale,
      localeExists: checkLocaleExists,
      keyExists: checkKeyExists,
      translate,
      translateIn: translateInLanguage,
      reset,
    };

    // register  i18n methods on the prototype and the global vue instance
    Vue.prototype.$i18n = i18n;
    Vue.i18n = i18n;

    // register the translation function on the vue instance directly
    Vue.prototype.$t = translate;

    // register the specific language translation function on the vue instance directly
    Vue.prototype.$tlang = translateInLanguage;

    // register a filter function for translations
    Vue.filter(translateFilterName, translate);
    Vue.filter(translateInFilterName, translateInLanguageFilter);
  },

};

// renderFn will initialize a function to render the variable substitutions in
// the translation string. identifiers specify the tags will be used to find
// variable substitutions, i.e. {test} or {{test}}, note that we are using a
// closure to avoid recompilation of the regular expression to match tags on
// every render cycle.
let renderFn = function renderFn(identifiers: string[], warnings: boolean = true) {
  if (identifiers === null || identifiers.length !== 2) {
    console.warn('vuex-i18n: You must specify the start and end character identifying variable substitutions');
  }

  // construct a regular expression ot find variable substitutions, i.e. {test}
  const matcher = new RegExp(`${identifiers[0]}{1}(\\w{1}|\\w.+?)${identifiers[1]}{1}`, 'g');

  // define the replacement function
  const replace = function replace(translation: string, replacements: { [index: string]: any }) {
    // check if the object has a replace property
    if (!translation.replace) {
      return translation;
    }

    return translation.replace(matcher, (placeholder) => {
      // remove the identifiers (can be set on the module level)
      const key = placeholder.replace(identifiers[0], '').replace(identifiers[1], '');

      if (replacements[key] !== undefined) {
        return replacements[key];
      }

      // warn user that the placeholder has not been found
      if (warnings) {
        if (console.group) {
          console.group('vuex-i18n: Not all placeholders found');
        } else {
          console.warn('vuex-i18n: Not all placeholders found');
        }
        console.warn('Text:', translation);
        console.warn('Placeholder:', placeholder);
        if (console.groupEnd) {
          console.groupEnd();
        }
      }

      // return the original placeholder
      return placeholder;
    });
  };

  // the render function will replace variable substitutions and prepare the
  // translations for rendering
  const render = function render(
    locale: string, translation: string | string[],
    replacements: { [index: string]: any } = {},
    pluralization: number | null = null,
  ) {
    // get the type of the property
    const objType = typeof translation;
    const pluralizationType = typeof pluralization;

    const resolvedPlaceholders = (function resolve() {
      if (isArray(translation) && translation instanceof Array) {
        // replace the placeholder elements in all sub-items
        return <string[]>translation.map((item: any) => replace(item, replacements));
      }
      return replace(<string>translation, replacements);
    }());

    // return translation item directly
    if (pluralization === null) {
      return resolvedPlaceholders;
    }

    // check if pluralization value is countable
    if (pluralizationType !== 'number') {
      if (warnings) console.warn('i18n: pluralization is not a number');
      return resolvedPlaceholders;
    }

    // --- handle pluralizations ---

    // replace all placeholders
    const resolvedTranslation = resolvedPlaceholders;

    // initialize pluralizations
    let pluralizations = null;

    // if translations are already an array and have more than one entry,
    // we will not perform a split operation on :::
    if (isArray(resolvedTranslation) && resolvedTranslation.length > 0) {
      pluralizations = resolvedTranslation;
    } else {
      // split translation strings by ::: to find create the pluralization array
      const translationText = resolvedTranslation as string;
      pluralizations = translationText.split(':::');
    }

    // determine the pluralization version to use by locale
    const index = plurals(locale, pluralization);

    // check if the specified index is present in the pluralization
    if (typeof pluralizations[index] === 'undefined') {
      if (warnings) {
        console.warn('i18n: pluralization not provided in locale', translation, locale, index);
      }

      // return the first element of the pluralization by default
      return pluralizations[0].trim();
    }

    // return the requested item from the pluralizations
    return pluralizations[index].trim();
  };

  // return the render function to the caller
  return render;
};

// check if the given object is an array
function isArray(obj: any) {
  return !!obj && Array === obj.constructor;
}

export default VuexI18nPlugin;
