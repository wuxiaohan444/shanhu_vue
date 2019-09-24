<template>
    <div id="inventory">
        <div class="inventory_title">
            <div :class="titleIndex===index?'active':''" v-for="(item,index) in titleArr" :key="index"
                 @click="chooseTitle(index)">{{item}}
            </div>
        </div>
        <div class="channel_main" v-if="titleIndex===0">
            <div class="channel_left">
                <div :class="tierIndex===index?'left_item active':'left_item'" v-for="(item,index) in tierNumber"
                     :key="index" @click="chooseTier(index,item)">
                    {{item}}
                </div>
            </div>
            <div class="channel_right">
                <div class="channel_title">{{tierList.floor}}</div>
                <div class="channel_goods" v-for="(item,index) in tierList.channelList" :key="index">
                    <div class="goods_img">
                        <img :src="ip+item.foo.goods.img">
                    </div>
                    <div class="goods_info">
                        <div>{{item.foo.goods.name}}</div>
                        <p>货道编号：{{item.realNo}}</p>
                    </div>
                    <div class="goods_number">
                        <img :src="item.choose===1?require('../../assets/images/noxuan2.png'):require('../../assets/images/noxuan1.png')" alt="" @click="chooseChannel(item.choose,index)">
                        <p>数量：<span>{{item.num}}/{{item.maxNum}}</span></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="save_btn" @click="capacity" v-if="titleIndex===0">容量调整</div>
        <div class="modal" v-show="adjustShow">
            <div class="modal_box">
                <h5>容量调整</h5>
                <input type="text" placeholder="填写调整数量" oninput="value=value.replace(/[^\d]/g,'')" v-model="adjustNumber">
                <div class="modal_btn">
                    <div class="cancel" @click="cancel">取消</div>
                    <div class="affirm" @click="listenerConfirm">确认</div>
                </div>
            </div>
        </div>

        <!--商品-->
        <div class="goods-main" v-if="titleIndex===1">
            <div style="background: white;margin-bottom: 10px">
                <div class="statistics">
                    <div>
                        <div>{{countNumber}}</div>
                        <div>库存容量</div>
                    </div>
                    <div>
                        <div>{{nowNumber}}</div>
                        <span>库存数量</span>
                    </div>
                </div>
                <div class="goods-main_title">库存占比</div>
                <div class="progress">
                    <div class="have" :style="{width: width+'px'}"></div>
                </div>
                <div class="describe"> 当前库存占比<span>{{percentage}}%</span></div>
            </div>
            <div class="goods-main-item" v-for="(item,index) in goodsList" :key="index">
                <img :src="ip+item.img">
                <div class="goods-main-info">
                    <div>{{item.name}}</div>
                    <div>￥{{item.price}}</div>
                </div>
                <div class="goods-number"> 数量 :
                    <span>{{item.foo.num}}</span>/{{item.foo.maxNum}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "inventory",
        data() {
            return {
                titleArr: ['货道查看', '商品查看'],
                titleIndex: 0,
                deviceId: '',
                tierInfo: '',//货道详情
                tierList: [],
                tierIndex: 0,
                countData: '',
                ip: this.fixedIp(),
                textHiht: false,
                goodsList: [],
                adjustShow: false,
                adjustNumber: '',
                tierNumber: '',
                width: 0,
                percentage: '',//商品百分比
                countNumber: 0,//总容量
                nowNumber: 0,//现在的数量
            }
        },
        created() {
            this.deviceId = this.$route.query.id;
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.$axios('get', '/partner/device/traditionalDeviceGoodsByFloor', {deviceId: this.deviceId}, (res) => {
                    let data = res.data;
                    this.tierNumber = data.map((a) => {
                        return a.floor
                    });
                    this.countData = data;
                    this.getTier(data, this.tierNumber[this.tierIndex])
                })
            },

            // 商品信息

            getGoodsInfo() {
                this.$axios('get', '/partner/device/traditionalDeviceGoodsByGoods', {deviceId: this.deviceId}, (res) => {
                    let data = res.data;
                    this.goodsList = data.goodList;
                    this.countNumber = data.maxNumCount;
                    this.nowNumber = data.numCount;
                    let percentage = ((this.nowNumber / this.countNumber) * 100).toFixed(1);
                    this.percentage = percentage;
                    this.width = (690 * percentage) / 100;
                })
            },

            getTier(data, tierNumber) {
                let tierList;
                for (let i = 0; i < data.length; i++) {
                    if (tierNumber === data[i].floor) {
                        tierList = data[i];
                    }
                }
                let tierList1 = [];
                tierList.channelList.reduce((item, next) => {
                    next.foo.hasOwnProperty("goods") && tierList1.push(next);
                    return next;
                }, {foo: {}});
                tierList1.map((num) => {
                    num.choose = 0;
                });
                tierList.channelList = tierList1;

                this.tierList = tierList;
                if (tierList.channelList === 0) {
                    this.textHiht = true
                }
            },
            // 选择层数
            chooseTier(index, content) {
                this.tierIndex = index;
                this.getTier(this.countData, content)
            },
            chooseTitle(index) {
                this.titleIndex = index;
                if (index === 1) {
                    this.getGoodsInfo();
                }
            },
            cancel() {
                this.adjustShow = false;
            },
            capacity() {
                this.adjustShow = true;
            },
            listenerConfirm() {
                let channelGoodsIds = [];
                for (let i = 0; i < this.tierList.channelList.length; i++) {
                    if (this.tierList.channelList[i].choose === 1) {
                        channelGoodsIds.push(this.tierList.channelList[i].id)
                    }
                }
                this.$axios("post", '/partner/device/adjustMaxNum', {
                    channelGoodsIds: channelGoodsIds.join(','),
                    num: this.adjustNumber
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.getInfo();
                    this.adjustShow = false;
                });
            },
            chooseChannel(choose, index) {
                if (choose === 0) {
                    this.tierList.channelList[index].choose = 1;
                } else if (choose === 1) {
                    this.tierList.channelList[index].choose = 0;
                }
                this.$forceUpdate()
            }
        }
    }
</script>

<style scoped lang="less">
    #inventory {
        height: 100%;
        .inventory_title {
            background-color: white;
            display: flex;
            justify-content: center;
            height: 88px;
            > div {
                height: 88px;
                line-height: 88px;
                width: 300px;
                text-align: center;
                color: #999999;
                font-size: 30px;
            }
            > div.active {
                color: #333333;
                position: relative;
            }
            > div.active:after {
                content: '';
                position: absolute;
                width: 60px;
                height: 6px;
                background-color: #595ca1;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
        }
        .channel_main {
            height: calc(~'100% - 186px');
            overflow: scroll;
            display: flex;
            .channel_left {
                width: 180px;
                background: #f2f2f2;
                .left_item {
                    height: 100px;
                    line-height: 100px;
                    text-align: center;
                    font-size: 28px;
                    color: #333333;
                    position: relative;
                }
                .left_item:after {
                    content: '';
                    position: absolute;
                    width: 80px;
                    height: 2px;
                    background-color: #e5e5e5;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .active {
                    background: white;
                }
                .active:after {
                    content: '';
                    position: absolute;
                    width: 80px;
                    height: 2px;
                    background-color: white;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            .channel_right {
                color: #333333;
                flex: 2;
                margin-left: 20px;
                overflow: scroll;
                .channel_title {
                    font-size: 28px;
                    text-align: center;
                    line-height: 70px;
                    border-bottom: 2px solid #EBE9E9;
                }
                .channel_goods {
                    padding: 30px 0;
                    display: flex;
                    border-bottom: 2px solid #EBE9E9;
                    .goods_img {
                        width: 100px;
                        height: 100px;
                        margin-right: 20px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .goods_info {
                        flex: 1;
                        > div {
                            font-size: 28px;
                            line-height: 40px;
                            height: 40px;
                            display: inline;
                        }
                        > p {
                            font-size: 26px;
                            color: #999999;
                            line-height: 60px;
                        }
                    }
                    .goods_number {
                        margin-right: 30px;
                        text-align: right;
                        img {
                            width: 40px;
                            height: 40px;
                        }
                        p {
                            font-size: 28px;
                            line-height: 60px;
                            span {
                                color: #595ca1;
                            }
                        }
                    }
                }
            }
        }
        /*商品*/
        .goods-main {
            background: #f2f2f2;
            height: calc(~'100% - 90px');
            overflow: scroll;
            .statistics {
                display: flex;
                > div {
                    flex: 1;
                    text-align: center;
                    font-size: 26px;
                    height: 120px;
                    > div {
                        font-weight: bold;
                        line-height: 60px;
                    }
                    > span {
                        color: #999999;
                        line-height: 60px;
                    }
                }
                > div:nth-child(1) {
                    box-shadow: 1px 0 0 0 rgba(213, 213, 213, 1);
                }
            }
            .goods-main_title {
                font-size: 26px;
                line-height: 60px;
                background: white;
                padding: 0 30px;
            }
            .progress {
                width: 690px;
                height: 10px;
                border-radius: 5px;
                overflow: hidden;
                margin: 0 auto;
                background: #DFDFDF;
                .have {
                    background: #CEB267;
                    height: 10px;
                }

            }
            .describe {
                font-size: 24px;
                color: #999999;
                line-height: 50px;
                padding-left: 30px;
                span {
                    color: #CEB267;
                }
            }
            .goods-main-item {
                height: 190px;
                box-shadow: 0 2px 0 0 rgba(35, 24, 21, 0.1);
                display: flex;
                align-items: center;
                padding: 0 20px;
                font-size: 28px;
                color: #333333;
                background: white;
                margin-bottom: 2px;
                img {
                    width: 130px;
                    height: 130px;
                }
                .goods-main-info {
                    width: 400px;
                    margin-left: 20px;
                    > div {
                        line-height: 60px;
                    }
                }
                .goods-number {
                    width: 175px;
                    text-align: right;
                    span {
                        color: #595CA1;
                    }
                }
            }
        }
        .modal {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            position: fixed;
            top: 0;
            left: 0;
            .modal_box {
                width: 590px;
                height: 360px;
                background: #ffffff;
                border-radius: 8px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                h5 {
                    line-height: 88px;
                    height: 88px;
                    text-align: center;
                    font-size: 32px;
                    border-bottom: 2px solid rgba(34, 24, 21, 0.1);
                    box-sizing: border-box;
                }
                input {
                    height: 80px;
                    width: 550px;
                    margin: 52px 20px;
                    border-bottom: 2px solid rgba(34, 24, 21, 0.5);
                    box-sizing: border-box;
                    color: #666666;
                }
                .modal_btn {
                    border-top: 2px solid rgba(34, 24, 21, 0.1);
                    height: 88px;
                    line-height: 88px;
                    box-sizing: border-box;
                    display: flex;
                    > div {
                        flex: 1;
                        text-align: center;
                        font-size: 32px;
                    }
                    .cancel {
                        border-right: 2px solid rgba(34, 24, 21, 0.1);
                    }
                }
            }
        }
    }
</style>