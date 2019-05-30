<template>
	<aside  id="menu">
		<dl class="list flex-column" v-if="list">
			<template  v-for="(item, key) in list">
				<template v-if="item.children">
					<dt class="mtitle top" :class="{mitem:item.url,selected:item.url && $store.state.menu == key}">
						<router-link :to="item.url" v-if="item.url"><icon class="mr-30" :face="item.url && $store.state.menu == key?(item.selectedIcon||item.icon):item.icon" size="1.5em"></icon>{{item.label}}</router-link>
						<div style="cursor: default;" v-else>
							<icon class="mr-30" :face="item.icon" size=".3rem"></icon>{{item.label}}
						</div>
					</dt>
					<dd class="mitem" :class="{selected:$store.state.menu == key2}" v-for="(sub,key2) in item.children" :key="key2">
						<router-link :to="sub.url||'javascript:;'" ><icon class="mr-30" :face="$store.state.menu == key2?(sub.selectedIcon||sub.icon):sub.icon" size=".3rem"></icon>{{sub.label}}</router-link>
					</dd>
				</template>
				<dd class="mitem top" :class="{selected:$store.state.menu == key}" v-else>
					<router-link :to="item.url||'javascript:;'" ><icon class="mr-30" :face="$store.state.menu == key?(item.selectedIcon||item.icon):item.icon" size=".3rem"></icon>{{item.label}}</router-link>
				</dd>
			</template>
		</dl>
		<delay-loading style="width:2rem" v-else>正在加载导航菜单……</delay-loading>
	</aside>
</template>
<script>
	import http from '@/utils/http'
	export default {
		name:'menu-list',
		data() {
			var menu = $$.catch.local('nav_menu')||null

			if (menu) {
				menu = menu[this.$store.state.app]||null
			}

			return { list: menu }
		},
		mounted(){
			this.loadData()
		},
		methods:{
			loadData(){
				http.request('back/index/nav_menu',{app:this.$store.state.app||'shibu'},rlt=>{
					if (rlt.status==1) {
						this.list = rlt.data
						var menu = $$.catch.local('nav_menu')||{}
						menu[this.$store.state.app] = rlt.data
						$$.catch.local('nav_menu',menu)

					}

				})
			}
		},
	}
</script>

<style scoped lang="scss">
#menu{
	float: left;
	.list{
		height: 100%;
		border-right:.01rem solid #e7e7e7;

		font-size: .14rem;

		.top{
			position:relative;
			font-size: .18rem;
			&:not(:first-child):before{
				content: "";
				position:absolute;
				height: .01rem;
				background-color:#e7e7e7;
				width:calc(100% - .68rem);
				left: .34rem;
				top:0;
			}
		}

		.iconfont{
			vertical-align: -.03rem;
		}
		.mtitle{
			padding:.05rem 0;
			height:.5rem;
			line-height:.4rem;
			div{
				padding:0 .65rem 0 .34rem;
			}
		}
		.mitem{
			padding:.05rem 0;
			height:.5rem;
			line-height:.4rem;
			/*font-size:.16rem;*/
			a{
				display:block;
				height:100%;
				padding:0 .65rem 0 .34rem;
				&:link,
				&:visited{
					color:#616161;
				}
				&:hover,
				&:active{
					color:#E83227;
				}
			}
			&:hover{
				background-color:#f1f1f1;
			}

			&.recycle{
				margin: .1rem;
			    a{
					padding: 0 .55rem 0 .24rem;
				    border: 1px solid transparent;
				    &:hover{
				    	color:#E83227;
				    }
			    }
			}
			&.selected{
				position:relative;
				a{
					color:#E83227;
					&:before{
						content:"";
						position:absolute;
						top:0;
						left:0;
						width:.04rem;
						height:100%;
						background-color:#E83227;
					}
				
				}
				&.recycle{
				    a{
					    background-color: rgba(255, 87, 34, 0.5);
					    border: 1px solid;
				    	color:#E83227;
				    }
					&:before{
						display: none;
					}
				}
			} 
		}
	}
	
}
</style>