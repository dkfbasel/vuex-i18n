import Vue from 'vue';

// use vuex for state management
import Vuex from 'vuex';
Vue.use(Vuex);

// initilialize a new vuex store
import state from './store/state';
import mutations from './store/mutations';
import actions from './store/actions';

const store = new Vuex.Store({
	state: state,
	mutations: mutations,
	actions: actions
});

// initialize the vuex-i18 module
import vuexI18n from 'vuex-i18n';
Vue.use(vuexI18n.plugin, store);

// import predefined localizations
import translationsEn from 'i18n/en.js';
import translationsDe from 'i18n/de.js';

// add translations
Vue.i18n.add('en', translationsEn);
Vue.i18n.add('de', translationsDe);

// default locale is english
Vue.i18n.set('en');

// use vue-router for navigation
import Router from 'vue-router';
import routes from './routes.js';

// make the router components and methods available to all vue components
Vue.use(Router);

// initialize a new router
var router = new Router({
	mode: 'history',
	routes: routes
});

// synchronize the router with vuex
import {sync} from 'vuex-router-sync';
sync(store, router);

// import the main app component
import App from './app.vue';

// initialize the application
new Vue({
	router,
	store,
	el: '#app',
	render: h => h(App)
});
