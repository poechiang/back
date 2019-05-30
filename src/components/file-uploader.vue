<template>
	<div class="file-uploader">
		<div class="flex-row flex-wrap" v-if="isMulti">
			<div class="fitem m-5" v-for="(item,index) in list" :key="index" :style="fitemStyle">
				<div :style="{backgroundPosition:'center',backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundImage:path(item)}" class="img dp-block full-col" :data-index="index">
					<input type="file" :accept="accept || 'image/*'" multiple="multiple" @change="choose($event,index)" title="点击替换">
					<div class="opts">
						<button class="btn-block btn-minum error" type="button" @click="del(index)">删除</button>
					</div>
				</div>
			</div>
			<div class="fitem m-5 add-new" :style="fitemStyle">
				<span class="iconfont">&#xe6d8;</span>
				<input type="file" :accept="accept || 'image/*'" multiple="multiple" @change="choose($event)" title="点击选择">
			</div>
		</div>
		<div class="fitem add-new" :style="fitemStyle" v-else>
			<div :style="{backgroundPosition:'center',backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundImage:path(list)}" class="dp-block full-col"></div>
			<span class="iconfont" v-if="!list && !uploading">&#xe6d8;</span>
			<div class="dp-table full-row full-col pos-absolute" style="top:0;left:0;" v-if="uploading" >
				<div class="dp-table-cell ver-middle">
					<delay-loading label='正在上传'/>
				</div>
			</div>
			<template v-else>
				<input type="file" :accept="accept || 'image/*'" @change="choose($event)"  title="点击选择" v-if="rebuilt">

				<div class="opts" v-if="list">
					<button class="btn-block btn-minum error" type="button" @click="del">删除</button>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
	import http from '@/utils/http'
	export default {
		name:'uploader',
		props:['files','item','accept','server','domain','autoUpload'],
		data() {
			return {
				list:this.files,
				uploading:false,
				rebuilt:true
			}
		},
		computed:{
			isMulti(){
				return this.list && $$.isArray(this.list)
			},
			fitemStyle(){
				return $$.extend(true,{
					width:(this.isMulti?80:200)+'px',
					height:(this.isMulti?80:100)+'px',
					lineHeight:(this.isMulti?80:100)+'px',
				},this.item||{})
			},

		},
		watch:{
			files:function(v){
				this.list = v
			},
		},
		methods:{
			path(file){
				if (!file) {
					return null
				}
				return 'url('+(/^(blob\:)?https?:\/\//.test(file)?file:this.domain+file)+')'
			},
			choose(e,index){				
				if (this.autoUpload!==false) {
					this.upload(e.target.files,resp=>{
						//this.$emit('change',{files:e.target.files})

						if (this.isMulti) {

							$$.each(resp,(index2,file)=>{
								var url = file.url

								if (index>=0) {
									this.list.splice(index++,index2==0?1:0,url)
								}
								else{
									this.list.push(url)
								}	
							})
						}
						else{
							this.list=resp.url
						}
						this.$emit('update:files',this.list)
					})
				}
				else{
					if (this.isMulti) {
						$$.each(e.target.files,(index2,file)=>{
							var url = $$.createObjectURL(file)

							if (index>=0) {
								this.list.splice(index++,index2==0?1:0,url)
							}
							else{
								this.list.push(url)
							}	
						})
					}
					else{
						this.list = $$.createObjectURL(e.target.files[0])
					}
					this.$emit('change',{files:e.target.files})	
				}
				
			},
			del(index){
				if (this.isMulti) {
					if (index>=0) {
						this.list.splice(index,0)
					}
				}
				else{
					this.list= null
					this.rebuilt = false
					this.rebuilt = true
				}
			},
			upload(files,cb){
				var formData = new FormData(),
					files = files

				if(this.isMulti){
					for(var i =0;i<files.length;i++){
						formData.append('img[]', files[i])
					}
				}
				else {
					formData.append('img', files[0])
				}
				this.uploading=true
				http.upload(this.server,formData,rlt=>{
	        		if(rlt.status == 1){
	        			cb && cb(rlt.data)
	        		}
	        		else{
	        			$$.ui.modal(rlt.msg,{textAlign:'center',cancel:false})
	        		}
	        		this.uploading = false
		        })
			}
		}
	}
</script>
<style scoped lang="scss">
.file-uploader{
	position:relative;
	.fitem{
		position:relative;
		text-align:center;
		overflow:hidden;
		input{
			position:absolute;
		    left: 0;
		    top: 0;
		    width: 100%;
		    height: 100%;
		    opacity: 0;
		    cursor: pointer;
		}
		.opts{
			position:absolute;
			bottom:-.2rem;
			left:0;
			width:100%;
			transition:bottom .2s ease-in-out;
			line-height:1;
			text-align:right;
		}
		&:hover{
			.opts{
				bottom:0;
			}
		}
		&.add-new{
			.iconfont{
				position:absolute;
				top:0;
				left:0;
				width:100%;
				height:100%;
				border:.01rem dashed #888;
			}
		}
	}
}
</style>