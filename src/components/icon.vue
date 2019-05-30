<template>
	<span class="iconfont" v-if="isUnicode" v-html="useFace" :style="iconStyle"></span>
	<svg class="icon" aria-hidden="true" v-else v-html="useFace" :style="iconStyle"></svg>
</template>
<script>
	export default {
		props:['face','size','color'],
		data() {
			return {
				perffix:'icon',
				name:this.face,
				fontSize:this.size||'1.2em'
			}
		},
		watch:{
			face(v){
				this.name = v
			}
		},
		computed:{
			isUnicode(){
				return this.name && this.name.startsWith('&#x') && this.name.endsWith(';')
			},
			useFace:function(){
				return this.isUnicode?this.name:'<use xlink:href="#'+this.perffix+'-'+this.name+'"></use>'
			},
			iconStyle:function(){
				var style={fontSize:this.fontSize}
				if (this.fontColor) {
					style.color=this.fontColor
				}
				return style
			}
		}
	}
</script>