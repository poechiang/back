<template>
	<div class="field-editor  flex-row flex-line-center" ref="editor" >
		<label class="label dp-inline-block" :style="labelStyle" v-if="title"> <slot name="label">{{title}}</slot>：</label>
		<div class="field flex-item pos-relative">
			<slot>
				<output v-if="!options.editing" :class="{tip:local===null}">{{(format?format[local]:local) || placeholder}}</output>
				<template v-else>
					<onoff v-if="type=='switch'" v-model="local" :on="on" :off="off">{{format?format[local]:local}}</onoff>
					<template v-else>
						<textarea @keydown="handleEnter" @blur="handleBlur" :placeholder="placeholder" :disabled="!options.editing"  v-if="multi" :style="textAreaStyle">{{local}}</textarea>
						<input :type="type||'text'" v-model="local" @keydown="handleEnter" @blur="handleBlur" :placeholder="placeholder" :disabled="!options.editing" v-else>
					</template>
				</template>
			</slot>

			<template v-if="editable && isAlone">
				<transition enter-active-class="animated speed-4 delay-2 fadeInRight" leave-active-class="animated speed-4 fadeOutRight">	
					<div class="op-box" v-if="options.editing">
						<a class="confirm iconfont def" href="javascript:;" title="确认修改" @click="handleConfirm">&#xe737;</a>
						<a class="cancel iconfont def" href="javascript:;" title="取消修改" @click="handleCancel">&#xe739;</a>
					</div>
				</transition>
				<transition enter-active-class="animated speed-4 delay-1 fadeIn" leave-active-class="animated speed-4 fadeOut">	
					<a class="edit iconfont def" href="javascript:;" @click="handleEdit" title="编辑" v-if="!options.editing">&#xe738;</a>
				</transition> 
			</template>


			<transition name="fade-right" enter-active-class="animated speed-4 fadeInRight" leave-active-class="animated speed-4 fadeOutRight">	
				<div class="verif err" v-if="options.validator.verif==-1 && options.validator.msg">{{options.validator.msg}}</div>
			</transition> 
			<transition name="fade" enter-active-class="animated speed-4 fadeIn" leave-active-class="animated speed-4 fadeOut">	
				<div class="verif okay" v-if="options.validator.verif==1"></div>
			</transition> 
		</div>
	</div>
</template>
<script>
	export default{
		props:{
			value:{
				default:()=>{
					return null
				}
			},
			title:String,
			placeholder:{
				type:String,
				default:'(未设置)',
			},
			type:{
				type:String,
				default:'text',
			},
			label:{
				type:Number,
				default:100,
			},
			auto:Boolean,
			editing:Boolean,
			validator:{
				type:Object,
				default:()=>{
					return {verif:null}
				},
			},
			multi:false,
			height:String,
			format:[Object,Array],
			on:[Object,String,Number,Boolean],
			off:[Object,String,Number,Boolean],
			editable:{
				type:Boolean,
				default:true
			},
		},
		data(){
			return {
				local:this.value,
				isAlone:true,
				options:{
					validator:this.validator,
					editing:this.editing
				}
				
			}
		},
		computed:{
			labelStyle(){
				return {
					width:(this.label||100)/100+'rem'
				}
			},
			textAreaStyle(){
				if (this.type=='text' && this.multi==true) {
					if (this.height=='auto') {
						return {
							width:'100%',
							padding:'.02rem .05rem',
						}	
					}
					else{

						return {
							width:'100%',
							height:this.height/100+'rem',
							padding:'.02rem .05rem',
							resize: 'none',
						}
					}
				}
				return {}
			}
			
		},
		mounted(){
			this.isAlone=$(this.$refs.editor).closest('.fields-box').length<=0
		},
		watch:{
			value(v){
				this.local=v
				if (!this.isAlone) {
					this.$emit('input',v)
				}
			},
			editing(v){
				this.options.editing=v
			},
			local(v){
				
				console.log(v)
			},
			'options.editing':function(v){
				this.$emit('update:editing',v)
			}
			
		},
		methods:{
			handleEdit(){
				this.options.editing=true
			},
			handleEnter(e){
				if (this.isAlone && e.keyCode == 13) {
					this.handleConfirm()
				}
			},
			handleBlur(){
				if (this.isAlone && this.auto) {
					this.handleConfirm()
				}
			},
			handleConfirm(){
				if (this.validator && this.validator.pattern) {
					if ($$.isFunction(this.validator.pattern) && false === this.validator.pattern(this.local)) {
						return false
					}
					else{
						if (!this.validator.pattern.test(this.local)) {
							return false
						}
					}
				}

				this.options.editing=false
				if (this.value != this.local) {
					this.$emit('input',this.local)
				}
			},
			handleCancel(){
				this.options.editing = false
				this.local = this.value
			}
		}
	}
</script>
<style lang="scss">
	.field-editor{
		.label{
			text-align:right;
			padding-right:.05rem;
			color:#607D8B;
		}
		.field{
			line-height: .34rem;
			a{
				font-size: .14rem;
				&.edit{
					position:absolute;
					top:50%;
					right:.05rem;
					height: .2rem;
					line-height: .2rem;
					margin-top:-.1rem;
					color:#2196f3;
				}
				&.confirm{
					color:#4CAF50;
				}
				&.cancel{
					color:#f44336;
				}
			}
			output{
				padding:.02rem .05rem;
				line-height: .34rem;
				border:.01rem solid transparent;
			}
			/*input,select,textarea {
				&:not([type="radio"]):not([type="checkbox"]){
					display: block;
					&:focus,&:hover{
				    	border:.01rem solid #ED9236;
				    }
				}
			    
			    &:focus{
			    	box-shadow:0 0 .03rem #ED9236;
			    }
			    &:disabled{
			    	border-color:transparent!important;
			    	background-color:#fff!important;
			    }
			}
			textarea{
				padding:.06rem .1rem;
			}
			input:not([type="radio"]):not([type="checkbox"]),select{
				padding:.02rem .05rem;
				width:100%;
				height:.34rem;
			}
			input[type="radio"],input[type="checkbox"]{
				width:1em;
				height: 1em;
			}*/
			.op-box{
				position:absolute;
				top:50%;
				right:0;
				height: .2rem;
				line-height: .2rem;
				margin-top:-.1rem;
				a{
					margin:.01rem .05rem;
				}
			}
		}
	}
</style>