<template>
	<div class="logo" :style="style">
		<span class="view" ></span>
	</div>
</template>
<!-- <div class="user-photo large f-left" :background-image="'url('+(member.photo || def_photo)+')'"></div> -->
<script>
	
	export default {
		props:{
			src:{
				type:String,
			},
			size:{
				type:[String,Array,Object],
				default:'60,60'
			},
			padding:{
				type:Number,
				default:0,
			},
			radius:{
				type:Number|String,
				default:5
			},
			mode:{
				type:String,
				default:'fill',//'fill'|'contain'|'cover'
			}
		},
		data() {
			return {

			}
		},
		computed:{
			style:function(){
				var style={},
					src = this.src,
					size = this.size,
					padding = this.padding,
					radius = this.radius,
					mode = this.mode
				if(this.src){
					style.backgroundImage = 'url('+src+')'
				}

				if (typeof size == 'object') {
					size = (size.width||size.w)+','+(size.height||size.h)
				}
				if (typeof size == 'string') {
					size = size.split(',')
				}
				if (size) {
					var w = size[0],h=size.length>1?size[1]:size[0]
					style.width=(w/100)+'rem'
					style.height=(h/100)+'rem'
				}
				if (padding) {
					style.padding = (padding/100)+'rem'
				}
				if (typeof radius == 'number') {
					radius = radius/100 +'rem'
				}
				style.borderRadius = radius
				switch(mode){
					case 'contain':
					style.backgroundSize = 'contain'
					break
					case 'cover':
					style.backgroundSize = 'cover'
					break
					default:
					style.backgroundSize = '100% 100%'
					break
				}
				return style
			}
		}
	}
</script>
<style scoped lang="scss">
	.logo{
		display: inline-block;
	    background-repeat: no-repeat;
	    background-position: center;
	}

</style>