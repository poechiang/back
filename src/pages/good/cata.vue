<template>
	<section id="good-cata-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">产品库</a> —— {{locale.id?'编辑':'添加'}}分类</h2>
			<div class="flex-item"></div>
			<div >
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</header>
		<article class="poeui-content-box">
			<block class="fields-box of-hidden " :title="false" :class="{flat:!!editData,'pv-0':!!editData}" :loading="!ready">
				<field title="上级分类" v-model="prevCode" :data-list="codes" :disabled="locale.id" placeholder=" 顶级分类"/>
				<field title="分类编码" v-model="locale.code" :disabled="locale.id" v-if="locale.id"/>
				<field title="分类编码" :required="true" v-else>
					<div class="flex-row">
						<span class="prev mr-5" v-if="prevCode">{{prevCode}}</span>
						<input class="flex-item" v-model="currCode" placeholder=" 输入两位十六进制分类编码[ 01-09,0A,...0F,10,11,12,..,1A,1B,...,1F,20,21,......,FF ]" style="text-transform:uppercase;">
					</div>
				</field>
				<field title="分类名称" v-model="locale.name" :required="true" placeholder=" 输入分类全称"/>
				<field title="分类介绍" v-model="locale.desc" multi placeholder="（可选）输入分类介绍"/>
				<field title="状态">
					<onoff v-model="locale.status" :on="1" :off="0"> <span >{{locale.status=='1'?'正常':'冻结'}}</span> </onoff>
				</field>
			</block>
			<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	const urls={
		edit:'back/good/list_exist_good_catas',
		data:'back/good/get_good_cata',
		save:'back/good/save_good_cata',
		delete:'back/good/del_good_cata',
	}
	export default {
		route:{
			meta:{
				menu:'good',
			},
			
		},
		model:{
			prop:'edit-data',
			event:'change'
		},
		props:['editData','trigger'],
		data() {
			var code = this.editData?(this.editData.code||''):''

			return {
				ready: !!this.editData,
				changed:false,
				locale:this.editData||{
					status: 1,
				},
				mode:this.editData?'box':'page',
				codes:[],
				prevCode:code.substring(0,code.length-2)||null,
				currCode:code.substr(-2,2)||null,
			}

		},
		mounted(){
			var id = this.$route.query.id
			this.loadData(id||0)
		},
		watch:{
			locale:{
				handler(v){
					this.changed=true
					if(this.editData && this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
			prevCata(v){
				var index = this.codes.indexOf(v,'code')
				this.locale.prev = v.id
			}
		},
		methods:{
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(id){
				!this.editData && http.request(urls.data,{id:id||0},(rlt)=>{
					if (rlt.status==1) {
						if (rlt.data.cata) {
							this.locale = rlt.data.cata
						}
						this.ready=true
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
				http.request(urls.edit,rlt=>{
					if (rlt.status==1) {
						var list = rlt.data||[]
						if (list.length>0) {
							this.codes = list.map((item)=>{
								item.value = item.code
								item.label = item.title||item.name
								return item
							})
						}
					}
				})
				
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.name) {
					msg.push(' * 分类名称为必填项')
				}
				if (!this.currCode) {
					msg.push(' * 分类编码为必填项')
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
				param.code = (this.prevCode||'') + this.currCode
				http.request(urls.save,param,rlt=>{
					if (rlt.status==1) {
						if (this.editData) {
							$$.ui.modal('修改成功',{
								textAlign:'center',
								mask:true,
								cancel:false,
								confirm:()=>{
									that.$emit('change',rlt.data)
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
										that.$router.go(-1)
									},
								},
								confirm:{
									text:'继续发布',
									callback:()=>{
										that.locale={
											status: '1',
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
	#good-cata-edit{
		.field{
			margin:.2rem 0;
		}
	}
</style>