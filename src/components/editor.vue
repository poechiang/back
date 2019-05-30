<template>
	<transition	name="flade-scale">
		<div class="poe-dlg-mask dp-table noselect" v-show="visible"  @mouseup="endMove" @mouseleave="endMove"  @mousemove="moveBox">
			<div class="dp-table-cell full-col hor-center ver-middle">
				<div class="poe-dlg-box flex-column hor-left" :style="boxStyle" >
					<header class="poe-dlg-header flex-row flex-line-stretch">
						<div class="poe-dlg-title flex-item ph-15 lh-30"  @mousedown="startMove">
							<slot name="header">{{title}}</slot>
						</div>
						<button class="close btn-outline error iconfont" @click="handleBtnClick()">&#xe783;</button>
					</header>
					<article class="poe-dlg-body flex-item p-15 sel-init of-auto">
						<slot></slot>
					</article>
					<footer class="poe-dlg-footer p-15 flex-row flex-main-center" v-if="footer!==false">
						<slot name="footer">
							<template v-for="(item,key) in actions">
								<button class="dlg-btn btn-block mh-10" :class="item.theme||'default'" :disabled="item.disabled&&item.disabled()"  @click="handleBtnClick(key)">{{item.label}}</button>
							</template>
						</slot>
					</footer>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
	export default {
		props:['title','footer','box','buttons','show','size'],
		data(){
			
			return {
				actions:$$.extend(true,{
					cancel:{
						label:'取消',
					},
					confirm:{
						theme:'primary',
						label:'确定',
					},
				},this.buttons||{}),
				point:{x:0,y:0},
				org:{x:0,y:0},
				offset:{h:0,v:0},
				moving:false,
				visible:this.show
			}
		},
		computed:{
			boxStyle(){
				var bs = this.box||{}

				if (bs.width) {
					bs.width= bs.width/100+'rem'
				}
				if (bs.height) {
					bs.height= bs.height/100+'rem'
				}
				if (bs.maxWidth) {
					bs.maxWidth= bs.maxWidth/100+'rem'
				}
				if (bs.maxHeight) {
					bs.maxHeight= bs.maxHeight/100+'rem'
				}
				if (bs.minWidth) {
					bs.minWidth= bs.minWidth/100+'rem'
				}
				if (bs.minHeight) {
					bs.minHeight= bs.minHeight/100+'rem'
				}


				// bs.left=(this.point.x+this.offset.h)/100+'rem'
				// bs.top=(this.point.y+this.offset.v)/100+'rem'

				return bs
			}
		},
		watch:{
			show:function(v){
				this.visible = v
			},

		},
		methods:{
			startMove(e){
				if (e.buttons===1) {
					this.org={
						x:e.pageX,
						y:e.pageY,
					}
					this.offset={
						h:0,
						v:0,
					}
					if (!this.moving) {
						this.moving=true
					}
				}
			},
			endMove(e){
				if(this.moving){
					this.point = {
						x:this.point.x+this.offset.h,
						y:this.point.y+this.offset.v
					}
					this.moving = false
				}
			},
			moveBox(e){
				if (this.moving) {
					this.offset={
						h:e.pageX - this.org.x,
						v:e.pageY - this.org.y,
					}

					$(e.target).closest('.poe-dlg-mask').find('.poe-dlg-box').css({
						left:(this.point.x+this.offset.h)/100+'rem',
						top:(this.point.y+this.offset.v)/100+'rem'
					})
				}
			},
			handleBtnClick(_key){
				var args={
					key:_key,
					isConfirm:_key==='confirm',
					isCancel:_key==='cancel',
					cancelClose:false,
				}
				if (args.isConfirm) {
					this.$emit('poe-dlg-confirm',args)
				}
				if (args.isCancel) {
					this.$emit('poe-dlg-cancel',args)
				}

				args.key =args.key || 'shell-close'

				if (!args.cancelClose) {
					this.$emit('update:show',false)
				this.visible = false
				}
				this.$emit('poe-dlg-close',args)
			},
		}
	}
</script>
<style scoped lang="scss">
	.poe-dlg-mask{
	    position: fixed;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0,0,0,.5);
	    z-index:100010;
	    .poe-dlg-box{
	    	position:relative;
	    	width:5rem;
	    	margin:auto;
		    background-color: #fff;
		    border-radius: .05rem;
		    overflow: hidden;
			transform: scale(1);
	    	.poe-dlg-header{
	    		cursor:move;
	    		.poe-dlg-title{
	    			color:#888;
	    		}
	    		.close{
	    			height:.3rem;
	    			width:.3rem;
	    			padding:0;
	    			border:none;
	    		}
	    	}
	    	.poe-dlg-body{
	    		font-size:.14rem;
	    	}
	    	.poe-dlg-footer{
	    		.dlg-btn{
	    			min-width:1rem;
	    		}
	    	}
	    }

		&.flade-scale-enter-active{
		    transition: background-color .3s ease-in-out;
		    .poe-dlg-box{
		    	transition: transform .2s .1s ease-in-out;
		    }
		}
		&.flade-scale-leave-active{
		    transition: background-color .3s ease-in-out;
		    .poe-dlg-box{
		    	transition: transform .2s ease-in-out;
		    }
		}
		&.flade-scale-enter, &.flade-scale-leave-to{
			background-color: rgba(0,0,0,0);
			.poe-dlg-box{
				transform: scale(0);
			}
		}
		&.flade-scale-enter-to,&.flade-scale-leave{
			background-color: rgba(0,0,0,0.5);
			.poe-dlg-box{
				transform: scale(1);
			}
		}
	}
</style>