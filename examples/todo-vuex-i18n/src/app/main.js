import Vue from 'vue';

// import a vuex store to handle all state in one location
import store from './store/index';

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
