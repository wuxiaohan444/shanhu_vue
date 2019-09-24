<template>
    <div id="data">
        <div class="data_head">
            <div class="data_head_top">
                <div v-for="(item,index) in titleText" :key="index" :class="titleIndex===index?'active':''"
                     @click="chooseTitle(index)">{{item}}
                </div>
            </div>
            <div class="data_head_bottom">
                <div v-for="(item,index) in timeType" :key="index" :class="timeIndex===index?'active':''"
                     @click="chooseTime(index)">{{item}}
                </div>
            </div>
        </div>
        <div class="data_income" v-show="titleIndex===0">
            <div class="income_table">
                <div class="income_table_item">
                    <p>￥{{incomeInfo.realPrice?incomeInfo.realPrice:0}}</p>
                    <div>收入总额</div>
                </div>
                <div class="income_table_item">
                    <p>￥{{incomeInfo.salePrice?incomeInfo.salePrice:0}}</p>
                    <div>销售收入</div>
                </div>
                <div class="income_table_item">
                    <p>￥{{incomeInfo.luckRealPrice?incomeInfo.luckRealPrice:0}}</p>
                    <div>营销收入</div>
                </div>
                <div class="income_table_item">
                    <p>￥{{incomeInfo.allCost?incomeInfo.allCost:0}}</p>
                    <div>成本</div>
                </div>
                <div class="income_table_item">
                    <p>￥{{incomeInfo.num?incomeInfo.num:0}}</p>
                    <div>订单总额</div>
                </div>
                <div class="income_table_item">
                    <p>￥{{incomeInfo.saleNum?incomeInfo.saleNum:0}}</p>
                    <div>销售订单</div>
                </div>
                <div class="income_table_item">
                    <p>￥{{incomeInfo.exceptionNum?incomeInfo.exceptionNum:0}}</p>
                    <div>异常订单</div>
                </div>
                <div class="income_table_item">
                    <p>￥{{incomeInfo.drawNum?incomeInfo.drawNum:0}}</p>
                    <div>其他订单</div>
                </div>
            </div>
            <div class="list_title">收入列表</div>
            <div class="list_table list_income" id="list_income" @scroll="scrollList1" ref="list1">
                <div class="tr">
                    <div>日期</div>
                    <div>总收入</div>
                    <div>销售收入</div>
                    <div>利润</div>
                </div>
                <div class="tr" v-for="(item,index) in incomeList" :index="index">
                    <div>{{item.dayTime}}</div>
                    <div>{{item.realPrice}}</div>
                    <div>{{item.saleIncome}}</div>
                    <div>{{item.incomePrice}}</div>
                </div>
                <div v-show="onEarth" class="on_earth">到底了</div>
            </div>
        </div>
        <div class="data_goods" v-show="titleIndex===1">
            <div class="goods_main">
                <div class="goods_main_title">商品分类销售比</div>
                <div class="goods_pie" id="goodsPie"></div>
            </div>
            <div class="goods_main">
                <div class="goods_main_title">商品热销Top5</div>
                <div class="goods_ranking">
                    <div class="li" v-for="(item,index) in hotTop" :key="index">
                        <span>{{item.goodName}}</span>
                        <div class="progress">
                            <div class="have blue" :style="{width:item.width+'%'}"></div>
                            <div class="none">{{item.countNum}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="goods_main">
                <div class="goods_main_title">商品滞销Top5</div>
                <div class="goods_ranking">
                    <div class="li" v-for="(item,index) in stopTop" :key="index">
                        <span>{{item.goodName}}</span>
                        <div class="progress">
                            <div class="have red" :style="{width:item.width+'%'}"></div>
                            <div class="none">{{item.countNum}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="data_device" v-show="titleIndex===2">
            <div class="device_name" @click="deviceDetails">
                <span>全部售货机</span>
                <img src="../../assets/images/right.png" alt="">
            </div>
            <div class="list_title">{{deviceType}}</div>
            <div class="list_table list_income" id="list_device" @scroll="scrollList2" ref="list2">
                <div class="tr">
                    <div>设备昵称</div>
                    <div>总收入</div>
                    <div>销售收入</div>
                    <div>利润</div>
                </div>
                <div class="tr" v-for="(item,index) in deviceList" :key="index">
                    <div>{{item.nickName}}</div>
                    <div>{{item.realPrice}}</div>
                    <div>{{item.saleIncome}}</div>
                    <div>{{item.incomePrice}}</div>
                </div>
                <div v-show="onEarth" class="on_earth">到底了</div>
            </div>
        </div>
        <div class="time_modal" v-show="modalShow" @click="clsoeModal">
            <div class="time_box" v-show="boxShow">
                <div class="time_item">
                    <span>开始时间：</span>
                    <div>{{startTime}}</div>
                </div>
                <div class="time_item">
                    <span>结束时间：</span>
                    <div>{{endTime}}</div>
                </div>
                <div class="time_btn">
                    <div @click="cancel">取消</div>
                    <div @click="affirm">确认</div>
                </div>
            </div>
        </div>
        <inlineCalendar mode="during" class="startTime" @change="chooseStartTime" v-show="timeShow"/>
    </div>
</template>

<script>
    export default {
        name: "dataAnalyze",
        data() {
            return {
                titleText: ['收入统计', '商品统计', '设备统计'],
                titleIndex: 0,
                timeType: ['今日', '本月', '上月', '自定义'],
                timeIndex: 0,
                dayType: 1,
                timeShow: false,
                modalShow: false,
                boxShow: false,
                startTime: '',
                endTime: '',
                hotTop: [],
                stopTop: [],
                deviceShow: false,
                incomeInfo: '',
                incomePage: 1,
                incomeList: [],//收入列表统计
                scrollFlag: true,
                onEarth: false,
                goodsClass: '',
                goodsName: '',
                deviceId: '',
                devicePage: 1,
                deviceList: [],
                deviceType: '全部售货机'
            }
        },
        created() {
            if (localStorage.getItem('deviceType')) {
                this.deviceId = localStorage.getItem('deviceId');
                this.deviceType = localStorage.getItem('deviceType');
                localStorage.removeItem('deviceId');
                localStorage.removeItem('deviceType');
                this.titleIndex = 2;
                this.chooseTime(this.timeIndex)
            } else {
                this.chooseTime(this.timeIndex)
            }
        },
        mounted() {

        },
        methods: {
            chooseTitle(index) {
                this.titleIndex = index;
                switch (index) {
                    case 0:
                        this.scrollFlag = true;
                        this.onEarth = false;
                        this.incomePage = 1;
                        this.incomeList = [];
                        this.getIncome();
                        this.getIncomeList();
                        break;
                    case 1:
                        this.goodsStatistics();
                        break;
                    case 2:
                        this.scrollFlag = true;
                        this.onEarth = false;
                        this.devicePage = 1;
                        this.deviceList = [];
                        this.getDeviceList();
                        break;
                }

            },
            chooseTime(index) {
                this.timeIndex = index;
                switch (index) {
                    case 0:
                        this.dayType = 1;
                        this.chooseTitle(this.titleIndex);
                        break;
                    case 1:
                        this.dayType = 5;
                        this.chooseTitle(this.titleIndex);
                        break;
                    case 2:
                        this.dayType = 6;
                        this.chooseTitle(this.titleIndex);
                        break;
                    case 3:
                        this.dayType = 7;
                        this.modalShow = true;
                        this.timeShow = true;
                }
            },
            chooseStartTime(date) {
                if (date.length > 1) {
                    this.startTime = date[0].format('YYYY-MM-DD');
                    this.endTime = date[1].format('YYYY-MM-DD');
                    this.timeShow = false;
                    this.boxShow = true;
                }
            },
            clsoeModal() {
                this.modalShow = false;
                this.timeShow = false;
            },
            // 收入统计
            getIncome() {
                this.$axios('get', 'partner/statics/income', {
                    dayType: this.dayType,
                    createTimeStar: this.startTime,
                    createTimeEnd: this.endTime
                }, (res) => {
                    this.incomeInfo = res.data;
                })
            },
            //收入统计列表
            getIncomeList() {
                this.$axios('get', 'partner/statics/incomeListPage', {
                    page: this.incomePage,
                    limit: '10',
                    dayType: this.dayType,
                    createTimeStar: this.startTime,
                    createTimeEnd: this.endTime
                }, (res) => {
                    this.incomeList = this.incomeList.concat(res.rows);
                    if (this.incomeList.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = this.page !== 1;
                        this.scrollFlag = false;
                    }
                })
            },
            //商品统计
            goodsStatistics() {
                // 商品分类
                this.$axios('get', 'partner/statics/classifyList', {
                    dayType: this.dayType,
                    createTimeStar: this.startTime,
                    createTimeEnd: this.endTime
                }, (res) => {
                    let goodsClass = [], goodsName = [];
                    for (let i = 0, data = res.data; i < data.length; i++) {
                        goodsClass.push({
                            name: data[i].className,
                            value: data[i].salePrice
                        });
                        goodsName.push(data[i].className)
                    }
                    this.goodsClass = goodsClass;
                    this.goodsName = goodsName;
                    this.drawPer();
                });
                //热销
                this.$axios('get', 'partner/statics/goodsTopList', {
                    dayType: this.dayType,
                    type: '2',
                    createTimeStar: this.startTime,
                    createTimeEnd: this.endTime
                }, (res) => {
                    let data = res.data;
                    this.hotTop = this.getProgress(data)
                });
                //滞销
                this.$axios('get', 'partner/statics/goodsTopList', {
                    dayType: this.dayType,
                    type: '1',
                    createTimeStar: this.startTime,
                    createTimeEnd: this.endTime
                }, (res) => {
                    let data = res.data;
                    this.stopTop = this.getProgress(data)
                })
            },
            // 取消自定义时间
            cancel() {
                this.modalShow = false;
                this.timeShow = false;
                this.boxShow = false;
                this.startTime = '';
                this.endTime = '';
            },
            //确定时间
            affirm() {
                this.modalShow = false;
                this.timeShow = false;
                this.boxShow = false;
                this.chooseTitle(this.titleIndex);
            },
            //画饼状图
            drawPer() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('goodsPie'));
                // 绘制图表
                myChart.setOption({
                    legend: {
                        orient: 'vertical',
                        right: '10%',
                        y: 'center',
                        data: this.goodsName
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            center: ['30%', '50%'],
                            radius: ['50%', '80%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.goodsClass
                        }
                    ]
                });
            },
            // 收入统计滚动
            scrollList1() {
                let a = this.$refs.list1.scrollHeight;
                let b = this.$refs.list1.clientHeight;
                let c = this.$refs.list1.scrollTop;
                if (a - (b + c) < 200 && this.scrollFlag && this.incomeList.length >= 10) {
                    this.scrollFlag = false;
                    this.incomePage++;
                    this.getIncomeList();
                }
            },
            // 渲染进度条
            getProgress(arr) {
                let maxArr = arr.map((num) => {
                    return num.countNum
                });
                let maxNumber = Math.max(...maxArr) + 30;
                for (let i = 0; i < arr.length; i++) {
                    arr[i].width = ((arr[i].countNum / maxNumber) * 100).toFixed(1);
                }
                return arr;
            },
            // 设备列表
            getDeviceList() {
                this.$axios('get', 'partner/statics/deviceList', {
                    dayType: this.dayType,
                    page: this.devicePage,
                    createTimeStar: this.startTime,
                    createTimeEnd: this.endTime,
                    id: this.deviceId
                }, (res) => {
                    this.deviceList = this.deviceList.concat(res.rows);
                    if (this.deviceList.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = this.page !== 1;
                        this.scrollFlag = false;
                    }
                });
            },

            // 设备统计滚动
            scrollList2() {
                let a = this.$refs.list2.scrollHeight;
                let b = this.$refs.list2.clientHeight;
                let c = this.$refs.list2.scrollTop;
                if (a - (b + c) < 200 && this.scrollFlag && this.deviceList.length >= 10) {
                    this.scrollFlag = false;
                    this.devicePage++;
                    this.getDeviceList();
                }
            },
            // 售货机列表
            deviceDetails() {
                this.$router.push({
                    path: '/deviceList'
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #data {
        height: 100%;
        background: #f2f2f2;
        overflow: scroll;
        .data_head {
            background: white;
            padding: 0 30px;
            padding-top: 10px;
            .data_head_top {
                height: 76px;
                display: flex;
                border: 2px solid #CEB267;
                border-radius: 8px;
                box-sizing: border-box;
                overflow: hidden;
                > div {
                    flex: 1;
                    text-align: center;
                    line-height: 76px;
                    font-size: 30px;
                    border-left: 2px solid #CEB267;
                }
                > div:nth-child(1) {
                    border-left: 0;
                }
                > div.active {
                    background: #CEB267;
                    color: white;
                }
            }
            .data_head_bottom {
                height: 80px;
                display: flex;
                > div {
                    flex: 1;
                    text-align: center;
                    line-height: 80px;
                }
                > div.active {
                    color: #595CA1;
                    border-bottom: 3px solid #595CA1;
                }
            }
        }
        .list_title {
            line-height: 70px;
            font-size: 26px;
            padding-left: 60px;
            position: relative;
        }
        .list_title:after {
            content: '';
            position: absolute;
            width: 6px;
            height: 30px;
            background: rgba(89, 92, 161, 1);
            border-radius: 3px;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
        }
        .list_table {
            .tr {
                display: flex;
                > div {
                    flex: 1;
                    text-align: center;
                    font-size: 30px;
                    line-height: 80px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .tr:nth-child(odd) {
                background: white;
            }
        }
        .data_income {
            padding-top: 20px;
            height: calc(~'100% - 166px');
            box-sizing: border-box;
            .income_table {
                margin: 0 20px;
                padding: 0 10px;
                background: white;
                display: flex;
                flex-flow: row wrap;
                border-radius: 8px;
                .income_table_item {
                    height: 150px;
                    width: 25%;
                    text-align: center;
                    padding-top: 20px;
                    box-sizing: border-box;
                    border-right: 2px solid #f2f2f2;
                    p {
                        color: #595CA1;
                        line-height: 60px;
                        font-size: 30px;
                    }
                    div {
                        font-size: 26px;
                        color: #666666;
                        line-height: 50px;
                    }
                }
                .income_table_item:nth-child(-n+4) {
                    border-bottom: 2px solid #f2f2f2;
                }
                .income_table_item:nth-child(4n) {
                    border-right: none;
                }
            }
        }
        .data_goods {
            .goods_main {
                background: white;
                border-radius: 8px;
                width: 710px;
                margin: 0 auto;
                margin-top: 20px;
                .goods_main_title {
                    width: 100%;
                    font-size: 30px;
                    line-height: 80px;
                    border-bottom: 2px solid #f2f2f2;
                    padding: 0 20px;
                    box-sizing: border-box;
                }
                .goods_pie {
                    width: 710px;
                    height: 250px;
                }
                .goods_ranking {
                    width: 100%;
                    padding: 20px;
                    box-sizing: border-box;
                    .li {
                        display: flex;
                        align-items: center;
                        margin: 12px 0;
                        color: #999999;
                        font-size: 24px;
                        span {
                            text-align: right;
                            padding-right: 10px;
                            box-sizing: border-box;
                            width: 20%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .progress {
                            width: 80%;
                            display: flex;
                            height: 44px;
                            background: #F4F4F7;
                            line-height: 44px;
                            .none {
                                text-indent: 10px;
                            }
                            .blue {
                                background: #54B7F5;
                            }
                            .red {
                                background: #F55454;
                            }
                        }
                    }
                }

            }
        }
        .data_device {
            height: calc(~'100% - 194px');
            .device_name {
                width: 690px;
                height: 80px;
                background: rgba(255, 255, 255, 1);
                border: 2px solid rgba(224, 224, 224, 1);
                border-radius: 8px;
                padding: 0 20px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 25px auto;

                span {
                    font-size: 30px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    line-height: 80px;
                }
                img {
                    width: 24px;
                }
            }
        }
        .time_modal { //时间模态框
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, .4);
            .time_box {
                width: 540px;
                height: 320px;
                background: white;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-radius: 10px;
                padding: 20px;
                box-sizing: border-box;
                .time_item {
                    display: flex;
                    line-height: 80px;
                    border-bottom: 2px solid #f2f2f2;
                    font-size: 30px;
                    > div {
                        width: 300px;
                        height: 80px;
                    }
                }
                .time_btn {
                    display: flex;
                    height: 88px;
                    line-height: 88px;
                    width: 100%;
                    justify-content: space-between;
                    text-align: center;
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    > div {
                        flex: 1;
                        border-top: 2px solid #E8E8EA;
                    }
                    > div:nth-child(1) {
                        border-right: 2px solid #E8E8EA;
                    }
                }
            }
        }
        .startTime {
            position: fixed;
            width: 100%;
            bottom: 0;
        }
        #list_income {
            height: calc(~'100% - 370px');
            overflow: scroll;
        }
        #list_device {
            height: calc(~'100% - 174px');
        }
        .on_earth {
            line-height: 50px;
            text-align: center;
        }
    }
</style>