<template>
	<div class="poeui-content-block flex-column">
		<header class="block-head flex-row flex-line-center"> 
			<h4 v-if="title">{{title}}</h4>
			<div class="flex-item tip" style="line-height: 1.2;" v-if="aside">{{aside}}</div>
			<slot name="aside" v-else></slot>
			<div class="block-op-pnl" v-if="editable">
				<transition enter-active-class="animated speed-4 delay-1 fadeIn" leave-active-class="animated speed-4 fadeOut">	
					<button class="block-edit btn-outline primary btn-small" v-if="!editMode" @click="editMode=true"> <span class="iconfont small">&#xe738;</span> 编辑</button>
				</transition>
				<transition enter-active-class="animated speed-4 delay-2 fadeInRight" leave-active-class="animated speed-4 fadeOutRight">
					<div class="block-op-box" v-if="editMode">
						<button class="block-confirm btn-outline success btn-small" @click="editMode=false"> <span class="iconfont small">&#xe737;</span> 确定</button>
						<button class="block-cancel btn-outline error btn-small" @click="editMode=false"> <span class="iconfont small">&#xe739;</span> 取消</button>
					</div>
				</transition>
			</div>
		</header>
		<article class="block-body full-col flex-item">
			<delay-loading class="mv-50" label="正在加载" v-if="loading"/>

			<tip class="dp-block mv-50 hor-center" style="height: .3rem;line-height: .3rem;" v-else-if="loadEmpty">{{loadEmpty===true?'== 当前无数据 ==':loadEmpty}}</tip>

			<template  v-else>
				<slot></slot> 
				<tip class="dp-block mv-10 hor-center"  v-if="loadEnd">{{loadEnd===true?'== 没有更多数据了 ==':loadEnd}}</tip>
			</template>
		</article>
	</div>
</template>
<script>
	export default{
		name:'block',
		props:{
			title:{
				type:[String,Boolean],
				default:undefined,
			},
			aside:String,
			editable:{
				type:Boolean,
				default:false,
			},
			editing:{
				type:Boolean,
				default:false,
			},
			loading:false,
			loadEnd:false,
			loadEmpty:false,
		},
		data(){
			return {
				editMode:this.editing || false
			}
		},
		watch:{
			editMode:function(v){
				this.$emit('update:editing',v)
			}
		}
	}
</script>
<style lang="scss">
	@import "@/assets/css/mixin.scss";
	.poeui-content-block{
		font-size:.14rem;
		background-color: #ffffff;
		padding: .2rem .6rem;
		margin-bottom: .3rem;

		@include prefixAttr(box-shadow, 0 0 .02rem rgba(0,0,0,.1rem));
		@include prefixAttr(border-radius, .05rem);

		.block-head{
			line-height:.32rem;
			h4{
			    font-weight: 400;
			    font-size: .2rem;
			    display: inline-block;
			    margin-right: .2rem;
			}
			.block-op-pnl{
				position: relative;
				width:1.5rem;
				height: .32rem;
				text-align: right;
				button{
					border:none;
				}
				div.block-op-box{
					position:absolute;
					right:0;
					top:0;
				}
			}
			&:empty{
				display: none;
			}
		}
		.block-body{
			overflow: auto;
		}
		/*.block-head+.block-body{
			margin-top: .2rem;
		}*/

	}
</style>