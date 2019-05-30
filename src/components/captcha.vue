<template>
	<div class="captcha flex-row flex-line-center">
		<input class="flex-item" v-model="inputCode" :style="inputStyle" :placeholder="placeholder||'验证码'" >
		<div class="bdr pos-relative ml-10" ref="bdr" :style="imgStyle" :title="imgTitle">
			<div class="load-box dp-table" v-if='loading' >
				<div class="dp-table-cell full-col hor-center ver-middle">
					<delay-loading class="mv-0"/>
				</div>	
			</div>
			<template v-else>
				<span class="thumb top flash infinite" :class="{'animated':needFlash}" :style="topThumbStyle"></span>
				<span class="thumb right flash infinite" :class="{'animated':needFlash}" :style="rightThumbStyle"></span>
				<span class="thumb bottom flash infinite" :class="{'animated':needFlash}" :style="bottomThumbStyle"></span>
				<span class="thumb left flash infinite" :class="{'animated':needFlash}" :style="leftThumbStyle"></span>
			</template>
			<img class="" :src="url" @click="handleRefresh" @load="startTimer">
		</div>
	</div>
</template>
<script>
	export default {
		props:['value','length','svr','img','input','placeholder','expire','ckey'],
		data(){
			return {
				loading:true,
				inputCode:this.value,
				inputStyle:this.input||{width:0},
				expireTime:this.expire||300,
				imgStyle:this.img||{},
				hash:(new Date).to(),
				timer:null,
				thumb:0,
				bdrSize:{w:0,h:0,all:0,value:0}
			}
		},
		watch:{
			inputCode(v){
				this.$emit('input',v)
			},
			value(v){
				this.inputCode = v 
			},
		},
		computed:{
			url(){
				return this.svr+'?len='+(this.length||4)+(this.ckey?('&key='+this.ckey):'')+'&t='+this.hash
			},
			imgTitle(){
				return '四位图片验证码，'+parseInt(this.expireTime - this.thumb)+' s后过期，点击立即刷新！'
			},
			
			topThumbStyle(){
				var style=this.thumbStyle()
				style.width=Math.min(Math.max(0,this.bdrSize.value),this.bdrSize.w)/100+'rem'
				return style
			},
			rightThumbStyle(){
				var style=this.thumbStyle()
				style.height=Math.min(Math.max(0,this.bdrSize.value-this.bdrSize.w),this.bdrSize.h)/100+'rem'
				return style
			},
			bottomThumbStyle(){
				var style=this.thumbStyle()
				style.width=Math.min(Math.max(0,this.bdrSize.value-this.bdrSize.w-this.bdrSize.h),this.bdrSize.w)/100+'rem'
				return style
			},
			leftThumbStyle(){
				var style=this.thumbStyle()
				style.height=Math.min(Math.max(0,this.bdrSize.value-this.bdrSize.w*2-this.bdrSize.h),this.bdrSize.h)/100+'rem'
				return style
			},
			needFlash(){
				return this.expireTime-this.thumb<10
			}
		},
		methods:{
			thumbStyle(){
				var level=parseInt(this.thumb/(this.expireTime/5))+1
				switch(level){
					case 1:
					return {
						backgroundColor:'#8BC34A',
						boxShadow:'0 0 .03rem rgba(139, 195, 74, .8)'
					}
					case 2:
					return {
						backgroundColor:'#cddc39',
						boxShadow:'0 0 .03rem rgba(205, 220, 57, .8)'
					}
					case 3:
					return {
						backgroundColor:'#FFC107',
						boxShadow:'0 0 .03rem rgba(255, 193, 7, .8)'
					}
					case 4:
					return {
						backgroundColor:'#ff9800',
						boxShadow:'0 0 .03rem rgba(255,152,0,.8)'
					}
					default:
					return {
						backgroundColor:'#ff5722',
						boxShadow:'0 0 .03rem rgba(255, 87, 34, .8)'
					}
				}
			},
			startTimer(){
				this.loading=false

				this.timer && clearInterval(this.timer)
				this.timer = setInterval(()=>{
					if (!this.bdrSize.all) {
						var $bdr = $(this.$refs.bdr)
						this.bdrSize.h=$bdr.height()
						this.bdrSize.w=$bdr.width()
						this.bdrSize.all = (this.bdrSize.w+this.bdrSize.h)*2
					}
					if((this.thumb+1)>=this.expireTime){
						this.handleRefresh()
						return
					}
					this.thumb+=1
					this.bdrSize.value = parseInt(this.thumb*this.bdrSize.all/this.expireTime)
					

				},1000)
			},
			handleRefresh(){
				this.timer && clearInterval(this.timer)
				this.loading=true
				this.thumb=0;
				this.bdrSize.value = 0
				this.hash = (new Date).to()
				this.inputCode=''
			},
		}
	}
</script>
<style lang="scss">
	.captcha{
		input{
			width:0;
		}
		.bdr{
			background-color:#eee;
			.load-box{
				position:absolute;
				left:0;
				top:0;
				width:100%;
				height:100%;
				background-color:rgba(255,255,255,.8);

			}
			img{
				height:100%;
				width:100%;
			}
			.thumb{
				position: absolute;
				background-color: #009688;
				box-shadow:0 0 .03rem #009688;
				z-index: 2;
				&.top{
					height: .02rem;
					width:0;
					top:0;
					left: 0;
				}
				&.right{
					width: .02rem;
					height: 0;
					top:0;
					right:0;
				}
				&.bottom{
					height: .02rem;
					width:0;
					right: 0;
					bottom:0;
				}
				&.left{
					width: .02rem;
					height: 0;
					bottom:0;
					left: 0;
				}
			}
		}
	}
</style>