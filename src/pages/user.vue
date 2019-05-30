<template>
	<section id="user-center" class="poeui-frame flex-row">
		<aside class="ml-40 mr-20" style="width:2rem;">
			<dl class="mt-20">
				<dt class="user-photo"><img :src="$store.state.user.photo||'http://sosc.localhost.com/res/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'"></dt>
				<dd class="b2 hor-center mt-10 mb-25" style="line-height: 1.5">
					{{$store.state.user.nick}}<br><span class="tip">{{$store.state.user.name}}</span>
				</dd>
				<dd><span class="iconfont mr-5">&#xe6c0;</span> <place-holder :value="$store.state.user.unitPost" holder="工作单位及职务"/></dd>
				<dd><span class="iconfont mr-5">&#xe647;</span> <place-holder :value="$store.state.user.city" holder="所在城市"/></dd>
				<dd><span class="iconfont mr-5">&#xe930;</span> <place-holder :value="$store.state.user.phone" holder="手机号码"/></dd>
				<dd><span class="iconfont mr-5">&#xe6e2;</span> <place-holder :value="$store.state.user.email" holder="电子邮件"/></dd>
			</dl>
		</aside>
		<div class="flex-item ml-20 mr-30">
			<header class="poeui-content-header flex-row flex-line-center">
				<h2 class="poeui-content-title">个人中心</h2>
			</header>
			<aside class="poeui-content-tabs">
				<nav-tabs class="flex-row" v-model="currTab" :tabs="['个人资料','安全设置','我的应用']" orientation="horizontal"/>
			</aside>
			<article class="poeui-content-box">
				<block class="ph-40 fields-box" title="基础信息" v-show="currTab==0" :editable="true" :editing.sync="userInfoEditing1">
					<uploader class="f-right mh-40" v-model="userInfo.cust_photo" :auto="true" :editable="userInfoEditing1" def="http://sosc.localhost.com/res/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg"/>
					<div style="max-width:6rem;">
						<field-editor title="帐号ID" v-model="userInfo.uuid" :editing="false"/>
						<field-editor title="账号名称" v-model="userInfo.name" :editing="false"/>
						<field-editor title="昵称" v-model="userInfo.nick" :editing="userInfoEditing1"/>
						<field-editor title="真实姓名" v-model="userInfo.realname" :editing="userInfoEditing1"/>
						<field-editor title="性别" v-model="userInfo.gender" :format="['女士','先生']" :editing="userInfoEditing1">
							<label class="ml-5"><input type="radio" value="1" name="sex" :checked="userInfo.gender==1" @click="userInfo.gender=1"> 先生</label>
							<label class="ml-30"><input type="radio" value="0" name="sex" :checked="userInfo.gender==0" @click="userInfo.gender=0"> 女士</label>
						</field-editor>
						<field-editor title="出生日期" v-model="userInfo.birth" type="date" :editing="userInfoEditing1"/>
						<field-editor title="创建日期" v-model="userInfo._create" :editing="false"/>
						<field-editor title="最近更新" v-model="userInfo._update" :editing="false"/>
						<field-editor title="账号状态" v-model="userInfo.status" type="switch" :editing="userInfoEditing1" :format="['已冻结','正常']" :on="1" :off="0"/>
					</div>
				</block>
				<block class="ph-40 fields-box" title="更多信息" v-show="currTab==0" :editable="true" :editing.sync="userInfoEditing2">
					<div style="max-width:6rem;">
						<field-editor title="手机号码" v-model="userInfo.phone" :editing="userInfoEditing2"/>
						<field-editor title="验证码" :editing="true" v-if="userInfoEditing2">
							<verif v-model="verifCode" />
						</field-editor>
						<field-editor title="固定电话" v-model="userInfo.tel" type="tel" :editing="userInfoEditing2"/>
						<field-editor title="邮件地址" v-model="userInfo.email" type="email" :editing="userInfoEditing2"/>
						<field-editor title="QQ号码" v-model="userInfo.qq" :editing="userInfoEditing2"/>
						<field-editor title="微信" v-model="userInfo.wx" :editing="userInfoEditing2"/>
						<field-editor title="手机号码" v-model="userInfo.phone" :editing="userInfoEditing2"/>
						<field-editor title="国家" v-model="userInfo.ncode" :editing="userInfoEditing2"/>
						<field-editor title="地区" :editing="userInfoEditing2">
							<region v-if="userInfoEditing2" v-model="userInfo.adcode"/>
							<span v-else class="tip ph-5" style="line-height: .34rem;">(未设置)</span>
						</field-editor>
						<field-editor title="详细地址" v-model="userInfo.addr" :editing="userInfoEditing2"/>
						<field-editor title="邮编" v-model="userInfo.postcode" :editing="userInfoEditing2"/>
						<field-editor title="户籍" v-model="userInfo.household" :editing="userInfoEditing2"/>
					</div>
				</block>
				<block class="ph-40 fields-box" v-show="currTab==1" :editable="true" :editing.sync="userInfoEditing3">
					<field-editor title="登录密码" value="******" type="password" :editing="userInfoEditing3"/>
					<field-editor title="支付密码" value="******" type="password" :editing="userInfoEditing3"/>
					<field-editor title="身份证号码" v-model="userInfo.idc" :editing="userInfoEditing3"/>
				</block>
			</article>
		</div>
	</section>
</template>
<script>
	import http from '@/utils/http'
	export default {
		route:{
			meta:{
				aside:false,
				view:false,
			}
		},
		data() {
			return {
				currTab:0,
				userInfo:$$.extend(true,{},this.$store.state.user),
				verifCode:'',
				userInfoEditing1:false,
				userInfoEditing2:false,
				userInfoEditing3:false,
			}
		},
		computed:{
			unitPost(){
				return [this.$store.state.user.unit,this.$store.state.user.post].join(', ')
			}
		},
		watch:{
			'userInfo.photo':function(v){
				console.log(v)
			}
		},
		methods:{
		}
	}
</script>

<style scoped lang="scss">
#user-center{
	aside{
		dd{
			line-height: .4rem;
		}
	}
	.poeui-content-box{
		.field-editor{
			margin:.1rem 0;
			line-height: .36rem;
		}
	}
}
</style>