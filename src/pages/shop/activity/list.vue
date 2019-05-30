<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">活动管理</h2>
			<div class="flex-item"></div>
		</header>
		<tabs :items="[{value:1,label:'优惠券'},{value:2,label:'红包'}]" v-model="currTab"/>
		<article class="poeui-content-box" >
			<block class="file-block" :loading="!ready[currTabLabel]" :load-empty="!list[currTabLabel] || list[currTabLabel].length<=0" :load-end="pagi[currTabLabel] && pagi[currTabLabel].curr==pagi[currTabLabel].last">
				<div class="hor-right mb-10">
					<button class="btn-block theme" style="width:1rem;" @click="handleRowAdd">添加</button>
				</div>
				<data-table :columns="columns[currTabLabel]" :setting="false" >
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
		<!-- <editor class="edit-viewer" title='轮播编辑' :footer='false' :show.sync="editorShow" :box="{width:900,height:700}" >
			<item-editor v-model="current" @change="handleCurrentChange"/>
		</editor> -->
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	import currentEditor from '@/pages/shop/activity/edit'
	const urls = {
		data: {
			coupons:'back/activity/list_coupons',
			red:'back/activity/list_reds',
		},
		save: 'back/activity/save_shop_activity',
		delete: 'back/activity/del_shop_activity',
	}
	export default {
		components: {
			'item-editor': currentEditor
		},
		route: {
			path: ['/shop/activity', '/shop/activity/list'],
			meta: {
				menu: 'activity',
			},

		},
		data() {
			var query = this.$route.query,
				tab=parseInt(query.t===undefined?1:query.t),
				page = parseInt(query.p||1)
			return {
				columns: {
					coupons:[{
						align: 'left',
						title: '优惠券',
					}, '金额', '类型', '门槛', {
						title: '状态',
						width: 100,
					}]
				},
				list: {
					coupons: [],
					reds: [],
				},
				ready: {
					coupons: false,
					reds: false,
				},
				pagi: {
					coupons: {},
					reds: {},
				},
				page: {
					coupons: tab === 1 ? page : 1,
					reds: tab === 2 ? page : 1,
				},
				currTab: tab
			}

		},
		computed: {
			currTabLabel(){
				var lbl
				switch (parseInt(this.currTab)) {
					case 2:
						lbl = 'red'
						break
					default: // 1
						lbl = 'coupons'

				}
				return lbl
			},
			editPath(){
				var path
				switch (parseInt(this.currTab)) {
					case 2:
						path = '/shop/activity/edit'
						break
					default: // 1
						path = '/shop/activity/edit'
				}
				return path
			}
		},
		watch: {
			page: {
				handler(v) {
					this.ready[this.currTabLabel]=false
					this.$router.push({
						path: this.$router.path,
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
					path: this.$router.path,
					query: {
						p: this.page[this.currTabLabel],
						t: this.currTab
					}
				})
			},
		},
		beforeRouteUpdate(to, from, next) {
			var toTab = to.query.t>=0?to.query.t: 1
			if (this.currTab != toTab) {
				this.currTab = toTab
			}
			!this.ready[this.currTabLabel] && this.loadData()

			next()
		},
		mounted() {
			this.loadData()
		},
		methods: {
			loadData() {
				this.ready[this.currTabLabel] = false
				http.request(urls.data[this.currTabLabel], {
					filter:this.currTab,
					page: this.page[this.currTabLabel],
					rows: 10
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
			handleRowAdd() {
				this.$router.push({
					path: '/shop/activity/edit',
					query: {
						t: this.currTab
					}
				})

			},
			handleRowEdit(row,index) {
				this.$router.push({
					path: '/shop/activity/edit',
					query: {
						id: row.id,
						t: this.currTab
					}
				})

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
<style lang="scss"></style>