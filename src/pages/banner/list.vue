<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">轮播广告</h2>
			<div class="flex-item"></div>
		</header>
		<article class="poeui-content-box" >
			<block class="file-block">
				<div class="mb-10 hor-right">
					<button class="btn-block success" style="width:1rem;" @click="handleRowAdd">添加</button>
				</div>
				<section >
					<data-table :columns="columns" v-if="ready && list.length>0" :setting="false">
						<template v-for="(row,index) in list">
							<tr :class="{deleted:row.deleted}">
								<td>
									<img class="f-left mr-10" :class="{gray:row.deleted}" height="60" :src="row.pic">
									<big>{{row.title}}</big><br>
									<tip >{{row.path}}</tip><br>
									<tip>{{row.type_desc}}</tip>
								</td>
								<!-- <td-status v-model="row.status" @data-edit="handleRowEdit(row,index)" @data-del="handleRowDel(row,index)" @change="handleStatusToggle(index,$event)"/> -->
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
					<div class="mv-50 hor-center tip" v-else-if="ready && list.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
		</article>
		<editor class="edit-viewer" title='轮播编辑' :footer='false' :show.sync="editor" :box="{width:600}" >
			<item-editor v-model="current" @change="handleCurrentChange"/>
		</editor>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	import bannerEditor from '@/pages/banner/edit'
	const urls={
		data:'back/banner/list_banners',
		save:'back/banner/save_banner',
		delete:'back/banner/del_banner',
		restore:'back/banner/restore_banner',
	}
	export default {
		components:{
			'item-editor':bannerEditor
		},
		route:{
			path:['/banner','/banner/list'],
			meta:{
				menu:'bnr',
			},
			
		},
		data() {
			return {
				columns:[{title:'轮播',align:'left'},{title:'状态',width:100}],
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
				list:[],
				ready:false,
				editor:false,
				current:null,

			}

		},
		computed:{},
		watch:{},
		mounted(){
			this.loadData()
		},
		methods:{
			loadData(){
				this.ready = false
				http.request(urls.data,rlt=>{
					if (rlt.status==1) {
						this.list=rlt.data||[]
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
					this.ready = true
				})
			},
			handleCurrentChange(row){
				var index = this.list.indexOf(this.current.id,'id')
				if(index>=0){
					this.list.splice(index,1,row)
				}
				else{
					this.list.push(row)
				}
				
				this.editor=false
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
						break
					case 'destroy':
						url = urls.delete
						data = {id:row.id,force:true}
						confirmTip = '确实要彻底删除当前数据吗？'
						break
					case 'restore':
						url = urls.restore
						data = {id:row.id}
						break
					default:
						if (!row) {
							$$.ui.modal('当前数据不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
							return
						}
						this.current = $$.extend(true,{},row)
						this.editor = true
						return
				}
				try{
					if (confirmTip) {
						$$.ui.modal(confirmTip,{mask:true,confirm:()=>{
							this.updateData(url,data,this.list)
						}})
					}
					else{
						this.updateData(url,data,this.list)
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
			handleRowAdd(){

				this.current = {
					pic:'',
					status: 1,
					cata:'',
					type:0,
				}
				this.editor = true
			},
			// handleRowDel(row,index){
   //              $$.ui.modal('确实要删除指定数据吗？',{
   //              	ref:'m1',
   //              	mask:true,
   //              	confirm:()=>{
	  //                   $$.ui.loading('',{ref:'l1'})
	  //                   http.request(urls.delete,{ids:[row.id]},(rlt)=>{
	  //                   	$$.ui.hide({ref:'l1'})
	  //                       if (rlt.status==1) {
	  //                       	this.list.splice(index,1)
								
	  //                           $$.ui.toast('删除成功',{icon:'success'})
	  //                       }
	  //                       else{
	  //                           $$.ui.toast('删除失败:'.rlt.msg,{icon:'error'})
	  //                       }
	  //                   })
   //                  }
   //              })
			// },
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
	}
	.bnr-viewer .field-editor{
		margin:.1rem 0;
	}
</style>