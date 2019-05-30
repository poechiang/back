<template>
	<section id="brand-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">产品库</a> —— {{locale.id?'编辑':'添加'}}品牌</h2>
			<div class="flex-item"></div>
			<div >
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</header>
		<article class="poeui-content-box">
			<block class="fields-box of-hidden " :title="false" :class="{flat:!!editData,'pv-0':!!editData}" :loading="!ready" v-if="currTab==0">
				<field title="品牌商标" :require="true" class="f-left mt-0">
					<uploader class="pv-10" v-model="locale.logo" width="200" height="200" :auto="true"/>
				</field>
				<field title="品牌名称" v-model="locale.title" placeholder=" 输入品牌全称"/>
				<field title="品牌简称" v-model="locale.abbr" placeholder="（可选）输入品牌简称"/>
				<field title="品牌介绍" v-model="locale.desc" multi placeholder=" 输入品牌介绍"/>
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
		data:'back/brand/get_detail',
		save:'back/brand/save',
		delete:'back/brand/delete',
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
			if (true) {}
			return {
				ready: !!this.editData,
				changed:false,
				locale: this.editData||{
					status: 1,
				},
				mode:this.editData?'box':'page',
				currTab:0,
			}

		},
		mounted(){
			var bid = this.$route.query.bid
			this.loadData(bid||0)
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
		},
		methods:{
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(bid){
					http.request(urls.data,{id:bid||0},(rlt)=>{
						if (rlt.status==1) {
							if (rlt.data.brand) {
								this.locale = rlt.data.brand
							}
							this.ready=true
						}
						else{
							$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
						}
					})
				
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.locale.title) {
					msg.push(' * 品牌名称为必填项')
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
	#brand-edit{
		.field{
			margin:.2rem 0;
		}
	}
</style>