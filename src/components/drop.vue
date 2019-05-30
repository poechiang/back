<template>
	<span class="drop poe-drop-button" :class="{opened:isOpened}" >
		<span class="btn"  href="javascript:;" @click="showPop">
			<span v-if="!selectedItem" style="color:#E832274f;">{{placeHolder||'请选择'}}</span>
			<span v-else>{{selectedItem.title||selectedItem.label}}</span>
			<span class="icon iconfont small def" v-html="currIcon||(isOpened?'&#xea50;':'&#xea4f;')"></span>
		</span>
		<transition name="fade" @after-enter="onPopupShown">
			<ul class="poe-pop-list hor-left" tabindex = "0" v-focus="shown" v-if="isOpened" @blur="onBlur">
				<slot>
					<template v-for="item in items">
						<li class="splitter" v-if="'-'===(item.title || item.label || item)"></li>
						<li v-else @click="itemClick(item)">
							<span class="iconfont small" v-if="(item.value||item)==value">&#xe970;</span>
							<span class="iconfont small" v-else></span>
							{{item.title || item.label || item}}
						</li>
					</template>
				</slot>
			</ul>
		</transition>
	</span>
</template>
<script>
	export default {
		model: {
		    prop: 'value',
		    event: 'change'
		},
		props:['value','items','open','placeHolder','icon','autoClose'],
		data(){
			return {
				isOpened:this.open || false,
				currIcon:this.icon,
				shown:this.open || false,
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
		computed:{
			selectedItem(){
				var curr,selected=this.value
				$$.each(this.items,(index,item)=>{
					if (item.value == selected) {
						curr=item
					}
				})
				return curr
			}
		},
		methods:{
			onBlur(){
				if (this.autoClose!==false) {
					this.hidePop()
				}
			},
			onPopupShown(){
				this.shown=true
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
	.poe-drop-button{
		display:inline-block;
	    text-align: center;
	    position:relative;
	    border: 1px solid #e0e0e0;
	    .btn{
	    	display:block;
	    	width:100%;
		    position: relative;
		    padding: 0 .3rem 0 .05rem;
		    color:#414141!important;
		    height: .34rem;
		    line-height: .34rem;
		    cursor: pointer;
	    	.icon{
			    position: absolute;
			    top: 50%;
			    right: .08rem;
			    line-height: .14rem;
			    text-align: center;
			    width: .14rem;
			    margin-top: -.07rem;
	    	}
	    }
    	&:hover,
    	&:focus,
    	&.opened{
    		color:#414141;
    		border:.01rem solid #E83227;
    	}
    	&:focus,
    	&.opened{
    		box-shadow:0 0 0.03rem #E832277f;
    	}
	    .poe-pop-list{
		    min-width: 100%;
		    position: absolute;
		    background: #fff;
		    left: 0;
		    top:calc(100% + 1px);
		    width: auto;
		    box-shadow: 0 0 0.05rem rgba(0,0,0,.2);
		    outline:none;
		    z-index:100050;
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
				    background: #E83227;
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
		.fade-enter-active {
			animation:fadeInUp .2s both;
		}
		.fade-leave-active {
			animation:fadeOutDown .2s .1s both;
		}
	}
</style>