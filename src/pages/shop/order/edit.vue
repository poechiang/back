<template>
	<section :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><router-link class="title-link" to="/shop/order/list">商城订单</router-link> —— {{locale.sn}}</h2>
			<!-- <div class="flex-item"></div>
			<div >
				<button class="btn-block primary dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div> -->
		</header>
		<tabs :items="[{value:1,label:'订单信息'},{value:2,label:'订单详情'},{value:3,label:'订单发货'}]" v-model="currTab"/>
		<article class="poeui-content-box">
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==1">
				<field title="订单编号" v-model="locale.sn" :disabled="true"/>
				<field title="订单金额" v-model="locale.amount" :disabled="true"/>
				<field title="下单时间" v-model="locale.create" :disabled="true"/>
				<field title="订单状态" v-model="locale.back_state_label" :disabled="true" width="100,auto,*" :desc="'更新时间：'+locale.state_update"/>

				<field title="支付信息" v-if="locale.state>=10">
					<div><tip >支付金额: </tip> {{locale.paied}} <tip class="ml-30">积分抵扣: </tip> {{locale.integral}} (使用 {{locale.meta.integral||0}} 积分) <tip class="ml-30">使用红包: </tip> {{locale.coupon}}</div>
					<div>
						<tip v-if="locale.meta.pay_info.type=='wxpay'">微信支付: </tip>
						<tip v-else>支付宝支付: </tip>
						{{locale.meta.pay_info.transaction_id}}(流水号)</div>
					<div><tip>支付时间: </tip> {{locale.pay_dt}}</div>
				</field>
				<field title="收货信息">
					{{locale.rname}} {{locale.rphone}}<br>{{locale.raddr}}
				</field>
				<field title="客户留言">
					<p v-if="locale.remark && locale.remark._order_">{{locale.remark._order_.content}}</p>
					<tip>（无）</tip>
				</field>

				<field title="状态">
					<onoff v-model="locale.status" :on="1" :off="0" :disabled="true"> <span >{{locale.status=='1'?'正常':'冻结'}}</span> </onoff>
				</field>
			</block>
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready" v-else-if="currTab==2">
				<data-table :columns="columns" :setting="false" >
					<template v-for="(row,index) in locale.details">
						<tr>
							<td :title="row.good.abbr||row.good.group_label?row.good.title:''">
							{{row.good.abbr||row.good.group_label||row.good.title}}<br>
							<tip>{{row.good.norms}}</tip><br>
							<tip>{{row.good.param.substr(0,40)+'...'}}</tip>
							</td>
							<td class="hor-center">￥{{row.price}}</td>
							<td class="hor-center">{{row.count}}</td>
						</tr>
					</template>
				</data-table>
			</block>
			<template v-else>
				<block class="fields-box" title="收货人信息" :class="{flat:!!editData}" :loading="!ready">
					<field title="收货信息">
						{{locale.rname}} {{locale.rphone}}<br>{{locale.raddr}}
					</field>
				</block>
				<block class="fields-box" title="物流信息" :class="{flat:!!editData}">
					<!-- 已支付 -->
					<template v-if="locale.state>=10"> 
						<ul class="exp-list flex-row flex-wrap mb-20" v-if="locale.send_info && locale.send_info.expresses&& locale.send_info.expresses.length>0">
							<li class="mr-20" v-for="(item,index) in locale.send_info.expresses" :key="index"><tip color="#009688">【{{item.exp}}】 {{item.waybill}}</tip> <a class="del iconfont" href="javascript:;" title='删除当前物流单号' @click="delExp(index)" v-if="locale.state<20">&#xe783;</a></li>
						</ul>
						<div class="flex-row flex-line-center" v-if="locale.state>=10 && locale.state<20">
							<select class="mr-10" style="width:1.1rem" v-model="newExp.no">
								<option value="0">选择物流公司</option>	
								<option v-for="(express,no) in expresses" :key="no" :value="no">{{express.name}}</option>	
							</select>
							<input class="mr-10" style="width:3rem;" v-model="newExp.waybill" placeholder="输入订单号回车或点击【添加】按钮" :disabled="newExp.no==0">
							<button class="btn-block success mr-10" :disabled="newExp.waybill==''" @click="handleExpressAdd">添加物流单号</button>
						</div>
					</template>
					<!-- 如果订单未支付，则提示等待订单支付后方可填写物流信息 -->
					<div class="mv-20 hor-center" v-else>
						<tip> 请等待订单支付完成</tip>
					</div>
				</block>
				<block class="fields-box" title="备注信息" :class="{flat:!!editData}" v-if="locale.state>=10">
					<template v-if="locale.state<20 && locale.send_info && locale.send_info.expresses && locale.send_info.expresses.length>0">
							
						<textarea class="dp-block rs-none pv-5" style="width:5.4rem;height:.6rem" v-model="send_remark" placeholder="请输入发货相关的备注信息"></textarea>
						<div class="flex-row flex-line-center mt-20">
							<input class="mr-10" style="width:4.4rem;" v-model="locale.sender" placeholder="填写发货人" >
							<button class="btn-block error" :disabled="!locale.sender" style="width:.9rem" @click="handleOrderSend">确认发货</button>
						</div>
					</template>
					<div class="mv-20 hor-center" v-else-if="locale.state<20" >
						<tip> 请先添加物流信息</tip>
					</div>
					<div class="mv-20 hor-center" v-else>
						<field title="发货人" width="100,auto,*">{{locale.sender}}</field>
					</div>
					<ul class="remark-list mt-20" v-if="locale.remark && locale.remark._send_&& locale.remark._send_.length>0">
						<li class="flex-row mh-40" v-for="(item,index) in locale.remark._send_" :key="index">
							<span class="flex-item">{{item.content}}</span>
							<tip color="#009688" >{{item.datetime}} {{item.author}}</tip>
						</li>
					</ul>
				</block>
			</template>
			<!-- <button class="btn-block btn-large btn-round primary  mv-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button> -->
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	const urls={
		expresses:'back/index/get_expresses',
		data:'back/order/get_shop_order',
		send:'back/order/send_shop_order',
		save:'back/order/save_shop_order',
		delete:'back/order/del_shop_order',
	}
	export default {
		route:{
			path:'/shop/order/edit',
			meta:{
				menu:'order',
			},
			
		},
		model:{
			prop:'edit-data',
			event:'change'
		},
		props:['editData','on'],
		data() {
			if (true) {}
			return {
				ready: !!this.editData,
				changed:false,
				locale: this.editData||{
					id:this.$route.query.id,
					sn:this.$route.query.sn,
				},
				columns:[{title:'商品',align:'left'},'价格','数量'],
				expresses:[],
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				currTab:this.$route.query.t||1,
				newExp:{no:0,exp:'',waybill:''},
				send_remark:'',
			}

		},
		mounted(){
			var id = this.$route.query.id
			this.getExpresses()
			!this.ready && this.loadData(id||0)
		},
		watch:{
			locale:{
				handler(v){
					if (!this.ready) {
						return
					}

					this.changed=true
					
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
			editData(v){
				this.locale = v||{}
			},
			currTab(v){
				this.$router.push({path:'/shop/order/edit',query:{id:this.locale.id,sn:this.locale.sn,t:v}})
			},
			newExp:{
				handler(v){
					console.log(v)
				},
				deep:true
			}
		},
		beforeRouteUpdate (to, from, next) {
			var toTab = (to.query.t||1)
			if (this.currTab!=toTab) {
				this.currTab = toTab
			}
			next()
		},
		methods:{
			getExpresses(){
				http.request(urls.expresses,(rlt)=>{
					if (rlt.status==1) {
						this.expresses = rlt.data
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
			},
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(id){
				this.ready = false
				http.request(urls.data,{id:id||0,sn:this.$route.query.sn},(rlt)=>{
					if (rlt.status==1) {
						if (rlt.data) {
							this.locale = rlt.data
						}
						this.$nextTick(() => {
							this.ready = true
						})
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
				
			},
			handleExpressAdd(){
				if (this.newExp.no<=0 ||!this.newExp.waybill) {
					$$.ui.modal('物流信息不全，请选择物流公司并填写货运单号',{cancel:false})
					return
				}
				this.locale.send_info=this.locale.send_info||{expresses:[]}
				this.newExp.exp = this.expresses[this.newExp.no].name
				this.locale.send_info.expresses.push($$.extend({},this.newExp))
				this.newExp.waybill = ''
			},
			delExp(index){
				this.locale.send_info.expresses.splice(index,1)
			},
			handleOrderSend(){
				//验证订单状态
				if (this.locale.status!=1||this.locale.state<10 && this.locale.state>=20) {
					$$.ui.modal('订单状态无效，无法执行发货流程',{cancel:false})
					return
				}
				//验证发货信息
				if (!this.locale.send_info || !this.locale.send_info||!this.locale.send_info.expresses ||this.locale.send_info.expresses.length<=0) {
					$$.ui.modal('请添加流程信息',{cancel:false})
					return
				}
				if (!this.locale.sender) {
					$$.ui.modal('请填写发货人',{cancel:false})
					return
				}

				var that = this
				http.request(urls.send,{
					id:this.locale.id,
					sender:this.locale.sender,
					send_info:this.locale.send_info,
					remark:this.send_remark,
				},rlt=>{
					if (rlt.status==1) {
						console.log(this.locale,rlt.data.state)
						this.locale.state == rlt.data.state||20
						$$.ui.modal('订单发货成功',{
							textAlign:'center',
							mask:true,
							cancel:false,
						})

						
					}
					else{
						$$.ui.modal(rlt.msg,{mask:true,cancel:false})
					}
				})
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.pic) {
					msg.push(' * 轮播的图片为必选项')
				}
				if (msg.length>0) {
					$$.ui.modal('您有'+msg.length+'项信息需要补全：<p>'+msg.join('<p>'),{
						title:'提示',
						cancel:false,
						mask:true
					})
					return
				}

				var param = $$.extend(true,{},this.locale)
				var that = this
				http.request(urls.save,param,rlt=>{
					if (rlt.status==1) {
						if (this.locale.id) {
							$$.ui.modal('修改成功',{
								textAlign:'center',
								mask:true,
								cancel:false,
								confirm:()=>{
									if (this.editData && this.trigger=='submit') {
										that.$emit('change',that.locale)
									}
									else{
										that.$router.go(-1)
									}
								}

							})
						}
						else{
							$$.ui.modal('提交成功',{
								textAlign:'center',
								mask:true,
								cancel:{
									text:'返回',
									callback:()=>{
										that.$router.push({path:'/order/list'})
									},
								},
								confirm:{
									text:'继续发布',
									callback:()=>{
										that.order={}
										this.loadData()
									}
								}

							})
						}
						
					}
					else{
						$$.ui.modal(rlt.msg,{mask:true,cancel:false})
					}
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.field{
		margin:.2rem 0;
	}
	ul.exp-list{
		line-height: .4rem;
		li{
			position: relative;
			padding-right: .2rem;
			.del{
				position:absolute;
				right: 0;
				top:50%;
				line-height: .2rem;
				height: .2rem;
				margin-top:-.08rem;
				display: none;
				color:#F44336;
			}
			&:hover{
				.del{
					display: inline;
				}
			}
		}
	}
	ul.remark-list{
		line-height: .2rem;
	}
</style>