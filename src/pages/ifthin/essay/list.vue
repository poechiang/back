<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">分享动态</h2>
			<div class="flex-item"></div>
		</header>
		<tabs v-model="currTab" :items="['全部动态','待审核','审核通过','审核失败']"/>
		<article class="poeui-content-box" > 
			<block class="file-block">
				<section >
					<data-table :columns="columns" v-if="ready[currTabField]" >
						<template v-for="(row,index) in essays[currTabField]">
							<tr>
								<td>
									<div class="mb-10" v-if="row.topic || row.tags && row.tags.length>0 || row.title">
										<tip class="art-topic dp-block mb-5" v-if="row.topic">{{row.topic}}</tip>
										<tip class="f-right">{{row.tags.join(' ')}}</tip>
										<big >{{row.title}}</big>
									</div>
									<p class="brief">{{row.brief}}…… <a href="javascript:;" @click="handleEssayView(row,false)" style="color:#03A9F4"> 全文 </a></p>
								</td>
								<td class="hor-center" >
									<p class="ellipsis" style="width:1.5rem">
										<img class="user-photo" :src="row.member.photo||'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'" v-if="row.member">{{row.member?(row.member.nick||'匿名用户'):'未设置'}}
									</p>
								</td>
								<td class="hor-center" style="white-space: nowrap;">{{row.stamp.insert.MdYHi}}</td>
								<td class="hor-center ws-nowrap"><tip :theme="row.audit==0?'default':(row.audit>0?'success':'error')" :title="row.audit_msg">{{row.labels.audit}}</tip></td>
								<td-status 
									:value = "row.status"
									:actions="row.deleted?delDataActions:(row.audit==0?unAuditDataActions:auditedDataActions)"
									:toggle="!row.deleted"
									@operate="handleStatusOp($event,row,index)" >
									<tip :theme="row.status==1 && !row.deleted?'success':'error'">{{row.labels.status}}</tip>
								</td-status>
							</tr>
						</template>
					</data-table>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>

			<data-pagi class="pv-15 ph-30" :page="pagi[currTabField]" :list="false" @page-change="page[currTabField] = $event.page"/>
		</article>
		<editor class="art-viewer" :footer="false" :show.sync="editor" :box="{width:800,maxHeight:800}" v-if="current">
			<div slot="header">{{current.title}}</div>
			<div class="mh-50 pb-50">
				<div class="flex-row flex-line-center">
					<img class="user-photo circle mr-10" :src="current.member.photo||'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'">
					<div class="lh-30">
						<big>{{current.member?(current.member.nick||'匿名用户'):'未设置'}}</big><br>
						<tip>{{current.stamp.insert.YmdHis}}</tip>
					</div>
					<div class="flex-item"></div>
					<div class="cata">{{current.cata}}</div>
				</div>
				<div class="tags mt-10" v-if="current.tags">
					<tip class="tag mr-5 ph-5 dp-inline-block br-10 lh-20" style="background-color:#f7f7f7;" v-for="tag in current.tags" :key="tag">{{tag}}</tip>
				</div>
				<div>
					<span class="f-left mr-10" style=" font-size: .18rem;color:red" v-if="current.topic">#{{current.topic}}#</span>
					<div v-html="current.content" style="width:100%;font-size: .18rem;line-height: 1.5"></div>
				</div>
				<multi-uploader v-model="current.pictures" style="background-color: #f7f7f7;padding:.1rem 0;border-radius: .05rem;" :disabled="true"/>

				<div class="flex-row flex-line-center flex-main-center pos-absolute full-width pl-65 pr-71" style="bottom: .1rem;left:0">
					<button class="btn-block btn-large btn-round theme" style="width:2rem" @click="closeEditor" v-if="!audit"> 关闭 </button>
					<template v-else>
						<input class="flex-item mr-5" v-model="audit_msg" placeholder="如果审核不通过，请填写不通过原因">
						<button class="btn-block error mr-5" @click="auditEssay(false)" :disabled="!audit_msg"> 审核失败 </button>
						<button class="btn-block success" @click="auditEssay(true)"> 审核通过 </button>
					</template>
				</div>
			</div>
		</editor>
	</div>

</template>
<script>
	import http from '@/utils/http'
	const urls={
		data:'back/art/list_essay',
		save:'back/art/save_essay',
		delete:'back/art/delete_essay',
		restore:'back/art/restore_essay',
	}
	export default {
		route:{
			path:['/ifthin/essay','/ifthin/essay/list'],
			meta:{
				menu:'essay',
				app:'ifthin'
			},
			
		},
		data() {
			var t = parseInt(this.$route.query.t||0),
				p = parseInt(this.$route.query.p||1),
				page={}
			page[['all','unaudit','audit_ok','audit_err'][t]] = p

			return {
				page:page,
				currTab:t,
				columns:[{title:'图文',align:'left'},{title:'作者',width:100},{title:'发表时间',width:150},'审核',{title:'状态',width:100}],
				delDataActions:{
					restore:{
						title:'恢复当前数据',
						color:'#62A8EA',
						icon:'&#xe734;'
					},
					destroy:{
						title:'彻底删除',
						color:'#F96868',
						icon:'&#xeed6;'
					}
				},
				unAuditDataActions:{
					audit:{
						title:'审核',
						color:'#62A8EA',
						icon:'&#xe761;'
					},
					del:{
						title:'删除',
						color:'#F96868',
						icon:'&#xe889;'
					},
				},
				auditedDataActions:{
					del:{
						title:'删除',
						color:'#F96868',
						icon:'&#xe889;'
					},
				},
				essays:{
					all:[],
					unaudit:[],
					audit_ok:[],
					audit_err:[],
				},
				ready:{
					all:false,
					unaudit:false,
					audit_ok:false,
					audit_err:false
				},
				editor:false,
				current:null,
				audit:false,
				audit_msg:null,
				pagi:{
					all:{},
					unaudit:{},
					audit_ok:{},
					audit_err:{},
				}
			}

		},
		computed:{
			currTabField(){
				return ['all','unaudit','audit_ok','audit_err'][this.currTab]
			}
		},
		mounted(){
			this.loadData(this.page[this.currTabField])
		},
		watch:{
			page(v){
					this.ready[this.currTabField]=false
					this.$router.push({path:this.$route.path,query:{p:v,t:this.currTab}})
			},
			currTab(v){
				this.$router.push({path:this.$route.path,query:{p:this.page[this.currTabField]||1,t:v}})
			}
		},
		beforeRouteUpdate (to, from, next) {
			if (this.currTab!=to.query.t) {
				this.currTab = (to.query.t)
			}
			this.loadData(this.page[this.currTabField]||1)
			next()
		},
		methods:{
			loadData(page,rows){
				if(this.ready[this.currTabField]){
					return
				}
				http.request(urls.data,{audit:this.currTabField,page:page||1},rlt=>{
					if (rlt.status==1) {
						this.essays[this.currTabField]=rlt.data||[]
						this.pagi[this.currTabField]=rlt.page

						this.ready[this.currTabField]=true
					}
					else{
						this.essays[this.currTabField]=[]
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
			},
			closeEditor(){
				this.editor=false
				setTimeout(()=>{
					this.current = null
				},400)
			},
			auditEssay(rlt){

				this.updateData(urls.save,{id:this.current.id,audit:rlt?1:-1,audit_msg:this.audit_msg},(rlt)=>{
					
					if (rlt.status==1) {
                    	var index = this.essays[this.currTabField].indexOf(this.current.id,'id')
                    	var curr = this.essays[this.currTabField][index]

                    	if(rlt.status==1){
                    		curr.audit = rlt.data.audit
                    		curr.audit_msg = rlt.data.audit_msg
                    		this.essays[this.currTabField].splice(index,1,curr)
                    	}

                        $$.ui.toast('',{icon:'success'})
                    }
                    else{

                    	$$.ui.modal(rlt.msg,{cancel:false,mask:true,textAlign:'center'})

                    }

					this.editor=false

					setTimeout(()=>{
						this.current = null
					},400)

				})

				
			},
			handleEssayView(row , audit){
				this.audit = audit
				this.editor = true
				this.current = row
			},


			handleStatusOp(e,row,index){
				var url,data,confirmTip
				switch(e.event){
					case 'toggle':
						url = urls.save
						data = {id:row.id,status:e.detail}
						break
					case 'del':
						url = urls.delete
						data = {id:row.id}
						confirmTip = '确实要删除当前数据吗？<p><p class="tip">删除之前请确保当前分类下已没有产品数据'
						break
					case 'destroy':
						url = urls.delete
						data = {id:row.id,force:true}
						confirmTip = '确实要彻底删除当前数据吗？<p><p class="tip">删除之前请确保当前分类下已没有产品数据'
						break
					case 'restore':
						url = urls.restore
						data = {id:row.id}
						confirmTip = '确实要恢复当前数据吗？'
						break
					default:
						this.handleEssayView(row,true)
						return
				}
				try{
					if (confirmTip) {
						$$.ui.modal(confirmTip,{mask:true,confirm:()=>{
							this.updateData(url,data)
						}})
					}
					else{
						this.updateData(url,data)
					}
	                
				}
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			updateData(url,param,onComplete){
				$$.ui.loading('',{ref:'l1'})

				http.request(url,param,rlt => {
                	$$.ui.hide({ref:'l1'})
                    if (onComplete) {
                    	onComplete(rlt)
                    }
                    else {
                    	if (rlt.status==1) {
	                    	var index = this.essays[this.currTabField].indexOf(param.id,'id'),
	                    		curr = this.essays[this.currTabField][index]
	                    	curr = $$.extend(true,{},curr,rlt.data)
	                    	if(rlt.data){
	                    		this.essays[this.currTabField].splice(index,1,curr)
	                    	}
	                    	else{
	                    		this.essays[this.currTabField].splice(index,1)
	                    	}

	                        $$.ui.toast('',{icon:'success'})
	                    }
	                    else{
	                    	$$.ui.modal(rlt.msg,{cancel:false,mask:true,textAlign:'center'})
	                    }

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
		    color: #9e9e9e;
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