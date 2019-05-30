<template>
	<div class="good-selector flex-column">
		<div class="flex-row flex-line-center flex-main-center mb-20">
			<search  @search="doSearchGood" :buttons="false" v-model="keys"/>
			<button class="btn-block theme ml-10" :disabled="!keys" @click="doSearchGood">查找</button>
		</div>

		<div class="flex-item">
			<data-table :columns="[{title:'产品名称',align:'left'},'生产商','供应商','价格',{title:'操作',width:100}]" :setting="false" style>
				<template v-for="(row,index) in goods">
					<tr>
						<td style="line-height: 1.5"  :title="row.title"><img class="f-left mr-10" height="40" width="40" :src="row.heads[0]" v-if="row.heads && row.heads.length>0">
							<div v-html="row.abbr||row.title"></div>
							<tip class="mt-5" size="12" v-html="row.cata_title"></tip>
						</td>
						<td class="hor-center" v-html="row.manufacturer||'--'"></td>
						<td class="hor-center" v-html="row.supplier||'--'"></td>
						<td class="hor-center" style="white-space: nowrap;">￥{{row.retail_price}}</td>
						<td class="hor-center"><input type="radio" :checked="locale && row.id === locale.id" @change="locale = row"></td>
					</tr>
				</template>
			</data-table>
			<delay-loading class="mv-20" v-if="searching">正在检索产品……</delay-loading>
			<div class="mv-20 hor-center" v-else-if="goods.length<=0">
				<tip >输入产品关键字点击查找</tip>
			</div>
		</div>
		<div class="hor-center mt-50">
			<button class="btn-block btn-round theme" :disabled="goods.length<=0 || !locale" style="width:1rem;" @click="selectGood">确定</button>
		</div>
	</div>
</template>
<script>
	import http from '@/utils/http'
	const urls={
		goods:'back/good/for_keys',
	}

	export default {
		data() {
			var id = this.$route.query.id
			return {
				searching: false,
				changed:false,
				locale: null,
				keys:'',
				goods:[],
				currGood:null,
			}

		},
		watch:{
			locale(v){
				this.changed=true
			}
		},
		methods:{
			doSearchGood(e){
				this.searching=true
				http.request(urls.goods,{
					keys:this.keys.split(' '),
					mark:true,
					fields:'title abbr group_title group_label supplier manufacturer'.split(' ')
				},(rlt)=>{
					if (rlt.status==1) {
						this.goods = rlt.data
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
					this.searching = false
				})
			},
			selectGood(){
				this.$emit('change',this.locale)
			},
		}
	}
</script>
<style lang="scss">

</style>