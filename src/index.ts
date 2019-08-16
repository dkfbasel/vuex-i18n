
// import the vuex module for localization
import i18nVuexModule from './store/vuex-i18n-module';

// import the corresponding plugin for vue
import VuexI18nPlugin from './vuex-i18n-plugin';

// export store and plugin
export const store = i18nVuexModule;
// const plugin = VuexI18nPlugin;

export default VuexI18nPlugin;
