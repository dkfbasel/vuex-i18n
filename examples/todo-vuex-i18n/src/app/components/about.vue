<template>
	<div :class="$style.about">
		<p>
			This is a small sample app to illustration internationalization with
			the vuex-i18n plugin.
		</p>
		<p :class="$style.back">
			<router-link :to="{name:'todos'}">Back to my list</router-link>
		</p>
	</div>
</template>

<script>
	export default {
		name: 'About'
	};
</script>

<style lang="stylus" module>

	.about {
		font-size: 24px;

		p {
			margin-bottom: 1.5em;
		}
	}

	.back {

		a {
			text-decoration: underline;
			color: #4D94E7;
		}
	}
</style>