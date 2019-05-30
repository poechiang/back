<template>
	<section :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><router-link class="title-link" to="/shop/activity/list">活动管理</router-link> {{pageTitle}}</h2>
		</header>
		<article class="poeui-content-box">
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready" v-if="type==1">
				<field title="标识" v-model="locale.cno" :disabled="true" v-if="locale.id"/>
				<field title="标题" v-model="locale.title" placeholder="显示标题"/>
				<field title="金额" v-model="locale.amount" placeholder="抵用金额"/>
				<field title="条件" v-model="locale.condi" placeholder="使用条件" width="100,*,2*" :field="{width:'initial'}" desc="满足指定金额后可使用，缺省表示无门槛使用"/>
				<field title="有效期" v-model="locale.expire_in" width="100,*,2*" :field="{width:'initial'}" placeholder="3 ( 天 )" desc="自领取之日起指定时间内有效，缺省表示永远有效"/>
				<field title="总量" v-model="locale.count" width="100,*,2*" :field="{width:'initial'}" desc="当前优惠券种类，缺省表示不限量"/>
				
				<field title="属性">
					<onoff v-model="locale.is_cover" :on="1" :off="0"> 叠加使用 </onoff>
					<onoff v-model="locale.is_cover" :on="1" :off="0"> 叠加使用 </onoff>
				</field>

				<field title="状态">
					<onoff v-model="locale.status" :on="1" :off="0"> <span >{{locale.status=='1'?'正常':'冻结'}}</span> </onoff>
				</field>
			</block>
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready" v-else-if="currTab==2">
				<data-table :columns="columns" :setting="false" >
					<template v-for="(row,index) in locale.goods">
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
			<div class="hor-center">
				<button class="btn-block btn-large btn-round theme  mv-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	const urls={
		data:'back/activity/get_coupon',
		send:'back/order/send_shop_order',
		save:'back/order/save_shop_order',
		delete:'back/order/del_shop_order',
	}
	export default {
		route:{
			path:['/shop/activity/add','/shop/activity/edit'],
			meta:{
				menu:'activity',
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
				type:this.$route.query.t||1,
				ready: !!this.editData,
				changed:false,
				locale: this.editData||{status:1},
				columns:[{title:'商品',align:'left'},'价格','数量'],
				expresses:[],
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				currTab:this.$route.query.t||1,
				newExp:{no:0,exp:'',waybill:''},
				send_remark:'',
			}

		},
		computed:{
			pageTitle(){
				switch(parseInt(this.type)){
					default:
					return '——优惠券'
				}
			}
		},
		mounted(){
			var id = this.$route.query.id

			if(id){
				this.loadData(id)
			}
			else{
				this.ready = true
			}
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
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(id){
				this.ready = false
				http.request(urls.data,{id:id},(rlt)=>{
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