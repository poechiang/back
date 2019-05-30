<template>
	<div class="verif-code" :class="{requesting:isRequesting,waiting:isWaiting}">
		<span class="wait tip-error f-right" v-if="isWaiting">{{this.local.remain}} s 后重新发送</span>
		<delay-loading class="load" label='正在发送' v-else-if="isRequesting"/>
		<a class="get-btn" href="javascript:;" v-else>点击获取验证码</a>
		<input v-model="code" :placeholder="placeholder||'验证码'">
	</div>
</template>
<script>
	export default{
		props:{
			code:{
				type:String,
				default:'',
			},
			placeholder:{
				type:String,
				default:'验证码',
			},
			url:{
				type:String,
				requeire:true,
			},
			delay:{
				type:Number,
				default:60,
			},
			ui:{
				type:Boolean,
				default:true,
			}
		},
		data(){
			return {
				local:{
					code:this.code,
					remain:this.delay
				},
				isRequesting:false,
				isWaiting:false,
			}
		}
	}
</script>
<style lang="scss">
	.verif-code{
		position: relative;
		input{
			display: block;
			width: 100%;
		}
		a{
			position:absolute;
			height: .2rem;
			line-height: .2rem;
			font-size: .14rem;
			right:.05rem;
			top:50%;
			margin-top: -.1rem;
			text-align: center;
			color:#62A8EA;
		}
		.wait{
			position:absolute;
			height: .2rem;
			line-height: .2rem;
			font-size: .14rem;
			right:.05rem;
			top:50%;
			margin-top: -.1rem;
			font-size: .14rem;
		}
		.delay-loading{
			position:absolute;
			height: .3rem;
			line-height: .3rem;
			font-size: .14rem;
			right:.05rem;
			top:50%;
			width:1rem;
			margin-top: -.15rem;

		}
		
	}
</style>