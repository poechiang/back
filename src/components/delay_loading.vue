<template>
	<div class="delay-loading">
		<div class="loading">
			<span class="scale" v-for="i in 12" :key="i"></span>
		</div>
		<div class="text">{{label||'数据加载中'}}...</div>
	</div>
</template>
<script>
	export default {
		props:['label'],
	}
</script>