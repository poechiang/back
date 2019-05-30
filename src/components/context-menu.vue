<template>
	<div  id="context-menu" :style="menuStyle">
		<ul class="list">
			<template v-for="(item, index) in items">
				<li class="mitem" :disabled="item.disabled" v-if="item.visiabled">
					<a href="javascript:;" v-if="item.disabled"><icon class="mr-10" :face="item.icon" />{{item.label||item}}</a>
					<a :class="item.key" href="javascript:;" @click="clickMItem(item,$event)" v-else><icon class="mr-10" :face="item.icon"/>{{item.label||item}}</a>
				</li>
			</template>
		</ul>
	</div>
</template>
<script>
	export default {
		props:['items','show','context'],
		data() {
			return {
				openned:this.show,
				left:0,
				top:0,
			}
		},
		watch:{
			show(v){
				this.openned = v
			}
		},
		created(){
			document.oncontextmenu=(e)=>{
				if($(e.target).closest(this.context||'body').length>0) {
					this.left = e.clientX+'px'
					this.right = e.clientY+'px'
					this.$emit('update:show',true)
					return false
				}
				else{
					this.$emit('update:show',false)
				}
				
			}
			document.onclick=(e)=>{
				this.openned=false
				this.$emit('update:show',false)
			}
		},
		watch:{
			show(v){
				this.openned = v
			}
		},
		computed:{
			menuStyle(){
				var style = {
					display:this.openned?'block':'none',
					left:this.left,
					top:this.right,
				}
				return style
			}
		},
		methods:{
			clickMItem(item,e){
				event.data = item
				this.$emit('item-click',e)
			}
		},
	}
</script>

<style scoped lang="scss">
#context-menu{
	display: none;
	position: fixed;
	border-radius: .05rem;
	box-shadow: 0 0 .05rem rgba(0,0,0,.5);
	z-index: 101000;
	overflow: hidden;
	.list{
		background-color:#fff;

		.mitem{
			font-size:.14rem;
			line-height: .3rem;
			a{
				display:block;
				height:100%;
				padding:0 .1rem;
				color:#414141;
				&:hover{
					background-color:#62A8EA;
					color:#ffffff;
				}
			}
			&[disabled]{ 
				a{
					color:#b1b1b1;
					background-color:transparent;
					cursor: not-allowed;
				}
			}

		}
	}
	&.shown{
		display: block;
	}
}
</style>