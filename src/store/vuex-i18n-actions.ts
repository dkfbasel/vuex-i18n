
import { ActionTree } from 'vuex';
import { ModuleState, RootState } from './vuex-i18n-state';

// define the context to be used for actions
interface context {
  // commit actions always need to provide a type and
  // a locale and optionally some translations
  commit(payload: {
    type: string,
    locale: string,
    translations?: object
  }): any;
}

const actions: ActionTree<ModuleState, RootState> = {

  // reset the module (used for testing)
  reset(ctx: context, payload: { locale: string } = { locale: 'all' }) {
    ctx.commit({
      type: 'RESET',
      locale: payload.locale,
    });
  },

  // set the current locale
  setLocale(ctx: context, payload: { locale: string }) {
    ctx.commit({
      type: 'SET_LOCALE',
      locale: payload.locale,
    });
  },

  // add or extend a locale with translations
  addLocale(ctx: context, payload: { locale: string, translations: object }) {
    ctx.commit({
      type: 'ADD_LOCALE',
      locale: payload.locale,
      translations: payload.translations,
    });
  },

  // replace locale information
  replaceLocale(ctx: context, payload: { locale: string, translations: object }) {
    ctx.commit({
      type: 'REPLACE_LOCALE',
      locale: payload.locale,
      translations: payload.translations,
    });
  },

  // remove the given locale translations
  removeLocale(ctx: context, payload: { locale: string, translations: object }) {
    ctx.commit({
      type: 'REMOVE_LOCALE',
      locale: payload.locale,
      translations: payload.translations,
    });
  },

  setFallbackLocale(ctx: context, payload: { locale: string }) {
    ctx.commit({
      type: 'SET_FALLBACK_LOCALE',
      locale: payload.locale,
    });
  },

};

export default actions;
