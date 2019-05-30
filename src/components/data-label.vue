<template>
	<span class="data-label" :style="{display:display}">
		<label :style="label">{{this.title}}</label>
		<template v-if="value">{{value}}</template>
		<tip v-else>{{nullValue}}</tip>
	</span>
</template>
<script>
	export default{
		props:{
			value:Object,
			title:{
				type:String,
				default:'',
			},
			nullValue:{
				type:String,
				default:'- -',
			},
			display:{
				type:String,
				default:'inline-block'
			},
			label:Object
		},
		data(){
			return {
			}
		}
	}
</script>
<style scoped lang="scss">

	.data-label{
		color:#414141;
		&>label{
			display: inline-block;
		    color: #607D8B;
		    white-space: nowrap;
		}
	}
</style>