module.exports = {
	dest: '../docs',
	base: '/vuex-i18n/',
	title: 'Vuex-i18n',
	description: 'Vuex-I18n is internationalization plugin for Vue.js',
	head: [
		['meta', {
			name: 'theme-color',
			content: '#3eaf7c'
		}],
	],
	serviceWorker: false,
	themeConfig: {
		repo: 'dkfbasel/vuex-i18n',
		docsDir: 'docs_vuepress/docs',
		editLinks: true,
		editLinkText: 'Help us improve the documentation',
		lastUpdated: 'Last Updated',
		nav: [{
			text: 'Release Notes',
			link: 'https://github.com/dkfbasel/vuex-i18n/releases'
		}],
		sidebar: [
			'/guide/introduction.md',
			'/guide/setup.md',
			'/guide/usage.md',
			'/guide/api.md',
			'/guide/comparison.md',
		]
	}
}