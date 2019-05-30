<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">会员</h2>
			<div class="flex-item"></div>
		</header>
		<article class="poeui-content-box" >
			<block class="file-block" >
				<section >
					<data-table :columns="columns" v-if="ready && members.length>0" :setting="false">
						<tr v-for="(row,index) in members" :key="row.id">
							<td>
								<img class="user-photo f-left" :src="row.photo||def_photo">
								<tip class="dp-inline-block mt-5" size="12">{{row.uuid}}</tip><br>
								{{row.nick}}<br>
								<tip class="dp-inline-block mt-5" size="12">{{row.name}}</tip><br>
							</td>
							<td class="hor-center">{{row.mark_phone}}</td>
							<td class="hor-center">{{row.labels.gender}}</td>
							<td class="hor-center">{{row.region||'（无）'}}</td>
							<td class="hor-center">{{row.stamp.reg.MdYHi}}</td>
							<td-status v-model="row.status" :status="['冻结','正常']" :toggle="{on:'帐号状态正常',off:'冻结账号'}" @data-edit="handleEdit(row.id)" @data-del="handleDel(row,index)" @change="handleStatusToggle(index,$event)"/>
						</tr>
					</data-table>
					<div class="mv-50 hor-center tip" v-else-if="ready && members.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
			<data-pagi class="ph-20" :page="pagi" :list="false" @page-change="handlePageChange"/>
		</article>
		<!-- <editor class="edit-viewer" title='会员编辑' :footer='false' :show.sync="editor.member" :box="{width:1000,height:800}" >
			<member-editor v-model="current" @change="handleCurrentChange" v-if="editor.member && current"/>
		</editor>
		<editor class="edit-viewer" title='品牌编辑' :footer='false' :show.sync="editor.perm" :box="{width:800}" >
			<perm-editor v-model="current" @change="handleCurrentChange" v-if="editor.perm && current"/>
		</editor>
		<editor class="edit-viewer" title='会员分类编辑' :footer='false' :show.sync="editor.role" :box="{width:800}" >
			<role-editor v-model="current" @change="handleCurrentChange" v-if="editor.role && current"/>
		</editor> -->
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	const urls={
		data:'back/user/list_members',
		save:'back/user/save_member',
		delete:'back/user/del_member',
	}
	export default {
		route:{
			path:['/member','/member/list'],
			meta:{
				menu:'member',
			}
		},
		data() {
			return {
				def_photo:'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg',
				columns:[{title:'账号',align:'left'},'手机号码','性别','地区','注册',{title:'状态',width:100}],
				list:[],
				editor:false,
				current:null,
				ready:false,
				page:parseInt(this.$route.query.p||1),
				pagi:null
			}

		},
		watch:{
			page(v) {
				this.ready=false
				console.log(this.$router)
				this.$router.push({
					path: this.$route.path,
					query: {p:v}
				})
			},
		},
		beforeRouteUpdate(to, from, next) {
			!this.ready && this.loadData()

			next()
		},
		mounted(){
			this.loadData()
		},
		methods:{
			loadData(){
				this.ready = false
				http.request(urls.data,{page:this.page},rlt=>{
					//$$.ui.hide()
					if (rlt.status==1) {
						this.members=rlt.data||[]
						this.pagi=rlt.page
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
					this.ready = true
				})
			},
			handleCurrentChange(row){
				if (this.editor) {
					this.members.splice(this.current_index,1,row)
					this.editor=false
				}
				this.current=null
			},
			handleStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.member.save,{id:this.members[index].id,status:status},(rlt)=>{
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
			handleEdit(row){
				if ($$.isNumber(row)) {
					this.$router.push({path:'member/edit',query:{id:row}})
				}
				else{
					this.editor = true
					this.current = $$.extend(true,{},row)
				}
			},
			handleDel(row,index){
                $$.ui.modal('确实要删除当前会员吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    http.request(urls.member.delete,{ids:[row.id]},(rlt)=>{
	                    	$$.ui.hide({ref:'l1'})
	                        if (rlt.status==1) {
	                        	this.members.splice(index,1)
								
	                            $$.ui.toast('删除成功',{icon:'success'})
	                        }
	                        else{
	                            $$.ui.modal('删除失败:'.rlt.msg,{mask:true,cancel:false,textAlign:'center'})
	                        }
	                    })
                    }
                })
			},
			handlePageChange(e){
				this.page = e.page
			}
		}
			
	}
</script>
<style lang="scss">
	table.data-table{
		.user-photo{
			width:.6rem;
			height: .6rem;
			border-radius: .05rem;
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