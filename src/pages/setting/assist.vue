<template>
	<section id="set-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">消息助手</a> —— {{locale.id?'编辑':'添加'}}</h2>
			<div class="flex-item"></div>
			<div >
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</header>
		<article class="poeui-content-box">
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready">
				<div style="width:6rem;margin:auto;overflow: hidden;padding-right: .05rem;">
					<field title="助手标识" :require="true" v-model="locale.name" placeholder="唯一标识，可以为空，一旦填写不能修改" :validate="nameValidate" :disabled="locale.id && locale.name"/>
					<field title="助手类型" v-model="locale.type" :items="assistTypes"/>
					<field title="图标" :require="true">
						<uploader v-model="locale.cust_photo" width="120" height="120" :auto="true"/>
					</field>
					<field title="显示名称" :require="true" v-model="locale.cust_nick" placeholder="显示名称，建议四个以上汉字或英文字母" />
					<field title="简介" v-model="locale.signature" placeholder="助手业务内容的简介说明"/>

					<field title="是否官方" v-model="locale.official" type="switch"/>
					<field title="状态">
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
		allAssistKeys:'back/setting/all_assist_keys',
		data:'back/setting/get_assist',
		save:'back/setting/save_assist',
		delete:'back/setting/del_assist',
	}
	const def= {
		status: 1,
		type:0,
	}
	export default {
		route:{
			path:['/setting/assist'],
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
			return {
				ready: !!this.editData,
				changed:false,
				locale: this.editData|| def,
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				nameValidate:{
					pattern:v=>{
						if (this.keys.length<=0) {
							return true
						}
						return this.locale.id || this.keys.indexOf(v)<0
					},
					msg:'配置名称不能为空且不能被占用',
				},
				keys:[],
				assistTypes:[{value:0,label:'商户助手'},{value:1,label:'消息助手'},{value:2,label:'物流助手'},{value:3,label:'安全助手'},{value:4,label:'订阅助手'}],
			}

		},
		mounted(){
			if(!this.ready) this.loadData(this.$route.query.id||0)

			http.request(urls.allAssistKeys,rlt=>{
				if (rlt.status==1) {
					this.keys=rlt.data
				}
			})
		},
		watch:{
			editData(v){
				this.locale= v||def
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
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.cust_nick) {
					$$.ui.modal('显示名称为必填项',{
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
							$$.ui.modal('数据保存成功',{
								textAlign:'center',
								mask:true,
								cancel:false,
								confirm:()=>{
									that.$emit('change',rlt.data)
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
