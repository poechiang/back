<template>
	<footer id="copyright" class="poeui-content-outter dp-table mt-20">
		<div class="dp-table-cell ver-middle">
			<ul class="links flex-row flex-line-start">
				<li>{{copyright}}</li>
				<li class="ml-20"><a href="http://www.miitbeian.gov.cn" target="_blank">{{ban}}</a></li>
				<li class="flex-item"></li>
				<li class="link" v-for="(link,index) in links" :key="index">
					<a :href="link.href" v-if="link.href">{{link.label}}</a>
					<a href="javascript:;" @click="msg" v-else>{{link.label}}</a>
				</li>
			</ul>
		</div>
	</footer>
</template>
<script>
	export default {
		data() {
			return {
				copyright: '版权所有 © '+(new Date()).getFullYear()+' 拾补数据 ',
				ban:'浙ICP备17033699号-2',
				links:[{
					label:'服务协议'
				},{
					label:'运营中心'
				},{
					label:'产品手册'
				},{
					label:'仓鼠客服'
				},{
					href:'/contact/dialog',
					label:'联系我们'
				},{
					label:'关于仓鼠盒子'
				}]
			}
		},
		methods:{
			msg:function(){
				$$.ui.modal('相关内容正在准备',{textAlign:'center',mask:true,cancel:false,confirm:false})
			}
		}
	}
</script>
<style scoped lang="scss">
#copyright {
	font-size: .14rem;
    margin: 0 .65rem;
    width:calc(100% - 1.3rem);
    height: .6rem;
	border-top: .01rem solid #e7e7e7;
	.links {
		a {
			&:link,
			&:visited {
				color: #888888;
			}

			&:hover,
			&:active {
				color: #FF5722;
			}

			&:hover {
				text-decoration: underline;
			}

		}

		.link {
			a {
				margin: 0 .1rem;
			}

			&:not(:last-child) {
				border-right: .01rem solid #e7e7e7;
			}

		}

	}

}
</style>
