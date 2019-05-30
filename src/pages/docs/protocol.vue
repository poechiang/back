<template>
	<section id="user-reg" class="poeui-frame">
		<header>
			<h1 class="hor-center mb-20">新用户注册</h1>
		</header>
		<article class="flex-item poeui-content-box">
			<block class="ph-60 ma-0" style="width:6rem">
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
					<captcha svr="https://api.shibu365.com/verif/captcha" v-model="verifCode" :img="{width:'1.6rem',height:'.5rem'}"/>

				</field>
				<field :title="false">
					<label><input type="checkbox" :checked="iAgree"> 我已阅读理解并接受 <a class="link">《拾补平台管理员账号使用协议及责任 1.1》</a> </label>
				</field>
				<field :title="false" class="hor-center mt-30 mb-50">
					<button class="btn-block theme mh-10" style="width:1.5rem;" @click="handleSubmit" :disabled="!(user.name&&user.login_pwd&&confirm_pwd&&user.phone&&verifCode&&iAgree)">提交</button>
					<button class="btn-block mh-10" style="width:1.5rem" @click="handleCancel">取消</button>
				</field>
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
			return {}
		},
		methods:{
		}
	}
</script>
<style lang="scss">
</style>