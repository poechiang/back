<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">整点购</h2>
		</header>
		<article class="poeui-content-box" >
			<block class="file-block" :loading="!ready" :load-empty = "ready && list&& list.length<=0" :load-end="ready&&pagi.curr == pagi.last">
				<div slot="aside" class="hor-right">
					<a class="btn-block theme" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/shop/hourly/add">添加</a>
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
							<td class="hor-center">{{row.retail_price}}</td>
							<td class="hor-center"><span v-if="row.labels.state.value>0">{{row.count||0}}/</span>{{row.total}}</td>
							<td class="hor-center">{{row.date}}</td>
							<td class="hor-center">{{row.hour}}点档</td>
							<td class="hor-center">
								<span class="tip-default" v-if="row.labels.state.value==-1">{{row.labels.state.label}}</span>
								<span class="tip-warning" v-else-if="row.labels.state.value==1">{{row.labels.state.label}}</span>
								<span class="tip-error" v-else-if="row.labels.state.value==2">{{row.labels.state.label}}</span>
								<span class="tip-success" v-else>{{row.labels.state.label}}</span>
							</td>
							<td-status :status="false" :editable="row.labels.state.value==0"  @data-edit="handleEdit(row,index)" @data-del="handleDel(row,index)" @change="handleStatusToggle(index,$event)"/>
						</tr>
					</template>
				</data-table>
			</block>
				<data-pagi class="ph-20" :page="pagi" :list="false" @page-change="handlePageChange"/>
		</article>
	</div>

</template>
<script>
	import http from '@/utils/http'
	//import Vue from 'vue'
	const urls={
		data:'back/good/list_Hourlies',
		save:'back/good/save_hourly',
		delete:'back/good/del_hourly',
	}
	export default {
		route:{
			path:['/shop/hourly','/shop/hourly/list'],
			meta:{
				menu:'hourly',
			}
		},
		data() {
			var query = this.$route.query,
				page =  parseInt(query.p||1)

			return {
				page:page,
				columns:[{title:'产品名称',align:'left'},'价格','数量','时间','日期','状态',{title:'操作',width:100}],
				editor:false,
				current:null,
				list:{},
				ready:false,
				pagi:{}
			}

		},
		mounted(){
			this.loadData()
		},
		watch:{
			page: {
				handler(v) {
					this.ready=false
					this.$router.push({
						path: '/shop/hourly/list',
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
						this.pagi=rlt.page
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
	                http.request(urls.hourly.save,{id:this.list.Hourlies[index].id,status:status},(rlt)=>{
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

				this.$router.push({path:'/shop/hourly/edit',query:{id:row.id}})
				
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
<style lang="scss"></style>