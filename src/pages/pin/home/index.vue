<style scoped lang="scss">
	@import "@/assets/css/main.scss";
	@import "@/assets/css/plugin.scss";	
</style>
<template>
	<div class="poeui-page">
		<!-- <header class="poeui-content-header flex-row flex-line-center">
		</header> -->
		<article class="poeui-content-box" @click="unselectFile" @dblclick="openFiles">
			<block class="file-block" :class="blockClass">
				<div class="full-col pl-20 pr-10 mr-10"  @drop="handleDrop">
					<section class="file-list" v-for="item in files" :key="item.id">
						<header class="cf-both">{{item.date}}</header>
						<template v-for="item in item.list">
							<article class="f" @click="selectFile(item)" :class="{selected:selectedPaths.indexOf(item.id,'id')>=0}" @contextmenu="selectFile(item)">
								<figure>
									<div class="file-logo" :style="{'background-image':'url('+item.url+')',opacity:item.loading?'0.5':'1'}">
									</div>
									<figcaption class="flex-row flex-line-center" v-if="$store.state.filter.value==-1||$store.state.view==0">
										<div class="flex-item-2" title="文件名称及类型">
											{{item.title}}<br><span class="tip">{{item.mime}}</span>
										</div>
										<div class="flex-item-2 ellipsis of-hidden" title="文件路径">
											{{item.path}}</span>
										</div>
										<div class="flex-item" title="所有者">{{item.uid==0?'公共':$store.state.user.nick||$store.state.user.name}}</div>
										<div title="上传时间">{{item._create}}</div>
										<div title="删除时间">{{Date.from(item._delete).format('Y-m-d H:i:s')}}</div>
									</figcaption>
									<figcaption v-else>{{item.title}}</figcaption>
								</figure>
							</article>
						</template>
					</section>
				</div>
			</block>
		</article>
		<editor class="img-viewer" :show.sync="swiperShow" :box="{width:900,height:600}">
			<div slot="header" class="hor-center">{{currImgInfo.title}}</div>
			<div class="swiper-container full-col">
				<ul class="list swiper-wrapper">
					<li class="swiper-slide" :data-file-url="item.url" v-for="(item,index) in selectedPaths" :key="index">
						<div class="item" :style="{'background-image':'url('+item.url+')'}"></div>
					</li>
				</ul>
			</div>
			<div style="position: absolute;width: 100%;bottom:.65rem;left: 0;padding: 0 .15rem;line-height: .2rem;">
				<div>路径：{{currImgInfo.path}}<br>URL：{{currImgInfo.url}}</div>
				<div class="swiper-pagination"></div>
			</div>
			<div slot="footer" class="flex-row flex-main-center mt-30">
				<button class="file-down btn-outline btn-large iconfont large view" title="下载当前文件" @click="downFile">&#xe72b;</button>
				<button class="file-copy btn-outline btn-large iconfont large view" title="复制文件链接">&#xe729;</button>
				<button class="file-delete btn-outline btn-large iconfont large view" title="删除当前文件" @click="delFile">&#xe8c7;</button>
			</div>
		</editor>
		<context-menu :items="cmItems" :show.sync="cmShow" context=".file-block" @item-click="handleContextMenuItemClick"/>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import ClipBoard from 'clipboard'
	import Vue from 'vue'
	var swiper
	export default {
		route:{
			path:['/pin/home','/pin/home/index'],
			meta:{
				menu:'home',
				app:'pin'
			},
		},
		data() {
			var items=[{
				key:'file-open',
				icon:'&#xe730;',
				label:'新标签内打开',
				disabled:false,
				visiabled:true,
			},{
				key:'file-view',
				icon:'&#xe7b0;',
				label:'本地打开',
				disabled:false,
				visiabled:true,
			},{
				key:'file-down',
				icon:'&#xe72b;',
				label:'下载',
				disabled:false,
				visiabled:true,
			},{
				key:'file-down',
				icon:'&#xe732;',
				label:'下载',
				disabled:false,
				visiabled:true,
			},{
				key:'file-copy',
				icon:'&#xe72d;',
				label:'复制链接',
				disabled:false,
				visiabled:true,
			},{
				key:'file-restore',
				icon:'&#xe734;',
				label:'恢复选中文件',
				disabled:false,
				visiabled:true,
			},{
				key:'file-delete',
				icon:'&#xe644;',
				label:'删除',
				disabled:false,
				visiabled:true,
			},{
				key:'file-delete',
				icon:'&#xe644;',
				label:'彻底删除',
				disabled:false,
				visiabled:false,
			}]
			return {
				files:[],
				selectedPaths:[],
				ready:false,
				cmItems:items,
				cmShow:false,
				swiperShow:false,
				swiper:null,
			}

		},
		computed:{
			blockClass(){
				return {
					groupable:this.$store.state.groupByDate,
					'list-view':this.$store.state.filter.value==-1||this.$store.state.view==0,
					'small-view':this.$store.state.filter.value>=0&&this.$store.state.view==1,
					'large-view':this.$store.state.filter.value>=0&&this.$store.state.view==3,
				}
			},
			currImgInfo(){
				if (this.selectedPaths.length<=0 || !this.swiper) {
					return {}
				}
				return this.selectedPaths[this.swiper.activeIndex]
			}
		},
		mounted(){
			this.loadData()
			var cb = new ClipBoard('.file-copy', {								    
			    text: (target)=> {
			    	if ($(target).is('.view')) {
			    		return $(this.swiper.slides[this.swiper.activeIndex]).data('file-url')
			    	}
			    	var paths = []
			    	for (var i = 0; i < this.selectedPaths.length; i++) {
			    		paths.push(this.selectedPaths[i].url)
			    	}
			        return paths.join(';')
			    }
			})
			cb.on('success',()=>{
				$$.ui.notify('复制文件URL地址成功',{type:'success'})
			})
			this.events.$off('poe-filter-change')
			this.events.$on('poe-filter-change',e=>{
				this.loadData()
			})
		},
		watch:{
			groupByDate(v){
				console.log(v)
			},
			swiperShow(v){
				if (!this.swiper) {
					this.swiper = new Swiper('.swiper-container', {
						pagination: {
							el: '.swiper-pagination',
							type:'fraction',
						},
					})
				}
				this.swiper.update(true)
			},
			selectedPaths(v){
				$$.each(this.cmItems,(index,item)=>{
					item.disabled=false
					item.visiabled=true

				})

				if (this.$store.state.filter.value>=0) {
					this.cmItems[0].disabled = v.length!=1
					this.cmItems[2].visiabled = v.length<=1
					this.cmItems[3].visiabled = v.length>1
					this.cmItems[5].visiabled = false
					this.cmItems[7].visiabled = false
				}
				else{
					this.cmItems[0].visiabled = false
					this.cmItems[1].visiabled = false
					this.cmItems[2].visiabled = false
					this.cmItems[3].visiabled = false
					this.cmItems[4].visiabled = false
					this.cmItems[6].visiabled = false
				}
				this.swiper&& this.swiper.update(true)

			}
		},
		methods:{
			loadData(){
				return
				$$.ui.loading()
				http.request('res/Resource/get_res_list',{source:1,filter:this.$store.state.filter.value},(rlt)=>{
					$$.ui.hide()
					if (rlt.status==1) {
						this.files=rlt.data||[]
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
			},
			openFiles(){
				if (!this.$store.state.user && this.$store.state.filter.value>=0) {
					return
				}
				var finputer = document.createElement("input"),
					that = this
				finputer.type="file";
				finputer.multiple='multiple'
				switch(this.$store.state.filter.value){
					case 1:
						finputer.accept='image/*'
						break;
					case 2:
						finputer.accept='audio/*'
						break;
					case 3:
						finputer.accept='video/*'
						break;
				}
				finputer.onchange=function(e){
	        		that.uploadFiles(this.files)
				}
				finputer.click()
			},
			unselectFile(e){
				if ($(e.target).closest('.f').length <= 0 && this.selectedPaths.length>0) {
					this.selectedPaths=[]
				}
			},
			selectFile(item){
				if (this.selectedPaths.indexOf(item.id,'id')>=0 && event.which==3) {}
				else{
					if (event.ctrlKey) {
						var index = this.selectedPaths.indexOf(item.id,'id')
						if (index>=0) {
							this.selectedPaths.splice(index,1)
						}
						else{
							this.selectedPaths.push(item)	
						}
					}
					else{
						this.selectedPaths=[item]
					}

						
				}
				this.cmShow=false
			},
			handleContextMenuItemClick(e){
				switch(e.data.key){
					case 'file-open':
						$$.each(this.selectedPaths,function(){
							window.open(this.url,'_blank')
						})
					break
					case 'file-view':
						this.swiperShow=true
					break
					case 'file-down':
						this.downFile()
					break
					case 'file-delete':
						this.delFile()
					break
					default:
				}
			},
			delFile(e){
				// 删除资源
                var ids = [],isView = e?$(e.target).is('.view'):false
                if (isView) {
                	var item=this.selectedPaths[this.swiper.activeIndex]
                	ids = [item.id||item.path]
                }
                else{
                	for (var i = 0; i < this.selectedPaths.length; i++) {
                    	var item = this.selectedPaths[i]
                    	ids.push(item.id || item.path)
                    }
                }
                $$.ui.modal('确实要删除指定资源文件吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    
	                    
	                    http.request('res/Resource/del_res',{files:ids},(rlt)=>{
	                    	$$.ui.hide({ref:'l1'})
	                        if (rlt.status==1) {
	                        	this.files=rlt.data||[]
	                        	if (isView) {
	                        		this.selectedPaths.splice(this.swiper.activeIndex,1)
	                        	}
	                        	else{
	                        		this.selectedPaths=[]
	                        	}
								
	                            $$.ui.toast('删除成功',{icon:'success'})
	                        }
	                        else{
	                            $$.ui.toast('删除失败',{icon:'error'})
	                        }
	                    })
                    }
                })
			},
			downFile(e){
				var length = this.selectedPaths.length,paths,param
				if (length<=0) {
					return
				}
				
				if (length==1) {
					param = '?file='+this.selectedPaths[0].path
				}
				else if ($(e.target).is('.view')) {
                	var item=this.selectedPaths[this.swiper.activeIndex]
                	param = '?file='+item.path
                }
				else{
					paths=this.selectedPaths.map((item)=>{
						return item.id
					})
					param='?files='+paths
				}
				window.location.href=Vue.config.domain+'res/Resource/down_res'+param
			},
			handleDrop(e){
		    	
		        var fs = (e.dataTransfer || e.originalEvent.dataTransfer).files
		        if(fs.length == 0){ 
		            return false
		        } 
	        	this.uploadFiles(fs)
				this.$forceUpdate()

				e.preventDefault()
	        	e.stopPropagation()
	        	e.cancelBubble=true
	        	e.returnValue = false
	        	return false
		    },
		    uploadFiles(fs){
		    	var that = this
		        $.each(fs,function(){
		        	var file = {},
		        		img = $$.createObjectURL(this)

		        	file.title=this.name
		        	file.loading=true
		        	file.path=img
		        	file.url=img

		        	
		        	var now=new Date(new Date().setHours(0, 0, 0, 0)) / 1000,
		        		date = Date.from(now).format('Y年m月d日'),
		        		index = that.files.indexOf(date,'date'),
		        		curr = that.files[index]
		        	if (curr) {
		        		curr.list.unshift(file)
		        	}
		        	else{
		        		that.files.unshift({
		        			time:now,
		        			date:date,
		        			list:[file]
		        		})	
		        	}

		        	var fd = new FormData()
			        fd.append('file', this)
			        fd.append('source', 1)
		        	http.upload(fd,{
		        		xhr(){
		        			var _xhr = $.ajaxSettings.xhr() // new XMLHttpRequest()
					        _xhr.upload.addEventListener("progress", function(e) {  
							    if (e.lengthComputable) {  
							        var percentage = Math.round((e.loaded * 100) / e.total);  
							        //$html.find('.thumb').width($html.width()*percentage) 
							    }  
							}, false)
				   
							_xhr.upload.addEventListener("load", function(e){ 
								file.loading = false
							}, false)
		        			return _xhr
		        		},
		        		success(rlt){
		        			if (rlt.status==1) {
		        				file.url=rlt.data[0].url
		        				file.path =rlt.data[0].path 
		        				file.id = rlt.data[0].id
		        			}
		        			else{
		        				$$.ui.error('图片上传错误');
		        			}
		        		}
		        	})
		        })
		    }
		}
	}
</script>