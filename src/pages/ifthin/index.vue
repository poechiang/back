<template>
	<div class="poeui-page">
		<article class="poeui-content-box">
			
			<block title="今日打卡" style="width:100%">
				<div ref="line" style="width:100%;height: 400px;margin:auto"></div>
			</block>
		</article>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import Vue from 'vue'
	var swiper
	export default {
		route:{
			path:['/ifthin','/ifthin/index'],
			meta:{
				menu:'home',
				app:'ifthin'
			},
		},
		data() {
			return {}
		},
		computed:{
		},
		mounted(){
			this.$nextTick(function() {
                // this.drawPie()
                this.drawLine()
                // this.drawMap()
                // this.drawParallel()
                // this.drawLines()
            })
		},
		watch:{
		},
		methods:{
			formatNumber(v){
				return v<10?'0'+v:v
			},
			drawLine() {
				var i,data=[],h,m,H,M,dataZoom,
					charts = this.$echarts.init(this.$refs.line),
					now = new Date
				H = now.getHours()
				M = this.formatNumber(now.getMinutes())
				dataZoom = H > 0 ? { startValue: this.formatNumber(H-1)+':'+M } : {}

				M = H*60 +parseInt(M)
				for(i=0;i<=M;i++){
					h = this.formatNumber(parseInt(i/60))
					m = this.formatNumber(i%60)
					data.push([h+':'+m, parseInt(Math.random()*500), parseInt(Math.random()*500)])
				}
				charts.setOption({
			        tooltip: {
			            trigger: 'axis',
			            //formatter:'打卡时间：{b}<br>{a0}：{c0}<br>{a1}：{c1}'
			        },
			        xAxis: {
			            data: data.map(function (item) {
			                return item[0];
			            })
			        },
			        yAxis: {
			            type:'value',
			        },
				    legend: {
				        data:['体重打卡','三餐打卡'],
				    },
				    grid: {
				        left: '0',
				        right: '0',
				        bottom: '60',
        				containLabel: true
				    },
			        toolbox: {
			            feature: {
			                restore: {},
			                saveAsImage: {}
			            }
			        },
			        dataZoom: [dataZoom,{type:'inside'}],
			        series: [{
			            name: '体重打卡',
			            type: 'line',
			            data: data.map(function (item) {
			                return item[1];
			            }),
			        },{
			            name: '三餐打卡',
			            type: 'line',
			            data: data.map(function (item) {
			                return item[2];
			            }),
			        }]
				})
			},
		}
	}
</script>
<style scoped lang="scss">
</style>