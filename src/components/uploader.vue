<template>
	<div class="uploader bdr pos-relative of-hidden" :class="{'editable':editable!==false}"  :style="sizeStyle" @click="handleSelect">
		<div class="pnl" :style="{'background-image':'url('+(this.local||this.def)+')'}"></div>
		<div class="tip" :class="{static:tip}" v-if="editable!==false">{{tip||'点击选择 / 替换'}}</div>
		<transition name="slide" enter-active-class="animated speed-2 fadeInDown" leave-active-class="animated speed-2 fadeOutDown">	
			<div class="progress" v-if="loading">
				上传中 （{{this.percentage}}%）...
				<div class="thumb" :style = "thumbStyle"></div>
			</div>
		</transition>
	</div>
</template>
<script>
	import http from '@/utils/http'

	export default{
		model:{
			prop:'src',
			event:'change',
		},
		props:{src:String,def:String,tip:String,multi:Boolean,
			auto:{
				type:Boolean,
				default:true,
			},
			editable:{
				type:Boolean,
				default:true,
			},
			width:{
				type:Number,
				default:300
			},
			height:{
				type:Number,
				default:300
			}
		},
		data(){
			return {
				local:this.src||null,
				loading:false,
				percentage:0,
			}
		},
		watch:{
			src(v){
				this.local = v ||null
			},
			local:function(v){
				this.$emit('change',v)
			},
		},
		computed:{
			sizeStyle(){
				return {
					width:(this.width)/100+'rem',
					height:(this.height)/100+'rem',
				}
			},
			thumbStyle(){
				return {
					width:this.percentage+'%'
				}
			}
		},
		mounted(){
		},
		methods:{
			handleSelect(){
				if (this.editable===false) {
					return 
				}
				var finputer = document.createElement("input"),
					that = this

				finputer.type="file";
				finputer.accept=this.mime || 'image/*'
				if (this.multi) {
					finputer.multiple='multiple'
				}
				finputer.onchange=function(e){
	        		that.uploadFiles(this.files[0])

				}
				finputer.click()
			},
			uploadFiles(file){

				if (!this.auto) {
					this.$emit('upload',file/*this.local*/)
					return
				}

				this.local = $$.createObjectURL(file)
				
				this.loading = true
				this.percentage = 0
		        var fd = new FormData(),that = this
		        fd.append('file', file)
		        fd.append('source', 1)
	        	http.upload(fd,{
	        		xhr(){
	        			var _xhr = $.ajaxSettings.xhr() 
				        _xhr.upload.addEventListener("progress", function(e) {  
						    if (e.lengthComputable) {  
						        var percentage = Math.round((e.loaded * 100) / e.total)
						        that.percentage = percentage
						    }  
						}, false)
			   
						_xhr.upload.addEventListener("load", function(e){ 
							that.loading = false
						}, false)
	        			return _xhr
	        		},
	        		success(rlt){
	        			if (rlt.status==1) {
	        				that.local=rlt.data[0].url
	        				that.$emit('change',that.local)
	        			}
	        			else{
	        				$$.ui.error('上传错误');
	        			}
	        		}
	        	})
			}
		},
	}
</script>
<style scoped lang="scss">
	.uploader{
		position: relative;
		.pnl{
			width: 100%;
			height: 100%;
			background-size: contain;
			background-position:center;
			background-repeat:no-repeat;
		}
		.tip{
		    position: absolute;
		    text-align: center;
		    line-height: .4rem;
		    width: 1.5rem;
		    background-color: rgba(255,255,255,.5);
		    top: 50%;
		    left: 50%;
		    margin-left: -.75rem;
		    margin-top: -.2rem;
		    color: #414141;
		    border-radius: .05rem;
		    transition: opacity .4s ease-in-out;
		    &:not(.static){
		    	opacity: 0;
		    }
		}
		.progress{
		    position: absolute;
		    width: 100%;
		    left: 0;
		    bottom: .02rem;
		    color: #888;
		    text-align: center;
		    padding-bottom: .05rem;
		    background-color: rgba(255,255,255,.5);
		    font-size: .12rem;
			&:before{
				content: "";
				position:absolute;
				height:.03rem;
				left: .03rem;
				width:calc(100% - .06rem);
				bottom:.01rem;
				background-color:#bbb;
    			border-radius: .03rem;
			}
			.thumb{
				position:absolute;
				left:.02rem;
				bottom:0;
				width:.05rem;
				height:.05rem;
				background-color:#8BC34A;
				border-radius:.05rem;
			}
		}
		&:hover{
			.tip{
				opacity: 1;
			}
		}
		&.bdr{
			border:.01rem solid transparent;
		}
		&.editable{
			cursor: pointer;
			border:.01rem solid #e1e1e1;
		}
	}
</style>