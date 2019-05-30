<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">图文列表</h2>
			<div class="flex-item"></div>
		</header>
		<article class="poeui-content-box" > <!-- @click="unselectFile" @dblclick="openFiles" -->
			<block class="file-block">
				<div class="hor-right mb-10">
					<tip class="f-left lh-32">展示所有用户的分享内容，【添加】按钮可以添加虚拟帐号的分享内容</tip>
					<a class="btn-block theme" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/art/post">添加</a>
				</div>
				<section >
					<data-table :columns="columns" v-if="essays.length>0" >
						<template v-for="(art,index) in essays">
							<tr>
								<td>
									<tip class="art-topic dp-block mb-5" v-if="art.topic">{{art.topic}}</tip>
									<tip class="f-right">{{art.tags.join(' ')}}</tip>
									<big >{{art.title}}</big>
									<p class="brief mt-10">{{art.brief80}} <a href="javascript:;" @click="handleRowEditorShow(art,index)" style="color:#03A9F4"> 全文 </a></p>
								</td>

								
								<td class="hor-center" style="white-space: nowrap;"><img class="user-photo" :src="art.member.photo||'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'" v-if="art.member">{{art.member?(art.member.nick||'匿名用户'):'未设置'}}</td>
								<td class="hor-center" style="white-space: nowrap;">{{art.stamp.insert.MdYHi}}</td>
								<td-status v-model="art.status" @data-edit="handleRowEdit(art)" @data-del="handleRowDel(art,index)" @change="handleStatusToggle(index,$event)"/>
							</tr>
						</template>
					</data-table>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>

			<data-pagi class="pv-15 ph-30" :page="artPagi" :list="false" @page-change="page = $event.page"/>
		</article>
		<editor class="art-viewer" :show.sync="editorShow" :box="{width:1000,height:800}" v-if="editorShow">
			<div slot="header" class="hor-center">图文编辑</div>
			<ul class="list" style="width:7rem;margin:auto">
				<li>
					<field-editor title="标题" v-model="art.title"/>
					<field-editor title="分类" v-model="art.cata"/>
					<field-editor title="标签" :editable="false">
						<tags-editor v-model="art.tags" />
					</field-editor>
					<field-editor title="话题" v-model="art.topic"/>
					<field-editor title="正文" :editable="false">
						<textarea v-model="art.content" style="width:100%;min-height: 2rem; resize: none;font-size: .18rem;line-height: 1.5"></textarea>
					</field-editor>
					<field-editor title="用户" v-model="art.member.nick" :editable="false"/>
					<field-editor title="图片" :editable="false">
						<multi-uploader v-model="art.pictures"/>
					</field-editor>
				</li>
			</ul>
			<div slot="footer" class="flex-item full-row hor-right">
				<button class="file-delete btn-outline iconfont error mr-10 f-left" title="删除当前文件" @click="handleRowDel(art,art_index)">&#xe8c7;</button>
				<button class="file-delete btn-outline iconfont warning mr-10 f-left" title="重置本次编辑" @click="handleRowRestoe">&#xe734;</button>
				<button class="file-down btn-outline iconfont mr-10" title="取消编辑" @click="editorShow=false;art=null;art_index=-1;">&#xe739;</button>
				<button class="file-copy btn-outline iconfont theme " title="确认并提交修改"  @click="handleRowSubmit(art,art_index)">&#xe737;</button>
			</div>
		</editor>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import ClipBoard from 'clipboard'
	import Vue from 'vue'
	var swiper
	export default {
		route:{
			path:['/art','/art/list'],
			meta:{
				menu:'art',
			},
			
		},
		data() {
			var p = parseInt(this.$route.query.p||1)

			return {
				page:p,
				columns:[{title:'图文',align:'left'},{title:'作者',width:300},{title:'发表时间',width:200},{title:'状态',width:100}],
				essays:[],
				ready:false,
				editorShow:false,
				art:null,
				art_index:-1,
				artPagi:{}
			}

		},
		computed:{
			currImgInfo(){
				if (this.selectedPaths.length<=0 || !this.swiper) {
					return {}
				}
				return this.selectedPaths[this.swiper.activeIndex]
			}
		},
		mounted(){
			this.loadData(this.page)
		},
		watch:{
			page(v){
				this.$router.push({path:this.$route.path,query:{p:v}})
			}
		},
		beforeRouteUpdate (to, from, next) {
			this.loadData(this.page)
			next()
		},
		methods:{
			loadData(page,rows){
				$$.ui.loading()
				http.request('back/art/list_essay',{page:page||1},rlt=>{
					$$.ui.hide()
					if (rlt.status==1) {
						this.essays=rlt.data||[]
						this.artPagi=rlt.page
					}
					else{
						this.essays=[]
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
			},
			handleRowEditorShow(row,index){
				if (!row) {
					$$.ui.modal('当前文章不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
					return
				}
				this.editorShow = true
				row.member = row.member||{household:{}},
				this.art = $$.extend(true,{},row)
				this.art_index = index
			},
			handleStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
                http.request('back/art/set_status',{ids:[this.essays[index].id],status:status},(rlt)=>{
                	$$.ui.hide({ref:'l1'})
                    if (rlt.status!=1) {
                    	$$.ui.modal(rlt.msg,{
                    		cancel:false,
                    		mask:true,
                    		textAlign:'center'
                    	})
                    }
                })
			},
			handleRowEditorHide(){
				this.editorShow = false
				this.art = null
			},
			handleRowEdit(row){
				this.$router.push({path:'/art/edit',query:{aid:row.id}})
			},
			handleRowRestoe(){
				this.art = $$.extend(true,{},this.essays[this.art_index])
			},
			handleRowSubmit(row,index){
				//验证过程
				var msg=[]
				if (!row.content) {
					msg.push(' * 文章内容不能为空')
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
					art:$$.extend(true,{},this.art)
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
				$$.ui.loading('',{ref:'l1'})
				http.request('back/art/save_art',param,rlt=>{
					if (rlt.status==1) {
						$$.ui.hide({ref:'l1'})
						$$.ui.toast('修改成功',{
							icon:'success',
							complete:()=>{
								that.essays.splice(index,1,rlt.data.art)
								that.editorShow=false
								that.art=null
								that.art_index=-1
							}
						})
					}
					else{
						$$.ui.modal(rlt.msg,{mask:true,cancel:false})
					}
				})
			},
			handleRowDel(row,index){
                $$.ui.modal('确实要删除指定数据吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    http.request('back/art/del_arts',{ids:[row.id]},(rlt)=>{
	                    	$$.ui.hide({ref:'l1'})
	                        if (rlt.status==1) {
	                        	this.essays.splice(index,1)
								
	                            $$.ui.toast('删除成功',{icon:'success'})
	                        }
	                        else{
	                            $$.ui.toast('删除失败:'.rlt.msg,{icon:'error'})
	                        }
	                    })
                    }
                })
			},
		}
			
	}
</script>
<style lang="scss">
	table.data-table{
		.user-photo{
			width:.4rem;
			height: .4rem;
			border-radius: 50%;
			margin-right: .05rem;
			vertical-align: middle;
		}
		.op-td{
			.op{
				color:#62A8EA;
			}
		}
		.brief{
		    background-color: #f0f0f0;
		    text-indent: 2em;
		    line-height: 2;
		    padding: 0 .1rem;
		    border-radius: .05rem;
		    color: #616161;
		}
		.art-topic:before,
		.art-topic:after{
			content:' # ';
		}
	}
	.art-viewer .field-editor{
		margin:.1rem 0;
	}
</style>