<template>
	<section id="bnr-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title">{{banner.id?'编辑轮播广告':'添加新轮播广告'}}</h2>
			<div class="flex-item"></div>
			<div >
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handleSubmit">提交</button>
			</div>
		</header>
		<article class="poeui-content-box">
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready">
				<field width="100,*,200" title="位置" v-model="banner.type" type="select" :items="banner_locations"/>
				<field width="100,*,auto" title="轮播图片" :required="true">
					<uploader class="pv-10" v-model="banner.pic" :width="200" :height="100" tip='添加/替换图片'/>
				</field>
				<field width="100,*,auto" title="标题" v-model="banner.title" placeholder="（可选）输入轮播标题"/>
				<field width="100,*,auto" title="分类" v-model="banner.cata" placeholder="（可选）输入轮播分类"/>

				<field width="100,*,auto" title="目标路径" v-model="banner.path" placeholder="（可选）输入轮播点击后的目标页面路径"/>
				<field width="100,*,auto" title="状态" v-if="banner.id">
					<onoff v-model="banner.status" :on="1" :off="0"> <span >{{banner.status=='1'?'正常':'冻结'}}</span> </onoff>
				</field>
			</block>
			<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	const urls={
		bannerTypes:'back/banner/banner_locations',
		data:'back/banner/get_banner',
		save:'back/banner/save_banner',
		delete:'back/banner/del_banner',
	}
	export default {
		route:{
			path:['/banner/edit','/banner/add'],
			meta:{
				menu:'bnr',
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
				banner: this.editData||{
					pic:'',
					status: 1,
					cata:'',
					type:0,
				},
				banner_locations:[],
				mode:this.editData?'box':'page',
				trigger:this.on||'submit'
			}

		},
		mounted(){

			this.loadData(this.$route.query.id)

		},
		watch:{
			banner:{
				handler(v){
					this.changed=true
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
			editData(v){
				this.banner = v||{
					pic:'',
					status: 1,
					cata:'',
					type:0,
				}
			}
		},
		methods:{
			loadData(id){
				if (id) {
					http.request(urls.data,{id:id},rlt=>{
						if (rlt.status==1) {
							this.banner = rlt.data||[]
							this.ready=true
						}
						else{
							$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
						}
					})
				}
				else{
					this.ready=true
				}
				http.request(urls.bannerTypes,rlt=>{
					if (rlt.status==1) {
						var locations = []
						for(var x in rlt.data){
							locations.push({value:x,label:rlt.data[x]})
						}

						this.banner_locations = locations
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
				
			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.banner.pic) {
					$$.ui.modal('轮播的图片为必选项',{
						title:'提示',
						cancel:false,
						mask:true
					})
					return
				}

				var param = $$.extend(true,{},this.banner)
				var that = this
				http.request(urls.save,param,rlt=>{
					if (rlt.status==1) {
						$$.ui.modal('提交成功',{
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
<style lang="scss">
	#bnr-edit{
		.field{
			margin:.2rem 0;
		}
	}
</style>