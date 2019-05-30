<template>
	<td class="td-status pos-relative of-hidden" :class="{'editable':editable}">
		<template v-if="status===false">
			<div class="action" v-if="editable">
				<a href="javascript:;" :title="op.title||op" @click="handleOp(key)" v-if="op!==false" v-for="(op,key) in adjustActions" :key="op.title||op||key" >
					<span class="iconfont small" v-html="op.icon" v-if="op.icon" :style="{color:op.color||'inherit'}"></span>
					<span v-else :style="{color:op.color||'inherit'}">{{op.title||op}}</span>
				</a>
			</div>
			<div class="hor-center" v-else>
				<slot>
					<tip>--</tip>
				</slot>
			</div>
		</template>
		<template v-else>
			<div class="status anim">
				<slot>
					<span class="status-tip " :class="item.color" v-if="value==(item.value || index)" v-for="(item,index) in options.status" :key="item.value || index">{{item.title||item}}</span>
				</slot>
			</div>
			<div class="action anim" v-if="editable">
				<template v-if="toggle!==false">
					<a class="op-off" href="javascript:;" :title="adjustToggle.off" @click="handleToggle(0)" v-if="value==1"></a>
					<a class="op-on"href="javascript:;" :title="adjustToggle.on"  @click="handleToggle(1);" v-else></a>
				</template>
				<a href="javascript:;" :title="op.title||op" @click="handleOp(key)" v-if="op!==false" v-for="(op,key) in adjustActions" :key="op.title||op||key" >
					<span class="iconfont small" v-html="op.icon" v-if="op.icon" :style="{color:op.color||'inherit'}"></span>
					<span v-else :style="{color:op.color||'inherit'}">{{op.title||op}}</span>
				</a>
			</div>
		</template>
	</td>
</template>
<script>
	const defActions={
		edit:{
			title:'编辑',
			color:'#62A8EA',
			icon:'&#xe623;'
		},
		del:{
			title:'删除',
			color:'#F96868',
			icon:'&#xe889;'
		},
	},
	defToggle = {
		on:'切换状态',
		off:'切换状态'
	}
export default {
	model:{
		prop:'value',
		event:'change',
	},
	props: {
		value:{
			type:[Number,String],
			default(){
				return 1
			},
		},
		toggle:{
			type:[Object,Boolean],
			default(){
				return defToggle
			}
		},
		actions:{
			type:[Object,Boolean],
			default(){
				return defActions
			},
		},
		status:{
			type:[Object,Array,String,Boolean],
			default:'冻结,正常',
		},
		editable:{
			type:Boolean,
			default:true,
		},
	},
	data(){
		var status = this.status,
			actions = this.actions
		if ($$.isString(status)) {
			status = status.split(',')
		}
		status = $$.extend(true,{},status)
		for(var x in status){
			if ($$.isString(status[x])) {
				status[x]={
					color:x==='0'?'error':(x==='1'?'success':'default'),
					title:status[x]
				}
			}
			else{
				delete(status[x])
			}
		}
		for(var x in status){
			if ($$.isString(status[x])) {
				status[x]={
					color:x==='0'?'error':(x==='1'?'success':'default'),
					title:status[x]
				}
			}
		}


		return {
			options:{
				status:status
			}
		}
	},
	computed:{
		adjustActions(){
			return this.actions===true?defActions:this.actions
		},
		adjustToggle(){
			return this.toggle===true?defToggle:this.toggle
		}
	},
	methods:{
		handleToggle(v){
			this.$emit('change', v)
			this.$emit('operate', {event:'toggle',detail:v})
		},
		handleOp(e,v){
			this.$emit('data-'+e)
			this.$emit('operate', {event:e,detail:v})
		}
	}
}

</script>
<style scoped lang="scss">

	.action {
		a {
			margin:0 .05rem;
			&:before {
				font-family: iconfont !important;
				font-size: 1em;
				font-style: normal;
				-webkit-font-smoothing: antialiased;
			}

			&.op-on {
				color: #46BE8A;

				&:before {
					content: "\e7b9";
				}

			}

			&.op-off {
				color: #F2A654;

				&:before {
					content: "\e7b8";
				}

			}

		}
	}
</style>
