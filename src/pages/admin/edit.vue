<template>
	<section id="admin-edit" :class="{'poeui-page':!editData,'poeui-box':editData}">
		<header class="poeui-content-header flex-row flex-line-center" v-if="!editData">
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">管理员</a> —— {{admin.id?'修改':'添加'}}</h2>
		</header>
		<tabs v-model="currTab" :items="['基本信息','帐号审核','权限与角色']" v-if="admin.id"/>
		<article class="poeui-content-box">
			<template v-if="!admin.id">

				<!-- 添加新的管理员帐号 -->

				<block class="fields-box" :title="false" :class="{flat:!!editData}" :loading="!ready">
					<field title="账号名称" v-model="admin.name" required width="100,300,*" placeholder=" 账号名称" desc="帐号登录名称，4-20位英文字母或数字下划线。" :validate.sync="validate.name" @verif = "handleVerif($event,'name')"/>
					<field title="账号类型" class="mv-40">
						<label><input type="radio" value="1" v-model="admin.type" name="acctype"> 普通帐号</label> —— <tip>正常的管理员帐户，具有正常的权限及功能。</tip><br>
						<label><input type="radio" value="0" v-model="admin.type" name="acctype"> 虚拟帐号</label> —— <tip>为相关功能展示建立的虚假帐号，无法登录系统并使用系统中的功能。</tip><br>
						<label><input type="radio" value="-1" v-model="admin.type" name="acctype"> 测试帐号</label> —— <tip>可以登录系统且有限使用系统部分功能，部分业务流程仅具有演示功能，相关数据不一定写入数据库。</tip><br>
					</field>

					<field title="登录密码" v-model="admin.login_pwd" required width="100,300,*" :validate.sync="validate.login"  @verif = "handleVerif($event,'login')" type="password" placeholder=" 输入账号登录密码" desc="6至16位，至少包含一个大写字母，一个小写字母，一个数字及一个特殊字符（!、@、#、$、%、^、&、*、?）"/>
					<field title="确认密码" v-model="confirm_pwd" required width="100,300,*" type="password" :validate.sync="validate.confirm"  @verif = "handleVerif($event,'confirm')" placeholder=" 重复账号登录密码"/>
					

					<field class="mt-40" title="所在单位" v-model="admin.unit" width="100,300,*" placeholder="（可选）账号所属单位、子公司或代理商"/> 
					<field title="部门" v-model="admin.dep_id" width="100,300,*" placeholder=" （可选）所属部门"/>
					<field title="职位" v-model="admin.post_id" width="100,300,*" placeholder="（可选）所属职务"/>

					<field title="状态">
						<onoff v-model="admin.status" :on="1" :off="0"> <span >{{admin.status=='1'?'正常':'冻结'}}</span> </onoff>
					</field>
				</block>

				<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!(changed&& canSubmit)" @click="handleRegister">提交</button>
			</template>
			<template v-else>

				<!-- 修改现有管理员帐号 -->

				 <block class="fields-box lh-40" title="账号信息" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==0">
						<img class="f-right" width="140" height="140" :src="admin.cust_photo||'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'">
						<big>{{admin.cust_nick?(admin.cust_nick+'('+admin.name+')'):admin.name}}</big> <small class="ml-20" v-if="admin.labels && admin.labels.gender">{{admin.labels.gender.label}}</small><br>
						<tip v-if="admin.labels && admin.labels.type">[{{admin.labels.type.label}}]</tip><br>
						<div class="flex-row" >
							<data-label title="部门：" :value="admin.dep_name" class="flex-item"/>
							<data-label title="职务：" :value="admin.post_name" class="flex-item"/>
							<data-label title="单位：" :value="admin.unit" class="flex-item-2"/>
						</div>
					</block>

					<block class="fields-box" title="账号资料" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==0">
						
						<div class="flex-row">
							<data-label title="真实姓名：" class="flex-item" :value="admin.real_name" />
							<data-label title="手机号码：" class="flex-item" :value="admin.phone?admin.phone.substr(0,3)+'****'+admin.phone.substr(7,4):''" />
							<data-label title="出生日期：" class="flex-item" :value="admin.stamp.birth.ymd" />
							<data-label title="身份证号：" class="flex-item" :value="admin.idc?admin.idc.substr(0,2)+'************'+admin.idc.substr(14,4):''" />
						</div>
					</field> 
					<field title="联系地址" v-model="admin.addr" disabled/>
					<field title="出生日期" v-model="admin.birth" type="date" disabled/> 
					<field title="电话" v-model="admin.tel" disabled/> 
					<field title="QQ" v-model="admin.qq" disabled/> 
					<field title="微信">
						<img :src="admin.wx" width="140" height="140" v-if="admin.wx">
						<tip v-else>( 未绑定 )</tip>
					</field>
					<field title="E-mail" v-model="admin.email" type="email" disabled/>
					<field title="登录密码" v-model="admin.login_pwd?'······':''" >
						<output v-if="admin.login_pwd">●●●●●●</output>
						<tip v-else>( 未设置 )</tip> 
						<button class="btn-block theme ml-200" v-if="admin.login_pwd">重置密码</button>
					</field>
					<field title="状态" width="140,*,*">
						<onoff v-model="admin.status" :on="1" :off="0"> <span >{{admin.status=='1'?'正常':'冻结'}}</span> </onoff>
					</field>
				</block>
				<block class="fields-box" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==1">
					<field class="mv-0" title="真实姓名" v-model="admin.real_name" disabled/> 
					<field class="mv-0" title="联系地址" v-model="admin.addr" disabled/>
					<field class="mv-0" title="出生日期" v-model="admin.birth" type="date" disabled/> 
					<field class="mv-0" title="身份证号码" v-model="admin.idc" disabled/> 
					<field class="mv-0" title="电话" v-model="admin.tel" disabled/> 
					<field class="mv-0" title="QQ" v-model="admin.qq" disabled/> 
					<field class="mv-0" title="微信">
						<img :src="admin.wx" width="140" height="140" v-if="admin.wx">
						<tip v-else>( 未绑定 )</tip>
					</field>
					<field class="mv-0" title="E-mail" v-model="admin.email" type="email" disabled/>
					
					<field class="mv-0" title="手机号码" v-model="admin.phone" disabled/>

				</block>
				<block class="fields-box" title="状态展示" :class="{flat:!!editData}" :loading="!ready" v-if="currTab==2">
				</block> 

				<!-- <button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handleSubmit">提交</button> -->
			
		</template>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	const urls={
		acc:'back/user/get_admin_acctypes',
		data:'back/user/get_admin',
		reg:'back/user/reg_admin',
		save:'back/user/save_admin',
		delete:'back/user/del_admin',
	},
	nameRegx = /^[a-zA-Z_][a-zA-Z_0-9]{3,19}$/,
	pwdRegx = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?]).*$/,
	defValid = {
		name:{
			pattern:nameRegx,
			msg:'账号名称无效'
		},
		login:{
			pattern:pwdRegx,
			msg:'登录密码无效'
		},
		confirm:{
			pattern:v=>{
				if (!v) {
					return '确认密码不能为空'
				}
				else if (!pwdRegx.test(v)) {
					return '确认密码格式无效'
				}
				else if(v!=this.admin.login_pwd){
					return '确认密码与登录密码不一至'
				}
				else{
					return true
				}

			},
		}
	}

	export default {
		route:{
			path:['/admin/add','/admin/edit'],
			meta:{
				menu:'admin',
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
				admin: $$.extend({
					id:this.$route.query.id||0,
					type:1,
					gender:1,
					status: 1,
				},this.editData),
				confirm_pwd:'',
				mode:this.editData?'box':'page',
				trigger:this.on||'submit',
				validate:$$.extend(true,{},defValid),
				currTab:0
			}

		},
		mounted(){
			var id = this.$route.query.id
			this.loadData(id||0)
		},
		computed:{
			canSubmit(){
				return this.validate.name.verif==1 && this.validate.login.verif==1 && this.validate.confirm.verif==1
			}
		},
		watch:{
			admin:{
				handler(v){
					this.changed=true
					if(this.trigger=='change'){
						this.$emit('change',v)
					}
				},
				deep:true
			},
		},
		methods:{

			loadData(id){
				if(!id){
					this.ready=true
					return
				}
				http.request(urls.data,{id:id||0},(rlt)=>{
					if (rlt.status==1 && rlt.data) {
						this.admin = rlt.data
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}

					this.ready=true
				})

			},
			
			handleVerif(e,key){
				if (key=='name') {
					http.request('back/user/check_admin_name',{name:e.value},rlt=>{
						if(rlt.status==1 && rlt.data){
							e.validate.verif=-1
							e.validate.msg='指定账号已存在'
						}
						
					})
				}
			},
			handleAdComplete(){

			},
			handleRegister(){
				//验证过程
				var msg=[],
					data = this.admin,
					nameValid = this.validate.name,
					loginValid = this.validate.login,
					confirmValid = this.validate.confirm

				if (nameValid.verif!=1) {
					msg.push(' * 账户登录名无效')
				}
				if (loginValid.verif!=1) {
					msg.push(' * 帐户登录密码无效')
				}
				if (confirmValid.verif!=1) {
					msg.push(' * 帐户确认密码无效')
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
				http.request(urls.reg,data,rlt=>{
					if (rlt.status==1) {
						$$.ui.modal('注册管理员账号成功',{
							textAlign:'center',
							mask:true,
							cancel:{
								text:'返回',
								callback:()=>{
									that.$router.go(-1)
								},
							},
							confirm:{
								text:'继续',
								callback:()=>{
									that.admin={type:1,gender:1,status: 1}
									that.confirm_pwd = ''
									that.changed = false
									that.ready = true
									that.validate = $$.extend(true,{},defValid)
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
	#admin-edit{
		.data-label>label{
			min-width: .7rem;
		}
		.field{
			margin:.2rem 0;
		}
	}
</style>