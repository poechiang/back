<template>
	<label class="onoff dp-inline-block " :class="{disabled:disabled}" @click="handleClick" style="cursor:default;white-space:nowrap;">
		<span class="bar dp-inline-block" :class="{checked:isChecked}" :disabled="disabled" :style="backStyle"><span class="thumb" :style="thumbStyle"></span></span>
		<span :style="tipStyle"><slot></slot></span>
	</label>
	
</template>
<script>
	export default{
		model:{
			prop:'checked',
			event:'change'
		},
		name:'onoff',
		props:['value','on','off','color','disabled','width','checked'],
		data(){
			return {
			}
		},
		computed:{
			isChecked(){
				if ($$.isArray(this.checked)) {
					return this.checked.indexOf(this.value)>=0
				}
				return this.on===undefined?this.checked:(this.on===this.checked)
			},
			backStyle(){
				if (this.color && this.isChecked) {
					return {
						backgroundColor:this.color,
						borderColor:this.color
					}
				}
				return {}
			},
			thumbStyle(){
				if (this.color && this.isChecked) {
					return {
						boxShadow:'0 0 0.07rem ' + this.color
					}
				}
				return {}
			},
			tipStyle(){
				var style = {
					color:'#bbb!important',
					'padding-left':'.05rem',
				}
				if (this.isChecked) {
					style.color=this.color || '#E83227!important'
				}
				return style
			}
		},
		methods:{
			handleClick(){
				if (this.disabled) {
					return
				}
				if ($$.isArray(this.checked)) {
					var index = this.checked.indexOf(this.value),
						list = this.checked.slice(0)
					if (index>=0) {
						list.splice(index,1)
					}
					else{
						list.push(this.value)
					}
					
					this.$emit('change',list)
				}
				else{
					this.$emit('change',this.isChecked?(this.off===undefined?false:this.off):(this.on===undefined?true:this.on))
				}
				
			}
		},
	}
</script>
<style scoped lang="scss">
	@import '@/assets/css/mixin.scss';
	.onoff {
		line-height: initial;
		.bar {
		    -webkit-appearance:none;
		    outline: none;
		    background: #fff;
		    vertical-align: -5px;
		    border-radius: .15rem!important;
		    position: relative;
		    cursor: pointer;
		    height: .2rem!important;
		    width: .4rem!important;
		    border: .01rem solid #e0e0e0!important;
		    @include transition(all,.2s);
		    &[disabled]{
		        border:1px solid #ECEFF1!important;
		    }
		    .thumb {
		        background-color: #fff;
		        position: absolute;
		        bottom: 0;
		        top: 0;
		        left: 0;
		        width: .18rem;
		        border-radius: 50%;
		        @include boxShadow(.1rem,rgba(0,0,0,.2));
		        @include transition(all,.2s);

		    }
		    &.checked{
		        background: #E83227 !important;
		    	border: 1px solid #E83227 !important;
		        &[disabled]{
		            background: #CFD8DC!important;
		            border: 1px solid #CFD8DC!important;
		        }
		        .thumb {
		            background-color: #fff;
		            bottom: 0;
		            top: 0;
		            width: .18rem;
		            left: 50%;
		            @include boxShadow(.07rem,#E83227);
		        }
		    }
		}
		&.disabled *{
			cursor: not-allowed !important;

		}
	}
</style>