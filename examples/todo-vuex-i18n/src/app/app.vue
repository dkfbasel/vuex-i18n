<template>

	<div :class="$style.app">
		<intro />
		<router-view :class="$style.content" />
	</div>

</template>

<script>
	import Intro from 'components/intro.vue';
	export default {
		name: 'App',
		components: {Intro}
	};
</script>

<style lang="stylus" module>

	@require "~styles/reset.styl";

	:global body {
		background: #fff;
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 16px;
		color: rgb(64, 64, 64);
	}

	.app {
		display: flex;
		flex-direction: column;
		width: 600px;
		margin: 40px auto;
	}

</style>