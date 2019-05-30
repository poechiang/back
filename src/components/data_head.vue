<template>
	<tr>
		<template v-for="(col,index) in columns">
			<col-head  :col="col" :cols="columns" :setting="setting" v-if="setting && index==0"/>
			<col-head  :col="col" v-else/>
		</template>
	</tr>
</template>
<script>
	export default {
		props:{
			columns:{
				type:Array,
				require:true,
			},
			setting:{
				type:Boolean,
				default:true,
			}

		},
	}
</script>