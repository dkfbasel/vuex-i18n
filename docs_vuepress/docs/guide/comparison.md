# Comparison

There are other internationalization plugins available, that use a slightly
different approach.

## Vue-i18n

The internationalization plugin [vue-i18n](https://github.com/kazupon/vue-i18n)
is awesome and has many similarities with this plugin.

The main difference is that vue-i18n stores the data inside of components and
javascript objects that are passed to components, whereas vuex-i18n saves
translation inside a vuex store module.

This allows us to take advantage of all the built-in reactivity features of vue
and have an easy to understand represantation of the content that is displayed 
in the user interface.

However, vue-i18n does currently provide additional functionality – such as
interpolation of components and extraction of translations via a webpack loader –
that are currently not matched by the vuex-i18n plugin.

We are working on bringing the aforementioned features to vuex-i18n as well and
even have some additional exciting ideas on the roadmap.

One advantage of vuex-i18n is the support for languages that have multiple
plural forms.
