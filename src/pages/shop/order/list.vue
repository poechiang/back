<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">商城订单</h2>
			<div class="flex-item"></div>
		</header>
		<tabs :items="[{value:1,label:'新订单'},{value:2,label:'待发货订单'},{value:0,label:'全部订单'}]" v-model="currTab"/>
		<article class="poeui-content-box" >
			<block class="file-block" :loading="!ready[currTabLabel]" :load-empty="list[currTabLabel].length<=0" :load-end="pagi[currTabLabel].curr==pagi[currTabLabel].last">
				<data-table :columns="columns" :setting="false" >
					<template v-for="(row,index) in list[currTabLabel]">
						<tr>
							<td>
								<big>{{row.sn}}</big><br>
								<tip>{{row.rname}}</tip> <tip color="#607D8B">{{row.rphone}}</tip><br>
								<small class="tip">{{row.raddr}}</small>
							</td>
							<td class="hor-center">￥{{row.amount}}</td>
							<td class="hor-center">{{row.back_state_label}}</td>
							<td class="hor-center">{{row.update}}</td>
							<td-status v-model="row.status" @data-edit="handleRowEdit(row,index)" @data-del="handleRowDel(row,index)" @change="handleStatusToggle(index,$event)"/>
						</tr>
					</template>
				</data-table>
			</block>
				<data-pagi class="ph-20" :page="pagi[currTabLabel]" :list="false" @page-change="handlePageChange"/>
		</article>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	import currentEditor from '@/pages/shop/order/edit'
	const urls = {
		data: 'back/order/list_shop_orders',
		save: 'back/order/save_shop_order',
		delete: 'back/order/del_shop_order',
	}
	export default {
		components: {
			'item-editor': currentEditor
		},
		route: {
			path: ['/shop/order', '/shop/order/list'],
			meta: {
				menu: 'order',
			},

		},
		data() {
			var query = this.$route.query,
				tab=parseInt(query.t===undefined?1:query.t),
				page = parseInt(query.p||1)
			return {
				columns: [{
					align: 'left',
					title: '订单',
				}, '金额', '进度', '更新时间', {
					title: '状态',
					width: 100,
				}],
				list: {
					unpay: [],
					unsend: [],
					all: []
				},
				ready: {
					unpay: false,
					unsend: false,
					all: false
				},
				pagi: {
					unpay: {},
					unsend: {},
					all: {}
				},
				page: {
					unpay: tab === 1 ? page : 1,
					unsend: tab === 2 ? page : 1,
					all: tab === 0 ? page : 1,
				},
				// editorShow:false,
				// current:null,
				currTab: tab
			}

		},
		computed: {
			currTabLabel(){

				var lbl = 'all'
				switch (parseInt(this.currTab)) {
					case 1:
						lbl = 'unpay'
						break
					case 2:
						lbl = 'unsend'
						break
					default:
						lbl = 'all'
				}
				return lbl
			},
			orderState(){

				var lbl = 'all'
				switch (parseInt(this.currTab)) {
					case 1:
						lbl = 'unpay'
						break
					case 2:
						lbl = 'unsend'
						break
					default:
						lbl = 'all'
				}
				return lbl
			}
		},
		watch: {
			page: {
				handler(v) {
					this.ready[this.currTabLabel]=false
					this.$router.push({
						path: '/shop/order/list',
						query: {
							p: v[this.currTabLabel],
							t: this.currTab
						}
					})
				},
				deep: true
			},
			currTab(v) {
				this.$router.push({
					path: '/shop/order/list',
					query: {
						p: this.page[this.currTabLabel],
						t: this.currTab
					}
				})
			},
		},
		beforeRouteUpdate(to, from, next) {
			var toTab = to.query.t>=0?to.query.t: 1
			var p = to.query.p||1
			if (this.currTab != toTab) {
				this.currTab = toTab
			}
			if (this.page[this.currTabLabel]!=p) {
				this.page[this.currTabLabel] = p
				this.ready[this.currTabLabel] = false
			}
			!this.ready[this.currTabLabel] && this.loadOrder()

			next()
		},
		mounted() {
			this.loadOrder()
		},
		methods: {
			loadOrder() {
				//console.log(this.$route.query,this.page,this.currTab)
				this.ready[this.currTabLabel] = false
				http.request(urls.data, {
					state:this.orderState,
					page: this.page[this.currTabLabel],
					rows: 15
				}, rlt => {
					if (rlt.status == 1) {
						this.list[this.currTabLabel] = rlt.data || []
						this.pagi[this.currTabLabel] = rlt.page
					} else {
						$$.ui.modal(rlt.msg, {
							cancel: false,
							textAlign: 'center',
							mask: true
						})
					}
					this.ready[this.currTabLabel] = true
				})
			},
			handlePageChange(e) {

				this.page[this.currTabLabel] = e.page
			},
			handleCurrentChange(row) {
				var index = this.list[this.currTabLabel].indexOf(this.current.id, 'id')
				if (index >= 0) {
					this.list[this.currTabLabel].splice(index, 1, row)
				} else {
					this.list[this.currTabLabel].push(row)
				}

				this.editorShow = false
			},
			handleStatusToggle(index, status) {
				$$.ui.loading('', {
					ref: 'l1'
				})
				http.request(urls.save, {
					id: this.list[this.currTabLabel][index].id,
					status: status
				}, (rlt) => {
					$$.ui.hide({
						ref: 'l1'
					})
					if (rlt.status != 1) {
						$$.ui.modal(rlt.msg, {
							cancel: false,
							mask: true,
							textAlign: 'center'
						})
					}
				})
			},
			handleRowEdit(row, index) {
				this.$router.push({
					path: '/shop/order/edit',
					query: {
						id: row.id,
						sn: row.sn
					}
				})
				// if (!row) {
				// 	$$.ui.modal('当前轮播不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
				// 	return
				// }
				// this.editorShow = true
				// this.current = $$.extend(true,{},row)
			},
			handleRowDel(row, index) {
				$$.ui.modal('确实要删除当前订单吗？', {
					ref: 'm1',
					mask: true,
					confirm: () => {
						$$.ui.loading('', {
							ref: 'l1'
						})
						http.request(urls.delete, {
							ids: [row.id]
						}, (rlt) => {
							$$.ui.hide({
								ref: 'l1'
							})
							if (rlt.status == 1) {
								this.list[this.currTabLabel].splice(index, 1)

								$$.ui.toast('删除成功', {
									icon: 'success'
								})
							} else {
								$$.ui.toast('删除失败:'.rlt.msg, {
									icon: 'error'
								})
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
		.op-td{
			.op{
				color:#62A8EA;
			}
		}
	}
</style>