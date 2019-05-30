<template>
	<section id="good-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">团购</a> —— {{locale.id?'编辑团购':'添加新团购'}}</h2>
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

			<block class="fields-box" title="团购价格" :class="{flat:!!editData}" :loading="!ready" >
				<ul class="price-list flex-row flex-wrap">
					<li class="price-item" v-for="(pricer,index) in locale.pricers" :key="pricer.id">
						<tip class="count f-right">{{pricer.count}}人团</tip>
						<div class="fs18 price">{{pricer.price}}</div>
						<span class="op"><a class="edit link-primary mr-10" href="javascript:;" @click="editPricer(pricer)">编辑</a><a class="del link-error" href="javascript:;" @click="delPricer(index)">删除</a></span>
					</li>
					<li class="new-item tip">
						<a class="dp-block link-success" href="javascript:;" @click="addPricer">添加</a>
					</li>
				</ul>
			</block>
			<block class="fields-box" title="团购信息" :class="{flat:!!editData}" :loading="!ready" >
				<field title="开团时间" require width="100,auto,*" desc="失效时间省略表示长期有效">
					<input style="display: inline-block;width:auto;" type="datetime-local" v-model="startTime" placeholder="团购产品开始下单时间">
					<label> — </label>
					<input style="display: inline-block;width:auto;" type="datetime-local" v-model="endTime" placeholder="（可选）团购产品的失效时间">
				</field> 
				<field title="产品展示">
					<onoff class="mr-20" v-model="locale.visible" :value="key"  v-for="(item,key) in sences" :key="key"> {{item}}</onoff>
				</field>
				<field title="分批配送">
					<onoff v-model="locale.is_batch" :on="1" :off="0">当前产品在下单时将会提示客户设置配送时间及周期</onoff>
				</field>
				<field title="测试产品">
					<onoff v-model="locale.is_test" :on="1" :off="0">当前产品仅对测试帐号显示</onoff>
				</field>
				<field title="状态">
					<onoff v-model="locale.status" :on="1" :off="0"> <span >{{locale.status=='1'?'正常':'冻结'}}</span> </onoff>

				</field>
			</block>
			<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button>
		</article>
		<editor :footer="false" :show.sync="editorVisible.good" :box="{width:800,height:600}" >
			<good-selector class="full-height" @change="selGood"/>
		</editor>
		<editor class="pricer-editor" title='价格标签' :show.sync="editorVisible.pricer" :box='{width:600}' :buttons='{confirm:{disabled:()=>{return currPricer.count<2 || currPricer.price<=0}}}' @poe-dlg-confirm="handleCurrPricerAdd">
			<field title="人数" require v-model="currPricer.count" :items="pricerList"/>
			<field title="价格" require v-model="currPricer.price" />
			<div class="hor-center">
				
			</div>
		</editor>
	</section>

</template>
<script>
	import http from '@/utils/http'
	import goodSelector from '@/pages/common/good-selector'
	const urls={
		sences:'back/good/get_sences',
		data:'back/good/get_group_detail',
		save:'back/good/save_group',
		delete:'back/good/del_group',
	}
	const newGroup = {
		gid:0,
		visible:['1','2'],
		status: 1,
		is_batch:0,
		is_test:0,
		is_immediate:1,
		pricers:[],
		meta:{good:null}
	}
	export default {
		route:{
			path:['/shop/group/add','/shop/group/edit'],
			meta:{
				menu:'group',
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
				locale: $$.extend(true,{},newGroup,this.editData),
				startTime:this.editData?Date.from(this.editData.start):null,
				endTime:this.editData?Date.from(this.editData.end):null,
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				sences:[],
				currPricer:{count:0,price:0},
				editorVisible:{
					good:false,
					pricer:false
				}
			}

		},
		watch:{
			'locale.meta.good':function(v){

					console.log(v)
				if (v) {
					console.log(v.is_batch,v.is_test)
					this.locale.is_batch = v.is_batch||0
					this.locale.is_test = v.is_test||0
				}
			},
			locale:{
				handler(v) {
					this.changed=true
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
			startTime(v){
				this.locale.start = Date.parse(v)/1000
			},
			endTime(v){
				this.locale.end = Date.parse(v)/1000
			}
		},
		computed:{
			pricerList(){
				var i,remains = [{value:0,label:'选择参团人数'}]
				for(i=2;i<=10;i++){
					if (!this.locale.pricers.contains(i,'count')) {
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

			loadData(id){
				http.request(urls.data,{id:id||0},(rlt)=>{
					if (rlt.status==1) {
						if (rlt.data) {
							this.locale = rlt.data
							this.startTime = Date.from(rlt.data.start).format('Y-m-dTH:i:s')
							this.endTime = rlt.data.end?Date.from(rlt.data.end).format('Y-m-dTH:i:s'):null

						}
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}

					this.$nextTick(() => {
						this.ready = true
					})
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
			addPricer(){
				this.currPricer={count:0,price:0}
				this.editorVisible.pricer=true
			},
			editPricer(pricer){
				this.currPricer = pricer
				this.editorVisible.pricer=true
			},
			delPricer(index){
				$$.ui.modal('确定要删除当前的价格标签吗？',{ref:'r1',confirm:()=>{
					if (index>=0 && index<this.locale.pricers.length) {
						this.locale.pricers.splice(index,1)
					}
				}})
			},
			handleCurrPricerAdd(){
				if (!this.currPricer.id) {

					this.currPricer.id = (new Date).getTime()
					this.locale.pricers.push(this.currPricer)
					this.editorVisible.pricer=false
				}
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.gid) {
					msg.push(' * 请选择参与团购的产品')
				}
				if (this.locale.pricers.length<=0) {
					msg.push(' * 请至少添加一个价格标签')
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
					pricers:this.locale.pricers,
					start:this.locale.start,
					end:this.locale.end,
					visible:this.locale.visible,
					is_batch:this.locale.is_batch,
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
											that.locale=$$.extend(true,{},newGroup)
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
<style lang="scss">
	@import '@/assets/css/editor.scss';
	#good-edit{
		.field{
			margin:.2rem 0;
		}

		.price-list {
		    background-color: #F5F5F5;
		    margin-bottom: .2rem;
		    border-radius: .05rem;
		    padding: .05rem;
		    .price-item {
			    margin: .05rem;
			    background-color: #fff;
			    padding: .1rem;
			    width: 2rem;
			    height: .7rem;
			    line-height: .5rem;
			    border-radius: .05rem;
			    position: relative;
			    overflow: hidden;
			    .count{
			    	line-height: 1;
			    }
			    .op{
			    	position:absolute;
			    	right:.1rem;
			    	line-height: initial;
			    	opacity: 0;
			    	bottom:-.2rem;
			    	transition: all .2s;
			    }
			    &:hover{
			    	box-shadow: 0 0 3px #0000002F;
			    	.op{
			    		opacity: 1;
			    		bottom:.05rem;
			    	}
			    }

			}

			.new-item {
			    height: .7rem;
			    width: 2rem;
			    text-align: center;
			    line-height: .7rem;
			    border:.01rem dashed;
			    margin: .05rem;
			    color: #BDBDBD;
			    border-radius:.05rem;
			}
		}
	}
</style>