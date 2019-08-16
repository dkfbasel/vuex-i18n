import Vue from 'vue';
import { MutationTree } from 'vuex';
import { ModuleState } from './vuex-i18n-state';

const mutations: MutationTree<ModuleState> = {

  RESET(state: ModuleState, payload: { locale: string } = { locale: 'all' }) {
    if (payload.locale !== 'all') {
      Vue.delete(state.translations, payload.locale);
    }

    Vue.set(state, 'translations', {});
  },

  // set the current locale
  SET_LOCALE(state: ModuleState, payload: { locale: string }) {
    state.locale = payload.locale;
  },

  // add a new locale
  ADD_LOCALE(state: ModuleState, payload: { locale: string, translations: object }) {
    // reduce the given translations to a single-depth tree
    const translations = flattenTranslations(payload.translations);

    if (state.translations.hasOwnProperty(payload.locale)) {
      // get the existing translations
      const existingTranslations = state.translations[payload.locale];
      // merge the translations
      Vue.set(state.translations, payload.locale,
        Object.assign({}, existingTranslations, translations));
    } else {
      // just set the locale if it does not yet exist
      Vue.set(state.translations, payload.locale, translations);
    }
  },

  // replace existing locale information with new translations
  REPLACE_LOCALE(state: ModuleState, payload: { locale: string, translations: object }) {
    // reduce the given translations to a single-depth tree
    const translations = flattenTranslations(payload.translations);

    // replace the translations entirely
    Vue.set(state.translations, payload.locale, translations);
  },

  // remove a locale from the store
  REMOVE_LOCALE(state: ModuleState, payload: { locale: string }) {
    // check if the given locale is present in the state
    if (state.translations.hasOwnProperty(payload.locale)) {
      // check if the current locale is the given locale to remvoe
      if (state.locale === payload.locale) {
        // reset the current locale
        state.locale = null;
      }

      // create a copy of the translations object
      const translationCopy: { [index: string]: any } = Object.assign({}, state.translations);

      // remove the given locale
      delete translationCopy[payload.locale];

      // set the state to the new object
      state.translations = translationCopy;
    }
  },

  SET_FALLBACK_LOCALE(state: ModuleState, payload: { locale: string }) {
    state.fallback = payload.locale;
  },
};


// flattenTranslations will convert object trees for translations into a
// single-depth object tree
const flattenTranslations = function flattenTranslations(translations: { [index: string]: any }) {
  const toReturn: { [index: string]: any } = {};

  for (const i in translations) {
    // check if the property is present
    if (!translations.hasOwnProperty(i)) {
      continue;
    }

    // get the type of the property
    const objType = typeof translations[i];

    // allow unflattened array of strings
    if (isArray(translations[i])) {
      const count = translations[i].length;

      for (let index = 0; index < count; index++) {
        const itemType = typeof translations[i][index];

        if (itemType !== 'string') {
          console.warn('i18n:', 'currently only arrays of strings are fully supported', translations[i]);
          break;
        }
      }

      toReturn[i] = translations[i];
    } else if (objType === 'object' && objType !== null) {
      const flatObject = flattenTranslations(translations[i]);

      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = translations[i];
    }
  }
  return toReturn;
};

// check if the given object is an array
function isArray(obj: any) {
  return !!obj && Array === obj.constructor;
}


export default mutations;
