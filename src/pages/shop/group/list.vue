<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">团购</h2>
			<div class="flex-item"></div>
		</header>
		<article class="poeui-content-box" >
			<block class="file-block" :loading="!ready" :load-empty = "ready && list&& list.length<=0" :load-end="ready&&pagi.curr == pagi.last">
				<div slot="aside" class="hor-right">
					<a class="btn-block theme" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/shop/group/add">添加</a>
				</div>
				<data-table :columns="columns" :setting="false">
					<template v-for="(row,index) in list">
						<tr>
							<td style="line-height: 1.5":title="row.meta.good.title"><img class="f-left mr-10" height="80" width="80" :src="row.meta.good.heads[0]" v-if="row.meta.good.heads && row.meta.good.heads.length>0">
								{{row.meta.good.abbr||row.meta.good.title}}<br>
								<tip class="mt-5" size="12">分类：{{row.meta.good.cata_title}}</tip><br>
								<tip class="mt-5" size="12">品牌：{{row.meta.good.brand.title}}</tip><br>
								<tip class="mt-5" size="12">标签：{{row.meta.good.tags.join(',')}}</tip>
							</td>
							<td class="hor-center">{{row.meta.good.retail_price}}</td>
							<td><template  v-for="p in row.pricers" >{{p.price}} <tip class="ml-15" color="#BDBDBD" size="14">{{p.count}}人团 </tip><br></template></td>
							<td-status v-model="row.status" :status="['下线','上线']" :toggle="{on:'产品上线',off:'产品下线'}" @data-edit="handleEdit(row,index)" @data-del="handleDel(row,index)" @change="handleStatusToggle(index,$event)"/>
						</tr>
					</template>
				</data-table>
			</block>
				<data-pagi class="ph-20" :page="pagi" :list="false" @page-change="handlePageChange"/>
		</article>
		<!-- <editor class="edit-viewer" :footer='false' :show.sync="editor" :box="{width:1000}" >
			<discount-editor v-model="current" @change="handleCurrentChange" v-if="current"/>
		</editor> -->
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	// import groupEditor from '@/pages/shop/group/edit'
	const urls={
		data:'back/good/list_groups',
		save:'back/good/save_group',
		delete:'back/good/del_group',
	}
	export default {
		// components:{
		// 	'group-editor':groupEditor,
		// },
		route:{
			path:['/shop/group','/shop/group/list'],
			meta:{
				menu:'group',
			}
		},
		data() {
			var query = this.$route.query,
			// 	tab = parseInt(query.t||1),
				page =  parseInt(query.p||1)

			return {
				page:page,
				columns:[{title:'产品名称',align:'left'},'零售价格',{title:'价格',align:'left'},{title:'状态',width:100}],
				editor:false,
				current:null,
				list:{},
				ready:false,
				pagi:{}
			}

		},
		computed:{
			// currTabField(){
			// 	return '(this.tabs.get(this.currTab,'value')||{}).field
			// }
		},
		mounted(){
			this.loadData()
		},
		watch:{
			// currTab(v){
			// 	this.$router.push({path:'/shop/good/list',query:{t:v,p:this.page[this.currTabField]}})
			// },
			page: {
				handler(v) {
					this.ready=false
					this.$router.push({
						path: '/shop/group/list',
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
		methods:{
			loadData(){
				this.ready = false
				http.request(urls.data,{
					page:this.page,
				},rlt=>{
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
			add(){
				this.current={status:1}
				this.editor = true
			},
			handlePageChange(e){
				this.page = e.page
			},
			handleCurrentChange(row){
				var index = this.list.indexOf(row.id,'id')
				this.list.splice(index||0,index>=0?1:0,row)
				this.editor=false
				setTimeout(()=>{
					this.current=null
				},400)
			},
			handleStatusToggle(index,status){
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
			handleEdit(row,index){
				// if (!row) {
				// 	$$.ui.modal('当前产品不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
				// 	return
				// }
				// this.editor.good = true
				// this.current = $$.extend(true,{},row)
				this.$router.push({path:'/shop/group/edit',query:{id:row.id}})
			},
			handleDel(row,index){
                $$.ui.modal('确实要删除当前产品吗？',{
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