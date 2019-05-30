<template>
	<div id="contact-dialog" class="img-filter blur-10">
		<div class="dialog flex-column">
			<header class="dlg-title">
				<ul class="fun-list flex-row">
					<li class="cata fun" :class="{selected:currTab1==1}" @click='currTab1=1'>待回复 {{servings.length}}</li>
					<li class="cata fun" :class="{selected:currTab1==2}" @click='currTab1=2'>待接入 {{waitings.length}}</li>
					<li class="flex-item"></li>
					<li class="me fun" :class="{online:user.state==1}">
						{{user.nick}}
						<span class="iconfont">&#xe606;</span>
					</li>
					<li class="setting fun" :class="{selected:currTab1==3}" @click='currTab1=3'><span class="iconfont">&#xe926;</span></li>
				</ul>
			</header>
			<article class="dlg-body flex-item">
				<div class="flex-row full-col" v-if="currTab1==1">
					<aside class="member-list">
						<ul class="list">
							<li class="member flex-row flex-line-center pv-5 ph-15" :class="{curr:member.uuid==currMember.uuid}" v-for="member in servings" :key="member.uuid" v-if="member.svrid = uuid && member.state>=1" @click="currMember=member">
								<div class="user-photo circle small mr-10" :style="{backgroundImage:'url('+member.photo+')'}"></div>
								<div class="flex-item">
									<div class="user-nick b3 mb-5">{{member.nick}}</div>
									<p class="tip ellipsis">{{'你好，请问...'}}</p>
								</div>
							</li>
						</ul>
					</aside>
					<section class="chat-dialog flex-item">
						<div class="flex-column full-col" style="background-color: #F5F5F5;" v-if="currMember.uuid">
							<div class="flex-row flex-line-center ph-15 pv-10" style="background: #fff;color: #414141;">
								<h3 class="flex-item" style="font-weight: 300;">当前正在为 {{currMember.nick}} 服务</h3>
								<button class="btn-block error">挂断</button>
							</div>
							<div class="msg-panel flex-item of-auto-y" >
								<ul class="msg-inner-list">
									<li class="msg flex-line-start" :class="{'flex-row-reverse r':item.from==uuid,'flex-row l':item.from == currMember.uuid}" v-for="item in msgs" v-if="item.from==currMember.uuid || item.to==currMember.uuid">
										<div class="user-photo circle small" :style="{backgroundImage:'url('+(item.from==uuid?user.photo:currMember.photo)+')'}"></div>
										<div class="msg-bullet" style="max-width: 60%;" v-html='formatMst(item.msg)'></div>
										<div class="flex-item"></div>
										
									</li>
								</ul>
							</div>
							<div class="pos-relative">
								<div class="tools flex-row ph-10">
									<button class="text pr-5" :class="{selected:inputType==1}" @click="handleInputTypeToggle(1)"><span class="iconfont">&#xe9a7;</span></button>
									<button class="audio pr-20" :class="{selected:inputType==2}" @click="handleInputTypeToggle(2)"><span class="iconfont">&#xe9a0;</span></button>
									<button class="emoji pr-5" @click="showEmojiPanel"><span class="iconfont">&#xe927;</span></button>
									<button class="file pr-5"><span class="iconfont">&#xe9a9;</span></button>
									<button class="capture"><span class="iconfont">&#xe9a8;</span></button>
									<span class="flex-item"></span>
									<button class="sender" :disabled="!msg"><span style="font-size: .14rem" @click="send">发送 ( Enter )</span></button>
								</div>
								<div class="emoji-list flex-row flex-wrap" tabindex="0" v-focus="focusEmoji" v-if="showEmoji" @blur="hideEmojiPanel">
									<span class="emoji" v-for="em in emojis" :key="em" @click="insertEmoji(em)">{{em}}</span>
								</div>
								<textarea class="inputer" v-model="msg" placeholder="输入聊天内容回车发送" @keypress.enter = "send();$event.preventDefault()"></textarea>
							</div>
						</div>
					</section>
				</div>
				<div class="full-col" v-if="currTab1==2">
					<aside class="tabs flex-row mh-15 mv-10">
						<span class="tab mr-10" :class="{selected:currTab2==1}" @click='currTab2=1'>等待中</span> |
						<span class="tab ml-10" :class="{selected:currTab2==2}" @click='currTab2=2'>已过期</span>
					</aside>
					<section class="member-list">
						<ul class="list">
							<li class="member flex-row flex-line-center pv-5 ph-15" v-for="member in waitings" :key="member.uuid" v-if="currTab2==1 && member.state==0 || currTab2==2 && member.state==-1">
								<div class="user-photo circle small mr-10" :style="{backgroundImage:'url('+member.photo+')'}"></div>
								<div class="flex-item">
									<div class="user-nick b3 mb-5">{{member.nick}}</div>
									<p class="tip ellipsis">{{'你好，请问...'}}</p>
								</div>
								<button class="btn-block success check-in" @click="checkIn(member)">接入</button>
							</li>
						</ul>
					</section>
				</div>
				<div class="full-col flex-column" v-if="currTab1==3">
					<aside class="tabs flex-row flex-main-center mh-15 mv-10">
						<span class="tab mr-10" :class="{selected:currTab3==1}" @click='currTab3=1'>账号设置</span> |
						<span class="tab mh-10" :class="{selected:currTab3==2}" @click='currTab3=2'>接入设置</span> |
						<span class="tab mh-10" :class="{selected:currTab3==3}" @click='currTab3=3'>离开设置</span> |
						<span class="tab ml-10" :class="{selected:currTab3==4}" @click='currTab3=4'>回复设置</span>
					</aside>
					<section class="user-info flex-item tab-box" v-if="currTab3==1">
						<div class="info-panel full-col of-hidden">
							<div class="user-photo circle large" :style="{backgroundImage:'url('+user.photo+')'}"></div>
							<div class="user-nick ma-20">{{user.nick}}</div>
							<div class="info ma-20 hor-left" style="line-height: 2">
								<p><label>部门：</label><span class="value">客服部</span></p>
								<p><label>职务：</label><span class="value">客服</span></p>	
								<p><label>显示昵称：</label><span class="value">客服01</span></p>
								<p><label>上线时间：</label><span class="value">03-10 09:30</span></p>		
							</div>
							<ul class="calc flex-row flex-main-around pt-10">
								<li>
									<div class="label">今日服务人数</div>
									<div class="value">0</div>
								</li>
								<li>
									<div class="label">今日回复总数</div>
									<div class="value">0</div>
								</li>
							</ul>
							<div class="hor-right mt-10">
								<a href="javascript:;">历史数据 > </a>
							</div>
							<div class="hor-center mt-50">
								<button class="btn-block warning mr-20" >客服下线</button>
								<button class="btn-block error" >退出系统</button>
							</div>
						</div>
					</section>
					<section class="checkin-pnl flex-item tab-box" v-if="currTab3==2">
						<dl class="setting-list">
							<dt>是否启用自动接入</dt>
							<dd><label><input type="radio"> 不启用自动接入，全部采用手动接入</label></dd>
							<dd><label><input type="radio"> 启用自动接入，即当等待回复的人数较少时，系统自动为你接入等待中的客户</label></dd>
						</dl>
						<dl class="setting-list">
							<dt>接入客户时，是否启用自动问候语</dt>
							<dd><label><input type="radio"> 不启用自动问候语</label></dd>
							<dd><label><input type="radio"> 启用自动问候语</label></dd>
							<dd class="mt-10"><input type="text" class="reply" placeholder="很高兴为您服务"></dd>
						</dl>
					</section>
					<section class="reply-pnl flex-item tab-box" v-if="currTab3==3">
						<dl class="setting-list">
							<dt>离开时是否启用自动回复</dt>
							<dd><label><input type="radio"> 不启用自动回复</label></dd>
							<dd><label><input type="radio"> 启用自动回复</label></dd>
						</dl>
						<dl class="setting-list">
							<dt>自动回复内容 <span class="tip ml-10">当处于离开状态时，系统将自动随机回复选中内容，最多设置五条自动回复</span></dt>
							<dd>你好，很高兴为您服务 <a class="del" href="javascript:;">[ 删除 ]</a></dd>
							<dd>你好，请先编辑你的问题描述  <a class="del" href="javascript:;">[ 删除 ]</a></dd>
							<dd class="flex-row flex-line-stretch mt-10">
								<input type="text" class="new-reply mr-10 flex-item" placeholder="很高兴为您服务">
								<button class="btn-block success btn-radius" style="height:auto">添加</button>
							</dd>
						</dl>
					</section>
					<section class="reply-pnl flex-item tab-box" v-if="currTab3==4">
						<dl class="setting-list">
							<dt>快带回复设置 <span class="tip ml-10">可在聊天服务窗口的发送按钮旁边选择，以代替打字输入</span></dt>
							<dd>你好，很高兴为您服务 <a class="del" href="javascript:;">[ 删除 ]</a></dd>
							<dd>你好，请先编辑你的问题描述  <a class="del" href="javascript:;">[ 删除 ]</a></dd>
							<dd class="flex-row flex-line-stretch mt-10">
								<input type="text" class="new-reply mr-10 flex-item" placeholder="很高兴为您服务">
								<button class="btn-block success btn-radius" style="height:auto">添加</button>
							</dd>
						</dl>
					</section>
				</div>
			</article>
			<footer></footer>
		</div>
		<div class="cr hor-center">
			{{'版权所有 © '+(new Date()).getFullYear()+' 拾补数据 '}}
		</div>
	</div>
</template>
<script>
	import http from '@/utils/http'
	export default {
		route:{
			meta:{
				tab:'仓鼠客服',
				header:false,
				aside:false,
			}
		},
		data() {
			return {
				rid:this.$route.query.r,
				room:null,
				msg:'',
				msgs:$$.catch.session('msgs')||[],
				showEmoji:false,
				focusEmoji:false,
				user:{
					id:91,
					photo:'https://res.shibu365.com/f/2018-12-08/341860dd2d2248b0a40cd0287a9367c2.jpg',
					nick:'云淡风轻',
					state:1,//0离开 1在线
				},
				members:[],
				wait:{
					reply:0,
					checkin:0,
				},
				uuid:$$.catch.session('contact-uuid')||0,
				emojis:[],
				currTab1:1,
				currTab2:1,
				currTab3:1,
				currMember:{},
				inputType:1,
			}
		},
		directives: {
		    focus: {
		        update: function (el, {value}) {
		            if (value) {
		                el.focus();
		            }
		        }
		    }
		},
		watch:{
			msgs:{
				handler(v){
					$$.catch.session('msgs',v)
					this.$nextTick(() => {
			        	var container = this.$el.querySelector(".msg-panel")
				        container.scrollTop = container.scrollHeight
				        console.log(container.scrollTop,container.scrollHeight)
				    })
				},
				deep:true
			},
			rooms:{
				handler:v=>{
					if (v.length>3) {
						if (this.swiper) {
							this.swiper.updateSlides()
						}
						else{
							this.buildSwiper()
						}
					}
					else{
						this.swiper && this.swiper.destroy()
						this.swiper = null
					}
				},
				deep:true
			}
		},
		computed:{
			waitings(){
				return this.members.filter((item)=>{
					return item.state<=0
				})
			},
			servings(){
				return this.members.filter((item)=>{
					return item.state>=1
				})
			}
		},
		sockets: {
	        connect() {
	            console.log((new Date).format('H:i:s:f'),':: 连接成功')
	            let param = {uid:this.user.id,room:'shop'}
	            if (this.uuid) {
	            	param.uuid = this.uuid
	            }
	            this.$socket.emit('login',param)
	        },
	        login(data){
	        	console.log((new Date).format('H:i:s:f'),':: 登录成功')
	        	if (data.uuid) {
	        		this.uuid = data.uuid
	        		$$.catch.session('contact-uuid',data.uuid)
	        	}
	        	this.members = data.list
	        },
	        visit(data){
	        	console.log((new Date).format('H:i:s:f'),':: 有访问到')
	        	this.members = data.list
	        },
	        checkin(data){
	        	this.members = data.list
	        },
	        message(msg){

				this.msgs.push(msg);
				console.log(msg)
			}
	    },
		mounted(){

			if (this.rid) {
				this.loadData(this.rid)
				this.$socket.open()
			}
			else{
				$$.ui.toast('参数错误',{icon:'error'})
				return
			}
		},
		methods:{
			loadData(rid){

				rid && http.request('back/contact/get_room_info',{id:rid},rlt=>{
					this.room = rlt.data.info
					this.emojis = rlt.data.emojis

				})
			},
			checkIn(member){
				this.$socket.emit('checkin',{cid:member.uuid})
			},
			send(){
				if (this.msg && this.currMember) {
					var msg = {msg:this.msg,dt:(new Date).format('H:i:s'),to:this.currMember.uuid,from:this.uuid}
					this.$socket.send(msg)
					this.msgs.push(msg)
					this.msg=''
				}
				else{
					$$.modal('请选择服务对象后再发送消息内容',{align:'center',cancel:false})
				}
			},
			formatMst(msg){
				return msg.replace(/\n|\r|\r\n|\n\r/g,'<br>')
			},

			showEmojiPanel(){
				this.showEmoji = true
				setTimeout(()=>{
					this.focusEmoji = true
				},100)
				
			},
			hideEmojiPanel(){
				this.focusEmoji = false
				this.showEmoji = false
			},
			handleInputTypeToggle(v){
				if(v==2){
					$$.ui.modal('当前不支持语音录入',{
						cancel:false,
						confirm:'知道了',
						align:'center',
						mask:true,
					})
					return
				}
				this.inputType = v
			},
			insertEmoji(em){
				this.msg += em
				this.showEmoji = false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#contact-dialog{
	position: fixed;
	left:0;
	right:0;
	top:0;
	bottom: 0;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url(https://res.shibu365.com/i/2019-03-07/07cbcb86b1e44edc969a4c813ec6e263.jpg);
	.dialog{
		width:10rem;
		height: 8rem;
		position:absolute;
		top:50%;
		left: 50%;
		margin-top:-4rem;
		margin-left: -5rem;
		background-color:rgba(255, 255, 255, 0.5);
		box-shadow:0 0 .05rem rgba(0,0,0,.5);
		border-radius:.05rem;
		overflow: hidden;
		.dlg-title {
		    background-color: #42494B;
		    color: #ffffff;
		    line-height: .5rem;

		    padding-right:.15rem;
		    font-size: .16rem;
		    .fun {
		    	padding: 0 .15rem;
			    cursor: pointer;
			    user-select: none;
			    .iconfont{
			    	font-size: 1em;
			    }
			    &:hover {
				    color: #FFC107!important;
				}
				&.selected {
				    color: #FF9800;
				}
				&.me{
					position:relative;
					padding-left:.3rem;
					&:before{
						position:absolute;
						content:"";
						width:.1rem;
						height:.1rem;
						border-radius:50%;
						border: .03rem solid #9e9e9e;
						top:50%;
						left:.15rem;
						margin-top: -.05rem;
					}
					&.online:before{
						border: .03rem solid #4CAF50;
						box-shadow: 0 0 .03rem #4CAF50;
					}

				}
			}
		}
		.dlg-body{
			.member-list{
				background-color:rgba(255,255,255,.5);
				.member{
					margin:.1rem 0;
					cursor: default;
				}
			}
			aside.member-list{
				.member{
					width:2rem;
					&:hover{
						background-color:rgba(0,0,0,.1)!important;
					}
					&.curr{
						background-color:rgba(0,0,0,.05);
					}
				}
			}
			.chat-dialog{
			    background-position: center 39%;
			    background-size: 30%;
			    background-repeat: no-repeat;
			    background-color: rgba(255,255,255,.3);
			    background-image:url(https://res.shibu365.com/i/2019-03-09/3c6b3d5207714b39824c1ecf14132588.png);

				.msg-panel{
					background-color:#f5f5f5;
				    overflow-y: auto;
				    height: 0;
					.msg {
					    padding: 0 .15rem;
					    margin: .15rem 0;
					    .user-photo {
						    margin: 0;
						}
						.msg-bullet {
						    padding: .08rem .1rem;
						    border-radius: .05rem;
						    line-height: 1.5;
						    font-size: .14rem;
						    min-height: .4rem;
						    position: relative;
						    &:before {
								content: "";
								position: absolute;
						    	width:.1rem;
						    	height:.1rem;
						    	transform: rotate(45deg);

						    	background-color:inherit;
						    	top:.2rem;
						    	margin-top:-.06rem;
							}
						}

					    &.l{
							.msg-bullet {
							    background-color: #ffffff;
							    border:.01rem solid #ededed;
							    margin-left: .2rem;
							    &:before {
									left: -.06rem;
									border-left:.01rem solid #ededed;
									border-bottom:.01rem solid #ededed;
								}
							}
						}
					    &.r{
							.msg-bullet {
							    background-color: #9EEA6A;
							    margin-right: .2rem;
							    &:before {
									right: -.05rem;
								}
							}
						}
					}
				}
			    .tools{
			    	position:absolute;
			    	top:.05rem;
			    	width:100%;
					button {
					    background-color: transparent;
					    border: none;
					    outline: none;
					    padding:.03rem .05rem;
					    font-size: .16rem;
					    &:not(:disabled){

						    &:hover{
						    	color:#FFC107!important;
						    }
						    &.selected{
						    	color:#FF9800;
						    }
					    }
					}
			    }
			    .emoji-list{
			    	position:absolute;
			    	bottom:100%;
			    	width:calc(100% - .2rem);
			    	left: .1rem;
			    	background-color:#ffffff;
			    	padding:.1rem;
				    border: 1px solid #e0e0e0;
				    border-radius: .05rem;
				    outline: none;
			    	&:after{
			    		content: "";
			    		width:.1rem;
			    		height: .1rem;
			    		transform: rotate(45deg);
			    		background-color:#fff;
					    left: 88px;
					    bottom: -5px;
					    position: absolute;
					    border-bottom: 1px solid #e0e0e0;
					    border-right: 1px solid #e0e0e0;
			    	}
			    	.emoji{
			    		display: inline-block;
			    		padding:.05rem;
			    		cursor: pointer;
			    		font-size: .16rem;
			    	}
			    }
			    .inputer {
				    background-color: transparent;
				    width: 100%;
				    height: 2rem;
				    border: none;
				    resize: none;
				    box-sizing: border-box;
				    border: .1rem solid transparent;
				    border-top-width: .41rem;
				    &:focus{
				    	background-color:#fff;
				    }
				}
			}
			.tabs{
				padding:.1rem .15rem;
				.tab{
					color:#414141;
					cursor: default;
					&:hover{
						color:#FFC107!important;
					}
					&.selected{
						color:#ff9800;
					}
				}
			}
			section.member-list{
				background-color:transparent;
				.member{
					background-color:rgba(255,255,255,.5);
					margin:.1rem .15rem;
					border-radius:.1rem;
					.check-in{
						display: none;
					}
					&:hover{
						box-shadow:0 0 .03rem rgba(0,0,0,.3);
						.check-in{
							display: block;
						}
					}
				}
			}
			.tab-box{
			    background-color: rgba(255,255,255,.5);
			    border-radius: .1rem;
			    margin: 0 .2rem .2rem;
			}
			section.user-info {
				.info-panel {
				    width: 3rem;
				    margin: 0 auto;
				    text-align: center;
				    .user-photo{
				    	margin:.5rem auto .2rem;
				    }
				    .user-nick{
				    	font-size: .2rem;
				    }
				    .info{
				    	label{
				    		width:1rem;
				    		display: inline-block;
				    		text-align: right;
				    		color:#000000;
				    	}
				    	.value{
				    		color:#616161;
				    	}
				    }
				    .calc{
				    	border-top: .01rem solid #b0b0b0;
				    	border-bottom: .01rem solid #b0b0b0;

				    	.label{
				    		font-size: .14rem;
				    		color:#888;
				    	}
				    	.value{
				    		font-size: .18rem;
				    		margin:.1rem 0;
				    	}
				    }
				}
			}
			.setting-list{
			    margin: .2rem;
			    line-height: 3;
			    input[type="radio"]{
			    	margin-right: .1rem;
			    }  
			    input[type="text"]{
				    border: none;
				    background-color: #d0d0d0;
				    height: .45rem;
				    display: block;
				    border-radius: .05rem;
				    &.reply{
					    width: calc(100% - .3rem);
					    margin-left: .3rem;
				    } 
				}
				a.del{
					color:#FF5722;
					&:hover{
						text-decoration: underline;
					}
				}
			}
		}
	}
	.cr{
		position:absolute;
		bottom:0;
		line-height: 4;
		width:2rem;
		left:50%;
		margin-left:-1rem;
		color:#e0e0e0;
		font-weight: 300;
	}
}
</style>