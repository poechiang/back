<template>
	<section id="user-reg" class="poeui-frame">
		<header v-if="regSuccess==1">
			<h1 class="hor-center mb-20">新用户注册</h1>
		</header>
		<article class="flex-item poeui-content-box">
			<block class="ph-60 ma-0" style="width:6rem" v-if="regSuccess==1">
				<field :title="false" placeholder="登录账号 / 手机号码 / 电子邮件" v-model="user.name" :validate.sync="validate.name" @verif="handleVerif"/>

				<field :title="false" placeholder="登录密码 （6-16位，不能是纯数字）" type="password" v-model="user.login_pwd" :validate.sync="validate.login_pwd" @verif="handleVerif"/>
				<!-- <p class="tip">密码6-16位，须至少满足以下条件中的两条以上：</p>
				<ul class="rules tip">
					<li v-for="(rule,index) in pwdRules">{{index+1}} 、 {{rule}}</li>
				</ul> -->
				<field :title="false" placeholder="确认密码" type="password" v-model="confirm_pwd" :validate.sync="validate.confirm_pwd" @verif="handleVerif"/>
				<field :title="false" type="radio" :items="['女士','先生']" v-model="user.gender"/>
				<field :title="false" placeholder="手机号码" v-model="user.phone" :validate.sync="validate.phone" @verif="handleVerif"/>
				<field :title="false" type="verif" :validate.sync="validate.msgCode" @verif="handleVerif">
					<button class="btn-block warning ml-10 f-right" style="width:1.3rem" :disabled="isInvalidUserPhone">获取验证码</button>
					<input style="width:calc(100% - 1.4rem);" placeholder="输入6位验证码" v-model="msgCode">
				</field>
				<field :title="false" :validate.sync="validate.verifCode" @verif="handleVerif">
					<captcha svr="http://shi-api.localhost.com/verif/captcha" v-model="verifCode" :img="{width:'1.6rem',height:'.5rem'}"/>

				</field>
				<field :title="false">
					<label><input type="checkbox" v-model="iAgree"> 我已阅读理解并接受 <a class="link">《拾补平台管理员账号使用协议及责任 1.1》</a> </label>
				</field>
				<field :title="false" class="hor-center mt-30 mb-50">
					<button class="btn-block theme mh-10" style="width:1.5rem;" @click="handleSubmit" :disabled="!(user.name&&user.login_pwd&&confirm_pwd&&user.phone&&msgCode&&verifCode&&iAgree)">提交</button>
					<button class="btn-block mh-10" style="width:1.5rem" @click="handleCancel">取消</button>
				</field>
			</block>
			<block class="ph-60 ma-0" style="width:6rem" v-else>
				<img class="dp-block ma-50" width="150" src="https://res.shibu365.com/i/2019-03-20/4ba8008cefa34981a174a4e90d3f6621.png">
			</block>
		</article>
		<footer class="hor-center"></footer>
	</section>
</template>
<script>
	import http from '@/utils/http'
	export default {
		route:{
			meta:{
				aside:false,
			}
		},
		data() {
			return {
				user:{gender:1},
				confirm_pwd:'',
				msgCode:'',
				verifCode:'',
				iAgree:false,
				pwdRules:[
					// '至少一个小写字母',
					// '至少一个大写字母',
					// '至少一个0-9阿拉伯数字',
					// '至少一个英文半角字符：_ 、~ 、! 、@ 、# 、$ 、% 、^ 、& 、* 、- 、= 、+ 、( 、)'
				],
				validate:{
					name:{
						field:'name',
						require:true,
						pattern:/^[a-zA-Z0-9_@.]{4,}$/,
						msg:'账号名称必填，且长度大于4个字符',
					},
					login_pwd:{
						field:'login_pwd',
						require:true,
						pattern:(v)=>{
							return /^\d{6,16}$/.test(v)
						},
						msg:'登录密码无效',
					},
					confirm_pwd:{
						field:'confirm_pwd',
						require:true,
						pattern:(v)=>{
							return v==this.user.login_pwd
						},
						msg:'两次密码不一致',
					},
					real_name:{
						field:'real_name',
						partten:/.{3,}/,
						msg:'用户真实姓名应该与证件一致，三个以上汉字或英文字母',
					},
					phone:{
						field:'phone',
						require:true,
						pattern:/^1[0-9]{10}$/,
						msg:'手机号码无效',
					},
					msgCode:{
						field:'msgCode',
						require:true,
						pattern:/^([0-9]{4})|([0-9]{6})$/,
						msg:'短信验证码为4位或6位阿拉伯数字',
					},
					verifCode:{
						field:'verifCode',
						require:true,
						pattern:/^([0-9]{4})|([0-9]{6})$/,
						msg:'图片验证码为4位或6位阿拉伯数字',
					}
				},
				regSuccess:0,
			}
		},
		computed:{
			isInvalidUserPhone(){
				return !this.validate.phone.pattern.test(this.user.phone)
			}
		},
		methods:{
			handleVerif(e){
				if (e.validate.field=='login_pwd'&& e.validate.verif==0) {
					this.validate.confirm_pwd.verif=0
				}
			},
			handleSubmit(){
				var msg=[],len=0
				for (var x in this.validate) {
					if (this.validate[x].verif==-1) {
						msg.push((msg.length+1)+' 、'+this.validate[x].msg)
					}
				}
				len=msg.length
				msg = msg.join('<p>')
				if (len>0) {
					$$.ui.modal(msg,{cancel:false,mask:false,title:'您有' + len + '项输入无效，请逐一核对修改'})
					return
				}
				$$.ui.loading('正在提交注册')
				http.request('back/user/reg_admin',{user:this.user,msg:this.msgCode,verif:this.verifCode},{
					success:(rlt)=>{
						if (rlt.status==1) {
							$$.ui.toast('注册成功',{
								icon:'success',
								success:()=>{
									this.regSuccess = 1
								}
							})
							//this.user.id = rlt.data.id
						}
						else{
							$$.ui.modal(rlt.msg,{cancel:false,mask:true})
						}
					},
					error:(e)=>{
						$$.ui.hide()
					}
				})
			},
			handleCancel(){
				this.$router.go(-1)
			}
		}
	}
</script>

<style lang="scss">
#user-reg{
	::-webkit-input-placeholder {
		color:#A5D6A7;
	}
	:-moz-input-placeholder {
		color:#A5D6A7;
	}
	:-ms-input-placeholder {
		color:#A5D6A7;
	}
	:-o-input-placeholder{
		color:#A5D6A7;
	}
	:input-placeholder{
		color:#A5D6A7;
	}
	h1{
		font-size: 2em;
		font-weight: 300;
	}
	.field{
		margin:.2rem 0;
	}
}
</style>