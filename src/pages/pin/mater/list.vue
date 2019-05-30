<template>
	<div class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title">素材</h2>
			<div class="flex-item"></div>
		</header>
		<a class="btn-block success f-right" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/pin/mater/add">添加</a>
		<tabs :items="mateTypes" v-model="currType"/>
		<article class="poeui-content-box" v-if="currType==1">
			<block class="file-block">
				<section >
					<data-table :columns="column"  :setting="false" v-if="ready && list.length>0">
						<template v-for="(v,index) in list">
							<tr>
								<td class="hor-center">{{v.hot}}</td>
								<td style="line-height: 1.5">
									<img class="f-left mr-10" height="60" width="60" :src="v.cover" >
									{{v.desc}}
									<tip class="dp-block mt-5" size="12" style="white-space: nowrap;">视频热词：{{v.tags.join(',')}}</tip>
									<tip class="dp-block mt-5" size="12">视频时长：{{v.time||0}} 秒</tip>
								</td>
								<td class="hor-center">{{v.nick||'匿名用户'}}</td>
								<td class="hor-center">{{v.meta.fav||0}}</td>
								<td class="hor-center">{{v.meta.reply||0}}</td>
								<td-status :status="false" @data-edit="handleGoodEdit(v,index)" @data-del="handleGoodDel(v,index)"/>
							</tr>
						</template>
					</data-table>
					<div class="mv-50 hor-center tip" v-else-if="ready && list.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
		</article>
		<article class="poeui-content-box" v-if="currType==2">
			<block class="file-block">
				<div slot="aside" class="hor-right">
					<a class="btn-block success" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/pin/ranking/add?t=2">添加</a>
				</div>
				<section >
					<data-table :columns="columns.music" v-if="ready.music && list.musics.length>0"  :setting="false">
						<template v-for="(m,index) in list.musics">
							<tr>
								<td style="line-height: 1.5">
									<img class="f-left mr-10" height="60" width="60" :src="m.cover">
									{{m.title}}<br>
									<tip class="mt-5" size="12">{{m.desc||'暂无介绍'}}</tip>
								</td>
								<td class="hor-center">{{m.time}}</td>
								<td class="hor-center">{{m.hot}}</td>
								<td-status :status="false"  @data-edit="handleBrandEdit(m,index)" @data-del="handleBrandDel(m,index)" />
							</tr>
						</template>
					</data-table>
					<div class="mv-50 hor-center tip" v-else-if="ready.music && list.musics.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
		</article>
		<article class="poeui-content-box" v-if="currType==3">
			<block class="file-block">
				<div slot="aside" class="hor-right">
					<a class="btn-block success" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/pin/ranking/add?t=3">添加</a>
				</div>
				<section >
					<data-table :columns="columns.anchor" :setting="false" v-if="ready.anchor && list.anchors.length>0">
						<template v-for="(a,index) in list.anchors">
							<tr>
								<td class="hor-center">{{a.meta.month}}</td>
								<td>
									<img class="f-left mr-10" height="40" width="40" :src="a.cover">
									{{a.nick}}<br>
									<tip class="mt-5" size="12">{{a.desc||'暂无介绍'}}</tip>
								</td>
								<td class="hor-center">{{a.hot}}</td>
								<td class="hor-center">{{a.meta.fans}}</td>
								<td class="hor-center">{{a.meta.fav}}</td>
								<td class="hor-center">{{a.meta.reply}}</td>
								<td class="hor-center">{{a.meta.share}}</td>
								<td-status :status="false" @data-edit="handleCataEdit(a,index)" @data-del="handleCataDel(a,index)" />
							</tr>
						</template>
					</data-table>
					<div class="mv-50 hor-center tip" v-else-if="ready.anchor && list.catas.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
		</article>
		<article class="poeui-content-box" v-if="currType==4">
			<block class="file-block">
				<div slot="aside" class="hor-right">
					<a class="btn-block success" style="width:1rem;display: inline-block;line-height: .22rem;text-align: center;" href="/pin/ranking/add?t=4">添加</a>
				</div>
				<section >
					<data-table :columns="columns.topic" :setting="false" v-if="ready.topic && list.topics.length>0">
						<template v-for="(t,index) in list.topics">
							<tr>
								<td> # {{t.title}} # <br> <tip size="12">{{t.desc}}</tip> </td>
								<td class="hor-center">{{t.hot}}</td>
								<td-status :status="false" @data-edit="handleCataEdit(t,index)" @data-del="handleCataDel(t,index)" />
							</tr>
						</template>
					</data-table>
					<div class="mv-50 hor-center tip" v-else-if="ready.topic && list.catas.length<=0"> == 没有数据 == </div>
					<delay-loading class="mv-50" v-else>数据加载中</delay-loading>
				</section>
			</block>
		</article>
		<editor class="edit-viewer" title='产品编辑' :footer='false' :show.sync="editor.good" :box="{width:1000,height:800}" >
			<good-editor v-model="current" @change="handleCurrentChange" v-if="editor.good && current"/>
		</editor>
		<editor class="edit-viewer" title='品牌编辑' :footer='false' :show.sync="editor.brand" :box="{width:800}" >
			<brand-editor v-model="current" @change="handleCurrentChange" v-if="editor.brand && current"/>
		</editor>
		<editor class="edit-viewer" title='产品分类编辑' :footer='false' :show.sync="editor.cata" :box="{width:800}" >
			<cata-editor v-model="current" @change="handleCurrentChange" v-if="editor.cata && current"/>
		</editor>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	import goodEditor from '@/pages/good/good'
	import brandEditor from '@/pages/good/brand'
	import cataEditor from '@/pages/good/cata'
	const urls={
		data:'back/pindsh/rank_list',
		vedio:{
			data:'back/good/get_list',
			save:'back/good/save',
			delete:'back/good/delete',
		},
		brand:{
			data:'back/brand/get_list',
			save:'back/brand/save',
			delete:'back/brand/delete',
		},
		cata:{
			data:'back/catagory/get_list',
			save:'back/catagory/save',
			delete:'back/catagory/delete',
		}
	}
	export default {
		components:{
			'good-editor':goodEditor,
			'brand-editor':brandEditor,
			'cata-editor':cataEditor
		},
		route:{
			path:['/pin/mater','/pin/mater/list'],
			meta:{
				app:'pin',
				catch:true,
				menu:'ranking',
			}
		},
		data() {
			return {
				mateTypes:[{value:1,label:'新增素材'},{value:2,label:'更新中'}],
				currType:parseInt(this.$route.query.t||1),
				column:['指数',{title:'视频内容',align:'left'},'播主','点赞数','评论数','操作'],
				list:{
					videos:[],
					musics:[],
					anchors:[],
				},
				editor:{
					brand:false,
					cata:false,
					good:false
				},
				current:null,
				ready:{
					video:false,
					music:false,
					anchor:false,
					topic:false,
				}


			}

		},
		watch:{
			currType(v){
				this.$router.push({path:'/pin/mater?t='+v})
			},
		},
		mounted(){
			switch(this.currType){
				case 2:
					this.loadMusics()
				break
				case 3:
					this.loadAnchors()
				break
				case 4:
					this.loadTopic()
				break
				default:
					this.loadVideos()
				break
			}
			
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			// 你可以通过传一个回调给 next来访问组件实例。
			// 在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
			// next(vm => { // 通过 `vm` 访问组件实例 })
			next()
		},
		beforeRouteUpdate (to, from, next) {
			// 在当前路由改变，但是该组件被复用时调用
			// 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
			// 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
			// 可以访问组件实例 `this`
			switch(parseInt(to.query.t)){
				case 2:
					if ( !this.ready.music ) this.loadMusics()
				break
				case 3:
					if ( !this.ready.anchor ) this.loadAnchors()
				break
				case 4:
					if ( !this.ready.topic ) this.loadTopic()
				break
				default:
					if ( !this.ready ) this.loadVideos()
				break
			}
			if (this.currType!=to.query.t) {
				this.currType = to.query.t
			}
			next()
		},
		beforeRouteLeave (to, from, next) {
			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
			// 这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。
			next()
		},
		methods:{
			loadData(page){
				this.ready = false
				http.request(urls.data,{kind:1,rows:50,page:page||1},rlt=>{
					if (rlt.status==1) {
						this.list=rlt.data||[]
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,align:'center',mask:true})
					}
					this.ready = true
				})
			},
			addBrand(){
				this.current={status:1}
				this.editor.brand = true
			},
			addCata(){
				this.current={status:1}
				this.editor.cata = true
			},
			handleCurrentChange(row){
				if (this.editor.good) {
					this.list.splice(this.current_index,1,row)
					this.editor.good=false
				}
				if (this.editor.brand) {
					if (this.current_index<0) {
						this.list.brands.push(row)
					}
					else{
						this.list.brands.splice(this.current_index,1,row)
					}
					this.editor.brand=false
				}
				if (this.editor.cata) {
					if (this.current_index<0) {
						this.list.catas.push(row)
					}
					else{
						this.list.catas.splice(this.current_index,1,row)
					}
					this.editor.cata=false
				}
				this.current=null
				this.current_index=-1
			},
			handleGoodStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.good.save,{id:this.list[index].id,status:status},(rlt)=>{
	                	$$.ui.hide({ref:'l1'})
	                    if (rlt.status!=1) {
	                    	$$.ui.modal(rlt.msg,{
	                    		cancel:false,
	                    		mask:true,
	                    		textAlign:'center'
	                    	})
	                    }
	                })
				}
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			handleBrandStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.brand.save,{id:this.list.brands[index].id,status:status},(rlt)=>{
	                	$$.ui.hide({ref:'l1'})
	                    if (rlt.status!=1) {
	                    	$$.ui.modal(rlt.msg,{
	                    		cancel:false,
	                    		mask:true,
	                    		textAlign:'center'
	                    	})
	                    }
	                })
				}
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			handleCataStatusToggle(index,status){
				$$.ui.loading('',{ref:'l1'})
				try{
	                http.request(urls.cata.save,{id:this.list.catas[index].id,status:status},(rlt)=>{
	                	$$.ui.hide({ref:'l1'})
	                    if (rlt.status!=1) {
	                    	$$.ui.modal(rlt.msg,{
	                    		cancel:false,
	                    		mask:true,
	                    		textAlign:'center'
	                    	})
	                    }
	                })
				}
				catch(msg){
					$$.ui.hide({ref:'l1'})
				}
			},
			handleGoodEdit(row,index){
				if (!row) {
					$$.ui.modal('当前产品不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
					return
				}
				this.editor.good = true
				this.current = $$.extend(true,{},row)
				this.current_index = index
			},
			handleBrandEdit(row,index){
				if (!row) {
					$$.ui.modal('当前品牌不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
					return
				}
				this.editor.brand = true
				this.current = $$.extend(true,{},row)
				this.current_index = index
			},
			handleCataEdit(row,index){
				if (!row) {
					$$.ui.modal('当前产品分类不存在，无法编辑',{mask:true,cancel:false,textAlign:'center'})
					return
				}
				this.editor.cata = true
				this.current = $$.extend(true,{},row)
				this.current_index = index
			},
			handleGoodDel(row,index){
                $$.ui.modal('确实要删除当前产品吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    http.request(urls.good.delete,{ids:[row.id]},(rlt)=>{
	                    	$$.ui.hide({ref:'l1'})
	                        if (rlt.status==1) {
	                        	this.list.splice(index,1)
								
	                            $$.ui.toast('删除成功',{icon:'success'})
	                        }
	                        else{
	                            $$.ui.modal('删除失败:'.rlt.msg,{mask:true,cancel:false,textAlign:'center'})
	                        }
	                    })
                    }
                })
			},
			handleBrandDel(row,index){
                $$.ui.modal('确实要删除当前品牌数据吗？',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    http.request(urls.brand.delete,{ids:[row.id]},(rlt)=>{
	                    	$$.ui.hide({ref:'l1'})
	                        if (rlt.status==1) {
	                        	this.list.brands.splice(index,1)
								
	                            $$.ui.toast('删除成功',{icon:'success'})
	                        }
	                        else{
	                            $$.ui.modal('删除失败:'.rlt.msg,{mask:true,cancel:false,textAlign:'center'})
	                        }
	                    })
                    }
                })
			},
			handleCataDel(row,index){
                $$.ui.modal('确实要删除当前产品分类吗？<p class="tip">删除之前请确保当前分类下已没有产品数据',{
                	ref:'m1',
                	mask:true,
                	confirm:()=>{
	                    $$.ui.loading('',{ref:'l1'})
	                    http.request(urls.cata.delete,{ids:[row.id]},(rlt)=>{
	                    	$$.ui.hide({ref:'l1'})
	                        if (rlt.status==1) {
	                        	this.list.catas.splice(index,1)
								
	                            $$.ui.toast('删除成功',{icon:'success'})
	                        }
	                        else{
	                            $$.ui.modal('删除失败:'.rlt.msg,{mask:true,cancel:false,textAlign:'center'})
	                        }
	                    })
                    }
                })
			},
		}
			
	}
</script>
<style lang="scss">
	table.data-table{
		.user-photo{
			width:.4rem;
			height: .4rem;
			border-radius: 50%;
			margin-right: .05rem;
			vertical-align: middle;
		}
		.op-td{
			.op{
				color:#62A8EA;
			}
		}
	}
</style>