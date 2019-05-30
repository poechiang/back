<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">管理员</h2>
			<div class="flex-item"></div>
		</header>
		<article class="poeui-content-box" >
			<block class="file-block" :title="true">
				<div slot="aside" class="hor-right">
					<a class="btn-block theme" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/admin/add">添加</a>
				</div>
				<section >
					<data-table :columns="columns" :loading="!ready" :load-empty="!ready && list.length<=0">
						<tr v-for="(row,index) in list" :key="row.id">
							<td>
								<img class="user-photo f-left mr-10"  :src="row.photo||'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'">
								{{row.name}}<br>
								<tip size="12">{{row.dep_name||'--'}} {{row.post_name||'--'}}</tip><br>
								<tip size="12">{{row.unit||'--'}}</tip>
							</td>
							<td v-if="row.login_info.last">
								{{row.login_info.last.time}}<br>
								{{row.login_info.last.ip}}
							</td>
							<td class="hor-center" v-else>
								<tip>暂无登录记录</tip>
							</td>
							<td class="hor-center">{{row.login_info.count||0}}</td>
							<td class="hor-center"><tip :theme="row.review?'success':'default'">{{row.labels.review}}</tip></td>
							<td-status v-model="row.status" :status="['冻结','正常']" :toggle="{on:'帐号状态正常',off:'冻结账号'}" @data-edit="handleDataEdit(row,index)" @data-del="handleDataDel(row,index)" @change="handleDataStatusToggle(index,$event)"/>
						</tr>
					</data-table>
				</section>
			</block>
			<data-pagi class="ph-20" :page="pagi" :list="false" @page-change="this.page = $event.page"/>
		</article>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	const urls={
		data:'back/user/list_admins',
		save:'back/user/save_admin',
		delete:'back/user/del_admin',
	}
	export default {
		route:{
			path:['/admin','/admin/list'],
			meta:{
				menu:'admin',
			}
		},
		data() {
			return {
				columns:[{title:'账号',align:'left'},'最近登录','登录次数','审核','状态'],
				list:[],
				ready:false,
				pagi:{},
				page:parseInt(this.$route.query.p||1),
			}

		},
		watch:{
			page: {
				handler(v) {
					this.ready=false
					this.$router.push({
						path: this.$route.path,
						query: {p: v}
					})
				},
				deep: true
			},
		},
		beforeRouteUpdate (to, from, next) {

			!this.ready && this.loadData()

			next()
		},
		mounted(){
			!this.ready && this.loadData()
		},
		methods:{
			loadData(){
				this.ready = false
				http.request(urls.data,rlt=>{
					//$$.ui.hide()
					if (rlt.status==1) {
						this.list=rlt.data||[]
						this.pagi=rlt.page||{}
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
					this.ready = true
				})
			},
			addBrand(){
				this.current={status:1}
				this.editor.perm = true
			},
			addCata(){
				this.current={status:1}
				this.editor.role = true
			},
			handleCurrentChange(row){
				if (this.editor) {
					this.list.splice(this.current_index,1,row)
					this.editor=false
				}
				if (this.editor.perm) {
					if (this.current_index<0) {
						this.list.perms.push(row)
					}
					else{
						this.list.perms.splice(this.current_index,1,row)
					}
					this.editor.perm=false
				}
				if (this.editor.role) {
					if (this.current_index<0) {
						this.list.roles.push(row)
					}
					else{
						this.list.roles.splice(this.current_index,1,row)
					}
					this.editor.role=false
				}
				this.current=null
				this.current_index=-1
			},
			handleDataStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.save,{id:this.list[index].id,status:status},(rlt)=>{
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
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			handleBrandStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.perm.save,{id:this.list.perms[index].id,status:status},(rlt)=>{
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
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			handleCataStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.role.save,{id:this.list.roles[index].id,status:status},(rlt)=>{
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
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			handleDataEdit(row,index){
				this.$router.push({path:'/admin/edit',query:{id:row.id}});
			},
			handleDataDel(row,index){
                $$.ui.modal('确实要删除当前管理员吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    http.request(urls.delete,{ids:[row.id]},(rlt)=>{
	                    	$$.ui.hide({ref:'l1'})
	                        if (rlt.status==1) {
	                        	this.list.splice(index,1)
								
	                            $$.ui.toast('删除成功',{icon:'success'})
	                        }
	                        else{
	                            $$.ui.modal('删除失败:'.rlt.msg,{mask:true,cancel:false,textAlign:'center'})
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
			width:.5rem;
			height: .5rem;
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