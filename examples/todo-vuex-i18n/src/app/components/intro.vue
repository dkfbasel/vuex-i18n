<template>
	<div :class="$style.intro">
		Welcome to our <span :class="$style.awesome">awesome</span> Toodoo App
	</div>
</template>

<script>
	export default {
		name: 'Intro'
	};
</script>

<style lang="stylus" module>

	.intro {
		display: block;
		font-size: 64px;
		font-weight: 300;
		margin-bottom: 40px;
	}

	.awesome {
		background: #D3B63A;
	}

</style>