<template>
	<div class="search">
		<icon class="search-icon" :face="icon" v-if="buttons===false"/>
		<input class="search" :class="{'pl-28':buttons===false}" type="search" v-model="locale" @keydown.enter="search('enter')" placeholder="产品名称、标签、关键字……">
		<template v-if="buttons!==false">
			
			<a class="btn btn-search iconfont noselect" :class="{valid:locale}" href="javascript:;" @click="search('click')">&#xe7b4;</a>
			<transition name="fade">
				<a class="btn btn-clear iconfont noselect" href="javascript:;" v-if="locale" @click="clear">&#xe78e;</a>
			</transition>

		</template>
	</div>
</template>
<script>
	export default{
		props:['keys','autoClear','enter','buttons'],
		model:{
			prop:'keys',
			event:'change'
		},
		data(){
			return {
				icon:'&#xe7b4;',
				locale:this.keys
			}
		},
		watch:{
			keys(v){
				this.locale = v
			},
			locale(v){
				this.$emit('change',v)
			}
		},
		methods:{
			search(org){
				if(!this.locale){
					return
				}
				var key = this.locale
				if (this.autoClear) {
					this.locale = ''
				}
				this.$emit('search',key)
			},
			clear(){
				this.locale = ''
				this.$emit('clear','')
			}
		}
	}
</script>

<style scoped lang="scss">

	.search{
		position:relative;
		.search-icon{
			position:absolute;
			top:50%;
			padding:0;
			width:.2rem;
			height: .2rem;
			text-align: center;
			line-height: .2rem;
			margin-top:-.1rem;
			left:.04rem;
			font-size: 1em!important;
			z-index: 1;
			color:rgba(98,168,234,.5);
		}
		input[type="search"]{
			display: block;
			width:100%;
		}
		.btn{
			position:absolute;
			top:50%;
			padding:0;
			width:.2rem;
			height: .2rem;
			text-align: center;
			line-height: .2rem;
			margin-top:-.1rem;
			font-size: 1em;
			&-search{
				color:#e7e7eb;
				right:.04rem;
				&.valid{
					color:#4CAF50;
				}
			}
			&-clear{
				color:#F44336;
				right: .28rem;
			}
		}
		.fade-enter-to{
			transition: right .4s ease-in-out, opacity .3s .1s ease-in-out;
		}
		.fade-leave-to {
			transition: right .4 ease-in-out, opacity .3s ease-in-out;
		}
		.fade-enter, .fade-leave-to /* 进入前离开后*/ {
			right: .04rem;
			opacity: 0;
		}
		.fade-enter-to, .fade-leave /* 进入后离开前 */ {
			right: .28rem;
			opacity: 1;
		}
		// &:hover{
		// 	input[type="search"]{
		// 		border: .01rem solid #62A8EA;
		// 	}
		// }
	}

</style>