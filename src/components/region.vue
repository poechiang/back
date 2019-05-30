<template>
	<div class="region flex-row">
		<select class="hor-center flex-item" v-model="prov" :disabled="regions.length<=0" v-if="mode.indexOf('prov')>=0">
			<option value="0">省份</option>
			<option :value="(prov.code+'').substr(0,2)" v-for="prov in regions" :key="prov.code">{{prov.name}}</option>
		</select>
		<select class="hor-center flex-item" v-model="city" :disabled="currProv.children&&currProv.children.length<=0" v-if="mode.indexOf('city')>=0">
			<option value="0">城市</option>
			<option :value="(city.code+'').substr(2,2)" v-for="city in currProv.children" :key="city.code">{{city.name}}</option>
		</select>
		<select class="hor-center flex-item" v-model="dist" :disabled="currCity.children&&currCity.children.length<=0" v-if="mode.indexOf('dist')>=0">
			<option value="0">区县</option>
			<option :value="(dist.code+'').substr(4,2)" v-for="dist in currCity.children" :key="dist.code">{{dist.name}}</option>
		</select>
	</div>
</template>
<script>
	export default{
		model:{
			prop:'value',
			event:'change'
		},
		props:{
			value:{
				type:String,
				default:'',
			},
			mode:{
				default(){
					return ['prov','city','dist']
				}
			}
		},
		data(){
			let d={
				ready:false,
				regions:$$.catch.local('region')||[],
				has:{
					prov:this.mode.indexOf('prov')>=0,
					city:this.mode.indexOf('city')>=0,
					dist:this.mode.indexOf('dist')>=0,
				},
				evt:true
			}
			if (d.has.prov) {
				d.prov = this.value.substr(0,2)||0
			}
			if (d.has.city) {
				d.city = this.value.substr(2,2)||0
			}
			if (d.has.dist) {
				d.dist = this.value.substr(4,2)||0
			}
			return d
		},
		computed:{
			provCode(){
				return (this.prov||'').toString()
			},
			cityCode(){
				return this.provCode+(this.city||'').toString()
			},
			distCode(){
				return this.cityCode+(this.dist||'').toString()
			},
			currProv(){
				if (!this.has.prov) {
					return {}
				}
				return this.regions.get(this.provCode,'code')||{}
			},
			currCity(){

				if (!this.has.city) {
					return {}
				}
				return this.currProv.children?(this.currProv.children.get(this.cityCode,'code')||{}):{}
			},
			currDist(){
				if (!this.has.dist) {
					return {}
				}
				return this.currCity.children?(this.currCity.children.get(this.distCode,'code')||{}):{}
			}
		},
		watch:{
			value(v){
				v=v.toString()
				this.evt=false
				if (this.has.prov) {
					this.prov = v.length>=2?v.substr(0,2):0
				}
				if (this.has.city) {
					this.city = v.length>=4?v.substr(2,2):0
				}
				if (this.has.dist) {
					this.dist = v.length>=6?v.substr(4,2):0
				}

				this.evt = true

			},
			dist(v){
				if (!this.ready ||!this.evt) {
					return
				}
				this.$emit('change',this.distCode)
				this.$emit('select',{
					code:this.distCode,
					prov:this.currProv.name||'',
					city:this.currCity.name||'',
					dist:this.currDist.name||''
				})
			},
			prov(v){
				if (!this.ready ||!this.evt) {
					return
				}

				this.$emit('change',this.provCode)
				this.$emit('select',{
					code:this.provCode,
					prov:this.currProv.name||'',
					city:this.currCity.name||'',
					dist:this.currDist.name||''
				})
			},
			city(v){
				if (!this.ready ||!this.evt) {
					return
				}
				this.$emit('change',this.cityCode)
				this.$emit('select',{
					code:this.cityCode,
					prov:this.currProv.name||'',
					city:this.currCity.name||'',
					dist:this.currDist.name||''
				})
			},
		},
		mounted:function(){
			if(this.regions.length<=0){
				this.loadData()
			}
			else{
				this.ready = true
			}
		},
		methods:{
			loadData:function(){
				var regions = $$.catch.local('region')||[]
				if (regions.length<=0) {
					this.request('index/index/region_info',null,rlt=>{
						this.regions = rlt.data
						this.ready = true
						$$.catch.local('region',rlt.data)
					})
				}
				else{
					this.regions = regions
					this.ready = true
				}
			}
		},
	}
</script>
<style lang="scss">
	.region{
		width:4.7rem;
		select:not(:first-child){
			margin-left:.1rem;
		}
	}
</style>