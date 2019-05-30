<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">产品库</h2>
			<div class="flex-item"></div>
		</header>
		<tabs :items='[{value:1,label:"产品"},{value:4,label:"品牌"},{value:5,label:"分类"}]' v-model="currTab"/>
		<article class="poeui-content-box" >
			<block class="file-block" v-if="currTab==1" >
				<div class="hor-right mb-10">
					<a class="btn-block success" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/good/add">添加</a>
				</div>
				<data-table :columns="columns.good" v-if="ready.good && list.good.length>0" :setting="false">
					<template v-for="(row,index) in list.good">
						<tr :class="{deleted:row.deleted}">
							<td style="line-height: 1.5"  :title="row.title"><img class="f-left mr-10" height="40" width="40" :src="row.heads[0]" v-if="row.heads && row.heads.length>0">
								{{row.abbr||row.title}}<br>
								<tip class="mt-5" size="12">{{row.cata_title}}</tip>
							</td>
							<td class="hor-center">{{row.brand.title||'（无）'}}</td>
							<td class="hor-center" style="white-space: nowrap;">{{row.tags.join(',')}}</td>
							<td class="hor-center" style="white-space: nowrap;">￥{{row.retail_price}}</td>
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
				<div class="mv-50 hor-center tip" v-else-if="ready.good && list.good.length<=0"> == 没有数据 == </div>
				<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
			</block>
			<block class="file-block" v-if="currTab==4" >
				<div class="hor-right mb-10">
					<button class="btn-block success" style="width:1rem;" @click="addData('brand')">添加</button>
				</div>
				<data-table :columns="columns.brand" v-if="ready.brand && list.brand.length>0"  :setting="false">
					<template v-for="(row,index) in list.brand">
						<tr :class="{deleted:row.deleted}">
							<td style="line-height: 1.5">
								<img class="f-left mr-10" height="40" :src="row.logo">
								{{row.title}}<br>
								<tip class="mt-5" size="12">{{row.desc||'暂无介绍'}}</tip>
							</td>
							<td class="hor-center" style="white-space: nowrap;">{{row.stamp.insert.YmdHis}}</td>
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
				<div class="mv-50 hor-center tip" v-else-if="ready.brand && list.brand.length<=0"> == 没有数据 == </div>
				<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
			</block>
			<block class="file-block" v-if="currTab==5" >
				<div class="hor-right mb-10">
					<button class="btn-block success" style="width:1rem;" @click="addData('cata')">添加</button>
				</div>
				<data-table :columns="columns.cata" :setting="false" v-if="ready.cata && list.cata.length>0">
					<template v-for="(row,index) in list.cata">
						<tr :class="{deleted:row.deleted}">
							<td>{{row.code}}</td>
							<td>{{row.name}}<br> <tip size="12">{{row.title}}</tip> </td>
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
				<div class="mv-50 hor-center tip" v-else-if="ready.cata && list.cata.length<=0"> == 没有数据 == </div>
				<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
			</block>
			<data-pagi class="ph-20" :page="pagi[currTabKey]" :list="false" @page-change="handlePageChange"/>
		</article>
		<editor class="edit-viewer" title='产品编辑' :footer='false' :show.sync="editor.good" :box="{width:1000,height:800}" >
			<good-editor v-model="current" @change="handleCurrentChange" v-if="editor.good && current"/>
		</editor>
		<editor class="edit-viewer" title='品牌编辑' :footer='false' :show.sync="editor.brand" :box="{width:800,height:500}" >
			<brand-editor v-model="current" @change="handleCurrentChange" v-if="editor.brand && current"/>
		</editor>
		<editor class="edit-viewer" title='产品分类编辑' :footer='false' :show.sync="editor.cata" :box="{width:800}" >
			<cata-editor v-model="current" @change="handleCurrentChange" v-if="editor.cata && current"/>
		</editor>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	import goodEditor from '@/pages/good/good'
	import brandEditor from '@/pages/good/brand'
	import cataEditor from '@/pages/good/cata'
	const urls={
		good:{
			data:'back/good/list_goods',
			save:'back/good/save_good',
			delete:'back/good/del_good',
		},
		brand:{
			data:'back/brand/list_brands',
			save:'back/brand/save_brand',
			delete:'back/brand/delete_brand',
			restore:'back/brand/restore_brand',
		},
		cata:{
			data:'back/good/list_good_catas',
			save:'back/good/save_good_cata',
			delete:'back/good/del_good_cata',
			restore:'back/good/restore_good_cata',
		}
	}
	export default {
		components:{
			'good-editor':goodEditor,
			'brand-editor':brandEditor,
			'cata-editor':cataEditor
		},
		route:{
			path:['/good','/good/list'],
			meta:{
				menu:'good',
			}
		},
		data() {
			var tab = parseInt(this.$route.query.t||1),page={},p=parseInt(this.$route.query.p||1)

			switch(tab){
				case 5:
				page['good'] = p
				break
				case 4:
				page['brand'] = p
				break
				default:
				page['good'] = p
			}

			return {
				currTab:tab,
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
				columns:{
					good:[{title:'产品名称',align:'left'},'品牌','标签','价格',{title:'状态',width:100}],
					brand:[{title:'品牌',align:'left'},'添加时间',{title:'状态',width:100}],
					cata:[{
						title:'编码',
						align:'left'
					},{
						title:'分类',
						align:'left'
					},{
						title:'状态',
						width:100
					}],
				},
				list:{
					good:[],
					brand:[],
					cata:[],
				},
				editor:{
					brand:false,
					cata:false,
					good:false
				},
				current:null,

				ready:{
					good:false,
					brand:false,
					cata:false,
				},
				pagi:{
					good:null,
					brand:null,
					cata:null
				},
				page:page


			}

		},
		computed:{
			currTabKey(){
				switch(this.currTab){
					case 5:
					return 'cata'
					break
					case 4:
					return 'brand'
					break
					default:
					return 'good'
				}
			}
		},
		mounted(){
			this.loadData()
		},
		watch:{
			currTab(v){
				this.$router.push({path:this.$route.path,query:{t:v,p:this.page[this.currTabKey]}})
			},
			page(v){
				this.ready[this.currTabKey] = false
				this.$router.push({path:this.$route.path,query:{t:this.currTab,p:v}})
			},
		},
		beforeRouteUpdate (to, from, next) {
			
			if (this.currTab!=to.query.t) {
				this.currTab = (to.query.t)
			}

			this.loadData()
			next()
		},
		methods:{
			loadData(){
				if (this.ready[this.currTabKey]) {
					return
				}
				http.request(urls[this.currTabKey].data,rlt=>{
					//$$.ui.hide()
					if (rlt.status==1) {
						this.list[this.currTabKey]=rlt.data||[]
						this.pagi[this.currTabKey]=rlt.page
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
					this.ready[this.currTabKey] = true
				})
			},

			handlePageChange(e){
				this.page[this.currTabKey] = e.page
			},
			
			addData(key){
				this.current={status:1}
				this.editor[key || currTabKey] = true
			},

			handleCurrentChange(row,key){

				if (this.editor[key||this.currTabKey]) {
					var index = this.list[key||this.currTabKey].indexOf(row,'id')
					if (index<0)  {
						this.list[key||this.currTabKey].push(row)
					}
					else{
						this.list[key||this.currTabKey].splice(index,1,row)
					}
					this.editor[key||this.currTabKey]=false
				}

				this.current=null
			},
			handleStatusOp(e,row,index){
				var url,data,confirmTip
				switch(e.event){
					case 'toggle':
						url = urls[this.currTabKey].save
						data = {id:row.id,status:e.detail}
						break
					case 'del':
						url = urls[this.currTabKey].delete
						data = {id:row.id}
						confirmTip = '确实要删除当前数据吗？<p><p class="tip">删除之前请确保当前分类下已没有产品数据'
						break
					case 'destroy':
						url = urls[this.currTabKey].delete
						data = {id:row.id,force:true}
						confirmTip = '确实要彻底删除当前数据吗？<p><p class="tip">删除之前请确保当前分类下已没有产品数据'
						break
					case 'restore':
						url = urls[this.currTabKey].restore
						data = {id:row.id}
						confirmTip = '确实要恢复当前数据吗？'
						break
					default:
						if (!row) {
							$$.ui.modal('当前数据不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
							return
						}
						this.editor[this.currTabKey] = true
						this.current = $$.extend(true,{},row)
						return
				}
				try{
					if (confirmTip) {
						$$.ui.modal(confirmTip,{mask:true,confirm:()=>{
							this.updateData(url,data,this.list[this.currTabKey])
						}})
					}
					else{
						this.updateData(url,data,this.list[this.currTabKey])
					}
	                
				}
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			updateData(url,param,data){
				$$.ui.loading('',{ref:'l1'})
				console.log(param)
				http.request(url,param,rlt=>{
                	$$.ui.hide({ref:'l1'})
                    if (rlt.status==1) {
                    	var index = data.indexOf(param.id,'id')
                    	console.log(index)
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
			}
		}
			
	}
</script>
<style lang="scss"></style>