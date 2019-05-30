<template>
	<section id="good-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">产品库</a> —— {{locale.id?'编辑':'添加'}}产品</h2>
			<div class="flex-item"></div>
			<div >
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</header>
		<tabs v-model="currTab" :items="['基本信息','产品详情','附加信息']"/>
		<article class="poeui-content-box">
			<block class="fields-box" :title="false" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==0">
				<div style="width:8rem;">
					<field width="100,*,auto" title="产品名称" v-model="locale.title" required placeholder="  输入产品名称"/>
					<field width="100,*,auto" title="产品简称" v-model="locale.abbr" required placeholder="（可选）用于小屏幕设备显示"/>
					<field width="100,*,auto" title="品牌" required v-model='locale.bid' :data-list="brands" type="filter" :filter="{value:'id',label:'title'}" placeholder="  产品所属品牌"/>
					<field width="100,*,auto" title="产品分类" required v-model="locale.cata" :data-list="catas" type="filter" :filter="{value:'code',label:'title'}" :desc='"分类编码："+locale.cata' placeholder="  产品分类，选择后核对右侧分类编码"/>
					<field width="100,*,auto" title="分组标题" v-model="locale.group_title" placeholder="（可选）输入同款产品不同规格之间的共享名称，如果设置会优先于产品名称显示"/>
					<field width="100,*,auto" title="分组标签" v-model="locale.group_label" placeholder="（可选）输入同款产品不同规格之间的款式、颜色区分"/>
					<field width="100,*,auto" title="标签">
						<tags-editor v-model="locale.tags" :hots="tags"/>
					</field>
					<field width="100,*,auto" title="产品种类" v-model="locale.kind" :data-list="kinds" placeholder="（可选）输入产品种类，或从最近使用过的种类列表中选择"/>
					<field width="100,*,auto" title="保质期" v-model="locale.expire_in" placeholder="（可选）产品保持期：7天、3周、12个月，3年"/> 
					<field width="100,*,auto" title="规格" v-model="locale.norms" placeholder="（可选）产品规格：300g * 6袋/盒 * 24盒/箱"/> 
					<field width="100,*,auto" title="零售价" required v-model="locale.retail_price" placeholder="  产品零售价"/>
					<field width="100,*,auto" title="经销价" v-model="locale.sell_price" placeholder="（可选）产品经销、代理价"/>
					<field width="100,*,auto" title="进货价" v-model="locale.pur_price" placeholder="（可选）产品进货价"/> 
					<field width="100,*,auto" title="运费" v-model="locale.freight" placeholder="（可选）产品运费"/> 
					<field width="100,*,auto" title="运费合并" v-model="locale.freight_count" placeholder="（可选）运费合并数量，小于合并数的运费不变，超出部分运费翻倍"/> 
					<field width="100,*,auto" title="补充说明" v-model="locale.notice" :multi="true" placeholder="（可选）产品的补充说明信息：运费、发货的例外情况..."/> 

				</div>
			</block>
			<block class="fields-box" :class="{flat:!!editData}" :title="false" :loading="!ready" v-if="currTab==1">
				<div style="width:8rem;">
					<field width="100,*,auto" title="产品头图" required>
						<multi-uploader v-model="locale.heads" :col="3" :total="6"/>
					</field>
					<field width="100,*,auto">
						<div class="tip">产品头图最多六张图片，默认第一张图片显示于列表中，图片尺寸要求正方形，建议尺寸600*600</div>
					</field>
					
					<field width="100,*,auto" title="产品参数" v-model="locale.param" :multi="true" placeholder="（可选）产品参数：品牌、名称、型号、规格、颜色、尺寸、生产日期、保持期、注意事项……"/>
					<field width="100,*,auto" title="产品详情" required >

						<quill-editor
							class="flex-column flex-item quill-editor"
							:class="{docked:isEditorDocked}" 
							v-model="locale.detail" 
							ref="myQuillEditor" 
							:options="editorOption" 
							@change="handleEditorChange($event)" style="min-height: 5rem;font-size: .16rem;">
				        </quill-editor>
					</field>
				</div>
			</block>
			<block class="fields-box" :title="false" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==2">
				<div style="width:8rem;">
					<field width="100,*,auto" title="包装" v-model="locale.unit" placeholder="（可选）产品零售包装：盒、袋、瓶、包……"/> 
					<field width="100,*,auto" title="源产地" v-model="locale.origion" placeholder="（可选）产品源产地：北京、上海、天津、浙江杭州……"/> 
					<field width="100,*,auto" title="生产商" v-model="locale.manufacturer" placeholder="（可选）产品生产商：浙江###食品有限公司"/> 
					<field width="100,*,auto" title="供应商" v-model="locale.supplier" placeholder="（可选）产品零售价：浙江###进出口贸易有限公司"/> 
					<!-- <field width="100,*,auto" title="即时发货">
						<onoff class="mr-20" v-model="locale.is_immediate" :on="1" :off="0"> 打开表示立即发货，否则存在发货延迟</onoff>
					</field>
					<field width="100,*,auto" title="发货时间" required v-model="locale.send_time" placeholder="产品发货时间：48小时内发货、##年##月##日开始发货……（默认当天发货）" v-if="locale.is_immediate!=1"/> 
					<field width="100,*,auto" title="代理发货">
						<onoff class="mr-20" v-model="locale.is_third_send" :on="1" :off="0"> 打开表示由第三方代理发货，否则表示由本平台发货</onoff>
					</field> -->
				</div>
			</block>
			<block class="fields-box" :title="false" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==2">
				<div style="width:8rem;">
					
					<field width="100,*,auto" title="产品展示">
						<onoff class="mr-20" v-model="locale.visible" :value="key"  v-for="(item,key) in sences" :key="key"> {{item}}</onoff>
					</field>
					<field width="100,*,auto" title="分批配送">
						<onoff v-model="locale.is_batch" :on="1" :off="0">当前产品在下单时将会提示客户设置配送时间及周期</onoff>
					</field>
					<field width="100,*,auto" title="测试产品">
						<onoff v-model="locale.is_test" :on="1" :off="0"> <span>{{locale.is_test=='1'?'当前产品仅对测试帐号显示':'关闭'}}</span> </onoff>
					</field>
					<field width="100,*,auto" title="状态">
						<onoff v-model="locale.status" :on="1" :off="0"> <span >{{locale.status=='1'?'正常':'冻结'}}</span> </onoff>

					</field>
				</div>
			</block>
			<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	import { quillEditor } from 'vue-quill-editor'
	import quillModule from '@/../config/quill'
	const urls={
		info:'back/good/edit_good',
		data:'back/good/get_good_detail',
		save:'back/good/save_good',
		delete:'back/good/del_good',
	}
	export default {
		route:{
			path:['/good/add','/good/edit'],
			meta:{
				menu:'good',
			},
			
		},
		model:{
			prop:'edit-data',
			event:'change'
		},
		props:['editData','on'],
		data() {
			quillModule.good.toolbar.handlers={
                image: (value)=> {
                    var finputer = document.createElement("input")
                    finputer.type="file"
                    finputer.multiple='multiple'
                    finputer.accept='image/*'

                    finputer.onchange=this.handleImageAdded
                    finputer.click()
                }
            }
			return {
				ready: !!this.editData,
				changed:false,
				locale: $$.extend({
					bid:'',
					tags:[],
					visible:['1','2'],
					status: 1,
					cata:'',
					kind:'',
					is_test:0,
					is_immediate:1,
				},this.editData),
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				currTab:0,
				tags:[],
				catas:[],
				kinds:[],
				sences:[],
				editorOption:{
					placeholder: '文章内容....',
					theme: 'snow',  // or 'bubble'
					modules: quillModule.good
				},
				isEditorDocked:false,
				brands:[]
			}

		},
		mounted(){
			window.addEventListener('scroll',()=>{
				var offset = $('.quill-editor').offset()
				if (offset) {
					this.isEditorDocked = $(window).scrollTop()>=offset.top
				}
			},true)
			var id = this.$route.query.id
			this.loadData(id||0)
		},
		computed:{
			currBrand(){
				return this.locale.brand
			},
			currCata(){
				var index = this.catas.indexOf(this.locale.cata,'value')
				return index<0?null:this.catas[index]

			},
		},
		watch:{
			currBrand(v){
				this.locale.bid = v.id||0
			},
			currCata(v){
				this.locale.cata = v.value||0
			},
			locale:{
				handler(v){
					console.log(v)
					this.changed=true
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
		},
		methods:{
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(id){
					id && http.request(urls.data,{id:id||0},(rlt)=>{
						if (rlt.status==1) {
							if (rlt.data.good) {
								this.locale = rlt.data
							}
						}
						else{
							$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
						}
					})
					http.request(urls.info,{id:id||0},(rlt)=>{
						if (rlt.status==1) {
							this.catas = rlt.data.catas
							this.kinds = rlt.data.kinds
							this.tags = rlt.data.tags
							this.sences = rlt.data.sences
							this.brands = rlt.data.brands
							this.ready=true
						}
						else{
							$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
						}
					})
				
			},
			handleImageAdded(e) {
				var quill = this.$refs.myQuillEditor.quill,
					formData = new FormData(),
					cursor = quill.getSelection().index
				$$.each(e.target.files,(index,item)=>{
					formData.append('img[]', item)	
				})

				$$.ui.loading('正在上传')
				http.upload(formData,rlt=>{
					if(rlt.status == 1){
						$$.ui.hide()
						$$.each(rlt.data,(index,item)=>{
							quill.insertEmbed(cursor++, 'image', item.url);
						})

						quill.setSelection(cursor)

					}
					else{
						$$.ui.modal(rlt.msg,{textAlign:'center',cancel:false})
					}
					$$.ui.hide()
				})

			},
			handleEditorChange:function({editor, html, text}) {
				this.locale.detail = html
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.title) {
					msg.push(' * 产品名称为必选项')
				}
				if (!this.locale.cata) {
					msg.push(' * 产品分类编码为必选项')
				}
				if (!this.locale.retail_price) {
					msg.push(' * 产品零售价为必选项')
				}
				if (!this.locale.heads||this.locale.heads.length<=0) {
					msg.push(' * 至少上传一张产品头图')
				}
				if (!this.locale.detail) {
					msg.push(' * 产品详情为必选项')
				}
				if (this.locale.is_immediate!=1 && !this.locale.send_time) {
					msg.push(' * 如果产品不是即时发货，需要描述产品的发货时间')
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
										that.$router.push({path:'/good/list'})
									},
								},
								confirm:{
									text:'继续发布',
									callback:()=>{
										that.locale={
											tags:[],
											visible:['1','2'],
											status: 1,
											cata:'',
											kind:'',
											is_immediate:1,
										}
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
<style lang="scss">
	@import '@/assets/css/editor.scss';
	#good-edit{
		.field{
			margin:.2rem 0;

			.quill-editor{
				padding-top:.66rem;
				position:relative;
				background-color:#fff;
				.ql-toolbar{
					position:absolute;
					top:0;
					width:7rem;
					line-height: 1;
				    background-color: #ffffff;
				    z-index: 2;
				}
				.ql-container{
					flex:1;
					font-size:.16rem;
					.ql-editor img{
						display: block;
						width:100%;
					}
				}
				&.docked{
					.ql-toolbar{
						position:fixed;
						top:.6rem;
					}
				}
			}
		}
		&.poeui-box .field .quill-editor.docked .ql-toolbar{
			top:.3rem;
		}
	}
</style>