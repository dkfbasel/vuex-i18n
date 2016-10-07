// define a simple module to handle locales
const i18nVuexModule = {
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
			context.commit('SET_LOCALE', payload);
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
