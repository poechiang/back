<template>
	<span class="vue-tip" :class="themeColor" :style="style"><slot></slot></span>
</template>
<script>
	export default{
		props:['theme','color','size'],
		data(){
			return {}
		},
		computed:{
			themeColor(){
				if(!this.theme){
					return 'tip'
				}
				return 'tip-'+this.theme;
			},
			style(){
				
				var s = {
					fontSize:(this.size||14)/100+'rem',
				}

				if (this.color) {
					s.color = this.color
				}
				return s
			}
		}
	}
</script>