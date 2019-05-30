<style scoped lang="scss">
#c404{
	font-size:.16rem;
	h1{
		line-height:2;
		font-size:4em;
	}
	h2{
		line-height:2;
		font-weight:400;
	}
}
</style>
<template>
	<div id="c404" class="poeui-content-outter">
		<article class="poeui-content-box ma-50 hor-center">
			<h1>404</h1>
			<h2 class=" mb-100">你要找的页面回家收麦子去了！</h2>
		</article>
	</div>
</template>
<script>
export default {
	route:{
		path:'*',
		meta:{
			header:false,
			aside:false,
		}
	},
	data() {
		return {}
	}
}
</script>