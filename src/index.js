
// import the vuex module for localization
import i18nVuexModule from './vuex-i18n-store';

// import the corresponding plugin for vue
import VuexI18nPlugin from './vuex-i18n-plugin';

// export both modules as one file
export default {
	store: i18nVuexModule,
	plugin: VuexI18nPlugin
};
