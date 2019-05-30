<template>
	<table class="data-table full-width" cellspacing="0">
		<thead>
			<slot name = "thead">
				<data-head :columns = "columns" :setting="setting"/>
			</slot>
		</thead>
		<tbody v-if="!loading">
			<slot>
				<tr v-for="(row,index) in dataset" :key="row.id||index">
					<template v-for="col in columns" v-if="col.visible!==false">
						<td-status :status.sync="row[col.field||'status']" :actions="col.status?(col.status.actions||editActions):editActions" :tags="col.status?(col.status.tags||statusTags):statusTags" :editable="col.status?(col.status.editable||editable):editable" @data-edit="$emit('row-edit',row)" @data-del="$emit('row-del',row)" v-if="col.buildIn=='status'"/>
						<td :class="col.class" v-html="col.render(row[col.field]||row,row)" :align="col.align||'left'" v-else-if="col.render"  >
						</td>
						<td :class="col.class" v-html="format(row,col.format)" :align="col.align||'left'" v-else-if="col.format" >
							{{format(row,col.format)}}
						</td>
						<td :class="col.class" :align="col.align||'left'" v-else-if="col.field">
							{{row[col.field]}}
						</td>
						<td :class="col.class" :align="col.align||'left'" v-else>&nbps;</td>
					</template>
				</tr>
			</slot>
		</tbody>
		<tfoot style="background:#ffffff">
			<slot name = "tfoot"></slot>
			<tr v-if="!loading && pagi">
				<td :colspan="visibleColumns">
				<data-pagi  :page="pagi" :list="false" @poe-pagi-change="$emit('page-change',$event)"></data-pagi>

				</td>
			</tr>
			<tr v-if="loading">
				<td :colspan="visibleColumns">
					<delay-loading>数据加载中</delay-loading>
				</td>
			</tr>
			<tr v-else-if="loadEmpty">
				<td :colspan="visibleColumns">
					<tip class="dp-block mv-50 hor-center" style="height: .3rem;line-height: .3rem;">{{loadEmpty===true?'== 当前无数据 ==':loadEmpty}}</tip>
				</td>
			</tr>
			<tr  v-else-if="loadEnd">
				<td :colspan="visibleColumns">
					<tip class="dp-block mv-10 hor-center">{{loadEnd===true?'== 没有更多数据了 ==':loadEnd}}</tip>
				</td>
			</tr>
		</tfoot>
	</table>
</template>
<script>
	export default {
		props:{
			columns:{type:Array},
			dataSet:{type:Array},
			url:String,
			param:Object,
			pagi:Object,
			loading:false,
			loadEnd:false,
			loadEmpty:false,
			editActions:{
				type:[Array,String],
				default:function(){
					return ['toggle','edit','del']
				},
			},
			statusTags:{
				type:Object,
				default:function(){
					return {'1':{color:'success',label:'正常'},'0':{color:'error',label:'冻结'}}
				},
			},
			editable:{
				type:Boolean,
				default:true,
			},
			setting:{
				default:false
			}
		},
		data() {
			return {
				dataset:this.dataSet||[]
			}
		},
		computed:{
			
			visibleColumns(){
				var count=0
				$$.each(this.columns,(index,item)=>{
					if (item.visible!==false) {
						count++
					}
				})
				return count
			}
		},
		created:function(){
			this.search = function(e){
				console.log(e)
			}
		},
		mounted:function(){
			this.loadData()
		},
		methods:{
			loadData:function(){
				if(!this.dataSet && this.url){
					$$.ui.loading()
					this.request(this.url,this.param,{
						success:rlt=>{
							this.dataset = rlt.data
							$$.ui.hide()
						}
					})
				}

				
			},
			format(row,fmt){
				var fields = fmt.match(/(?!\{)[a-z_A-Z]\w*(?=\})/g)
				if (!fields || fields.length<=0) {
					return fmt
				}
				for(var i = 0; i < fields.length; i++){
					fmt = fmt.replace('{'+fields[i]+'}',row[fields[i]]||'--')
				}
				return fmt
			}
		}
	}
</script>
<style lang="scss">
</style>