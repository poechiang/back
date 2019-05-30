<template>
	<div class="popup" :class="{showing:isOpened}" :title="title">
		<a class="btn def  pv-15" href="javascript:;" @click="showPop">
			<slot name="label">{{label}}</slot>
			<span class="icon iconfont small def" v-html="isOpened?'&#xea50;':'&#xea4f;'" v-if="arrow!==false"></span>
		</a>
		<transition enter-active-class="animated speed-2 fadeInUp" leave-active-class="animated speed-2 delay-2 fadeOutDown" @after-enter="onPopupShown">	
			<div class="pop-panel hor-left" tabindex = "0" v-focus="shown" v-if="isOpened" @focusout="onBlur"><!--  -->
				<slot></slot>
			</div>
		</transition>
	</div>
</template>
<script>
	export default {
		props:['label','title','autoClose','auto','arrow'],
		data(){
			return {
				isOpened:false,
				shown:false,
			}
		},
		directives: {
		    focus: {
		        update: function (el, {value}) {

		            if (value) {
		                el.focus();
		            }
		        }
		    }
		},
		methods:{
			onPopupShown(){
				this.shown=true
			},
			onBlur(){
				if (this.autoClose!==false) {
					this.hidePop()
				}
			},
			showPop:function(){
				this.isOpened=true
			},
			hidePop:function(){
				this.isOpened=false
				this.shown=false
			},
			itemClick(item){
				this.$emit('poe-item-click',{item:item,value:item.value})
				this.$emit('change',item.value)

				if (this.autoClose!=false) {
					if (item.autoClose!==false) {
						this.hidePop()
					}
				}
				else{
					if (item.autoClose===true) {
						this.hidePop()
					}
				}
			}
		}
	}
</script>
<style lang="scss">
	.popup{
	    text-align: center;
	    position:relative;
	    cursor: pointer;
	    a.btn{
	    	display:block;
	    	width:100%;
		    position: relative;
		    padding: 0 .3rem 0 .05rem;
		    line-height: 1;
	    	.icon{
			    position: absolute;
			    top: 50%;
			    right: 10px;
			    line-height: .14rem;
			    text-align: center;
			    margin-top: -.07rem;
			    font-size: .8em;
	    	}
	    }
	    .pop-panel{
		    min-width: 1rem;
		    position: absolute;
		    background: #fff;
		    right: 0;
		    width: auto;
		    outline: none;
		    box-shadow: 0 0 0.05rem rgba(0,0,0,.2);
		    z-index:100050;
		    white-space: nowrap;
		    /*display: none;*/
		    li{
			    color: #616161;
			    white-space:nowrap;
				padding: 0 .15rem 0 .1rem;
			    cursor:pointer;
			    line-height:1;
			    span.iconfont {
				    display: inline-block;
				    width: .28rem;
				    height:.28rem;
				    line-height:.28rem;
				    text-align: center;
				    vertical-align:middle;
				}
				&:not(.splitter):hover {
				    background: #FF5722;
				    color: #fff;
				}
				&.splitter{
					cursor:default;
					position:relative;
					height:.01rem;
					&:before{
						position:absolute;
						height:100%;
						top:0;
						content:"";
						left:.1rem;
						right:.1rem;
						background-color: #f1f1f1;
					}
				}
			}
		}
		/*&:hover{
			.pop-panel{
				display: block;
			}
		}*/
	}
</style>