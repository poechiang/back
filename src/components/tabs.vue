<template>
	<aside class="poeui-content-tabs">
		<ul class="list flex-row"><!-- :class="{'flex-main-center':align=='center'}" v-if="type == 'button'" -->
			<li class="tab" :class="{selected:value==(item.value!==undefined?item.value:index)}" @click="$emit('change',(item.value!==undefined?item.value:index));" v-for="(item,index) in items" :key="item.value===undefined?item:item.value">{{item.label||item}}</li>
		</ul>
	</aside>
</template>
<script>
	export default {
		model:{
			prop:'value',
			event:'change',
		},
		props:['items','value','align','type'],
		data(){
			return {
			}
		},
	}
</script>