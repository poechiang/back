<template>
	<div id="contact-room" class="img-filter blur-10 flex-column">
		<header></header>
		<div class="flex-item"></div>
		<article class="box ma-0">
			<section :class="{'swiper-container':rooms.length>3}">
				<div class="room-list" :class="{'swiper-wrapper':rooms.length>3,'flex-row':rooms.length<=3}">
					<div class="pv-5" :class="{'flex-item':rooms.length<=3,'swiper-slide':rooms.length>3}" v-for="room in rooms" :key="room.id">
						<a class="room" :class="{'flex-item':rooms.length<=3}" :href="'/contact/dialog?r='+room.id">
							<img class="room-logo dp-block" :src="room.logo">
							<h1 class="room-title">
								{{room.title}}
							</h1>
						</a>
					</div>
				</div>
			</section>
		    <div class="swiper-button-prev iconfont no-select" :class="{disabled:swiper && swiper.realIndex<=0}" v-if="rooms.length>3" @click="toPrevSlide">&#xe7a6;</div><!--左箭头-->
		    <div class="swiper-button-next iconfont  no-select" :class="{disabled:swiper && swiper.realIndex>=rooms.length-1}" v-if="rooms.length>3" @click="toNextSlide">&#xe7a3;</div><!--右箭头-->
		    <div class="swiper-pagination" v-if="rooms.length>3"></div>
		</article>
		<div class="flex-item"></div>
		<footer class="hor-center">
			<div class="cr pv-20" style="color:#e0e0e0;font-weight: 300;">
				{{'版权所有 © '+(new Date()).getFullYear()+' 拾补数据 '}}
			</div>

		</footer>
	</div>
</template>
<script>
	import http from '@/utils/http'
	export default {
		route:{
			meta:{
				tab:'客服系统 —— 仓鼠盒子',
				header:false,
				aside:false,
			}
		},
		data() {
			return {
				rooms:[],
				swiper:null,
				curr:0,
			}
		},
		watch:{
			rooms:{
				handler:v=>{
					if (v.length>3) {
						if (this.swiper) {
							this.swiper.updateSlides()
						}
						else{
							this.buildSwiper()
						}
					}
					else{
						this.swiper && this.swiper.destroy()
						this.swiper = null
					}
				},
				deep:true
			}
		},
		mounted(){
			//this.rooms.length && this.buildSwiper()
			this.loadData()
		},
		methods:{
			loadData(){
				http.request('back/contact/get_rooms',(rlt)=>{
					this.rooms = rlt.data
				})
			},
			buildSwiper(){
				this.swiper = new Swiper('.swiper-container',{
					slidesPerView : 3,
					centeredSlides : true,
					mousewheel: true,
					pagination: {
					    el: '.swiper-pagination',
					 },
				})
			},
			toPrevSlide(){
				this.swiper.slidePrev()
			},
			toNextSlide(){
				this.swiper.slideNext()
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#contact-room{
	position: fixed;
	left:0;
	right:0;
	top:0;
	bottom: 0;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url(https://res.shibu365.com/i/2019-03-07/07cbcb86b1e44edc969a4c813ec6e263.jpg);
	.box{
		width:12rem;
		.room{
			display: block;
			border-radius: .1rem;
		    text-align: center;
		    padding:.1rem .2rem;
		    margin:0 .5rem;
		    height: 3.2rem;
		    width:2.6rem;
		    cursor: pointer;
		    overflow: hidden;
		    -webkit-transition: all .2s .1s ease-in-out;
		    -moz-transition: all .2s .1s ease-in-out;
		    -ms-transition: all .2s .1s ease-in-out;
		    -o-transition: all .2s .1s ease-in-out;
		    transition: all .2s .1s ease-in-out;
		    .room-logo{
		    	display: block;
		    	outline: none;
		    	margin:.5rem auto;
		    	-webkit-transition: all .2s ease-in-out;
		    	-moz-transition: all .2s ease-in-out;
		    	-ms-transition: all .2s ease-in-out;
		    	-o-transition: all .2s ease-in-out;
		    	transition: all .2s ease-in-out;
		    }
		    .room-title{
		    	font-size: .3rem;
		    	font-weight:normal;
	    	    margin:.2rem auto;
	    	    opacity: 0;
	    	    color:#fff;
		    	-webkit-transition: all .2s ease-in-out;
		    	-moz-transition: all .2s ease-in-out;
		    	-ms-transition: all .2s ease-in-out;
		    	-o-transition: all .2s ease-in-out;
		    	transition: all .2s ease-in-out;
	    	}
	    	&:hover{
			    background-color: rgba(255,255,255,.5);
			    box-shadow: 0 0 .1rem rgba(0,0,0,.5)!important;
			    .room-logo{
			    	margin:.2rem auto;
			    }
			    .room-title{
			    	opacity: 1;
			    	color:#414141;
		    	}
			}
		}
		.swiper-slide.swiper-slide-active .room{
		    background-color: rgba(255,255,255,.5);
		    box-shadow: 0 0 0.03rem rgba(0,0,0,.3);
		    .room-logo{
		    	margin:.2rem auto;
		    }
		    .room-title{
		    	opacity: 1;
		    	color:#414141;
	    	}
		}
		.swiper-button-prev,
		.swiper-button-next {
			background-image:none;
			color:#FFFFFF;
			opacity: .5;
			font-size: 1rem;
			width:1rem;
			height: 1rem;
			line-height: 1rem;
			margin-top:-.5rem;
			&:hover{
				opacity: 1;
			}
			&.disabled{
				cursor: default;
				color:#000000;
				opacity: .2;
			}
		}
		.swiper-button-prev {
			left:calc(50% - 7rem);
		}
		.swiper-button-next {
			right:calc(50% - 7rem);
		}
	}

	.swiper-pagination{
		position:static;
		margin-bottom: -1rem;
		margin-top:.84rem;
		.swiper-pagination-bullet{
			width:.12rem;
			height: .12rem;
			margin:0 .1rem;
			&.swiper-pagination-bullet-active {
				width:.36rem;
				height: .12rem;
				border-radius:.06rem;
			    opacity: .5;
			    background: #ffffff;
			    -webkit-box-shadow: 0 0 .05rem rgba(255,255,255,.05);
			    -moz-box-shadow: 0 0 .05rem rgba(255,255,255,.05);
			    -ms-box-shadow: 0 0 .05rem rgba(255,255,255,.05);
			    -o-box-shadow: 0 0 .05rem rgba(255,255,255,.05);
			    box-shadow: 0 0 .05rem rgba(255,255,255,.05);
			}
		}
	}
}
</style>