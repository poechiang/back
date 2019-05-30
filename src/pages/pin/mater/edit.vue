<template>
	<section id="rank-edit" class="poeui-page">
		<header class="poeui-content-header flex-row flex-line-center" >
			<h2 class="poeui-content-title"><a class="title-link" href="javascript:history.go(-1);">{{pageTitle}}</a> —— {{$route.params.id?'编辑':'添加'}}</h2>
			<div class="flex-item"></div>
			<div>
				<button class="btn-block theme dp-block" style="width:1rem" :disabled="!changed" @click="handlePost">提交</button>
			</div>
		</header>
		<aside class="mv-20" v-if="!kind">
			<div class="ma-0" style="width:4rem">
				<label class="mr-20"><input type="radio" v-model="rank.kind" value="1">视频</label>
				<label class="mr-20"><input type="radio" v-model="rank.kind" value="2">音乐</label>
				<label class="mr-20"><input type="radio" v-model="rank.kind" value="3">主播</label>
				<label><input type="radio" v-model="rank.kind" value="4">话题</label>
			</div>
		</aside>
		<article class="poeui-content-box" style="min-width: 9rem;">
			<block class="file-block fields-box pr-80" :loading="!ready"  v-if="rank.kind==1">
				<div style="width:8rem;margin:auto">
					<field title="封面图片" :require="true" width="100,auto,*" desc="视频封面。 1M以内jpg,png图片">
						<uploader class="p-10" v-model="rank.cover" def="https://res.shibu365.com/i/2019-03-22/7e3f3c7eb3084713a38d94bd5eb5c331.png" width="400" height="200" :auto="true"/>
					</field>
					<field title="抖音号" v-model="rank.dyid" placeholder="（可选）视频发布人抖音号"/>
					<field title="昵称" v-model="rank.nick" placeholder="（可选）视频发布人昵称……"/>
					<field title="描述" v-model="rank.desc" placeholder="（可选）视频描述……"/>
					<field title="分类" v-model="rank.cata" placeholder="（可选）选择已有或输入新的主播分类名称" :data-list="catas"/>
					<field title="话题" v-model="rank.topic" placeholder="（可选）视频所属话题名称 ……" :data-list="topics"/>
					<field title="作品时长" v-model="rank.time" placeholder="（可选）视频时长，单位为秒"/>
					<field title="发布时间" v-model="rank.post_time" type="datetime-local" />
					<field title="标签">
						<tags-editor v-model="rank.tags" :hots="tags"  catch-perfix='rank_tags'/>
					</field>
					<field title="热度指数" v-model="rank.hot" placeholder="（可选）视频播放次数" />
					<field title="点赞" v-model="rank.meta.fav" placeholder="（可选）视频点赞数"/>
					<field title="回复" v-model="rank.meta.reply" placeholder="（可选）视频回复评论数"/>
					<field title="分享" v-model="rank.meta.share" placeholder="（可选）视频分享次数"/>
					<field title="音乐" v-model="rank.meta.music" placeholder="（可选）视频视频所用音乐"/>
				</div>
			</block>
			<block class="file-block fields-box pr-80" :loading="!ready" v-if="rank.kind==2">
				<div style="width:8rem;margin:auto">
					<field title="封面图片" :require="true" width="100,auto,*" desc="音乐封面。 1M以内jpg,png图片">
						<uploader class="p-10" v-model="rank.cover" def="https://res.shibu365.com/i/2019-03-22/7e3f3c7eb3084713a38d94bd5eb5c331.png" width="400" height="200" :auto="true"/>
					</field>
					<field title="标题" v-model="rank.title" placeholder="（可选）热门音乐标题……" v-if="true"/>
					<field title="作品时长" v-model="rank.time" placeholder="（可选）音乐的时长，单位为秒" />
					<field title="发布时间" v-model="rank.post_time" type="datetime-local" />
					<field title="热度指数" v-model="rank.hot" placeholder="（可选）音乐使用次数" />
				</div>
			</block>

			<block class="file-block fields-box pr-80" :loading="!ready" v-if="rank.kind == 3">
				<div style="width:8rem;margin:auto">
					<field title="封面图片" :require="true" width="100,auto,*" desc="主播头像。 1M以内jpg,png图片">
						<uploader class="p-10" v-model="rank.cover" def="https://res.shibu365.com/i/2019-03-22/7e3f3c7eb3084713a38d94bd5eb5c331.png" width="400" height="200" :auto="true"/>
					</field>
					<field title="抖音号" v-model="rank.dyid" placeholder="（可选）视频发布人 或 主播的抖音号或者……"/>
					<field title="昵称" v-model="rank.nick" placeholder="（可选）人气主播的昵称……"/>
					<field title="描述" v-model="rank.desc" placeholder="（可选）主播的简介……"/>
					<field title="性别" v-model="rank.gender" :items='["女士","先生"]' type="radio"/>
					<field title="年龄" v-model="rank.age" placeholder="（可选）主播年龄" />

					<field title="现居地" v-model='rank.city' placeholder="（可选）主播常住城市"/>
					<field title="分类" v-model="rank.cata" placeholder="（可选）选择已有或输入新的主播分类名称" :data-list="catas"/>

					<field title="热度指数" v-model="rank.hot" placeholder="（可选）主播活跃度" />

					<field title="点赞" v-model="rank.meta.fav" placeholder="（可选）主播总赞数"/>
					<field title="回复" v-model="rank.meta.reply" placeholder="（可选）主播总回复评论数"/>
					<field title="分享" v-model="rank.meta.share" placeholder="（可选）主播总分享数"/>
					<field title="日榜" v-model="rank.meta.yest" placeholder="（可选）主播昨日成绩"/>
					<field title="周榜" v-model="rank.meta.week" placeholder="（可选）主播上周成绩"/>
					<field title="月榜" v-model="rank.meta.month" placeholder="（可选）主播上月排名"/>
					<field title="粉丝" v-model="rank.meta.fans" placeholder="（可选）主播总粉丝数"/>
					<field title="作品" v-model="rank.meta.works" placeholder="（可选）主播总作品数"/>

				</div>
			</block>
			<block class="file-block fields-box pr-80" :loading="!ready" v-if="rank.kind==4">
				<div style="width:8rem;margin:auto">
					<field title="标题" v-model="rank.title" placeholder="（可选）话题标题……" v-if="true"/>
					<field title="描述" v-model="rank.desc" placeholder="（可选）视频描述或主播的简介……" v-if="true"/>
					<field title="热度指数" v-model="rank.hot" placeholder="（可选）话题参与量……" />

				</div>
			</block>
			<!-- <block class="file-block fields-box pr-80" :loading="!ready">
				<div style="width:8rem;margin:auto">
					<field title="封面图片" :require="true" width="100,auto,*" desc="音乐、视频封面；主播头像。 1M以内jpg,png图片">
						<uploader class="p-10" v-model="rank.cover" def="https://res.shibu365.com/i/2019-03-22/7e3f3c7eb3084713a38d94bd5eb5c331.png" width="400" height="200" :auto="true"/>
					</field>

					<field title="标题" v-model="rank.title" placeholder="（可选）热门音乐或话题的名称标题……" v-if="true"/>
					<field title="抖音号" v-model="rank.dyid" placeholder="（可选）视频发布人 或 主播的抖音号或者……" v-if="true"/>
					<field title="昵称" v-model="rank.nick" placeholder="（可选）人气主播的昵称……" v-if="true"/>
					<field title="描述" v-model="rank.desc" placeholder="（可选）视频描述或主播的简介……" v-if="true"/>
					<field title="性别" v-model="rank.gender" :items='["女士","先生"]' type="radio"/>
					<field title="年龄" v-model="rank.age" placeholder="（可选）主播年龄" />

					<field title="现居地" v-model='rank.city' placeholder="（可选）主播常住城市"/>
					<field title="分类" v-model="rank.cata" placeholder="（可选）选择已有或输入新的主播分类名称" :data-list="catas"/>

					<field title="话题" v-model="rank.topic" placeholder="（可选）视频所属话题名称 ……" :data-list="topics"/>

					<field title="作品时长" v-model="rank.time" placeholder="（可选）视频或音乐的时长，单位为秒" />
					<field title="发布时间" v-model="rank.post_time" type="datetime-local" />
					<field title="标签">
						<tags-editor v-model="rank.tags" :hots="tags"  catch-perfix='rank_tags'/>
					</field>
					<field title="热度指数" v-model="rank.hot" placeholder="（可选）视频播放次数，音乐使用次数，主播活跃度，话题参与量……" />

					<field title="点赞" v-model="rank.meta.fav" placeholder="（可选）视频点赞数，或者主播总赞数"/>
					<field title="回复" v-model="rank.meta.fav" placeholder="（可选）视频回复评论数，或者主播总回复评论数"/>
					<field title="分享" v-model="rank.meta.fav" placeholder="（可选）视频分享次数，或者主播总分享数"/>
					<field title="音乐" v-model="rank.meta.music" placeholder="（可选）视频视频所用音乐"/>
					<field title="日榜" v-model="rank.meta.yest" placeholder="（可选）主播昨日成绩"/>
					<field title="周榜" v-model="rank.meta.week" placeholder="（可选）主播上周成绩"/>
					<field title="月榜" v-model="rank.meta.month" placeholder="（可选）主播上月排名"/>
					<field title="粉丝" v-model="rank.meta.fans" placeholder="（可选）主播总粉丝数"/>
					<field title="作品" v-model="rank.meta.works" placeholder="（可选）主播总作品数"/>

				</div>
			</block> -->
			<button class="btn-block btn-large btn-round theme dp-block ma-20" style="width:2rem" :disabled="!changed" @click="handlePost">提交</button>
		</article>
	</section>

</template>
<script>
	import http from '@/utils/http'
	export default {
		route:{
			path:['/pin/ranking/add','/pin/ranking/edit'],
			meta:{
				menu:'ranking',
				app:'pin'
			},

		},
		data() {
			let t = this.$route.query.t
			return {
				ready: false,
				kind:t,
				changed:false,
				tags: [],
				catas: [],
				topics:[],
				rank: {
					kind:t||1,
					tags:[],
					cata:'',
					topic:'',
					city:'',
					meta:{},
				},
				newtag: '',
			}

		},
		mounted(){
			var id = this.$route.query.id
			this.loadData(id||0)
		},
		computed:{

			pageTitle(){
				let t=this.rank.kind,
					pt
				switch(t){
				case '1':
					pt = '热门视频'
					break
				case '2':
					pt = '热门音乐'
					break
				case '3':
					pt = '人气主播'
					break
				case '4':
					pt = '热点话题'
					break
				default:
					pt='热门'
				}
				return pt
			}
		},
		watch:{
			rank:{
				handler(v){
					this.changed=true
				},
				deep:true
			},
		},
		methods:{
			/**
			 *    加载数据
			 *    @author poe
			 *    @date   2018-12-28T13:42:16+0800
			 */
			loadData(id){
				http.request('back/pindsh/edit_rank',{id:id||0},(rlt)=>{
					if (rlt.status==1) {
						this.tags = rlt.data.tags
						this.catas = rlt.data.catas
						this.topics = rlt.data.topics
						if (rlt.data.rank) {
							rlt.data.rank.tags = rlt.data.rank.tags ||[]
							rlt.data.rank.meta = rlt.data.rank.meta||{}
							this.rank = rlt.data.rank
						}
						this.ready=true
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
			
			},
			handlePost(){
				var rank=$$.extend(true,{},this.rank)

				if (rank.tags.length<=0) {
					rank.tags='-empty-'
				}

				var that = this
				http.request('back/pindsh/save_rank',rank,rlt=>{
					if (rlt.status==1) {
						if (this.rank.id) {
							$$.ui.modal('修改成功',{
								textAlign:'center',
								mask:true,
								cancel:false,
								confirm:()=>{
									that.$router.go(-1)
								}

							})
						}
						else{
							$$.ui.modal('发布成功',{
								textAlign:'center',
								mask:true,
								cancel:{
									text:'返回',
									callback:()=>{
										that.$router.go(-1)
									},
								},
								confirm:{
									text:'继续发布',
									callback:()=>{
										that.rank={
											kind:this.kind,
											tags:[],
											cata:'',
											topic:'',
											city:'',
											meta:{},
										}
										this.loadData()
									}
								}

							})
						}
						
					}
					else{
						$$.ui.modal(rlt.msg,{mask:true,cancel:false})
					}
				})
			},

			handleAdComplete(e){
				this.rank.city = ['北京市','天津市','上海市','重庆市'].indexOf(e.prov)>=0?e.prov+e.dist:e.prov+e.city+e.dist
			},
		}
	}
</script>
<style lang="scss">
	#rank-edit{
		.field{
			margin:.2rem 0;
		}
	}
</style>