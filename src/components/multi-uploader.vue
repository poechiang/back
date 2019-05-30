<template>
	<ul class="flex-row flex-wrap flex-main-around pic-list" ref="picBox">
		<li class="pic pos-relative" v-for="(pic,index) in list" :key="index" :style="{backgroundImage:'url('+pic+')'}">
			<div class="dp-table full-row full-col" v-if="!disabled"><div class="dp-table-cell hor-center ver-middle">
				<div class="op-pnl">
					<a href="javascript:;" style="color:#62A8EA" @click="handleOpenPic(index)">替换</a>
					<a href="javascript:;" style="color:#F96868" @click="handleRemovePic(index)">删除</a>
				</div>
			</div></div>
		</li>
		<li class="pic pos-relative add"  v-if="!disabled && remain>0">
			<div class="dp-table full-row full-col"><div class="dp-table-cell hor-center ver-middle">
				<div class="op-pnl">
					<a href="javascript:;" style="color:#46BE8A" @click="handleOpenPic(-1)">添加</a>
					<a href="javascript:;" style="color:#F96868" @click="handleClearPic">清空</a>
				</div>
			</div></div>
		</li>
		<li class="pic" v-for="i in (disabled?remain:remain-1)%3"></li>
	</ul>
</template>
<script>
	
	import http from '@/utils/http'
	export default {
		model:{
			prop:'srcs',
			event:'change'
		},
		props:{
			cols:{
				type:Number,
				default:3
			},
			total:{
				type:Number,
				default:9,
			},
			srcs:{
				type:Array,
				default:()=>{
					return []
				}
			},
			disabled:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				list:this.srcs||[]
			}
		},
		watch:{
			srcs(v){
				this.list = v||[]
			},
			// list:{
			// 	handler(v){
			// 		this.$emit('change',v)
			// 	},
			// 	deep:true
			// }
		},
		computed:{
			remain(){
				return this.total - this.list.length
			}

		},
		methods:{
			handleOpenPic(index){
				var finputer = document.createElement("input"),
					that = this,
					replace = index>=0
				finputer.type="file";
				if(!replace && (this.total-this.list.length)>1){
					finputer.multiple='multiple'
				}
				finputer.accept='image/*'
				finputer.onchange=function(e){
	        		that.handleUploadPic(this.files,rlt=>{
	        			if (rlt.status==1) {
	        				var list = []
	        				for(var i =0;i<rlt.data.length;i++){
		        				list.push(rlt.data[i].url)
	        				}
	        				if (list.length>0) {
	        					if (index>=0) {
	        						that.list.splice(index,1,...list)
	        					}
	        					else{
	        						that.list.push(...list)
	        					}
	        					that.$emit('change',that.list)
	        				}
	        			}
	        			else{
	        				$$.ui.modal('图片上传错误',{mask:true,cancel:false});
	        			}
	        		})
				}
				finputer.click()
			},
		    handleUploadPic(fs,cb){
		    	var fd = new FormData(),
		    		count = this.remain
		        $.each(fs,function(){
		        	if (count<=0) {
		        		return
		        	}
		        	fd.append('file[]', this)
		        	count--
		        })

	        	http.upload(fd,cb||$.noop)
		    },
		    handleClearPic(){
		    	//this.list.splice(0,this.list.length)
				this.$emit('change',[])
		    },
		    handleRemovePic(index){
		    	if (index>=0) {
		    		this.list.splice(index,1)
		    		this.$emit('change',this.list)
		    	}
		    }
		}
	}
</script>
<style scoped lang="scss">
	.pic-list{
		.pic{
			position:relative;
			width:2rem;
			height:2rem;
			border:.02rem solid transparent;
			background-size: cover;
			background-clip: content-box;
			background-repeat: no-repeat;
			background-position: center;
			.op-pnl{
				display: none;
				background-color: rgba(255,255,255,.8);
				color:#fff;
				margin:auto;
				width:.8rem;
				line-height: .4rem;
				text-align: center;
				a{
					display: block;
					&:hover{
						text-decoration: underline!important;
					}
				}
			}
			&:hover{
				.op-pnl{
					display: block;
				}
			}
			&.add{

				.op-pnl{
					border:.01rem solid #efefef;
					display: block;
					background-color:transparent;
				}
			}
		}
	}
</style>