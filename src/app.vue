<template>
	<div id="app">
		<page-header v-if="$store.state.ui.header"/>
		<menu-list class="f-left pt-40"  v-if="$store.state.ui.aside"/>
		<main class="of-hidden pt-40 of-auto-y" > <!-- :data-catch = "$store.state.ui.catch" -->
			<router-view />
			<copy-right/>
		</main>
	</div>
</template>

<script>
export default {
	name: 'App',
}

</script>
<style lang="scss">
@import "./assets/css/animate.scss";
@import "./assets/css/mixin.scss";
@import "./assets/css/global.scss";
main{
	height: calc(100% - .6rem);
}
</style>
