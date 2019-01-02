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

// IMPORTANT NOTE:
// The default format for the plugin is in es2015, if you do not use a transpiler
// such as babel) or for use in server side rendering (such as nuxt)
// the umd version should be loaded like this
// import vuexI18n from 'vuex-i18n/dist/vuex-i18n.umd.js';

// initialize the vuex store using the vuex module. note that you can change the
//  name of the module if you wish
const store = new Vuex.Store();

// initialize the internationalization plugin on the vue instance. note that
// the store must be passed to the plugin. the plugin will then generate some
// helper functions for components (i.e. this.$i18n.set, this.$t) and on the vue
// instance (i.e. Vue.i18n.set).
Vue.use(vuexI18n.plugin, store);

// please note that you must specify the name of the vuex module if it is
// different from i18n. i.e. Vue.use(vuexI18n.plugin, store, {moduleName: 'myName'})


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

You can specify a custom module name for vuex (default is 'i18n') or a callback that is triggered
when a key has no translation for the current locale. Please note, that the function
supplied for onTranslationNotFound will be called if the key is not in the actual
locale or a parent locale (ie. en for en-us), however, the key might still be available
in the fallback locale.

If a return value is given, this will be used as translation text for the key
that was not found. It is also possible to return a promise. This will allow you
to dynamically fetch the data from an api. Be aware, that the key will only
be resolved once and then written like any other key into the store. Therefore
subsequent calls of the same key will not trigger the onTranslationNotFound method.

```javascript

// without return value (will use fallback translation, default translation or key)
Vue.use(vuexI18n.plugin, store, {
	moduleName: 'i18n',
	onTranslationNotFound (locale, key) {
		console.warn(`i18n :: Key '${key}' not found for locale '${locale}'`);
	}}
);

// with string as return value. this will write the new value as translation
// into the store
// note: synchronous resolving of keys is not recommended as this functionality
// should be implemented in a different way
Vue.use(vuexI18n.plugin, store, {
	moduleName: 'i18n',
	onTranslationNotFound (locale, key) {
		switch(key) {
		case: '200':
			return 'Everything went fine';
			break;
		default:
			return 'There was a problem';
		}
	}}
);

// with promise as return value. this will write the new value into the store,
// after the promise is resolved
Vue.use(vuexI18n.plugin, store, {
	moduleName: 'i18n',
	onTranslationNotFound (locale, key) {

		return new Promise((resolve, reject) => {
			axios.get('/api/translations/async', {locale: locale, key:key})
			.then((result) => {
				resolve(result.data);

			}).catch() {
				reject();
			}

		})

	}}
);

```
## Config
You can pass a config object as the third parameter when use vuex-i18n. 
i.e. Vue.use(vuexI18n.plugin, store, config)

At present, the configuration options that are supported are as follows:

- `moduleName` (default `i18n`)
- `identifiers` (default `['{', '}']`)
- `preserveState` (default `false`)
- `translateFilterName` (default `translate`)
- `translateInFilterName` (default `translateIn`)
- `onTranslationNotFound` (default `function(){}`)
- `warnings`: default(`true`)

```javascript

const config = {
	moduleName: 'myName',
	translateFilterName: 't'
}

Vue.use(vuexI18n.plugin, store, config)

```

## Usage
vuex-i18n provides easy access to localized information through the use of
the `$t()` method or the `translate` filter.

The plugin will try to find the given string as key in the translations of the
currently defined locale and return the respective translation. If the string
is not found, it will return as is. This wil allow you to setup an application
very quickly without having to first define all strings in a separate template.

It is also possible to specify a fallback-locale `$i18n.fallback(locale)`. If
the key is not found in current locale, vuex-i18n will look for the key in the
fallback-locale. If the key can not be found in the fallback-locale either,
the key itself will be returned as translation.

```javascript
<div>
	// will return: "Some localized information"
	{{ $t('Some localized information')}}
</div>

```

In larger projects, it is often easier to use a more robust translation key instead
of the default text. Therefore it is also possible to specify the key and
default translation. The default value will only be used, if the key cannot be
found in the current and in the fallback locale.

```javascript
<div>
	// will return: "Default information text" if the key non.existing.key is
	// not specified in the current and the fallback locale
	{{ $t('non.existing.key', 'Default information text')}}
</div>
```

Dynamic parameters that can be passed to the translation method in the form of
key/value pairs.

```javascript
<div>
	// will return: "You have 5 new messages"
	{{ $t('You have {count} new messages', {count: 5}) }}
</div>
```

It is possible to specify custom identifiers for variable substitutions. The
respective identifiers - start and stop - must be passed when initializing the
module. Please note that a regular expression is used to match the tags.
Therefore it might be necessary to escape certain characters accordingly.

```javascript
// i.e. to use {{count}} as variable substitution.
Vue.use(vuexI18n.plugin, store, {
	identifiers: ['{{','}}']
});
```

Basic pluralization is also supported. Please note, that the singular translation
must be specified first, followed by plural translations denoted by `:::`.
Up to six pluralization forms are supported based on configuration taken from [vue-gettext](https://github.com/Polyconseil/vue-gettext).
The second option is used for variable replacements. The third option to define if
the singular or pluralized translation should be used (see below for examples).


```javascript
<div>
	// will return: "You have 5 new messages" if the third argument is 5"
	// or "You have 1 new message" if the third argument is 1
	// or "You have 0 new messages" if the third argument is 0 (note pluralized version)

	// using the translation directly (as specified in the current readme)
	{{ $t('You have {count} new message ::: You have {count} new messages', {count: 5}, 5) }}


	// using a key to lookup the translations
	{{ $t('mykey', {count: 5}, 5) }}

	// in the store
	const translations = {
	  'mykey': 'You have {count} new message ::: You have {count} new messages'
	}

	// alternative specification with array for translations
	const translations = {
	  'mykey': [
	    'You have {count} new message',
	    'You have {count} new messages'
	  ]
	}
</div>
```

```javascript
<div>
	// In case when there are more than singular and plural versions like in Latvian language.
	// will return: "5 bērni" (in english - 5 children) if the third argument is 5"
	// or "2 bērni" if the third argument is 2
	// or "1 bērns" if the third argument is 1
	// or "0 bērnu" if the third argument is 0
	{{ $t('{count} bērns ::: {count} bērni ::: {count} bērnu', {count: 5}, 5) }}
</div>
```

The current locale can be set using the `$i18n.set()` method. By default, the
translation method will select the pre-specified current locale. However, it is
possible to request a specific locale using the `$tlang()` method.

```javascript
<div>
	// will return the english translation regardless of the current locale
	{{ $tlang('en', 'You have {count} new messages', {count: 5}) }}
</div>
```

There are also several methods available on the property `this.$i18n` or `Vue.i18n`

```javascript

// translate the given key
$t(), Vue.i18n.translate()

// translate the given key in a specific locale, also available as filter
// i.e {{ 'message' | translateIn('en') }}
$tlang(), Vue.i18n.translateIn()

// get the current locale
$i18n.locale(), Vue.i18n.locale()

// get all available locales
// is is however recommended to use a computed property to fetch the locales
// returning Object.keys(this.$store.state.i18n.translations); as this will
// make use of vue's caching system.
$i18n.locales(), Vue.i18n.locales()

// set the current locale (i.e. 'de', 'en')
$i18n.set(locale), Vue.i18n.set(locale)

// add locale translation to the storage. this will extend existing information
// (i.e. 'de', {'message': 'Eine Nachricht'})
$i18n.add(locale, translations), Vue.i18n.add(locale, translations)

// replace locale translations in the storage. this will remove all previous
// locale information for the specified locale
$i18n.replace(locale, translations), Vue.i18n.replace(locale, translations)

// remove the given locale from the store
$i18n.remove(locale), Vue.i18n.remove(locale)

// set a fallback locale if translation for current locale does not exist
$i18n.fallback(locale), Vue.i18n.fallback(locale)

// check if the given locale translations are present in the store
$i18n.localeExists(locale), Vue.i18n.localeExists(locale)

// check if the given key is available (will check current, regional and fallback locale)
$i18n.keyExists(key), Vue.i18n.keyExists(key)

// optional with a second parameter to limit the scope
// strict: only current locale (exact match)
// locale: current locale and parent language locale (i.e. en-us & en)
// fallback: current locale, parent language locale and fallback locale
// the default is fallback
$i18n.keyExists(key, 'strict'), $i18n.keyExists(key, 'locale'), $i18n.keyExists(key, 'fallback'),

```

## Third-Party Integration
Thanks to Liip Team Amboss for developing an interactive translation manager for node.js. You can find it at https://github.com/liip-amboss/locale-man.


## Contributions
Any comments or suggestions are very welcome.
