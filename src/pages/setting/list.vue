<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">系统配置</h2>
			<div class="flex-item"></div>
		</header>
		<tabs :items='[{value:1,label:"消息通知"},{value:2,label:"配置列表"}]' v-model="currTab"/>
		<article class="poeui-content-box">
			<block class="file-block"  v-if="currTab==1">
				<div class="mb-10 hor-right">
					<button class="btn-block theme" style="width:1rem;" @click="handleDataAdd">添加</button>
				</div>
				<section >
					<data-table :columns="columns.assist" v-if="ready.assist && list.assist.length>0" :setting="false">
						<template v-for="(row,index) in list.assist">
							<tr :class="{deleted:row.deleted}">
								<td style="line-height: 1.5"><img class="f-left mr-10" height="40" width="40" :src="row.photo">
									{{row.nick}}<br>
									<tip class="mt-5" size="12">{{row.signature || row.name}}</tip>
								</td>
								<td class="hor-center">{{row.official?'是':'否'}}</td>
								<td-status 
									:value = "row.status"
									:actions="row.deleted?delDataActions:true"
									:toggle="!row.deleted"
									@operate="handleStatusOp($event,row,index)" >
									<tip :theme="row.status==1 && !row.deleted?'success':'error'">{{row.labels.status}}</tip>
								</td-status>
							</tr>
						</template>
					</data-table>
					<div class="mv-50 hor-center tip" v-else-if="ready.assist && list.assist.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
			<block class="file-block" v-if="currTab==2">
				<div class="mb-10 hor-right">
					<button class="btn-block theme" style="width:1rem;" @click="handleDataAdd">添加</button>
				</div>
				<section >
					<data-table :columns="columns.setting" v-if="ready.setting && list.setting.length>0" :setting="false">
						<template v-for="(row,index) in list.setting">
							<tr :class="{deleted:row.deleted}">
								<td>{{row.name}}<br>
									<tip class="mt-5" size="12">{{row.title||'--'}}</tip>
								</td>
								<td class="hor-center">{{row.perfix}}</td>
								<td class="hor-center"><button class="btn-outline" @click="handleContentView(row,index)" :disabled="row.deleted">查看</button></td>

								<td-status 
									:value = "row.status"
									:actions="row.deleted?delDataActions:true"
									:toggle="!row.deleted"
									@operate="handleStatusOp($event,row,index)" >
									<tip :theme="row.status==1 && !row.deleted?'success':'error'">{{row.labels.status}}</tip>
								</td-status>
							</tr>
						</template>
					</data-table>
					<div class="mv-50 hor-center tip" v-else-if="ready.setting && list.setting.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
			<data-pagi class="ph-20" :page="pagi[currDataKey]" :list="false" @page-change="this.page = $event.page"/>
		</article>
		<editor class="edit-viewer" title='设置编辑' :footer='false' :show.sync="editor.setting" :box="{width:800}" >
			<setting-editor v-model="current.setting" @change="handleCurrDataChange" v-if="current.setting"/>
		</editor>
		<editor class="edit-viewer" title='消息通知编辑' :footer='false' :show.sync="editor.assist" :box="{width:800}" >
			<assist-editor v-model="current.assist" @change="handleCurrDataChange"  v-if="current.assist"/>
		</editor>

		<editor class="edit-viewer" :title="currViewerTitle" :footer='false' :show.sync="editor.json" :box="{width:800,maxHeight:700}" >
			<json :value='(current.json||{}).content'/>
		</editor>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	import assistEditor from '@/pages/setting/assist'
	import settingEditor from '@/pages/setting/edit'
	const urls={
		assist:{
			data:'back/setting/all_assists',
			save:'back/setting/save_assist',
			delete:'back/setting/delete_assist',
			restore:'back/setting/restore_assist',
		},
		setting:{
			data:'back/setting/all_settings',
			save:'back/setting/save_setting',
			delete:'back/setting/delete_setting',
			restore:'back/setting/restore_setting',
		}
	}
	export default {
		components:{assistEditor,settingEditor},
		route:{
			path:['/setting','/setting/list'],
			meta:{
				menu:'setting',
			},
			
		},
		data() {
			var query = this.$route.query,
				tab = parseInt(query.t||1),p
			switch(tab){
				case 2:
					p = parseInt(query.p||1)
					break
				default:
					p = parseInt(query.p||1)
			}
			return {
				currTab:tab,
				page:p,
				columns:{
					assist:[{title:'消息助手',align:'left'},'官方','状态'],
					setting:[{title:'标识',align:'left'},{
						title:'分组',
						width:100,
					},{
						title:'内容',
						width:100,
					},{
						title:'状态',
						width:100,
					}]
				},
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
				list:{assist:[],settings:[]},
				ready:{
					assist:false,
					setting:false,
				},
				editor:{
					assist:false,
					setting:false,
					json:false,
				},
				current:{
					assist:null,
					setting:null,
					json:null
				},
				pagi:{
					assist:null,
					setting:null,
				}

			}

		},
		computed:{
			currViewerTitle(){
				if (this.current.json) {
					return this.current.json.name+' : '+this.current.json.title
				}
				return ""
			},
			currDataKey(){
				switch(this.currTab){
					case 2:return 'setting'
					default:return 'assist'
				}
			}
		},
		mounted(){
			this.loadData()
		},
		watch:{
			currTab(v){
				this.$router.push({path:this.$route.path, query:{t:v,p:this.page[this.currDataKey]}})
			},
			page(v){
				this.$router.push({path:this.$route.path, query:{t:this.currTab,p:v}})
			},
		},
		beforeRouteUpdate (to, from, next) {
			
			if(!this.ready[this.currDataKey]){
				this.loadData()
			}

			if (this.currTab!=to.query.t) {
				this.currTab = to.query.t
			}
			next()
		},
		methods:{
			loadData(){
				this.ready[this.currDataKey] = false
				http.request(urls[this.currDataKey].data,{rows:15},rlt=>{

					if (rlt.status==1) {
						this.list[this.currDataKey]=rlt.data||[]
						this.pagi[this.currDataKey]=rlt.page
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
					this.ready[this.currDataKey] = true
				})
			},
			handleDataAdd(){
				this.current[this.currDataKey] = this.currTab == 2?{
					status:1,
					type:0,
					cust_photo:'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'
				}:{
					status:1,
					perfix:'app',
					content:""
				}
				this.editor[this.currDataKey] = true
			},
			handleContentView(row,index){
				console.log(row)	
				this.current.json = row		
				this.editor.json = true
			},
			handleCurrDataChange(row){
				var index = this.list[this.currDataKey].indexOf(row.id,'id')

				if(index>=0){
					this.list[this.currDataKey].splice(index,1,row)
				}
				else{
					this.list[this.currDataKey].push(row)
				}
				setTimeout(()=>{
					this.current[this.currDataKey] = null
				},400)
				this.editor[this.currDataKey]=false
			},

			handleStatusOp(e,row,index){
				var url,data,confirmTip
				switch(e.event){
					case 'toggle':
						url = urls[this.currDataKey].save
						data = {id:row.id,status:e.detail}
						break
					case 'del':
						url = urls[this.currDataKey].delete
						data = {id:row.id}
						break
					case 'destroy':
						url = urls[this.currdataKey].delete
						data = {id:row.id,force:true}
						confirmTip = '确实要彻底删除当前数据吗？'
						break
					case 'restore':
						url = urls[this.currDataKey].restore
						data = {id:row.id}
						break
					default:
						if (!row) {
							$$.ui.modal('当前数据不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
							return
						}
						this.current[this.currDataKey] = $$.extend(true,{},row)
						this.editor[this.currDataKey] = true
						return
				}
				try{
					if (confirmTip) {
						$$.ui.modal(confirmTip,{mask:true,confirm:()=>{
							this.updateData(url,data,this.list)
						}})
					}
					else{
						this.updateData(url,data,this.list[this.currDataKey])
					}
	                
				}
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			updateData(url,param,data){
				$$.ui.loading('',{ref:'l1'})

				http.request(url,param,rlt=>{
                	$$.ui.hide({ref:'l1'})
                    if (rlt.status==1) {
                    	var index = data.indexOf(param.id,'id')
                    	if(rlt.data){
                    		data.splice(index,1,rlt.data)
                    	}
                    	else{
                    		data.splice(index,1)
                    	}

                        $$.ui.toast('',{icon:'success'})
                    }
                    else{
                    	$$.ui.modal(rlt.msg,{cancel:false,mask:true,textAlign:'center'})
                    }
                })
			},
			/*handleAssistStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.save_assist,{id:this.list.assist[index].id,status:status},(rlt)=>{
	                	$$.ui.hide({ref:'l1'})
	                    if (rlt.status!=1) {
	                    	$$.ui.modal(rlt.msg,{
	                    		cancel:false,
	                    		mask:true,
	                    		textAlign:'center'
	                    	})
	                    }
	                })
	            }
	            catch(err){
	            	$$.ui.hide({ref:'l1'})
	            	$$.ui.modal(err,{cancel:false,confirm:false})
	            }
			},
			handleSettingStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.save,{id:this.list.setting[index].id,status:status},(rlt)=>{
	                	$$.ui.hide({ref:'l1'})
	                    if (rlt.status!=1) {
	                    	$$.ui.modal(rlt.msg,{
	                    		cancel:false,
	                    		mask:true,
	                    		textAlign:'center'
	                    	})
	                    }
	                })
	            }
	            catch(err){
	            	$$.ui.hide({ref:'l1'})
	            	$$.ui.modal(err,{cancel:false,confirm:false})
	            }
			},
			handleAssistRowEdit(row,index){
				//this.$router.push({path:'/banner/edit',query:{bid:row.id}})
				if (!row) {
					$$.ui.modal('当前配置不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
					return
				}

				this.current.assist = $$.extend(true,{},row)

				this.editor[this.currDataKey] = true
			},
			handleSettingRowEdit(row,index){
				//this.$router.push({path:'/banner/edit',query:{bid:row.id}})
				if (!row) {
					$$.ui.modal('当前配置不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
					return
				}

				this.current.setting = $$.extend(true,{},row)

				this.settingEditorShow = true
			},
			handleAssistRowDel(row,index){
                $$.ui.modal('确实要删除指定数据吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    try{
		                    http.request(urls.delAssist,{ids:[row.id]},(rlt)=>{
		                    	$$.ui.hide({ref:'l1'})
		                        if (rlt.status==1) {
		                        	this.list.assist.splice(index,1)
									
		                            $$.ui.toast('删除成功',{icon:'success'})
		                        }
		                        else{
		                            $$.ui.toast('删除失败:'.rlt.msg,{icon:'error'})
		                        }
		                    })

			            }
			            catch(err){
			            	$$.ui.hide({ref:'l1'})
			            	$$.ui.modal(err,{cancel:false,confirm:false})
			            }
                    }
                })
			},
			handleSettingRowDel(row,index){
                $$.ui.modal('确实要删除指定数据吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    try {
		                    http.request(urls.delete,{ids:[row.id]},(rlt)=>{
		                    	$$.ui.hide({ref:'l1'})
		                        if (rlt.status==1) {
		                        	this.list.setting.splice(index,1)
									
		                            $$.ui.toast('删除成功',{icon:'success'})
		                        }
		                        else{
		                            $$.ui.toast('删除失败:'.rlt.msg,{icon:'error'})
		                        }
		                    })

			            }
			            catch(err){
			            	$$.ui.hide({ref:'l1'})
			            	$$.ui.modal(err,{cancel:false,confirm:false})
			            }
                    }
                })
			},*/
		}
			
	}
</script>