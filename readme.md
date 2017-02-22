# vuex-i18n
We are big fans of the awesome vue, vuex and vue-router libraries and were just
looking for an easy to use internationalization plugin, employing as much of
the "standard library" as possible.

The main difference to other internationalization plugins is the ease of use
and support for locales directly with the application or later from the server.

## Requirements
- Vue ^2.0.0
- Vuex ^2.0.0

## Installation
```
$ npm install vuex-i18n
```

## Setup
The vuex-i18n plugin is intended to be used for applications that use vuex as
store and require localized messages. Make sure that both vue and vuex have
been loaded beforehand.

The plugin provides a vuex module to store the localization information and
translations and a plugin to allow easy access from components.

The plugin does not make any assumption on how you want to load the localization
information. It can be loaded on start in your application bundle or dynamically
after when the user is switching to a different language.

A corresponding example can be found in the test directory.

```javascript

// load vue and vuex instance
import Vue from 'vue';
import Vuex from 'vuex';

// load vuex i18n module
import vuexI18n from 'vuex-i18n';

// initialize the vuex store using the vuex module. note that you can change the
//  name of the module if you wish
const store = new Vuex.Store({
	modules: {
		i18n: vuexI18n.store
	}
});

// initialize the internationalization plugin on the vue instance. note that
// the store must be passed to the plugin. the plugin will then generate some
// helper functions for components (i.e. this.$i18n.set, this.$t) and on the vue
// instance (i.e. Vue.i18n.set).
Vue.use(vuexI18n.plugin, store);

// please note that you must specify the name of the vuex module if it is
// different from i18n. i.e. Vue.use(vuexI18n.plugin, store, 'myName')


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
			<p>{{ $t('content', {'type': 'nice'}) }}
		</div>
	`
});

```

## Usage
The plugin provides easy access to localized information through the use of
the `$t()` method or the `translate` filter.

The plugin will try to find the given string as key in the translations of the
currently defined locale and return the respective translation. If the string
is not found, it will return as is. This allows to setup an application very
quickly without having to first define all strings in a separate template.

```javascript
<div>
	// will return: "Some localized information"
	{{ $t('Some localized information')}}
</div>

```

The `$t()` method also allows for inclusion of dynamic parameters that can be
passed to the method in the form of key/value pairs

```javascript
<div>
	// will return: "You have 5 new messages"
	{{ $t('You have {number} new messages', {number: 5}) }}
</div>
```

The `$t()` method support basic pluralization

```javascript
<div>
	// will return: "You have 5 new messages" or "You have one new message" if number passed is 1
	{{ $t('You have one new message ::: You have {number} new messages', {number: 5}, 5) }}
</div>
```

If you want to fetch a translation for a specific language, whats currently not
the locale use the `$tlang()` method.

```javascript
<div>
	// will return the english translation regardless of the current locale
	{{ $tlang('en', 'You have {number} new messages', {number: 5}) }}
</div>
```

There are also several methods available on the property `this.$i18n` or `Vue.i18n`

```javascript
$i18n.locale(), Vue.i18n.locale()		
	// get the current locale

$i18n.set(locale), Vue.i18n.set(locale)
	// set the current locale (i.e. 'de', 'en')

$i18n.add(locale, translations), Vue.i18n.add(locale, translations)
	// add a new locale to the storage
	// (i.e. 'de', {'message': 'Eine Nachricht'})

$i18n.exists(locale), Vue.i18n.exists(locale)
	// check if the given locale translations are present in the store

$i18n.remove(locale), Vue.i18n.remove(locale)
	// remove the given locale from the store

$i18n.fallback(locale), Vue.i18n.fallback(locale)
	// set a fallback locale if translation for current locale does not exist
```

## Contributions
Any comments or suggestions are very welcome.
