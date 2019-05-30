<style scoped lang="scss">
	@import "@/assets/css/main.scss";
	@import "@/assets/css/plugin.scss";	
</style>
<template>
	<div class="poeui-page">
		<!-- <header class="poeui-content-header flex-row flex-line-center" >
		</header> -->
		<article class="poeui-content-box">
			<block class="file-block">
				123
			</block>
		</article>
	</div>

</template>
<script>
	import http from '@/utils/http'

	export default {
		route:{
			path:['/pin','/pin/index'],
			meta:{
				menu:'home',
				app:'pin'
			},
		},
		data() {
			return {}
		},
		computed:{
		},
		mounted(){
		},
		watch:{
		},
		methods:{
		}
	}
</script>