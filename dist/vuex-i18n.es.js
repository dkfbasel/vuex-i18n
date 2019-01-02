function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/* vuex-i18n-store defines a vuex module to store locale translations. Make sure
** to also include the file vuex-i18n.js to enable easy access to localized
** strings in your vue components.
*/
// define a simple vuex module to handle locale translations
var i18nVuexModule = {
  namespaced: true,
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

      if (state.translations.hasOwnProperty(payload.locale)) {
        // get the existing translations
        var existingTranslations = state.translations[payload.locale]; // merge the translations

        state.translations[payload.locale] = Object.assign({}, existingTranslations, translations);
      } else {
        // just set the locale if it does not yet exist
        state.translations[payload.locale] = translations;
      } // make sure to notify vue of changes (this might break with new vue versions)


      try {
        if (state.translations.__ob__) {
          state.translations.__ob__.dep.notify();
        }
      } catch (ex) {}
    },
    // replace existing locale information with new translations
    REPLACE_LOCALE: function REPLACE_LOCALE(state, payload) {
      // reduce the given translations to a single-depth tree
      var translations = flattenTranslations(payload.translations); // replace the translations entirely

      state.translations[payload.locale] = translations; // make sure to notify vue of changes (this might break with new vue versions)

      try {
        if (state.translations.__ob__) {
          state.translations.__ob__.dep.notify();
        }
      } catch (ex) {}
    },
    // remove a locale from the store
    REMOVE_LOCALE: function REMOVE_LOCALE(state, payload) {
      // check if the given locale is present in the state
      if (state.translations.hasOwnProperty(payload.locale)) {
        // check if the current locale is the given locale to remvoe
        if (state.locale === payload.locale) {
          // reset the current locale
          state.locale = null;
        } // create a copy of the translations object


        var translationCopy = Object.assign({}, state.translations); // remove the given locale

        delete translationCopy[payload.locale]; // set the state to the new object

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
    // add or extend a locale with translations
    addLocale: function addLocale(context, payload) {
      context.commit({
        type: 'ADD_LOCALE',
        locale: payload.locale,
        translations: payload.translations
      });
    },
    // replace locale information
    replaceLocale: function replaceLocale(context, payload) {
      context.commit({
        type: 'REPLACE_LOCALE',
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
}; // flattenTranslations will convert object trees for translations into a
// single-depth object tree

var flattenTranslations = function flattenTranslations(translations) {
  var toReturn = {};

  for (var i in translations) {
    // check if the property is present
    if (!translations.hasOwnProperty(i)) {
      continue;
    } // get the type of the property


    var objType = _typeof(translations[i]); // allow unflattened array of strings


    if (isArray(translations[i])) {
      var count = translations[i].length;

      for (var index = 0; index < count; index++) {
        var itemType = _typeof(translations[i][index]);

        if (itemType !== 'string') {
          console.warn('i18n:', 'currently only arrays of strings are fully supported', translations[i]);
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
}; // check if the given object is an array


function isArray(obj) {
  return !!obj && Array === obj.constructor;
}

var plurals = {
  getTranslationIndex: function getTranslationIndex(languageCode, n) {
    switch (languageCode) {
      case 'ay': // Aymará

      case 'bo': // Tibetan

      case 'cgg': // Chiga

      case 'dz': // Dzongkha

      case 'fa': // Persian

      case 'id': // Indonesian

      case 'ja': // Japanese

      case 'jbo': // Lojban

      case 'ka': // Georgian

      case 'kk': // Kazakh

      case 'km': // Khmer

      case 'ko': // Korean

      case 'ky': // Kyrgyz

      case 'lo': // Lao

      case 'ms': // Malay

      case 'my': // Burmese

      case 'sah': // Yakut

      case 'su': // Sundanese

      case 'th': // Thai

      case 'tt': // Tatar

      case 'ug': // Uyghur

      case 'vi': // Vietnamese

      case 'wo': // Wolof

      case 'zh':
        // Chinese
        // 1 form
        return 0;

      case 'is':
        // Icelandic
        // 2 forms
        return n % 10 !== 1 || n % 100 === 11 ? 1 : 0;

      case 'jv':
        // Javanese
        // 2 forms
        return n !== 0 ? 1 : 0;

      case 'mk':
        // Macedonian
        // 2 forms
        return n === 1 || n % 10 === 1 ? 0 : 1;

      case 'ach': // Acholi

      case 'ak': // Akan

      case 'am': // Amharic

      case 'arn': // Mapudungun

      case 'br': // Breton

      case 'fil': // Filipino

      case 'fr': // French

      case 'gun': // Gun

      case 'ln': // Lingala

      case 'mfe': // Mauritian Creole

      case 'mg': // Malagasy

      case 'mi': // Maori

      case 'oc': // Occitan

      case 'pt_BR': // Brazilian Portuguese

      case 'tg': // Tajik

      case 'ti': // Tigrinya

      case 'tr': // Turkish

      case 'uz': // Uzbek

      case 'wa': // Walloon

      /* eslint-disable */

      /* Disable "Duplicate case label" because there are 2 forms of Chinese plurals */

      case 'zh':
        // Chinese

        /* eslint-enable */
        // 2 forms
        return n > 1 ? 1 : 0;

      case 'lv':
        // Latvian
        // 3 forms
        return n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2;

      case 'lt':
        // Lithuanian
        // 3 forms
        return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;

      case 'be': // Belarusian

      case 'bs': // Bosnian

      case 'hr': // Croatian

      case 'ru': // Russian

      case 'sr': // Serbian

      case 'uk':
        // Ukrainian
        // 3 forms
        return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;

      case 'mnk':
        // Mandinka
        // 3 forms
        return n === 0 ? 0 : n === 1 ? 1 : 2;

      case 'ro':
        // Romanian
        // 3 forms
        return n === 1 ? 0 : n === 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2;

      case 'pl':
        // Polish
        // 3 forms
        return n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;

      case 'cs': // Czech

      case 'sk':
        // Slovak
        // 3 forms
        return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2;

      case 'csb':
        // Kashubian
        // 3 forms
        return n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;

      case 'sl':
        // Slovenian
        // 4 forms
        return n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3;

      case 'mt':
        // Maltese
        // 4 forms
        return n === 1 ? 0 : n === 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3;

      case 'gd':
        // Scottish Gaelic
        // 4 forms
        return n === 1 || n === 11 ? 0 : n === 2 || n === 12 ? 1 : n > 2 && n < 20 ? 2 : 3;

      case 'cy':
        // Welsh
        // 4 forms
        return n === 1 ? 0 : n === 2 ? 1 : n !== 8 && n !== 11 ? 2 : 3;

      case 'kw':
        // Cornish
        // 4 forms
        return n === 1 ? 0 : n === 2 ? 1 : n === 3 ? 2 : 3;

      case 'ga':
        // Irish
        // 5 forms
        return n === 1 ? 0 : n === 2 ? 1 : n > 2 && n < 7 ? 2 : n > 6 && n < 11 ? 3 : 4;

      case 'ar':
        // Arabic
        // 6 forms
        return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;

      default:
        // Everything else
        return n !== 1 ? 1 : 0;
    }
  }
};

var VuexI18nPlugin = {}; // internationalization plugin for vue js using vuex

VuexI18nPlugin.install = function install(Vue, store, config) {
  // TODO: remove this block for next major update (API break)
  if (typeof arguments[2] === 'string' || typeof arguments[3] === 'string') {
    console.warn('i18n: Registering the plugin vuex-i18n with a string for `moduleName` or `identifiers` is deprecated. Use a configuration object instead.', 'https://github.com/dkfbasel/vuex-i18n#setup');
    config = {
      moduleName: arguments[2],
      identifiers: arguments[3]
    };
  } // merge default options with user supplied options


  config = Object.assign({
    warnings: true,
    moduleName: 'i18n',
    identifiers: ['{', '}'],
    preserveState: false,
    translateFilterName: 'translate',
    translateInFilterName: 'translateIn',
    onTranslationNotFound: function onTranslationNotFound() {}
  }, config); // define module name and identifiers as constants to prevent any changes

  var moduleName = config.moduleName;
  var identifiers = config.identifiers;
  var translateFilterName = config.translateFilterName;
  var translateInFilterName = config.translateInFilterName; // initialize the onTranslationNotFound function and make sure it is actually
  // a function

  var onTranslationNotFound = config.onTranslationNotFound;

  if (typeof onTranslationNotFound !== 'function') {
    console.error('i18n: i18n config option onTranslationNotFound must be a function');

    onTranslationNotFound = function onTranslationNotFound() {};
  } // register the i18n module in the vuex store
  // preserveState can be used via configuration if server side rendering is used


  store.registerModule(moduleName, i18nVuexModule, {
    preserveState: config.preserveState
  }); // check if the plugin was correctly initialized

  if (store.state.hasOwnProperty(moduleName) === false) {
    console.error('i18n: i18n vuex module is not correctly initialized. Please check the module name:', moduleName); // always return the key if module is not initialized correctly

    Vue.prototype.$i18n = function (key) {
      return key;
    };

    Vue.prototype.$getLanguage = function () {
      return null;
    };

    Vue.prototype.$setLanguage = function () {
      console.error('i18n: i18n vuex module is not correctly initialized');
    };

    return;
  }

  var render = renderFn(identifiers, config.warnings); // get localized string from store. note that we pass the arguments passed
  // to the function directly to the translateInLanguage function

  var translate = function $t() {
    // get the current language from the store
    var locale = store.state[moduleName].locale;
    return translateInLanguage.apply(void 0, [locale].concat(Array.prototype.slice.call(arguments)));
  }; // get localized string from store in a given language if available.
  // there are two possible signatures for the function.
  // we will check the arguments to make up the options passed.
  // 1: locale, key, options, pluralization
  // 2: locale, key, defaultValue, options, pluralization


  var translateInLanguage = function translateInLanguage(locale) {
    // read the function arguments
    var args = arguments; // initialize options

    var key = '';
    var defaultValue = '';
    var options = {};
    var pluralization = null;
    var count = args.length; // check if a default value was specified and fill options accordingly

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
      key = args[1]; // default value was not specified and is therefore the same as the key

      defaultValue = key;

      if (count > 2) {
        options = args[2];
      }

      if (count > 3) {
        pluralization = args[3];
      }
    } // return the default value if the locale is not set (could happen on initialization)


    if (!locale) {
      if (config.warnings) console.warn('i18n: i18n locale is not set when trying to access translations:', key);
      return defaultValue;
    } // get the translations from the store


    var translations = store.state[moduleName].translations; // get the last resort fallback from the store

    var fallback = store.state[moduleName].fallback; // split locale by - to support partial fallback for regional locales
    // like de-CH, en-UK

    var localeRegional = locale.split('-'); // flag for translation to exist or not

    var translationExists = true; // check if the language exists in the store. return the key if not

    if (translations.hasOwnProperty(locale) === false) {
      translationExists = false; // check if the key exists in the store. return the key if not
    } else if (translations[locale].hasOwnProperty(key) === false) {
      translationExists = false;
    } // return the value from the store


    if (translationExists === true) {
      return render(locale, translations[locale][key], options, pluralization);
    } // check if a regional locale translation would be available for the key
    // i.e. de for de-CH


    if (localeRegional.length > 1 && translations.hasOwnProperty(localeRegional[0]) === true && translations[localeRegional[0]].hasOwnProperty(key) === true) {
      return render(localeRegional[0], translations[localeRegional[0]][key], options, pluralization);
    } // invoke a method if a translation is not found


    var asyncTranslation = onTranslationNotFound(locale, key, defaultValue); // resolve async translations by updating the store

    if (asyncTranslation) {
      Promise.resolve(asyncTranslation).then(function (value) {
        var additionalTranslations = {};
        additionalTranslations[key] = value;
        addLocale(locale, additionalTranslations);
      });
    } // check if a vaild fallback exists in the store.
    // return the default value if not


    if (translations.hasOwnProperty(fallback) === false) {
      return render(locale, defaultValue, options, pluralization);
    } // check if the key exists in the fallback locale in the store.
    // return the default value if not


    if (translations[fallback].hasOwnProperty(key) === false) {
      return render(fallback, defaultValue, options, pluralization);
    }

    return render(locale, translations[fallback][key], options, pluralization);
  }; // add a filter function to translate in a given locale (i.e. {{ 'something' | translateIn('en') }})


  var translateInLanguageFilter = function translateInLanguageFilter(key, locale) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return translateInLanguage.apply(void 0, [locale, key].concat(args));
  }; // check if the given key exists in the current locale


  var checkKeyExists = function checkKeyExists(key) {
    var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fallback';
    // get the current language from the store
    var locale = store.state[moduleName].locale;
    var fallback = store.state[moduleName].fallback;
    var translations = store.state[moduleName].translations; // check the current translation

    if (translations.hasOwnProperty(locale) && translations[locale].hasOwnProperty(key)) {
      return true;
    }

    if (scope == 'strict') {
      return false;
    } // check any localized translations


    var localeRegional = locale.split('-');

    if (localeRegional.length > 1 && translations.hasOwnProperty(localeRegional[0]) && translations[localeRegional[0]].hasOwnProperty(key)) {
      return true;
    }

    if (scope == 'locale') {
      return false;
    } // check if a fallback locale exists


    if (translations.hasOwnProperty(fallback) && translations[fallback].hasOwnProperty(key)) {
      return true;
    } // key does not exist in the store


    return false;
  }; // set fallback locale


  var setFallbackLocale = function setFallbackLocale(locale) {
    store.dispatch({
      type: "".concat(moduleName, "/setFallbackLocale"),
      locale: locale
    });
  }; // set the current locale


  var setLocale = function setLocale(locale) {
    store.dispatch({
      type: "".concat(moduleName, "/setLocale"),
      locale: locale
    });
  }; // get the current locale


  var getLocale = function getLocale() {
    return store.state[moduleName].locale;
  }; // get all available locales


  var getLocales = function getLocales() {
    return Object.keys(store.state[moduleName].translations);
  }; // add predefined translations to the store (keeping existing information)


  var addLocale = function addLocale(locale, translations) {
    return store.dispatch({
      type: "".concat(moduleName, "/addLocale"),
      locale: locale,
      translations: translations
    });
  }; // replace all locale information in the store


  var replaceLocale = function replaceLocale(locale, translations) {
    return store.dispatch({
      type: "".concat(moduleName, "/replaceLocale"),
      locale: locale,
      translations: translations
    });
  }; // remove the givne locale from the store


  var removeLocale = function removeLocale(locale) {
    if (store.state[moduleName].translations.hasOwnProperty(locale)) {
      store.dispatch({
        type: "".concat(moduleName, "/removeLocale"),
        locale: locale
      });
    }
  }; // we are phasing out the exists function


  var phaseOutExistsFn = function phaseOutExistsFn(locale) {
    if (config.warnings) console.warn('i18n: $i18n.exists is depreceated. Please use $i18n.localeExists instead. It provides exactly the same functionality.');
    return checkLocaleExists(locale);
  }; // check if the given locale is already loaded


  var checkLocaleExists = function checkLocaleExists(locale) {
    return store.state[moduleName].translations.hasOwnProperty(locale);
  }; // register vue prototype methods


  Vue.prototype.$i18n = {
    locale: getLocale,
    locales: getLocales,
    set: setLocale,
    add: addLocale,
    replace: replaceLocale,
    remove: removeLocale,
    fallback: setFallbackLocale,
    localeExists: checkLocaleExists,
    keyExists: checkKeyExists,
    translate: translate,
    translateIn: translateInLanguage,
    exists: phaseOutExistsFn
  }; // register global methods

  Vue.i18n = {
    locale: getLocale,
    locales: getLocales,
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
  }; // register the translation function on the vue instance directly

  Vue.prototype.$t = translate; // register the specific language translation function on the vue instance directly

  Vue.prototype.$tlang = translateInLanguage; // register a filter function for translations

  Vue.filter(translateFilterName, translate);
  Vue.filter(translateInFilterName, translateInLanguageFilter);
}; // renderFn will initialize a function to render the variable substitutions in
// the translation string. identifiers specify the tags will be used to find
// variable substitutions, i.e. {test} or {{test}}, note that we are using a
// closure to avoid recompilation of the regular expression to match tags on
// every render cycle.


var renderFn = function renderFn(identifiers) {
  var warnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (identifiers == null || identifiers.length != 2) {
    console.warn('i18n: You must specify the start and end character identifying variable substitutions');
  } // construct a regular expression ot find variable substitutions, i.e. {test}


  var matcher = new RegExp('' + identifiers[0] + '{1}(\\w{1}|\\w.+?)' + identifiers[1] + '{1}', 'g'); // define the replacement function

  var replace = function replace(translation, replacements) {
    // check if the object has a replace property
    if (!translation.replace) {
      return translation;
    }

    return translation.replace(matcher, function (placeholder) {
      // remove the identifiers (can be set on the module level)
      var key = placeholder.replace(identifiers[0], '').replace(identifiers[1], '');

      if (replacements[key] !== undefined) {
        return replacements[key];
      } // warn user that the placeholder has not been found


      if (warnings) {
        console.group ? console.group('i18n: Not all placeholders found') : console.warn('i18n: Not all placeholders found');
        console.warn('Text:', translation);
        console.warn('Placeholder:', placeholder);

        if (console.groupEnd) {
          console.groupEnd();
        }
      } // return the original placeholder


      return placeholder;
    });
  }; // the render function will replace variable substitutions and prepare the
  // translations for rendering


  var render = function render(locale, translation) {
    var replacements = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var pluralization = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    // get the type of the property
    var objType = _typeof(translation);

    var pluralizationType = _typeof(pluralization);

    var resolvePlaceholders = function resolvePlaceholders() {
      if (isArray$1(translation)) {
        // replace the placeholder elements in all sub-items
        return translation.map(function (item) {
          return replace(item, replacements, false);
        });
      } else if (objType === 'string') {
        return replace(translation, replacements, true);
      }
    }; // return translation item directly


    if (pluralization === null) {
      return resolvePlaceholders();
    } // check if pluralization value is countable


    if (pluralizationType !== 'number') {
      if (warnings) console.warn('i18n: pluralization is not a number');
      return resolvePlaceholders();
    } // --- handle pluralizations ---
    // replace all placeholders


    var resolvedTranslation = resolvePlaceholders(); // initialize pluralizations

    var pluralizations = null; // if translations are already an array and have more than one entry,
    // we will not perform a split operation on :::

    if (isArray$1(resolvedTranslation) && resolvedTranslation.length > 0) {
      pluralizations = resolvedTranslation;
    } else {
      // split translation strings by ::: to find create the pluralization array
      pluralizations = resolvedTranslation.split(':::');
    } // determine the pluralization version to use by locale


    var index = plurals.getTranslationIndex(locale, pluralization); // check if the specified index is present in the pluralization

    if (typeof pluralizations[index] === 'undefined') {
      if (warnings) {
        console.warn('i18n: pluralization not provided in locale', translation, locale, index);
      } // return the first element of the pluralization by default


      return pluralizations[0].trim();
    } // return the requested item from the pluralizations


    return pluralizations[index].trim();
  }; // return the render function to the caller


  return render;
}; // check if the given object is an array


function isArray$1(obj) {
  return !!obj && Array === obj.constructor;
}

// import the vuex module for localization

var index = {
  store: i18nVuexModule,
  plugin: VuexI18nPlugin
};

export default index;
