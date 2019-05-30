<template>
	<div class="tags-box pos-relative" :class="{'show-drop':showing}" style="overflow: visible;">
		<div class="tags flex-row">
			<span class="tag noselect" v-for="(tag,index) in local" :key="index"><span class="value">{{tag}}</span><button class="del iconfont" @click="delTag(index,tag)">&#xe6d7;</button></span>
			<input class="new full-row" v-model="newtag"  :placeholder="'（可选）选择或输入标签（ '+local.length+' / '+9+' ）'" @keydown.enter="addTag" @keyup.space="addTag" @keydown.delete="removeTag" v-if="local.length<9" @focus="toggleTagDropDown(true)" @blur="toggleTagDropDown(false)"/>
		</div>
		<div class="tags-drop" v-if="recents.length>0 || hots.length>0 || oftens.length>0" >
			<div class="tip f-right" style="font-size: .12rem;line-height: 1.5;">
				<p>*点击本面板各标签可以添加或移除指定标签</p>				
				<p>*输入框内输入标签内容后按空格或回车自动添加标签</p>
				<p>*输入框内按Backspace或Del可快速移除最后一个标签</p>
			</div>
			<dl v-if="recents && recents.length>0">
				<dt>最近使用</dt>
				<dd class="noselect" :class="{selected:local.indexOf(tag)>=0}" v-for="tag in recents" :key="tag" @click="toggleTagSelected(tag)">{{tag}}</dd>
			</dl>
			<dl v-if="oftens && oftens.length>0">
				<dt>常用标签</dt>
				<dd class="noselect"  :class="{selected:local.indexOf(tag)>=0}" v-for="tag in oftens" :key="tag"  @click="toggleTagSelected(tag)">{{tag}}</dd>
			</dl>
			<dl v-if="hots && hots.length>0">
				<dt>热门标签</dt>
				<dd class="noselect"  :class="{selected:local.indexOf(tag)>=0}" v-for="tag in hots" :key="tag" @click="toggleTagSelected(tag)">{{tag}}</dd>
			</dl>
		</div>
	</div>
</template>
<script>
	import http from '@/utils/http'
	export default {
		props:{
			hots:Array,
			value:Array,
			catchPerfix:String,
		},
		data() {
			var recents = ($$.catch.local(this.catchPerfix||'tags')||[]).sort((a,b)=>{
					if (a.time==b.time) {
						return 0
					}
					else if (a.time>b.time) {
						return -1
					}
					else{
						return 1
					}
				}),
				oftens = ($$.catch.local(this.catchPerfix||'tags')||[]).sort((a,b)=>{
					if (a.count==b.count) {
						return 0
					}
					else if (a.count>b.count) {
						return -1
					}
					else{
						return 1
					}
				})

			recents = recents.splice(0,5)
			oftens = oftens.splice(0,5)
			return {
				recents:recents.map((tag)=>{
					return tag.title
				}),
				oftens:oftens.map((tag)=>{
					return tag.title
				}),
				local:this.value||[],
				newtag: '',
				showing:false,
			}

		},
		mounted(){},
		computed:{ },
		watch:{
			value(v){
				this.local = v||[]
			},
			local:{
				handler(v){
					this.$emit('change',v)
				},
				deep:true,
			} 
		},
		methods:{
			read(){
				var recents = ($$.catch.local(this.catchPerfix||'tags')||[]).sort((a,b)=>{
					if (a.time==b.time) {
						return 0
					}
					else if (a.time>b.time) {
						return -1
					}
					else{
						return 1
					}
				}),
				oftens = ($$.catch.local(this.catchPerfix||'tags')||[]).sort((a,b)=>{
					if (a.count==b.count) {
						return 0
					}
					else if (a.count>b.count) {
						return -1
					}
					else{
						return 1
					}
				})

				recents = recents.splice(0,5)
				oftens = oftens.splice(0,5)

				this.recents=recents.map((tag)=>{
					return tag.title
				})
				this.oftens=oftens.map((tag)=>{
					return tag.title
				})
			},
			write(tag){
				var list = $$.catch.local(this.catchPerfix||'tags')||[],
					index = list.indexOf(tag,'title')
				if (index>=0) {
					list[index].time = (new Date).to()
					list[index].count =(list[index].count||0)+1
				}
				else{
					list.unshift({
						title:tag,
						time:(new Date).to(),
						count:1
					})
				}
				$$.catch.local(this.catchPerfix||'tags',list)
			},
			toggleTagDropDown:function(v){
				setTimeout(()=>{
					this.showing=v
				},v?0:200)

			},
			addTag:function(){
				var tag = this.newtag.trim()
				if (!tag || tag==''){
					return true
				}

				if (tag && !this.local.contains(tag)) {
					this.local.push(tag)
					this.write(tag)
					this.read()
				}
				
				this.newtag=''
			},
			removeTag(){
				console.log(this.newtag)
				if((!this.newtag||this.newtag.length<=0) && this.local.length>0){
					this.local.splice(this.local.length-1,1)
				}
			},
			delTag(index,tag){
				this.local.splice(index,1)
			},
			toggleTagSelected(tag){
				if (this.local.contains(tag)) {
					this.local.splice(this.local.indexOf(tag),1)
				}
				else{
					this.local.push(tag)
					this.write(tag)
					this.read()
				}
			},
		}
	}

</script>
<style lang="scss">
.tags-box{
	.tags {
		border: none;
		border-radius: .05rem;
		outline: none;
		width: 100%;
		.tag {
			background-color: #fff;
			margin: .02rem .05rem .02rem 0;
			line-height: .3rem;
			height: .3rem;
			padding: 0 .2rem 0 .05rem;
			box-shadow: 0 0 .03rem rgba(0, 0, 0, .1);
			border-radius: .03rem;
			position: relative;
    		cursor: default;
			.value{
				white-space: nowrap;
			}
			&:hover {
				box-shadow: 0 0 .03rem rgba(0, 0, 0, .3);
			}

			.del {
				position: absolute;
				background-color: transparent;
				border: none;
				top: 50%;
				margin-top: -.08rem;
				right: 0;
				width: .16rem;
				height: .16rem;
				outline: none;
				font-size: .5em;
				&:hover {
					color: red;
				}

			}

		}

		.new {
			height: .34rem;
			background-color: transparent;
			border-radius: 0;
		}

		.tag+.new {
			padding-left: .05rem;
		}
	}

	.tags-drop{
		display:none;
		position:absolute;
		width:100%;
		padding:.1rem;
		top:100%;
		background-color:#fff;
		box-shadow:0 0 0.03rem rgba(0,0,0,.3);
		z-index:3;
		border-radius:.05rem;
		dl {
			overflow: hidden;
			dt {
				line-height: 2;
				color: #03A9F4;
				padding:0 .1rem;
				position:relative;
				/*&:after{
					content:"";
					position:absolute;
					height:.01rem;
					width:100%;
					background: -webkit-linear-gradient(left,rgba(3,169,244,1) 40%,rgba(3,169,244,0) 70%);
					background: -o-linear-gradient(left,rgba(3,169,244,1) 40%,rgba(3,169,244,0) 70%);
					background: -moz-linear-gradient(left,rgba(3,169,244,1) 40%,rgba(3,169,244,0) 70%);
					background: linear-gradient(left,rgba(3,169,244,1) 40%,rgba(3,169,244,0) 70%); 
					bottom:0;
					left:0;
				}*/
			}

			dd {
				float: left;
				line-height: 2;
				padding: 0 .1rem;
				border: .01rem solid #ccc;
				margin: .05rem .1rem;
				position: relative;
				cursor:pointer;
				border-radius:.03rem;
				&:hover{
					box-shadow:0 0 .03rem rgba(0,0,0,.3);
				}
				&.selected {
					border-color: #6583ff;
					box-shadow: 0 0 .03rem #6583ff;

					/*&:after {
						content: "";
						border: .05rem solid transparent;
						position: absolute;
						width: 0;
						height: 0;
						border-right-color: #6583ff;
						border-bottom-color:  #6583ff;
						right: 0;
						bottom: 0;
					}*/
				}
				&:not(:last-child){
					margin-bottom:.1rem;
				}
			}
		}
	}
	&.show-drop{
		.tags-drop{
			display: block;
		}
	}
}
</style>