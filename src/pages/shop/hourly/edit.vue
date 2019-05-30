<template>
	<section id="good-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">整点购</a> —— {{locale.id?'编辑整点购':'添加新整点购'}}</h2>
			<div class="flex-item"></div>
			<div >
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</header>
		<article class="poeui-content-box">
			<block class="fields-box" title="产品信息" :class="{flat:!!editData}">
				<div class="hor-right" slot="aside">
					<template  v-if="locale.gid>0">
						<button class="btn-block secondary " @click="addGood">替换</button>
						<button class="btn-block error " @click="delGood">删除</button>
					</template>
					<template v-else>
						<button class="btn-block theme f-right" @click="addGood">添加产品</button>
					</template>
				</div>
				<template  v-if="locale.gid>0">
					<div class="mh-100 good-info lh-20">
						<img class="f-left mr-10" height="80" width="80" :src="locale.meta.good.heads[0]" v-if="locale.meta.good.heads && locale.meta.good.heads.length>0">
						<div v-html="locale.meta.good.abbr||locale.meta.good.title"></div>
						<div class="f-right">
							零售价：<span class="price fs16"> {{locale.meta.good.retail_price}}</span><br>
							经销价：<span class="price fs16" v-if="locale.meta.good.sell_price>0"> {{locale.meta.good.sell_price}}</span>
						</div>
						<tip size="12" v-html="locale.meta.good.cata_title"></tip><br>
						<tip size="12" v-html="locale.meta.good.manufacturer"></tip><br>
						<tip size="12" v-html="locale.meta.good.supplier"></tip>
					</div>
				</template>
				<div class="mv-20 hor-center" v-else>
					<tip class="mv-20">（ 无 ）</tip>
				</div>
			</block>

			<block class="fields-box" title="整点购信息" :class="{flat:!!editData}" :loading="!ready" >
				<!-- <field title="整点购" required v-model="locale.hourly" width="100,auto,*" desc="整点购，100以内整数，如70表示7折，75表示75折"/> -->
				<field title="价格" required v-model="locale.retail_price" width="100,180,*" desc="参与整点抢购活动的商品价格必须低于产品正常零售价"/>
				<field title="数量" required v-model="locale.total" width="100,180,*" desc="参与抢购的商品的总数"/>

				<field title="抢购时间" require width="100,180,*">
					<input style="display: inline-block;width:auto;" type="time" v-model="startTime">
					<div class="ml-15" slot="desc" style="line-height: initial;">活动时间必须是0、6、8、10、12、14、16、18、20、22的整点，有效时间2小时。如果时间大于当前时间，表示今天，否则表示第二天相应时间</div>
				</field> 
				<field title="产品展示">
					<onoff class="mr-20" v-model="locale.visible" :value="key"  v-for="(item,key) in sences" :key="key"> {{item}}</onoff>
				</field>
				<!-- <field title="分批配送">
					<onoff v-model="locale.is_batch" :on="1" :off="0">当前产品在下单时将会提示客户设置配送时间及周期</onoff>
				</field> -->
				<field title="测试产品">
					<onoff v-model="locale.is_test" :on="1" :off="0">当前产品仅对测试帐号显示</onoff>
				</field>
				<field title="状态">
					<onoff v-model="locale.status" :on="1" :off="0"> <span >{{locale.status=='1'?'正常':'冻结'}}</span> </onoff>

				</field>
			</block>
			<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button>
		</article>
		<editor class="good-selector" :footer="false" :show.sync="editorVisible.good" :box="{width:800,height:600}" >
			<good-selector class="full-height" @change="selGood"/>
		</editor>
	</section>

</template>
<script>
	import http from '@/utils/http'
	import goodSelector from '@/pages/common/good-selector'
	const urls={
		sences:'back/good/get_sences',
		data:'back/good/get_hourly',
		save:'back/good/save_hourly',
		delete:'back/good/del_hourly',
	}
	const newHourly = {
		gid:0,
		visible:['1','2'],
		status: 1,
		is_test:0,
		meta:{good:null}
	}
	export default {
		route:{
			path:['/shop/hourly/add','/shop/hourly/edit'],
			meta:{
				menu:'hourly',
			},
		},
		model:{
			prop:'edit-data',
			event:'change'
		},
		components:{
			'good-selector':goodSelector,
		},
		props:['editData','on'],
		data() {
			var id = this.$route.query.id
			return {
				id:id,
				ready: !!this.editData || !id,
				changed:false,
				locale: $$.extend(true,{},newHourly,this.editData),
				startTime:this.editData?Date.from(this.editData.start):null,
				endTime:this.editData?Date.from(this.editData.end):null,
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				sences:[],
				editorVisible:{
					good:false,
					pricer:false
				}
			}

		},
		watch:{
			"locale.meta.good":function(v){
				if (v) {
					if (this.locale.hourly) {
						this.locale.retail_price = v.retail_price
					}

					this.locale.is_batch = v.is_batch||0
					this.locale.is_test = v.is_test||0
				}
			},
			locale:{
				handler(v){
					this.changed=true
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
			startTime(v){
				if(typeof v=='string'){
					var v = parseInt(v.split(':')[0]),
						now = new Date,
						y = parseInt(now.getFullYear()),
						m = parseInt(now.getMonth()),
						d = parseInt(now.getDate()),
						h = parseInt(now.getHours())
					now.setYear(y)
					now.setMonth(m)
					now.setDate(v<h?d+1:d)
					now.setHours(v)
					now.setMinutes(0)
					now.setSeconds(0)
					this.locale.start = parseInt(now.getTime()/1000)
				}
			}
		},
		computed:{
			pricerList(){
				var i,remains = [{value:0,label:'选择参团人数'}]
				for(i=2;i<=10;i++){
					if (i>=this.locale.pricers.length || !this.locale.pricers.contains(i,'value')) {
						remains.push({value:i,label:i+'人团'})
					}
				}
				return remains
			}
		},
		mounted(){
			http.request(urls.sences,{},(rlt)=>{
				if (rlt.status==1) {
					this.sences = rlt.data
				}
				else{
					$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
				}
			})
			!this.ready && this.loadData(this.id)
		},
		methods:{
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(id){
				http.request(urls.data,{id:id||0},(rlt)=>{
					if (rlt.status==1) {
						if (rlt.data) {
							this.locale = rlt.data
							this.startTime = Date.from(rlt.data.start)
						}
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
				this.$nextTick(() => {
						this.ready = true
					})
			},
			addGood(){
				this.editorVisible.good = true
			},
			selGood(row){
				this.locale.meta.good = row
				this.locale.gid = row.id
				this.editorVisible.good = false
			},
			delGood(){
				this.locale.gid = 0
				this.locale.meta.good=null
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.gid) {
					msg.push(' * 请选择参与整点购的产品')
				}
				if (!this.locale.retail_price) {
					msg.push(' * 请填写本次活动的价格')
				}
				if (!this.locale.total) {
					msg.push(' * 请填写本次活动商品的数量')
				}
				if (msg.length>0) {
					$$.ui.modal('您有'+msg.length+'项信息需要补全：<p>'+msg.join('<p>'),{
						title:'提示',
						cancel:false,
						mask:true
					})
					return
				}

				var that = this
				$$.ui.loading('正在提交',{ref:'loading1'})
				
				http.request(urls.save,{
					id:this.locale.id,
					gid:this.locale.gid,
					retail_price:this.locale.retail_price,
					total:this.locale.total,
					start:this.locale.start,
					end:this.locale.start+7200,
					visible:this.locale.visible,
					is_test:this.locale.is_test,
					status:this.locale.status
				},rlt=>{
					$$.ui.hide({ref:'loading1'})
					if (rlt.status==1) {
						$$.ui.modal('保存成功',{
							textAlign:'center',
							mask:true,
							cancel:this.mode=='box'||this.locale.id>0?false:{
								text:'返回',
								callback:()=>{
									setTimeout(()=>{
										that.$router.go(-1)
									},400)
								}
							},
							confirm:{
								text:this.mode=='box'?'关闭':(this.locale.id?'关闭':'继续'),
								callback:()=>{
									if (that.mode=='box'){
										that.$emit('change',that.locale)
									}
									else{
										if (!this.locale.id) {
											that.locale=$$.extend(true,{},newHourly)
										}
										else{
											setTimeout(()=>{
												that.$router.go(-1)
											},400)
										}

									}
								}
							}

						})
						
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
	.field .desc{
		line-height: initial;
	}
</style>