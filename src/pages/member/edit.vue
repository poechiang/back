<template>
	<section id="member-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">会员管理</a> —— 编辑会员</h2>
		</header>
		<!-- <tabs v-model="currTab" :items="['基本信息','其他信息','账号安全']"/> -->
		<article class="poeui-content-box">
			<block class="fields-box" :class="{flat:!!editData}" :loading="!ready">

				<logo class="f-right mr-100 ml-20" :src="member.photo || def_photo" size='120' mode='cover'/>

				<field class="m-0" title="账号名称" :value="member.name" disabled/>
				<field class="m-0" title="昵称" :value="member.cust_nick" disabled/>
				<field class="m-0" title="性别" :value="member.labels.gender" disabled/>
				<field class="m-0" title="注册时间" :value="member.stamp.reg.YmdHis" disabled/>
				<hr class="mv-20" style="opacity: .2">
				<field class="m-0" title="会员编号" :value="member.uuid" disabled/>
				<field class="m-0" title="手机号码">
					<output v-if="member.mark_phone">{{member.mark_phone}}</output>
					<tip v-else>( 未设置 )</tip>
				</field>
				<field class="m-0" title="所在地区" :value="member.region" disabled/>
				<field class="m-0" title="籍贯">
					<output v-if="member.household">{{member.household.prov+member.household.city+member.household.county}}</output>
					<tip v-else>( 未设置 )</tip>
				</field>
				<field class="mt-20" title="绑定微信">
					<template v-if="member.openid">
						<logo class="mr-5  f-left" :src="member.wx_photo || def_photo" size='68' radius="50%" mode='cover'/>
						<span><tip>{{member.openid}}</tip><br>{{member.wx_nick}}</span>
					</template>
					<tip v-else>( 未设置 )</tip>
				</field>
				<field title="状态">
					<onoff v-model="member.status" :on="1" :off="0"> <span >{{member.status=='1'?'正常':'冻结'}}</span> </onoff>
				</field>
			</block>
			<block class="fields-box" title="状态展示" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==1">
				<div style="width:8rem;margin:auto">
					<field title="签名" v-model="member.signature" placeholder="（可选）签名"/> 
					<field title="出生日期" v-model="member.birth" type="date" placeholder="（可选）出生日期"/> 
					<field title="身份证号码" v-model="member.idc" placeholder="（可选）18位二代身份证号码"/> 
					<field title="电话" v-model="member.tel" placeholder="（可选）区号+固定电话"/> 
					<field title="QQ" v-model="member.qq" placeholder="（可选）QQ号码"/> 
					<field title="微信" desc="（可选）微信二维码">
						<uploader v-model="member.wx" width="200" height="200" :auto="true"/>
					</field>
					<field title="E-mail" v-model="member.email" type="email" placeholder="（可选）电子邮件地址"/> 
					<field title="联系地址" :require="true">
						<region v-model="member.adcode" @select="handleAdComplete"/>
						<input class="mt-10" v-model="member.addr" placeholder="（可选）详细地址">
					</field>
				</div>
			</block>
			<block class="fields-box" title="状态展示" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==2">
				<div style="width:8rem;margin:auto">
					<field title="真实姓名" v-model="member.real_name" placeholder="（可选）真实姓名"/> 
					<field title="登录密码" v-model="member.login_pwd" required type="password" placeholder=" 输入账号登录密码"/>
					<field title="确认密码" v-model="login_pwd" required type="password" placeholder=" 重复账号登录密码"/>
					<field title="手机号码" v-model="member.phone" placeholder=" 输入手机号码获取验证码码号验证"/> 					
				</div>
			</block>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	const urls={
		data:'back/user/get_member',
		save:'back/user/save_member',
		delete:'back/user/del_member',
	}
	export default {
		route:{
			path:'/member/edit',
			meta:{
				menu:'member',
			},
			
		},
		model:{
			prop:'edit-data',
			event:'change'
		},
		props:['editData','on'],
		data() {
			return {
				id:this.$route.query.id,
				ready: !!this.editData,
				changed:false,
				member: $$.extend({},this.editData),
				login_pwd:'',
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				currTab:0,
				basic:{
					types:{},
					departments:{},
					posts:{},
				},
				def_photo:'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg',
			}

		},
		mounted(){
			this.loadData()
		},
		watch:{
			member:{
				handler(v){
					this.changed = true
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
		},
		methods:{
			// 加载数据
			loadData(){
				this.id && http.request(urls.data,{id:this.id},(rlt)=>{
					if (rlt.status==1) {
						if (rlt.data) {
							this.member = rlt.data
						}
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
					this.$nextTick(()=>{
						this.ready=true
					})
				})

			},
			
			handleAdComplete(){

			},
			handleSubmit(){
				//验证过程
				var msg=[]
				if (!this.member.title) {
					msg.push(' * 产品名称为必选项')
				}
				if (!this.member.cata) {
					msg.push(' * 产品分类编码为必选项')
				}
				if (!this.member.retail_price) {
					msg.push(' * 产品零售价为必选项')
				}
				if (!this.member.heads||this.member.heads.length<=0) {
					msg.push(' * 至少上传一张产品头图')
				}
				if (!this.member.detail) {
					msg.push(' * 产品详情为必选项')
				}
				if (this.member.is_immediate!=1 && !this.member.send_time) {
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

				var param = $$.extend(true,{},this.member)
				var that = this
				http.request(urls.save,param,rlt=>{
					if (rlt.status==1) {
						if (this.member.id) {
							$$.ui.modal('修改成功',{
								textAlign:'center',
								mask:true,
								cancel:false,
								confirm:()=>{
									if (this.editData && this.trigger=='submit') {
										that.$emit('change',that.member)
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
										that.$router.push({path:'/member/list'})
									},
								},
								confirm:{
									text:'继续发布',
									callback:()=>{
										that.member={}
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
	#member-edit{
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