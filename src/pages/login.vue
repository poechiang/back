<template>
	<div id="login" class="flex-column img-filter blur-10">
		<article class="flex-item" style="position: relative;z-index: 1">
			<section class="login-box">
				<img class="dp-block ma-20" src="http://sosc.localhost.com/res/f/2018-12-08/67c6e24e3a1448aeacc45a30b6d805b1.png">
				<div class="field">
					<input class="full-row" v-model="acc" placeholder="帐号 / 邮箱 / 手机号码">
					<icon face="&#xe604;" size="1.5em" class="pos-absolute" style="right:0;top:.05rem;"/>
				</div>
				<div class="field">
					<input class="full-row" v-model="pwd" placeholder="登录密码" type="password">
					<icon face="&#xe7cb;" size="1.5em" class="pos-absolute" style="right:0;top:.05rem;"/>
				</div>
				<captcha class="field" svr="https://api.shibu365.com/verif/captcha" v-model="code" :img="{width:'1.6rem',height:'.5rem'}"/>
				<div class="field"><button class="login full-row" @click="handleLogin">登录</button></div>
				<div class="field"><button class="regin full-row" v-if="0" @click="handleReg">注册</button></div>
				<div class="field pb-30 hor-left">
					<a class="forget" href="/forget" @click="handleForgetPwd">忘记密码？</a>
					<a class="reg f-right" href="/register">在线注册</a>
				</div>

			</section>
		</article>
	</div>
</template>
<script>
	import http from '@/utils/http'
	export default {
		route:{
			meta:{
				header:false,
				aside:false,
			}
		},
		data() {
			return {
				acc:'',
				pwd:'',
				code:'',
			}
		},
		watch:{
			code(v){
				console.log(v)
			}
		},
		mounted(){
			$(document).off('keydown').on('keydown',(e)=>{
				if (e.keyCode == 13) {
					this.handleLogin()
				}
			})
		},
		methods:{
			handleLogin(){
				$$.ui.loading('登录中 …')
				http.request('res/user/login',{name:this.acc,pwd:this.pwd,code:this.code},{
					success:(rlt)=>{
						if (rlt.status==1) {
							$$.ui.hide()
							this.$store.state.user=rlt.data
							this.$store.state.user.loginned=true
							$$.catch.session('curr-login-user',this.$store.state.user)
							this.$router.push({path:this.$route.params.redir||'/'})
						}
						else{
							$$.ui.modal(rlt.msg,{cancel:false,mask:true})
						}
					},
					error:(rlt)=>{
						$$.ui.hide()
						if(rlt.status<=0){

						}
					}

				})
			},
			handleForgetPwd(){
				$$.ui.modal('活该！',{textAlign:'center',mask:true,cancel:false,confirm:false})
				//$$.ui.toast('测试')
			},
			handleReg(){
				$$.ui.modal('没门！',{textAlign:'center',mask:true,cancel:false,confirm:false})	
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#login{
	position: fixed;
	left:0;
	right:0;
	top:0;
	bottom: 0;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url(http://sosc.localhost.com/res/f/2018-12-08/82f7b2edfcd84244b58170a9b637000b.jpg);
	.login-box{
	    position: absolute;
	    right: 1.5rem;
	    top: 50%;
	    margin-top: -3rem;
	    background-color: rgba(255,255,255,.5);
	    text-align: center;
	    width: 4rem;
	    box-shadow: 0 0 0.05rem rgba(0,0,0,.5);
	    border-radius: .1rem;
	    padding:0 .4rem;
	    img{
	    	display: block;
	    	outline: none;
	    }
	    .field{
	    	position:relative;
    	    margin:.2rem auto;
    	    input,button{
    	    	display: block;
    	    	outline: none;
    	    }
    	    input{
    	    	line-height: .4rem;
    	    	background-color:transparent;
    	    	border:none;
    	    	border-bottom:.02rem solid #000;
    	    }
    	    button{
    	    	border:none;
    		    height: .4rem;
    		    border-radius: .4rem;
    		    background-color:#4CAF50;
    		    color: #fff;
    		    &.login{
    		    	background-color: #FF5722;
    		    	margin-top: .3rem;
    		    }
    	    }
    	    a{
    	    	color:#4caf50;
    	    }
    	}
	}
}
</style>