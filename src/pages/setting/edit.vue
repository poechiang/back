<template>
	<section id="bnr-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">配置</a> —— {{locale.id?'编辑':'添加'}}</h2>
			<div class="flex-item"></div>
			<div >
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</header>
		<article class="poeui-content-box">
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready">
				<div style="width:6rem;margin:auto;overflow: hidden">
					<field width="100,*,auto" title="引用标识" :require="true" v-model="locale.name" :disabled="locale.id" placeholder="程序种引用时使用的名称，小写字母及下划线" :validate="configNameValidate"/>
					<field width="100,*,auto" title="前缀名称" v-model="locale.perfix" placeholder="配置前缀名称，默认app"/>
					<field width="100,*,auto" title="配置标题" v-model="locale.title" placeholder="配置说明"/>
					<field width="100,*,auto" title="配置内容" require :value="jsonstr" @change="handleContentChange" placeholder="配置内容" :field="{height:'4rem',lineHeight:2}" :multi="true"/>
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
	const urls={
		info:'back/setting/all_setting_keys',
		data:'back/setting/get_setting',
		save:'back/setting/save_setting',
		delete:'back/setting/delete_setting',
	}
	export default {
		route:{
			path:['/setting/add','/setting/edit'],
			meta:{
				menu:'setting',
			},
			
		},
		model:{
			prop:'edit-data',
			event:'change'
		},
		props:['editData','on'],
		data() {
			var def = {
					status: 1,
					perfix:'app',
					content:""
				}

			return {
				ready: !!this.editData,
				changed:false,
				locale: this.editData||def,
				//contentStr:this.editData?JSON.stringify(this.editData.content,undefined,4):'',
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				configNameValidate:{
					pattern:v=>{
						if (this.keys.length<=0) {
							return true
						}
						return this.locale.id || this.keys.indexOf(v)<0
					},
					msg:'配置名称不能为空且不能被占用',
				},
				keys:[]
			}

		},
		mounted(){
			if(!this.ready) this.loadData(this.$route.query.id||0)
			http.request(urls.info,rlt=>{
				if (rlt.status==1) {
					this.keys=rlt.data.names
				}
			})
		},
		computed:{
			jsonstr(){
				return JSON.stringify(this.locale.content,undefined,4)
			}
		},
		watch:{
			editData(v){
				this.locale= v||{
					status: 1,
					perfix:'app',
					content:""
				}
				this.ready = true
				this.changed = false
			},
			locale:{
				handler(v){
					this.changed=true
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			}
		},

		methods:{
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(id){
				// http.request(urls.data,{id:id||0},(rlt)=>{
				// 	if (rlt.status==1) {
				// 		this.banner_types = rlt.data.banner_types
				// 		if (rlt.data.banner) {
				// 			this.locale = rlt.data.banner
				// 		}
				// 		this.ready=true
				// 	}
				// 	else{
				// 		$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
				// 	}
				// })
				
			},
			handleContentChange(e){
				try {
					this.locale.content = JSON.parse(e)
				}
				catch(err){
					$$.ui.modal('您的配置值不符合JSON字符串的格式',{
						title:'提示',
						cancel:false,
						mask:true
					})
				}
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.name) {
					msg.push(' * 配置的引用名称为必填项')
				}
				if (!this.locale.content) {
					msg.push(' * 配置内容为必填项')
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
										that.$emit('change',that.locale)
									}
								},
								confirm:{
									text:'继续发布',
									callback:()=>{
										that.$emit('change',that.locale)
										that.locale={
											status: 1,
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
	#bnr-edit{
		.field{
			margin:.2rem 0;
		}
	}
</style>