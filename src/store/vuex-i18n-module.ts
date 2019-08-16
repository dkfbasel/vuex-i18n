// vuex-i18n-store defines a custom i18n module to be used in the vuex store.
// The respective state, actions and commits can be accessed just like any
// other vuex module.

// import vuex-module typescript definitions
import { Module } from 'vuex';

// import the state definitions
import { ModuleState, RootState, init } from './vuex-i18n-state';

// import actions and mutations
import actions from './vuex-i18n-actions';
import mutations from './vuex-i18n-mutations';

// define a vuex module to handle locale translations
const i18nVuexModule: Module<ModuleState, RootState> = {
  // the module should be namespaced (to avoid collisions)
  namespaced: true,
  state: init(),
  mutations,
  actions,
};

export default i18nVuexModule;
