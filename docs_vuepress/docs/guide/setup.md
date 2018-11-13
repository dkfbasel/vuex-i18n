
# Setup

The vuex-i18n plugin is intended to be used for applications that use vuex as
store and require localized messages. Make sure that both vue and vuex have
been loaded beforehand.

The plugin provides to main components:

- A vuex module to store the localization information and translations
- A vue plugin to allow easy access to localized information from components

The plugin does not make any assumption on how you want to load the localization
information. It can be loaded on start in your application bundle or dynamically
after when the user is switching to a different language.


## Webpack-Setup

The plugin can be used with your regular vue webpack setup. Please note, that
the default distribution is in es2015 format. Therefore your code should be transpiled
with something like babel to ensure compatibility to older browsers.

Install the plugin using npm or yarn
```
$ npm install vuex-i18n
```

```js
// load vue and vuex instance
import Vue from 'vue';
import Vuex from 'vuex';

// load vuex i18n module (es2015 format by default)
import vuexI18n from 'vuex-i18n';

// initialize the vuex store using the vuex module. note that you can change the
// name of the module if you wish
const store = new Vuex.Store();

// initialize the internationalization plugin on the vue instance. note that
// the store must be passed to the plugin. the plugin will then generate some
// helper functions for components (i.e. this.$i18n.set, this.$t) and on the vue
// instance (i.e. Vue.i18n.set).
Vue.use(vuexI18n.plugin, store);

// add some translations (could also be loaded from a separate file)
// note that it is possible to use placeholders. translations can also be
// structured as object trees and will automatically be flattened by the the
// plugin
const translationsEn = {
	"content": "This is some {type} content"
};

// translations can be kept in separate files for each language
// i.e. resources/i18n/de.json.
const translationsDe = {
	"My nice title": "Ein schöner Titel",
	"content": "Dies ist ein toller Inhalt"
};

// add translations directly to the application
Vue.i18n.add('en', translationsEn);
Vue.i18n.add('de', translationsDe);

// set the start locale to use
Vue.i18n.set('en');

// create a new component (requires a div with id app as mount point)
// you can use the method $t to access translations. the value will be returned
// as is, if no corresponding key is found in the translations
var app = new Vue({
	store,
	el: '#app',
	template: `
		<div>
			<h1>{{ 'My nice title' | translate }}</h1>
			<p>{{ $t('content', {'type': 'nice'}) }}</p>
		</div>
	`
});

```

## Server-Side-Rendering

The default format for the plugin is es2015, if you do not use a transpiler
(such as babel) or for use in server side rendering (such as nuxt) the umd version 
of the plugin should be loaded.

```js

// load vue and vuex instance
import Vue from 'vue';
import Vuex from 'vuex';

// load vuex i18n module in umd version
import vuexI18n from 'vuex-i18n/dist/vuex-i18n.umd.js';

...
```


