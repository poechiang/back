<style scoped lang="scss">
	@import "@/assets/css/main.scss";
	@import "@/assets/css/plugin.scss";	
	#home-page .poeui-content-block{
		width:calc(50% - .15rem);
	}
</style>
<template>
	<div id="home-page" class="poeui-page">
		<article class="poeui-content-box ">
			<div class="flex-row">
				<block class="flex-item mr-30" title="代理商分布">
					<div ref="map" style="width:500px;height: 400px;margin:auto"></div>
				</block>
				<block class="flex-item" title="主要城市销量">
					<div ref="parallel" style="width:100%;height: 400px;margin:auto"></div>
				</block>
			</div>
			<block title="近期访问统计" style="width:100%">
				<div ref="line" style="width:100%;height: 400px;margin:auto"></div>
			</block>
			<div class="flex-row">
				<block class="flex-item mr-30" title="用户入口分布统计">
					<div ref="pie" style="width:100%;height: 400px;margin:auto"></div>
				</block>
				<block class="flex-item" style="background-color:#404A59;">
					<div ref="lines" style="width:500px;height: 400px;margin:auto"></div>
				</block>
			</div>
		</article>
	</div>

</template>
<script>
	import http from '@/utils/http'
	import 'echarts/map/js/china.js'
	
	export default {
		route:{
			path:['/','/home'],
			meta:{
				menu:'home',
			},
		},
		data() {
			return {
                pie: {
                	opinion:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
                	data:[
	                  {value:335, name:'直接访问'},
	                  {value:310, name:'邮件营销'},
	                  {value:234, name:'联盟广告'},
	                  {value:135, name:'视频广告'},
	                  {value:1548, name:'搜索引擎'}
	                ]
	            },
                line: {
                	opinion:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
                	data:[
	                  {value:335, name:'直接访问'},
	                  {value:310, name:'邮件营销'},
	                  {value:234, name:'联盟广告'},
	                  {value:135, name:'视频广告'},
	                  {value:1548, name:'搜索引擎'}
	                ]
	            }
			}

		},
		computed:{
		},
		mounted(){
			this.loadData()
			this.$nextTick(function() {
                this.drawPie()
                this.drawLine()
                this.drawMap()
                this.drawParallel()
                this.drawLines()
            })
		},
		watch:{
			pie:{
				handler:()=>{
					    this.drawPie('pie')
				},
				deep:true
			}
		},
		methods:{
			loadData(){
				return
				$$.ui.loading()
				http.request('res/Resource/get_res_list',{source:1,filter:this.$store.state.filter.value},(rlt)=>{
					$$.ui.hide()
					if (rlt.status==1) {
						this.files=rlt.data||[]
					}
					else{
						$$.ui.modal(rlt.msg,{cancel:false,textAlign:'center',mask:true})
					}
				})
			},

			drawPie() {
				var charts = this.$echarts.init(this.$refs.pie)
				charts.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{a}<br/>{b}:{c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: this.pie.opinion
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'blod'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.pie.data
					}]
				})
			},

			drawLine() {
				var i,data=[],
					charts = this.$echarts.init(this.$refs.line),
					now = new Date
				now.setDate(now.getDate()-365)
				for(i=365;i>=0;i--){
					data.push([now.format('Y-m-d'),parseInt(Math.random()*500)])
					now.setDate(now.getDate()+1)
				}
				charts.setOption({
			        tooltip: {
			            trigger: 'axis'
			        },
			        xAxis: {
			            data: data.map(function (item) {
			                return item[0];
			            })
			        },
			        yAxis: {
			            splitLine: {
			                show: false
			            }
			        },
			        dataZoom: [{
			            startValue: '2014-06-01'
			        }, {
			            type: 'inside'
			        }],
			        visualMap: {
			            top: 10,
			            right: 10,
			            pieces: [{
			                gt: 0,
			                lte: 50,
			                color: '#096'
			            }, {
			                gt: 50,
			                lte: 100,
			                color: '#ffde33'
			            }, {
			                gt: 100,
			                lte: 150,
			                color: '#ff9933'
			            }, {
			                gt: 150,
			                lte: 200,
			                color: '#cc0033'
			            }, {
			                gt: 200,
			                lte: 300,
			                color: '#660099'
			            }, {
			                gt: 300,
			                color: '#7e0023'
			            }],
			            outOfRange: {
			                color: '#999'
			            }
			        },
			        series: {
			            name: 'Beijing AQI',
			            type: 'line',
			            data: data.map(function (item) {
			                return item[1];
			            }),
			            markLine: {
			                silent: true,
			                data: [{
			                    yAxis: 50
			                }, {
			                    yAxis: 100
			                }, {
			                    yAxis: 150
			                }, {
			                    yAxis: 200
			                }, {
			                    yAxis: 300
			                }]
			            }
			        }
				})
			},
			drawMap() {
				var charts = this.$echarts.init(this.$refs.map)
				charts.setOption({
				    tooltip : {
				        trigger: 'item'
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        data:['五常大米','藜麦']
				    },
				    visualMap: {
				        min: 0,
				        max: 2500,
				        left: 'left',
				        top: 'bottom',
				        text:['高','低'],           // 文本，默认为数值文本
				        calculable : true
				    },
				    toolbox: {
				        show: true,
				        orient : 'vertical',
				        left: 'right',
				        top: 'center',
				        feature : {
				            mark : {show: true},
				            dataView : {show: true, readOnly: false},
				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
				    },
				    series : [
				        {
				            name: '五常大米',
				            type: 'map',
				            mapType: 'china',
				            roam: false,
				            label: {
				                normal: {
				                    show: false
				                },
				                emphasis: {
				                    show: true
				                }
				            },
				            data:[
				                {name: '北京',value: Math.round(Math.random()*1000)},
				                {name: '天津',value: Math.round(Math.random()*1000)},
				                {name: '上海',value: Math.round(Math.random()*1000)},
				                {name: '重庆',value: Math.round(Math.random()*1000)},
				                {name: '河北',value: Math.round(Math.random()*1000)},
				                {name: '河南',value: Math.round(Math.random()*1000)},
				                {name: '云南',value: Math.round(Math.random()*1000)},
				                {name: '辽宁',value: Math.round(Math.random()*1000)},
				                {name: '黑龙江',value: Math.round(Math.random()*1000)},
				                {name: '湖南',value: Math.round(Math.random()*1000)},
				                {name: '安徽',value: Math.round(Math.random()*1000)},
				                {name: '山东',value: Math.round(Math.random()*1000)},
				                {name: '新疆',value: Math.round(Math.random()*1000)},
				                {name: '江苏',value: Math.round(Math.random()*1000)},
				                {name: '浙江',value: Math.round(Math.random()*1000)},
				                {name: '江西',value: Math.round(Math.random()*1000)},
				                {name: '湖北',value: Math.round(Math.random()*1000)},
				                {name: '广西',value: Math.round(Math.random()*1000)},
				                {name: '甘肃',value: Math.round(Math.random()*1000)},
				                {name: '山西',value: Math.round(Math.random()*1000)},
				                {name: '内蒙古',value: Math.round(Math.random()*1000)},
				                {name: '陕西',value: Math.round(Math.random()*1000)},
				                {name: '吉林',value: Math.round(Math.random()*1000)},
				                {name: '福建',value: Math.round(Math.random()*1000)},
				                {name: '贵州',value: Math.round(Math.random()*1000)},
				                {name: '广东',value: Math.round(Math.random()*1000)},
				                {name: '青海',value: Math.round(Math.random()*1000)},
				                {name: '西藏',value: Math.round(Math.random()*1000)},
				                {name: '四川',value: Math.round(Math.random()*1000)},
				                {name: '宁夏',value: Math.round(Math.random()*1000)},
				                {name: '海南',value: Math.round(Math.random()*1000)},
				                {name: '台湾',value: Math.round(Math.random()*1000)},
				                {name: '香港',value: Math.round(Math.random()*1000)},
				                {name: '澳门',value: Math.round(Math.random()*1000)}
				            ]
				        },
				        {
				            name: '藜麦',
				            type: 'map',
				            mapType: 'china',
				            label: {
				                normal: {
				                    show: false
				                },
				                emphasis: {
				                    show: true
				                }
				            },
				            data:[
				                {name: '北京',value: Math.round(Math.random()*1000)},
				                {name: '天津',value: Math.round(Math.random()*1000)},
				                {name: '上海',value: Math.round(Math.random()*1000)},
				                {name: '重庆',value: Math.round(Math.random()*1000)},
				                {name: '河北',value: Math.round(Math.random()*1000)},
				                {name: '安徽',value: Math.round(Math.random()*1000)},
				                {name: '新疆',value: Math.round(Math.random()*1000)},
				                {name: '浙江',value: Math.round(Math.random()*1000)},
				                {name: '江西',value: Math.round(Math.random()*1000)},
				                {name: '山西',value: Math.round(Math.random()*1000)},
				                {name: '内蒙古',value: Math.round(Math.random()*1000)},
				                {name: '吉林',value: Math.round(Math.random()*1000)},
				                {name: '福建',value: Math.round(Math.random()*1000)},
				                {name: '广东',value: Math.round(Math.random()*1000)},
				                {name: '西藏',value: Math.round(Math.random()*1000)},
				                {name: '四川',value: Math.round(Math.random()*1000)},
				                {name: '宁夏',value: Math.round(Math.random()*1000)},
				                {name: '香港',value: Math.round(Math.random()*1000)},
				                {name: '澳门',value: Math.round(Math.random()*1000)}
				            ]
				        }
				    ]
				})
			},
			drawParallel(){
				var dataBJ = [
				    [1,18,6,"滞销"],
				    [2,21,34,"滞销"],
				    [3,63,14,"滞销"],
				    [4,16,6,"滞销"],
				    [5,42,40,"滞销"],
				    [6,68,33,"滞销"],
				    [7,48,27,"滞销"],
				    [8,59,29,"滞销"],
				    [9,108,64,"脱销"],
				    [10,185,27,"畅销"],
				    [11,39,19,"滞销"],
				    [12,41,11,"滞销"],
				    [13,64,38,"滞销"],
				    [14,108,79,"滞销"],
				    [15,108,63,"滞销"],
				    [16,33,6,"滞销"],
				    [17,94,66,"滞销"],
				    [18,186,42,"畅销"],
				    [19,57,31,"滞销"],
				    [20,22,8,"滞销"],
				    [21,39,15,"滞销"],
				    [22,94,69,"滞销"],
				    [23,99,73,"滞销"],
				    [24,31,12,"滞销"],
				    [25,42,27,"滞销"],
				    [26,154,17,"畅销"],
				    [27,234,85,"脱销"],
				    [28,160,20,"畅销"],
				    [29,134,96,"滞销"],
				    [30,52,24,"滞销"],
				    [31,46,5,"滞销"]
				];

				var dataGZ = [
				    [1,26,37,"滞销"],
				    [2,85,62,"滞销"],
				    [3,78,38,"滞销"],
				    [4,21,21,"滞销"],
				    [5,41,42,"滞销"],
				    [6,56,52,"滞销"],
				    [7,64,30,"滞销"],
				    [8,55,48,"滞销"],
				    [9,76,85,"滞销"],
				    [10,91,81,"滞销"],
				    [11,84,39,"滞销"],
				    [12,64,51,"滞销"],
				    [13,70,69,"滞销"],
				    [14,77,5,"滞销"],
				    [15,109,68,"滞销"],
				    [16,73,68,"滞销"],
				    [17,54,27,"滞销"],
				    [18,51,61,"滞销"],
				    [19,91,71,"滞销"],
				    [20,73,2,"滞销"],
				    [21,73,50,"滞销"],
				    [22,84,94,"滞销"],
				    [23,93,77,"滞销"],
				    [24,99,30,"滞销"],
				    [25,146,84,"滞销"],
				    [26,113,8,"滞销"],
				    [27,81,48,"滞销"],
				    [28,56,48,"滞销"],
				    [29,82,92,"滞销"],
				    [30,106,16,"滞销"],
				    [31,118,50,"滞销"]
				];

				var dataSH = [
				    [1,91,45,"滞销"],
				    [2,65,27,"滞销"],
				    [3,83,60,"滞销"],
				    [4,109,81,"滞销"],
				    [5,106,77,"滞销"],
				    [6,109,81,"滞销"],
				    [7,106,77,"滞销"],
				    [8,89,65,"滞销"],
				    [9,53,33,"滞销"],
				    [10,80,55,"滞销"],
				    [11,117,81,"滞销"],
				    [12,99,71,"滞销"],
				    [13,95,69,"滞销"],
				    [14,116,87,"滞销"],
				    [15,108,80,"滞销"],
				    [16,134,83,"滞销"],
				    [17,79,43,"滞销"],
				    [18,71,46,"滞销"],
				    [19,97,71,"滞销"],
				    [20,84,57,"滞销"],
				    [21,87,63,"滞销"],
				    [22,104,77,"滞销"],
				    [23,87,62,"滞销"],
				    [24,168,28,"畅销"],
				    [25,65,45,"滞销"],
				    [26,39,24,"滞销"],
				    [27,39,24,"滞销"],
				    [28,93,68,"滞销"],
				    [29,188,43,"畅销"],
				    [30,174,31,"畅销"],
				    [31,187,43,"畅销"]
				];

				var schema = [
				    {name: 'date', index: 0, text: '日期'},
				    {name: 'AQIindex', index: 1, text: '五常大米'},
				    {name: 'PM25', index: 2, text: '藜麦'},
				    {name: '等级', index: 3, text: '等级'}
				];

				var lineStyle = {
				    normal: {
				        width: 1,
				        opacity: 0.5
				    }
				};

				this.$echarts.init(this.$refs.parallel).setOption({
				    color: [
				        '#ff9800', '#2196f3', '#009688'
				    ],
				    legend: {
				        top: 10,
				        data: ['北京', '上海', '广州'],
				        itemGap: 20
				    },
				    parallelAxis: [
				        {dim: 0, name: schema[0].text, inverse: true, max: 31, nameLocation: 'start'},
				        {dim: 1, name: schema[1].text},
				        {dim: 2, name: schema[2].text},
				        {dim: 7, name: schema[3].text,type: 'category', data: ['滞销', '畅销', '脱销']}
				    ],
				    parallel: {
				        left: '5%',
				        right: '13%',
				        bottom: '10%',
				        top: '20%',
				        parallelAxisDefault: {
				            type: 'value',
				            name: 'AQI指数',
				            nameLocation: 'end',
				            nameGap: 20,
				            nameTextStyle: {
				                fontSize: 12
				            }
				        }
				    },
				    series: [
				        {
				            name: '北京',
				            type: 'parallel',
				            lineStyle: lineStyle,
				            data: dataBJ
				        },
				        {
				            name: '上海',
				            type: 'parallel',
				            lineStyle: lineStyle,
				            data: dataSH
				        },
				        {
				            name: '广州',
				            type: 'parallel',
				            lineStyle: lineStyle,
				            data: dataGZ
				        }
				    ]
				})
			},
			drawLines(){
				var geoCoordMap = {
				    '上海': [121.4648,31.2891],
				    '东莞': [113.8953,22.901],
				    '东营': [118.7073,37.5513],
				    '中山': [113.4229,22.478],
				    '临汾': [111.4783,36.1615],
				    '临沂': [118.3118,35.2936],
				    '丹东': [124.541,40.4242],
				    '丽水': [119.5642,28.1854],
				    '乌鲁木齐': [87.9236,43.5883],
				    '佛山': [112.8955,23.1097],
				    '保定': [115.0488,39.0948],
				    '兰州': [103.5901,36.3043],
				    '包头': [110.3467,41.4899],
				    '北京': [116.4551,40.2539],
				    '北海': [109.314,21.6211],
				    '南京': [118.8062,31.9208],
				    '南宁': [108.479,23.1152],
				    '南昌': [116.0046,28.6633],
				    '南通': [121.1023,32.1625],
				    '厦门': [118.1689,24.6478],
				    '台州': [121.1353,28.6688],
				    '合肥': [117.29,32.0581],
				    '呼和浩特': [111.4124,40.4901],
				    '咸阳': [108.4131,34.8706],
				    '哈尔滨': [127.9688,45.368],
				    '唐山': [118.4766,39.6826],
				    '嘉兴': [120.9155,30.6354],
				    '大同': [113.7854,39.8035],
				    '大连': [122.2229,39.4409],
				    '天津': [117.4219,39.4189],
				    '太原': [112.3352,37.9413],
				    '威海': [121.9482,37.1393],
				    '宁波': [121.5967,29.6466],
				    '宝鸡': [107.1826,34.3433],
				    '宿迁': [118.5535,33.7775],
				    '常州': [119.4543,31.5582],
				    '广州': [113.5107,23.2196],
				    '廊坊': [116.521,39.0509],
				    '延安': [109.1052,36.4252],
				    '张家口': [115.1477,40.8527],
				    '徐州': [117.5208,34.3268],
				    '德州': [116.6858,37.2107],
				    '惠州': [114.6204,23.1647],
				    '成都': [103.9526,30.7617],
				    '扬州': [119.4653,32.8162],
				    '承德': [117.5757,41.4075],
				    '拉萨': [91.1865,30.1465],
				    '无锡': [120.3442,31.5527],
				    '日照': [119.2786,35.5023],
				    '昆明': [102.9199,25.4663],
				    '杭州': [119.5313,29.8773],
				    '枣庄': [117.323,34.8926],
				    '柳州': [109.3799,24.9774],
				    '株洲': [113.5327,27.0319],
				    '武汉': [114.3896,30.6628],
				    '汕头': [117.1692,23.3405],
				    '江门': [112.6318,22.1484],
				    '沈阳': [123.1238,42.1216],
				    '沧州': [116.8286,38.2104],
				    '河源': [114.917,23.9722],
				    '泉州': [118.3228,25.1147],
				    '泰安': [117.0264,36.0516],
				    '泰州': [120.0586,32.5525],
				    '济南': [117.1582,36.8701],
				    '济宁': [116.8286,35.3375],
				    '海口': [110.3893,19.8516],
				    '淄博': [118.0371,36.6064],
				    '淮安': [118.927,33.4039],
				    '深圳': [114.5435,22.5439],
				    '清远': [112.9175,24.3292],
				    '温州': [120.498,27.8119],
				    '渭南': [109.7864,35.0299],
				    '湖州': [119.8608,30.7782],
				    '湘潭': [112.5439,27.7075],
				    '滨州': [117.8174,37.4963],
				    '潍坊': [119.0918,36.524],
				    '烟台': [120.7397,37.5128],
				    '玉溪': [101.9312,23.8898],
				    '珠海': [113.7305,22.1155],
				    '盐城': [120.2234,33.5577],
				    '盘锦': [121.9482,41.0449],
				    '石家庄': [114.4995,38.1006],
				    '福州': [119.4543,25.9222],
				    '秦皇岛': [119.2126,40.0232],
				    '绍兴': [120.564,29.7565],
				    '聊城': [115.9167,36.4032],
				    '肇庆': [112.1265,23.5822],
				    '舟山': [122.2559,30.2234],
				    '苏州': [120.6519,31.3989],
				    '莱芜': [117.6526,36.2714],
				    '菏泽': [115.6201,35.2057],
				    '营口': [122.4316,40.4297],
				    '葫芦岛': [120.1575,40.578],
				    '衡水': [115.8838,37.7161],
				    '衢州': [118.6853,28.8666],
				    '西宁': [101.4038,36.8207],
				    '西安': [109.1162,34.2004],
				    '贵阳': [106.6992,26.7682],
				    '连云港': [119.1248,34.552],
				    '邢台': [114.8071,37.2821],
				    '邯郸': [114.4775,36.535],
				    '郑州': [113.4668,34.6234],
				    '鄂尔多斯': [108.9734,39.2487],
				    '重庆': [107.7539,30.1904],
				    '金华': [120.0037,29.1028],
				    '铜川': [109.0393,35.1947],
				    '银川': [106.3586,38.1775],
				    '镇江': [119.4763,31.9702],
				    '长春': [125.8154,44.2584],
				    '长沙': [113.0823,28.2568],
				    '长治': [112.8625,36.4746],
				    '阳泉': [113.4778,38.0951],
				    '青岛': [120.4651,36.3373],
				    '韶关': [113.7964,24.7028]
				};

				var BJData = [
				    [{name:'北京'}, {name:'上海',value:95}],
				    [{name:'北京'}, {name:'广州',value:90}],
				    [{name:'北京'}, {name:'大连',value:80}],
				    [{name:'北京'}, {name:'南宁',value:70}],
				    [{name:'北京'}, {name:'南昌',value:60}],
				    [{name:'北京'}, {name:'拉萨',value:50}],
				    [{name:'北京'}, {name:'长春',value:40}],
				    [{name:'北京'}, {name:'包头',value:30}],
				    [{name:'北京'}, {name:'重庆',value:20}],
				    [{name:'北京'}, {name:'常州',value:10}]
				];

				var SHData = [
				    [{name:'上海'},{name:'包头',value:95}],
				    [{name:'上海'},{name:'昆明',value:90}],
				    [{name:'上海'},{name:'广州',value:80}],
				    [{name:'上海'},{name:'郑州',value:70}],
				    [{name:'上海'},{name:'长春',value:60}],
				    [{name:'上海'},{name:'重庆',value:50}],
				    [{name:'上海'},{name:'长沙',value:40}],
				    [{name:'上海'},{name:'北京',value:30}],
				    [{name:'上海'},{name:'丹东',value:20}],
				    [{name:'上海'},{name:'大连',value:10}]
				];

				var GZData = [
				    [{name:'广州'},{name:'福州',value:95}],
				    [{name:'广州'},{name:'太原',value:90}],
				    [{name:'广州'},{name:'长春',value:80}],
				    [{name:'广州'},{name:'重庆',value:70}],
				    [{name:'广州'},{name:'西安',value:60}],
				    [{name:'广州'},{name:'成都',value:50}],
				    [{name:'广州'},{name:'常州',value:40}],
				    [{name:'广州'},{name:'北京',value:30}],
				    [{name:'广州'},{name:'北海',value:20}],
				    [{name:'广州'},{name:'海口',value:10}]
				];

				var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

				var convertData = function (data) {
				    var res = [];
				    for (var i = 0; i < data.length; i++) {
				        var dataItem = data[i];
				        var fromCoord = geoCoordMap[dataItem[0].name];
				        var toCoord = geoCoordMap[dataItem[1].name];
				        if (fromCoord && toCoord) {
				            res.push({
				                fromName: dataItem[0].name,
				                toName: dataItem[1].name,
				                coords: [fromCoord, toCoord]
				            });
				        }
				    }
				    return res;
				};

				var color = ['#a6c84c', '#ffa022', '#46bee9'];
				var series = [];
				[['北京', BJData], ['上海', SHData], ['广州', GZData]].forEach(function (item, i) {
				    series.push({
				        name: item[0] + ' Top10',
				        type: 'lines',
				        zlevel: 1,
				        effect: {
				            show: true,
				            period: 6,
				            trailLength: 0.7,
				            color: '#fff',
				            symbolSize: 3
				        },
				        lineStyle: {
				            normal: {
				                color: color[i],
				                width: 0,
				                curveness: 0.2
				            }
				        },
				        data: convertData(item[1])
				    },
				    {
				        name: item[0] + ' Top10',
				        type: 'lines',
				        zlevel: 2,
				        symbol: ['none', 'arrow'],
				        symbolSize: 10,
				        effect: {
				            show: true,
				            period: 6,
				            trailLength: 0,
				            symbol: planePath,
				            symbolSize: 15
				        },
				        lineStyle: {
				            normal: {
				                color: color[i],
				                width: 1,
				                opacity: 0.6,
				                curveness: 0.2
				            }
				        },
				        data: convertData(item[1])
				    },
				    {
				        name: item[0] + ' Top10',
				        type: 'effectScatter',
				        coordinateSystem: 'geo',
				        zlevel: 2,
				        rippleEffect: {
				            brushType: 'stroke'
				        },
				        label: {
				            normal: {
				                show: true,
				                position: 'right',
				                formatter: '{b}'
				            }
				        },
				        symbolSize: function (val) {
				            return val[2] / 8;
				        },
				        itemStyle: {
				            normal: {
				                color: color[i]
				            }
				        },
				        data: item[1].map(function (dataItem) {
				            return {
				                name: dataItem[1].name,
				                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
				            };
				        })
				    });
				});

				this.$echarts.init(this.$refs.lines).setOption({
				    backgroundColor: '#404a59',
				    title : {
				        text: '物流',
				        left: 'center',
				        textStyle : {
				            color: '#fff'
				        }
				    },
				    tooltip : {
				        trigger: 'item'
				    },
				    legend: {
				        orient: 'vertical',
				        top: 'bottom',
				        left: 'right',
				        data:['北京 Top10', '上海 Top10', '广州 Top10'],
				        textStyle: {
				            color: '#fff'
				        },
				        selectedMode: 'single'
				    },
				    geo: {
				        map: 'china',
				        label: {
				            emphasis: {
				                show: false
				            }
				        },
				        roam: true,
				        itemStyle: {
				            normal: {
				                areaColor: '#323c48',
				                borderColor: '#404a59'
				            },
				            emphasis: {
				                areaColor: '#2a333d'
				            }
				        }
				    },
				    series: series
				})
			}
		}
	}
</script>