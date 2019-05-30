<template>
	<div class="field flex-row flex-line-start" :class="{error:local.validate && local.validate.verif==-1,success:local.validate && local.validate.verif==1}" :disabled="disabled!==false">
		<label class="label pl-10 pos-relative" :class="classObj.label" :style="style.label" >
			<span class="require-bullet pos-absolute" v-if="title===false && !!required">*</span>
			<slot name="label" v-if="title!==false">
				<span class="tip-error pos-absolute" style="left:0" v-if="!!required">*</span> 
				{{title}} 
				<span v-if="title">：</span>
			</slot>
		</label>
		<div class="field-box" :class="classObj.field"> 
			<!-- <span class="require-bullet pos-absolute" v-if="title===false && !!required">*</span> -->
			<div class="verif-box pos-relative"  :style="style.field">
				<slot>
					<template v-if="disabled!==false">
						<span v-if="locale">{{locale}}</span>
						<span class="data-unset tip" v-else></span>
					</template>
					<template v-else-if="items">
						<template v-if="type=='checkbox' || type == 'radio'">
							<label class="mr-20" v-for="(item,index) in items" :key="item.value===undefined?index:item.value">
								<input :class="{'onoff-input':type=='switch'}" type="checkbox" :on="on" :off="off" :checked="locale.indexOf(item.value)>=0" :readonly="readonly" @change="toggleCheck(item.value)" v-if="type=='checkbox'||type=='switch'">
								<input :type="type" :value="item.value||index" v-model="locale" :readonly="readonly" v-else>
								{{item.label||item}}
							</label>
						</template>
						<drop :readonly="readonly" v-model="locale"  :style="style.field" style="{textAlign: 'left'}" :items="items" v-else />

					</template>
					<template v-else-if="type=='select'">
						<drop :readonly="readonly" v-model="locale"  :style="style.field" :items="items"/>
					</template>
					<template v-else-if="type=='switch'">
						<onoff :on="on" :off="off" v-model="locale" :readonly="readonly"/>
					</template>

					<filter-list :items="dataList" v-model="locale" :value='filter.value' :label='filter.label' :placeholder="placeholder"  v-else-if="type=='filter'"/>
					<template v-else-if="type=='password'">
						<input v-model="locale" :placeholder="placeholder" type="password" :readonly="readonly" :style="style.field" @change="handleChange">
					</template>
					<template v-else>
						<textarea v-model="locale" :placeholder="placeholder" :readonly="readonly" :style="style.field" v-if="multi|| type=='textarea'" @change="handleChange"></textarea>
						<input v-model="locale" :placeholder="placeholder" :readonly="readonly" :style="style.field" @change="handleChange" :type="type" :list="dataListKey" v-else>
						<datalist :id="dataListKey" v-if="dataList && dataList.length>0">
							<template  v-for="item in dataList">
							<option :label="item.label||item" :value="item.value!==undefined?item.value:item" v-if="item">{{item.label||item}}</option>
							</template>
						</datalist>
					</template>
				</slot>
				<transition name="fade-right" enter-active-class="animated speed-4 fadeInRight" leave-active-class="animated speed-4 fadeOutRight">	
					<div class="verif err" v-if="local.validate && local.validate.verif==-1 && local.validate.msg">{{local.validate.msg}}</div>
				</transition> 
				<transition name="fade" enter-active-class="animated speed-4 fadeIn" leave-active-class="animated speed-4 fadeOut">	
					<div class="verif okay" v-if="local.validate && local.validate.verif==1"></div>
				</transition> 
			</div>
		</div>
		<div class="desc pr-10" :class="classObj.desc" :style="style.desc">
			<slot name="desc" v-if="desc"><div class="ml-15" v-html="desc" ></div></slot>
		</div>
	</div>
</template>
<script>
	export default{
		name:'field',
		props:{
			value:{
				default:null,
			},
			title:{
				default:'',
			},
			items:[Array,Object],
			type:{
				default:'',
			},
			on:{
				type:[Number,Boolean],
				default:1 ,
			},
			off:{
				type:[Number,Boolean],
				default:0 ,
			},
			placeholder:{
				default:'(未设置)',
			},
			validate:{
				default(){
					return null	
				} ,
			},
			label:{
				default: null
			},
			field:{
				default: null
			},
			width:{
				type:[Array,String],
				default:'100,*,*'
			},
			multi:{
				type:Boolean,
				default:false
			},
			required:{
				type:Boolean,
				default:false,
			},
			disabled:{
				default:false
			},
			readonly:{
				default:false
			},
			filter:{
				type:Object,
				default(){
					return {
						value:'value',
						label:'label',
					}
				}
			},
			dataList:{
				type:[Object,Array],
				default(){
					return null
				}
			},
			desc:{
				default:''
			}
		},
		data(){
			
			return {
				locale:this.value,
				dataListKey:this.dataList?$$.uuid():null,
				local:{
					validate:!this.validate?null:$$.extend({verif:0,required:this.required},this.validate),
				}
			}
		},
		computed:{
			style(){
				var width = this.adjustWidth(),
					style={
						label:this.label||{},
						field:this.field||{},
						desc:{}
					}
				for(var i = 0; i<width.length; i++){
					var c={},w=0
					if (width[i]=='*') {
					} else if(width[i].indexOf('*')>0){
					} else if (width[i]=='auto') {
					} else {
						w = width[i]/100+'rem'
					}
					if (i==0) {
						if(w!==0) style.label.width = style.label.width||w
					} else if (i==1) {
						if(w!==0) style.field.width = style.field.width||w
					}
					else{
						if(w!==0) style.desc.width = w
						style.desc.lineHeight=1.5
						style.desc.padding = '.07rem 0 .06rem'
					}
				}
				return style
			},
			classObj(){

				var width = this.adjustWidth(),
					_class={}
				for(var i = 0; i<width.length; i++){
					var c={},w=0
					if (width[i]=='*') {
						c['flex-item'] = true
					} else if(width[i].indexOf('*')>0){
						c['flex-item-'+width[i].replace('*','')]=true
					}

					if (i==0) {
						_class.label=c

					} else if (i==1) {
						_class.field=c
					}
					else{
						_class.desc=c

					}

				}
				return _class
			}
		},
		watch:{
			validate(v){
				this.local.validate = !v?null:$$.extend({verif:0,required:this.required},v)
			},
			value(v){
				this.locale=v
			},
			locale:{
				handler(v){
					this.$emit('input',v)
					if (this.local.validate) {
						this.local.validate.verif = 0
						if (this.local.validate.on=='input') {
							this.doVerif(v)
						}
						// else{
						// 	this.$emit('verif',{validate:this.local.validate,value:v})
						// }
					}
				},
				deep:true,
			}
		},
		mounted(){
			this.local.validate && (this.local.validate.verif = 0)
			// this.doVerif(this.locale)
		},

		methods:{
			adjustWidth(){
				let width = this.width,l,f,d
				if ($$.isString(width)) {
					width = width.split(',')
				}
				if (width.length>=1) {
					l=width[0].toString().trim()||'100'
				}
				else{
					l='100'
				}
				if (width.length>=2) {
					f=width[1].toString().trim()||'*'
				}
				else {
					f="*"
				}
				if (width.length>=3) {
					d=width[2].toString().trim()||'auto'
				}
				else{
					d='auto'
				}

				return [l,f,d]

				
			},
			doVerif(v){
				var valid = this.local.validate
				if (!valid) {
					return
				}
				valid.verif = 0
				if (!this.required && !v) {
					return
				}
				if (valid.required && !v) {
					valid.verif = -1
					return
				}
				if (v && valid.pattern) {
					var rlt=true
					if ($$.isFunction(valid.pattern)) {
						rlt=valid.pattern(v)
					}
					else if(valid.pattern){
						rlt=valid.pattern.test(v)
					}
					if ($$.isBoolean(rlt)) {
						valid.verif = rlt?1:-1
					}
					else if ($$.isString(rlt)) {
						valid.verif = -1
						valid.msg = rlt
					}
					

				}
				this.$emit('verif',{validate:valid,value:v})
				
				this.local.validate = !valid?null:valid
				this.$emit('update:validate',valid)
			},
			toggleCheck(v){
				if(this.locale.indexOf(v)>=0){
					this.locale.splice(this.locale.indexOf(v),1)
				}
				else{
					this.locale.push(v)
				}
			},
			handleChange(){
				var v = this.locale

				if (this.local.validate && this.local.validate.on!='input' && this.local.validate.verif===0) {
					this.doVerif(v)
				}

				this.$emit('change',v)
			}
		}
	}
</script>
<style lang="scss">
	.field{
		line-height:.34rem;
		border:none;
		.label{
		    /*text-align: right;
		    padding-right: .05rem;*/
		    color: #607D8B;
		    white-space: nowrap;
		}
		.field-box{
			.require-bullet{
			    left: -.2rem;
			    color: #f00;
			    width: .2rem;
			    height: .2rem;
			    line-height: .25rem;
			    top: 50%;
			    margin-top: -.1rem;
			    text-align: center;
			}
			.verif{
			    position: absolute;
			    right: .1rem;
			    top: 0px;
				&:before {
				    font-family: iconfont;
				    font-size: 1.3em;
				}
			    &.err{
			    	color: #F96868;
					&:before {
					    content: "\e7c3";
					}
			    }
			    &.okay{
			    	color: #46BE8A;
					&:before {
					    content: "\e60b";
					}
			    }
			}
			// [class*="btn-"]{
			// 	height: .34rem;
			// 	line-height: .24rem;
			// 	vertical-align: -.01rem;
			// }

			output{
				padding:.02rem .05rem;
				line-height: .34rem;
				border:.01rem solid transparent;
			}
			input,select,textarea,.drop {
				&:not([type="radio"]):not([type="checkbox"]){
					display: block;
				}			    
			}
			textarea{
				padding:.06rem .05rem;
				width:100%;
				min-height: 1rem;
				resize: none;
			}
			input:not([type="radio"]):not([type="checkbox"]),select{
				padding:.02rem .05rem;
				width:100%;
				height:.34rem;
			}
			input[type="radio"],input[type="checkbox"]{
			    width: 1.2em;
			    height: 1.2em;
			    vertical-align: -3px;
			}
		}
		.desc{
			font-size:.14rem;
			color:#BDBDBD;/*#cdcdcd;*/
		}
		&.error{
			input,select,.drop,textarea{
				&:not(:disabled){
					border-color:#F44336;
				}
			}
		}
		&.warning{
			input,select,.drop,textarea{
				&:not(:disabled){
					border-color:#FF9800;
				}
			}
		}
		&.success{
			input,select,.drop,textarea{
				&:not(:disabled){
					border-color:#1AAD19;
				}
			}
		}
	}
</style>