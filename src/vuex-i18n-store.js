/* vuex-i18n-store defines a vuex module to store locale translations. Make sure
** to also include the file vuex-i18n.js to enable easy access to localized
** strings in your vue components.
*/

// define a simple vuex module to handle locale translations
const i18nVuexModule =  {
	state: {
		locale: null,
		translations: {}
	},
	mutations: {

		// set the current locale
		SET_LOCALE(state, payload) {
			state.locale = payload.locale;
		},

		// add a new locale
		ADD_LOCALE(state, payload) {
			state.translations[payload.locale] = payload.translations;
		}

	},
	actions: {

		// set the current locale
		setLocale(context, payload) {
			context.commit({
				type: 'SET_LOCALE',
				locale: payload.locale
			});
		},

		// add a new locale with translations
		addLocale(context, payload) {
			context.commit({
				type: 'ADD_LOCALE',
				locale: payload.locale,
				translations: payload.translations
			});
		}

	}
};

export default i18nVuexModule;
