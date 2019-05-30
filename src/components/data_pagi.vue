<template>
	<div class="paginate"> 
		<template v-if="page && page.total>0">
			<span class="mr-10" v-if="page.total>0">
				总计 {{page.total}} 条
				<drop v-model="page.rows" v-if="rowList.length>0" place-holder="选择每页记录数" :items="rowList" @change="onRowsChange"/>
			</span>
			<template >
				<span class="item curr" v-if="1==page.curr"> 1 </span>
				<a class="item def" href="javascript:;" @click="go(1)" v-else> 1 </a>
				<span class="item ellipsis" v-if="showStartEllipsis"> … </span>
			</template>

			<template v-for="i in page.last">
				<template v-if="i>=minValue && i<=maxValue">
					<span class="item curr" v-if="i==page.curr"> {{ i }} </span>
					<a class="item def" href="javascript:;" @click="go(i)" v-else> {{ i }} </a>
				</template>
			</template>

			<template v-if="page.last>1">
				<span class="item ellipsis" v-if="showEndEllipsis"> … </span>
				<span class="item curr" v-if="page.last==page.curr"> {{ page.last }} </span>
				<a class="item def" href="javascript:;" @click="go(page.last)" v-else> {{ page.last }} </a>
			</template>

			<span class=" bdr" v-if="page.last>9">
				<input v-model="jumpTo" @keypress="onJumpChange">
				<button class="go iconfont small" @click="jump" :disabled="page.curr==jumpTo"> &#xe988; </button>
			</span>
		</template>
	</div>
</template>
<script>
	export default {
		props:['page','list'],
		data(){
			var page_list

			if (this.list) {
				page_list=this.list
			}
			else{
				if (this.list===false) {
					page_list=[]
				}
				else{
					page_list = [{
						value: 10,
						label: '10 条 / 页',
					},{
						value: 20,
						label: '20 条 / 页',
					},{
						value: 40,
						label: '40 条 / 页',
					},{
						value: 60,
						label: '60 条 / 页',
					},{
						value: 80,
						label: '80 条 / 页',
					}]
				}
			}

			return {
				rowList:page_list,
				jumpTo:(this.page||{}).curr,
			}
		},
		watch:{
			page(v){
				this.jumpTo=(v||{}).curr
			},
			list(v){
				var page_list

				if (v) {
					page_list=v
				}
				else{
					if (v===false) {
						page_list=[]
					}
					else{
						page_list = [{
							value: 10,
							label: '10 条 / 页',
						},{
							value: 20,
							label: '20 条 / 页',
						},{
							value: 40,
							label: '40 条 / 页',
						},{
							value: 60,
							label: '60 条 / 页',
						},{
							value: 80,
							label: '80 条 / 页',
						}]
					}
				}

				this.rowList=page_list
			}
		},
		computed:{
			showStartEllipsis(){
				return this.page && this.page.last>=5 && this.page.curr >=5
			},
			showEndEllipsis(){
				return this.page && this.page.last>=5 && this.page.curr < this.page.last - 3 
			},
			minValue(){
				return this.page?Math.max(2,this.page.curr-2):1
			},
			maxValue(){
				return this.page?Math.min(this.page.last-1,parseInt(this.page.curr)+2):1
			}
		},
		methods:{
			jump(){
				this.$emit('page-change',{page:this.jumpTo,rows:this.page.rows})
			},
			onJumpChange(e){
				if (e.keyCode==13) {
					this.$emit('page-change',{page:this.jumpTo,rows:this.page.rows})
				}
			},
			go(index){
				this.$emit('page-change',{page:index,rows:this.page.rows})
			},
			onRowsChange(){
				this.$emit('page-change',{page:this.page.curr,rows:this.page.rows})
			}
		}
	}
</script>
<style scoped lang="scss">
	.paginate{
		/*background-color:#fff;*/
		text-align:right;
		.item{
			line-height:.16rem;
			height:.16rem;
			text-align:center;
			display:inline-block;
			width:.16rem;
			&.curr{
				font-weight:bolder;
			}
		}
		a.item{
			color:#2196F3;
			
		}
		.bdr {
			border: .01rem solid #e7e7eb;
			position:relative;
			display:inline-block;
			padding-right:.32rem;
			margin-left:.1rem;
			input{
				width: .5rem;
			    text-align: center;
			    border: none;
			    border-right: 1px solid #E0E0E0;
			    height: .2rem;
			    margin: .04rem 0;
			    display:block;
			}
			button.go{
				width: .28rem;
			    height: .28rem;
			    position: absolute;
			    top: 0;
			    right: 0;
			    border: none;
			    background-color: transparent;
			    border-left: none;
			    color: #888;
			    outline: none;
			}
		}
	}
</style>