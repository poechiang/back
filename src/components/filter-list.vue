<template>
	<div class="filter-list pos-relative" :class="{shown:dropShow}">
		<input v-model="filter" :placeholder="placeholder" @focus="handleDrop" @blur="handleComplete('blur')" @keydown.enter="handleComplete('enter')">
		<span class="arrow-down iconfont">&#xe80b;</span>
		<ul class="drop">
			<li class="item" :class="{selected:index===currentIndex}" v-for="(item,index) in items" :key="index" v-if="!regex || (item[label]||item).match(regex)" v-html="(item[label]||item).replace(regex,'<mark>'+filter+'</mark>')" @click="handleComplete(item)"></li>
		</ul>
	</div>
</template>
<script>
	export default{
		model:{
			prop:'current',
			event:'change'
		},
		props:{
			items:{
				type:Array,
				default:[]
			},
			current:{
				type:[Object,String,Number],
				default:'',
			},
			value:{
				type:String,
				default:'value',
			},
			label:{
				type:String,
				default:'label'
			},
			placeholder:{
				default:'(未设置)',
			},
		},
		data(){
			var f = this.refreshFilter(this.items,this.current)
			return {
				filter:f,
				regex:f?new RegExp(f,'g'):null,
				dropShow:false,
				currentIndex:0
			}
		},
		watch:{
			filter(v){
				var curr=0
				var reg = v?new RegExp(v,'g'):null
				$$.each(this.items,(index,item)=>{
					if (!reg||(item[this.label]||item).match(reg)) {
						curr = index
						return false
					}
				})
				this.regex = reg
				this.currentIndex= curr
			},

			current(v){
				this.filter=this.refreshFilter(this.items,v)
			},
			items(v){
				this.filter=this.refreshFilter(v,this.current)
			}
		},
		methods:{
			refreshFilter(items,curr){

				var index = curr?items.indexOf(curr,this.value):-1,
					_curr,f
				if (index>=0) {
					_curr = this.items[index],
					f = _curr[this.label]||_curr||this.current
				}
				else{
					f=curr
				}
				return f
			},
			handleComplete(e){
				if(!this.dropShow){
					return
				}
				if (e=='blur') {
					setTimeout(()=>{
						if (this.dropShow) {
							var curr = this.items[this.currentIndex];
							this.$emit('change',curr[this.value]||curr)
							this.dropShow = false
						}
					},200)
				}
				else if(e=='enter'){
					this.dropShow=false	
					var curr = this.items[this.currentIndex];
					this.$emit('change',curr[this.value]||curr)
				}
				else if(e){
					this.dropShow=false	
					this.$emit('change',e[this.value]||e)
				}
			},
			handleDrop(){
				this.dropShow=true
			}
		}
	}
</script>
<style scoped lang="scss">
	.filter-list {
		.arrow-down{
			position:absolute;
			width:.2rem;
			height: .2rem;
			line-height: .2rem;
			text-align: center;
			top:50%;
			margin-top:-.1rem;
			right:.05rem;
			display: none;
		}
		.drop{
			position:absolute;
			display: none;
			width:100%;
			top:calc(100% + .03rem);
			z-index: 100020;
			box-shadow: 0 0 .03rem #efefef;
			background-color:#fff;
			.item{
				padding:0 .05rem;
				line-height: 2;
				&:hover{
					background-color:#f8f8f8;
				}
				&.selected{
					background-color:#f8f8f8;
				}
			}	
		}
		&.shown{
			.drop{
				display: block;
			}
		}
		&:hover{
			.arrow-down{
				display: block;
			}
		}
	}
</style>
