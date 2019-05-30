<template>
	<section id="art-edit" class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">文章列表</a> —— {{$route.params.id?'编辑':'添加'}}</h2>
			<div class="flex-item"></div>
			<div>
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handlePost">提交</button>
			</div>
		</header>
		<article class="poeui-content-box" style="min-width: 9rem;">
			<block class="file-block fields-box pr-80" title="文章内容" :loading="!ready">
				<div style="width:8rem;margin:auto">
					<field title="标题" v-model="article.title" placeholder="（可选）输入文章标题……"/>
					<field title="分类" v-model="article.cata" placeholder="（可选）选择已有或输入新的分类名称" :data-list="catas"/>
					<!-- <datalist id="cataList">
						<option v-for="item in catas">{{item}}</option>
					</datalist> -->
					<field title="话题" v-model="article.topic" placeholder="（可选）所属 话题 ……" :data-list="topics"/>
					<!-- <datalist id="topicList">
						<option v-for="item in topics">{{item}}</option>
					</datalist> -->
					<field title="标签">
						<tags-editor v-model="article.tags" :hots="tags" catch-perfix='art_tags'/>
					</field>
					<field title="内容" :require="true">
						<quill-editor
							class="flex-column flex-item quill-editor"
							:class="{docked:isEditorDocked}" 
							v-model="article.content" 
							ref="myQuillEditor" 
							:options="editorOption" 
							@change="handleEditorChange($event)" style="min-height: 5rem;font-size: .16rem;">
				        </quill-editor>
					</field>
					<field title="图片">
						<multi-uploader v-model="article.pictures"/>
					</field>
					<field title="可见性" v-model="article.visible" :list="artVisibilities" type="radio"/>

					<field title="允许收藏">
						<onoff v-model="article.meta.allow.fav" on="1" off="0"> **允许别人点赞收藏</onoff>
					</field>
					<field title="允许评论">
						<onoff v-model="article.meta.allow.reply" on="1" off="0"> **允许别人回复留言</onoff>
					</field>
					<field title="允许分享">
						<onoff v-model="article.meta.allow.share" on="1" off="0"> **允许别人转发分享</onoff>
					</field>
				</div>
			</block>
			<block class="file-block fields-box pr-80" title="作者信息" :loading="!ready">
				<div style="width:8rem;margin:auto">
					<field title="用户" v-model="cuid" type="select" :list="users"></field>
					<template v-if="cuid<=0">
						<field title="帐号" :require="true" v-model="user.name"/>
						<field title="昵称" :require="true" v-model="user.cust_nick"/>
						<field title="头像" :require="true">
							<div class="tip f-right">用户头像，要求正方形，1M以内jpg,png图片</div>
							<uploader v-model="user.cust_photo" width="200" height="200" :auto="true"/>
						</field>
						<field title="籍贯" :require="true">
							<region v-model="user.household.adcode" @select="handleHHComplete"/>
						</field>
						<field title="现居地" :require="true">
							<region v-model="user.adcode" @select="handleAdComplete"/>
						</field>
					</template>
				</div>
			</block>
			<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handlePost">提交</button>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	import { quillEditor } from 'vue-quill-editor'
	import quillModule from '@/../config/quill'
	export default {
		route:{
			path:['/art/post','/art/edit'],
			meta:{
				menu:'art',
			},

		},
		data() {
			return {
				ready: false,
				changed:false,
				tags: [],
				catas: [],
				topics:[],
				cuid:0,
				users:['新增用户'],
				user:{
					household:{}
				},
				newPic:'',
				article: {
					tags:[],
					visible: 0,
					cata:'',
					topic:'',
					pictures:[],
					meta:{
						allow:{
							reply:1,
							fav:1,
							share:1
						}
					},
				},
				artVisibilities:[],
				isEditorDocked:false,
				showDropDown:false,
				newtag: '',
				editorOption:{
					placeholder: '文章内容....',
					theme: 'snow',  // or 'bubble'
					modules: quillModule.tuwen
				}
			}

		},
		mounted(){
			window.addEventListener('scroll',()=>{
				var offset = $('.quill-editor').offset()
				if (offset) {
					this.isEditorDocked = $(window).scrollTop()>=offset.top
				}
			},true)
			var aid = this.$route.query.aid
			this.loadData(aid||0)
		},
		computed:{
			editor() {
				//console.log(this.$refs.myQuillEditor.quill)
				return this.$refs.myQuillEditor.quill
			}
		},
		watch:{
			article:{
				handler(v){
					this.changed=true
				},
				deep:true
			},
			user:{
				handler(v){
					this.changed=true
				},
				deep:true
			},
			cuid(v){

				this.article.user_id=v
			}
		},
		methods:{
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(aid){

				

					http.request('back/art/edit_art',{id:aid||0},(rlt)=>{
						if (rlt.status==1) {
							this.tags = rlt.data.tags
							this.catas = rlt.data.catagories
							this.topics = rlt.data.topics

							var users = [{
									value:0,
									label:'添加新用户'
								}] 
							$$.each(rlt.data.users,function(){
								users.push({
									value:this.id,
									label:this.nick+' '+(this.loc_desc||'')
								})
							})

							this.users = users
							this.artVisibilities = rlt.data.visibilities
							if (rlt.data.article) {
								rlt.data.article.tags = rlt.data.article.tags ||[]
								rlt.data.article.pictures = rlt.data.article.pictures ||[]
								rlt.data.article.meta = rlt.data.article.meta||{allow:{
									reply:1,
									fav:1,
									share:1
								}}
								this.article = rlt.data.article
								this.cuid = rlt.data.article.user_id
							}
							this.ready=true
						}
						else{
							$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
						}
					})
				
			},
			handlePost(){
				//验证过程
				var msg=[]
				if (!this.article.content) {
					msg.push(' * 文章内容不能为空')
				}
				//console.log(this.user)
				if (this.cuid<=0) {
					if (!this.user.cust_nick) {
						msg.push(' * 新增用户需要填写用户昵称')
					}
					if (!this.user.cust_photo) {
						msg.push(' * 新增用户需要上传用户头像')
					}
					if (!this.user.household.adcode) {
						msg.push(' * 新增用户需要选择籍贯')
					}
					if (!this.user.adcode) {
						msg.push(' * 新增用户需要选择现居地')
					}
				}
				if (msg.length>0) {
					$$.ui.modal('您有'+msg.length+'项信息需要补全：<p>'+msg.join('<p>'),{
						title:'提示',
						cancel:false,
						mask:true
					})
					return
				}

				var param = {
					art:$$.extend(true,{},this.article)
				}
				if (this.cuid==0) {
					param.user=this.user
				}

				if (param.art.tags.length<=0) {
					param.art.tags='-empty-'
				}
				if (param.art.pictures.length<=0) {
					param.art.pictures='-empty-'
				}
				var that = this
				http.request('back/art/save_art',param,rlt=>{
					if (rlt.status==1) {
						if (this.article.id) {
							$$.ui.modal('修改成功',{
								textAlign:'center',
								mask:true,
								cancel:false,
								confirm:()=>{
									that.$router.go(-1)
								}

							})
						}
						else{
							$$.ui.modal('发布成功',{
								textAlign:'center',
								mask:true,
								cancel:{
									text:'返回',
									callback:()=>{
										that.$router.push({path:'/art/list'})
									},
								},
								confirm:{
									text:'继续发布',
									callback:()=>{
										that.article={
											tags:[],
											visible: 0,
											cata:'',
											topic:'',
											pictures:[],
											meta:{
												allow:{
													reply:1,
													fav:1,
													share:1
												}
											},
										}
										that.user={
											household:{}
										}
										that.cuid=0
										this.loadData()
									}
								}

							})
						}
						
					}
					else{
						$$.ui.modal(rlt.msg,{mask:true,cancel:false})
					}
				})
			},

			handleEditorChange:function({editor, html, text}) {
				this.article.content = html
			},
			handleAdComplete(e){
				//console.log(e)
				this.user.adcode=e.code
				this.user.province=e.prov
				this.user.city=e.city
				this.user.county=e.dist
			},
			handleHHComplete(e){
				//console.log(e)
				this.user.household={
					adcode:e.code,
					prov:e.prov,
					city:e.city,
					county:e.dist
				}
			},
			quillImgSuccess:function(e) {
				let quill = this.$refs.myQuillEditor.quill

				this.handleImageAdded(e.target.files[0],quill,quill.getSelection().index,()=>{

					quill.setSelection(length + 1)

				})

			},
			handleOpenPic(){
				var finputer = document.createElement("input"),
					that = this
				finputer.type="file";
				finputer.multiple='multiple'
				finputer.accept='image/*'
				finputer.onchange=function(e){
	        		that.handleUploadPic(this.files)
				}
				finputer.click()
			},
		    handleUploadPic(fs){
		    	var fd = new FormData(),
		    		count = 9-this.article.pictures.length||0
		        $.each(fs,function(){
		        	if (count<=0) {
		        		return
		        	}
		        	fd.append('file[]', this)
		        	count--
		        })

	        	http.upload(fd,rlt=>{
        			if (rlt.status==1) {
        				for(var i =0;i<rlt.data.length;i++){
	        				this.article.pictures.push(rlt.data[i].url)
        				}
        			}
        			else{
        				$$.ui.modal('图片上传错误',{mask:true,cancel:false});
        			}
        		})
		    },
		    handleClearPic(){
		    	this.article.pictures=[]
		    }
		}
	}
</script>
<style lang="scss">
	@import '@/assets/css/editor.scss';
	@import '@/assets/css/article/edit.scss';
</style>