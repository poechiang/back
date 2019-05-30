<template>
	<th :width="col.width||'*'" v-if="col.visible!==false" :align="col.align||'center'">
		<span class="data-col-setting" v-if="setting && cols && cols.length>0">
			<a class="iconfont small def" href="javascript:;" @click="showPop('setting')">&#xe97e;</a>
			<ul class="data-col-pop-list hor-left" tabindex = "0" v-focus="shown.setting" :class="{shown:shown.setting}" @blur="hidePop('setting')">
				<li v-for="(item,index) in cols" :key="index" @click="toggleCol(index)" v-if="item.visible!==undefined">
					<span class="iconfont small" v-if="item.visible===false"></span>
					<span class="iconfont small" v-else>&#xe970;</span>
					{{item.title}}
				</li>
				<li class="splitter"></li>
				<li @click="resetAll()"><span class="iconfont small">&#xe95b;</span> 重置</li>
			</ul>
		</span>
		<span class="data-col-setting" v-else-if="setting">
			<a class="iconfont small def" href="javascript:;" @click="resetAll()">&#xe95b;</a>
		</span>
			{{currColTitle}}
		<span class="data-col-filter" v-if="col.filters && col.filters.length>0">
			<a class="iconfont small def" href="javascript:;" @click="showPop('filter')" v-if="local.filter<0">&#xe983;</a>
			<a class="iconfont small def" href="javascript:;" @click="showPop('filter')" v-else>&#xe984;</a>
			<ul class="data-col-pop-list" tabindex = "0" v-focus="shown.filter" :class="{shown:shown.filter}" @blur="hidePop('filter')">
				<li v-if="local.filter>=0" @click="setColFilter(-1)">{{col.title}}</li>
				<li v-for="(item,index) in col.filters" :key="index" v-if="local.filter!=index" @click="setColFilter(index)">{{item.label||item}}</li>
			</ul>
		</span>
		<span class="data-col-sort" v-if="local.sort!==undefined">
			<a class="iconfont small def" href="javascript:;" v-if="local.sort===0" @click="showPop('sort')">&#xe97f;</a>
			<a class="iconfont small def" href="javascript:;" v-if="local.sort===-1" @click="showPop('sort')">&#xe981;</a>
			<a class="iconfont small def" href="javascript:;" v-if="local.sort===1" @click="showPop('sort')">&#xe980;</a>
			<ul class="data-col-pop-list hor-left"  tabindex = "0" v-focus="shown.sort"  :class="{shown:shown.sort}"  @blur="hidePop('sort')">
				<li v-if="local.sort!==1" @click="setColSort(1)">
					<span class="iconfont small">&#xe980;</span> 升序
				</li>
				<li v-if="local.sort!==-1"  @click="setColSort(-1)">
					<span class="iconfont small">&#xe981;</span> 降序
				</li>
				<li v-if="local.sort!==0"  @click="setColSort(0)">
					<span class="iconfont small">&#xe97f;</span> ( 无 )
				</li>
			</ul>
		</span>
		<a class="data-col-restore iconfont small def" href="javascript:;" v-if="col.filters && col.filters.length>0 && local.filter>=0 || local.sort" @click="reset">&#xe91b;</a>
	</th>
</template>
<script>
	export default {
		props:['col','cols','setting'],
		data:function(){
			return {
				local:{
					sort:this.col.sort,
					filter:-1,
				},
				shown:{
					filter:false,
					sort:false,
					setting:false,
				}
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
			currColTitle:function(){
				if (this.col.filters && this.local.filter>=0 && this.col.filters.length>this.local.filter) {
					return this.col.filters[this.local.filter].label || this.col.filters[this.local.filter]
				}
				else{
					return this.col.title||this.col
				}
			}
		},
		methods:{
			showPop:function(key){
				this.shown[key]=true
			},
			hidePop:function(key){
				this.shown[key]=false
			},
			setColFilter:function(v){
				this.local.filter=v
				this.shown.filter=false
			},
			setColSort:function(v){
				this.local.sort=v
				this.shown.sort=false
			},
			reset:function(){
				this.local.filter = -1
				if (this.local.sort!==undefined) {
					this.local.sort=0
				}
			},
			toggleCol:function(index){
				if (this.cols[index].visible!==undefined) {
					this.cols[index].visible = !this.cols[index].visible	
				}
			},
			resetAll:function(){
				for(var i = 0; i<this.cols.length; i++){
					if (this.cols[i].visible!==undefined) {
						this.cols[i].visible = true	
					}
					if (this.cols[i].sort!==undefined) {
						this.cols[i].sort = 0
					}
				}

				this.shown.setting=false
			}
		}
	}
</script>
<style lang="scss">
	th{
		position:relative;

		.data-col-pop-list{
			animation:fadeOutDown .2s .1s both;
		    position: absolute;
		    background: #fff;
		    left: .1rem;
		    width: calc(100% - .2rem);
		    box-shadow: 0 0 0.05rem rgba(0,0,0,.2);
		    z-index:-1;
		    transition:z-index 200ms;
		    outline:none;
		    li{
			    color: #616161;
			    white-space:nowrap;
				padding: 0 .1rem;
			    cursor:pointer;
			    span {
				    float: left;
				    width: .28rem;
				    height:.28rem;
				    text-align: center;
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
			&.shown{
				animation:fadeInUp .2s both;
				z-index:100050;
			}
		}


		.data-col-filter,
		.data-col-setting,
		.data-col-sort{
			a.iconfont{
				color:#888;
			}
		}
		.data-col-setting{
		    position: absolute;
		    left: .05rem;
		    width: .28rem;
		    text-align: center;
		    .data-col-pop-list{
			    left: 0;
			    min-width: 1.5rem;
			}
		}
		.data-col-restore{
			position:absolute;
			right:.05rem;
			color:#888;
		}
	}
</style>