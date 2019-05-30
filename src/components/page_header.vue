<template>
	<div id="header">
		<div class="poeui-frame flex-row flex-line-center">
			<a class="gohome mr-20" :href="info.url||'javascript:;'" style="width:2rem;" v-if="info">
				<img :src="info.logo||'https://res.shibu365.com/i/2019-04-22/123311377ff24b6895265686e9ba209c.jpg'" height="45"  > {{info.title||'拾补数据'}}
			</a>
			<template v-if="apps"  v-for="(app,key) in apps">
				<a :href="app.path" class="dp-block app" :title="app.title" :target="app.blank?'_blank':'_self'"  v-if="$store.state.app!=key">
					<icon :face="app.icon"></icon> {{app.label}}
				</a>
			</template>

			<div class="flex-item">
				<delay-loading v-if="!apps">正在加载……</delay-loading>
			</div>
			<div class="search mr-20" :class="{dirty:isDirty}" style="line-height: initial;">
				<input 
					v-model="$store.state.search.keys"
					:placeholder="$store.state.search.placeholder||'你想找什么？'"
					@keydown="searchKeyDown"
				>
				<a href="javascript:;" class="iconfont clear def" @click="clearKeys">&#xe6d7;</a>
				<a href="javascript:;" class="iconfont done def" @click="doSearch">&#xe677;</a>
			</div>

			<pop-up v-if="$store.state.user&& $store.state.user.loginned" :label="$store.state.user.nick" :title="$store.state.user.nick+' 个人中心'">
				<dl  class="uc-list p-10" >
					<dt style="line-height:1.2"><big style="font-weight: 300;color: #000;">{{$store.state.user.nick||'用户'}}</big>
					<br><small class="tip">@{{$store.state.user.name}}</small></dt>
					<dd v-if="$route.path!=='/user'"><a href="/user">个人中心</a></dd>
					<dd><button class="btn-block error btn-radius full-row mt-10" @click="handleLogout">退出系统</button></dd>
				</dl>
			</pop-up>
			<a href="/login" class="dp-block" title="点击登录系统" v-else>
				<span class="iconfont">&#xe866;</span> 登录
			</a>

		</div>
	</div>
</template>

<script>
	import http from '@/utils/http'
	export default {
		props:['view'],
		data() {

			var info = $$.catch.local('app_info')||null

			if (info) {
				info = info[this.$store.state.app]||null
			}

			return {
				info: info,
				apps: $$.catch.local('app_list')||null,
				//keys:this.$store.state.search.keys,
				old:this.$store.state.search.keys,
				currPage:this.$route.path
			}
		},
		watch:{
			info:{
				handler(v){
					document.title =v.title||'拾补数据'
					var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
				    link.type = 'image/x-icon'
				    link.rel = 'shortcut icon'

				    link.href = '/static/images/'+(v.icon?v.icon:'favicon')+'.ico'
				    document.getElementsByTagName('head')[0].appendChild(link)
				},
				deep:true
			}
		},
		mounted(){
			this.loadData()
		},
		computed:{
			isDirty:function(){
				return this.$store.state.search.keys.length>0
			},
			isUserCenter(){
				return this.$route.path == '/user'
			}
		},
		methods:{
			loadData(){
				http.request('back/index/app_info',{app:this.$store.state.app},rlt=>{

					this.info = rlt.data


					var info = $$.catch.local('app_info')||{}
					info[this.$store.state.app] = rlt.data
					$$.catch.local('app_info',info)
				})

				http.request('back/index/app_list',rlt=>{

					this.apps = rlt.data
					$$.catch.local('app_list',rlt.data)
				})
			},
			toggleView(index){
				if (index>=0 && index<=3 && this.$store.state.view!=index) {
					this.$store.state.view = index
					$$.catch.local('view-type',index)
					this.events.$emit('view-change',{value:index,title:this.list[index].title})
				}
			},
			searchKeyDown:function(e){
				if (this.old != this.$store.state.search.keys && e.keyCode==13) {
					this.events.$emit('poe-be-search',{keys:this.$store.state.search.keys})
					this.old = this.$store.state.search.keys
				}
				
			},
			clearKeys:function(){
				this.$store.state.search.keys=''
				if (this.old != this.$store.state.search.keys) {
					this.events.$emit('poe-be-search',{keys:this.$store.state.search.keys})
					this.old = this.$store.state.search.keys
				}
			},
			doSearch:function(){
				if (this.old != this.$store.state.search.keys && this.$store.state.search.keys) {
					this.events.$emit('poe-be-search',{keys:this.$store.state.search.keys})
					this.old = this.$store.state.search.keys
				}
			},
			onViewChange:function(){

			},
			handleLogout(){
				$$.ui.modal('确定要退出？',{
					mask:true,
					confirm:()=>{
						$$.catch.local('curr-login-user',null)
						
						this.$store.state.user=null
						this.$router.push({path:'/'})
					}
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	#header{
	    position: relative;
	    background-color: #fff;
	    .poeui-frame{
		    height: .6rem;
		    line-height: .6rem;
		    .search{
		    	position:relative;
		    	input{
				    width: 2rem;
				    border: none;
				    border-bottom: 1px solid #b1b1b1;
				    box-shadow: none!important;
				    padding-right:.3rem;
		    	}
		    	.done,.clear{
		    		width:.2rem;
		    		height:.2rem;
		    		top:50%;
		    		margin-top:-.1rem;
		    		text-align:center;
		    		&:link,&:visited{
		    			color:#888;
		    		}
		    	}
		    	.done{
		    		position:absolute;
		    		right:.05rem;
		    	}
		    	.clear{
		    		display:none;
		    		position:absolute;
		    		right:.30rem;
		    	}
		    	&.dirty{
		    		input{
		    			padding-right:.55rem;
		    		}
		    		.clear{
		    			display:block;
		    		}
		    	}
		    }

		    a.dp-block{
		    	height: .6rem;
		    	line-height: .6rem;
		    	padding:0 .1rem;
		    }

			.uc-list{
				min-width: 2rem;
				line-height: .36rem;
				font-size: .14rem;
				dt{
					margin-bottom: .1rem;
				}
				dd{
					border-top:.01rem solid #efefef;
					a{
						display: block;
						padding:0 .1rem;
					}
				}
			}
		}

		&:after{
			content:"";
			position:absolute;
			height:.01rem;
			width:100%;
			bottom:0;
		    /*! autoprefixer: off */
		    background:-webkit-gradient(linear, left top, right top, from(#152EFF), color-stop(#01E8FF),color-stop(#4216FF),to(#FD0376));
		    background: -webkit-linear-gradient(left, #152EFF, #01E8FF,#4216FF,#FD0376);
		    /* autoprefixer: on */
			background: -webkit-linear-gradient(left, #152EFF, #01E8FF,#4216FF,#FD0376);
			background: -moz-linear-gradient(left, #152EFF, #01E8FF,#4216FF,#FD0376);
			background: -o-linear-gradient(left, #152EFF, #01E8FF,#4216FF,#FD0376);
			background: linear-gradient(left, #152EFF, #01E8FF,#4216FF,#FD0376);
		}
	}
</style>
<style lang="scss">
	#header{
	    .poeui-frame{
			a{
				color:#616161;
				&:hover{
					background-color:#f1f1f1;
					color:#414141;
				}
				&:actived{
					background-color:#f1f1f1;
					color:#FF5722;
				}
				&.gohome{
					background-color:transparent;
					line-height: .45rem;
					font-size: .3rem;
					img{
						vertical-align: -.12rem;
					}
				}
			}

		}
	}
</style>