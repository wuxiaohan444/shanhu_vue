<template>
    <div id="order">
        <div class="order_class">
            <div class="order_class_main">
                <div :class="classIndex===index?'active':''" v-for="(item,index) in classText"
                     @click="chooseClass(index)">{{item}}
                </div>
            </div>
        </div>
        <div class="order_main">
            <div class="order_main_class">
                <div :class="typeIndex===index?'active':''" v-for="(item,index) in typeText" :key="index" @click="chooseType(index)">{{item}}
                </div>
            </div>
            <div class="order_list" @scroll="scrollList" ref="list">
                <div class="order_list_item" v-for="(item,index) in goodsItem" :key="index">
                    <div class="order_item_top">
                        <span class="time">{{item.createTime}}</span>
                        <p  :class="item.status===9?'status success':'status error'">
                            {{item.status===9?'出货成功':item.status===0?"未支付":item.status===10?"无需出货":item.status===13?"存货":"出货失败"}}</p>
                        <button @click="lookDetails(item.id)">查看详情</button>
                    </div>
                    <div class="order_item_middle" v-for="(goods,sonIndex) in item.goods" :key="sonIndex">
                        <div class="goods_img">
                            <img :src="ip+goods.img" alt="">
                        </div>
                        <div class="goods_name">{{goods.name}}</div>
                        <div class="goods_info">
                            <p class="price">￥{{goods.price}}</p>
                            <p class="number">x{{goods.num}}</p>
                            <p class="shipment" v-if="item.status===9">出货口：{{goods.showNo}}</p>
                        </div>
                    </div>
                    <div class="order_item_bottom">
                        <span class="no">单号：{{item.no}}</span>
                        <div class="out-of-pocket">实付：<span>￥{{item.price}}</span></div>
                    </div>
                </div>
                <div v-show="onEarth" class="on_earth">到底了</div>
                <div class="no_data" v-show="noData">
                    <img src="../../assets/images/no-order.png" alt="">
                    <p>暂无订单</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "order",
        data() {
            return {
                ip: this.fixedIp(),
                classText: ['订单管理', '营销管理'],
                classIndex: 0,
                typeText: ['全部', '完成订单', '异常订单'],
                typeIndex: 0,
                type: '',
                page: 1,
                noData: false,
                scrollFlag: true,
                goodsItem: [],
                onEarth:false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            chooseClass(index) {
                this.goodsItem = [];
                this.page = 1;
                this.typeIndex = 0;
                this.type = '';
                switch (index) {
                    case 0:
                        this.classIndex = 0;
                        this.typeText = ['全部', '完成订单', '异常订单'];
                        this.getList();
                        break;
                    case 1:
                        this.classIndex = 1;
                        this.typeText = ['全部', '出货成功', '出货失败', '存货'];
                        this.getList();
                        break;
                }
            },
            chooseType(index) {
                this.typeIndex = index;
                this.goodsItem = [];
                this.page = 1;
                if (this.classIndex === 0) {
                    switch (index) {
                        case 0:
                            this.type = '';
                            this.getList();
                            break;
                        case 1:
                            this.type = 1;
                            this.getList();
                            break;
                        case 2:
                            this.type = 0;
                            this.getList();
                            break;
                    }
                } else if (this.classIndex === 1) {
                    switch (index) {
                        case 0:
                            this.type = '';
                            this.getList();
                            break;
                        case 1:
                            this.type = 1;
                            this.getList();
                            break;
                        case 2:
                            this.type = 0;
                            this.getList();
                            break;
                        case 3:
                            this.type = 2;
                            this.getList();
                            break;
                    }
                }

            },
            getList() {
                let url;
                switch (this.classIndex) {
                    case 0:
                        url = '/partner/order/selectOrder';
                        break;
                    case 1:
                        url = '/partner/order/selectLuckDraw'
                }
                this.$axios('get', url, {
                    type: this.type,
                    page: this.page,
                    limit: '10'
                }, (res) => {
                    let data = res.rows;
                    this.noData = res.total === 0;
                    this.goodsItem = this.goodsItem.concat(data);
                    if (this.goodsItem.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = this.page !== 1;
                        this.scrollFlag = false;
                    }
                })
            },
            scrollList() {
                let a = this.$refs.list.scrollHeight;
                let b = this.$refs.list.clientHeight;
                let c = this.$refs.list.scrollTop;
                if (a - (b + c) < 200 && this.scrollFlag && this.goodsItem.length >= 10) {
                    this.scrollFlag = false;
                    this.page++;
                    this.getList();
                }
            },
            lookDetails(id){
                this.$router.push({
                    path:'/orderDetails',
                    query:{
                        id:id
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #order {
        height: 100%;
        background: #f2f2f2;
        .order_class {
            width: 100%;
            height: 100px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            .order_class_main {
                height: 76px;
                width: 500px;
                border: 1px solid #CEB267;
                border-radius: 8px;
                display: flex;
                overflow: hidden;
                > div {
                    flex: 1;
                    text-align: center;
                    line-height: 76px;
                    font-size: 30px;
                }
                .active {
                    background: #CEB267;
                    color: white;
                }
            }
        }
        .order_main {
            background: white;
            margin-top: 10px;
            height: calc(~'100% - 110px');
            .order_main_class {
                display: flex;
                height: 80px;
                > div {
                    flex: 1;
                    text-align: center;
                    line-height: 80px;
                    font-size: 30px;
                }
                > div.active {
                    color: #595CA1;
                    position: relative;
                    border-bottom: 3px solid #595CA1;
                }
            }
            .order_list {
                height: calc(~'100% - 80px');
                overflow: scroll;
                .order_list_item {
                    padding: 0 20px;
                    border-bottom: 10px solid #f2f2f2;
                    .order_item_top {
                        height: 70px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        border-bottom: 2px solid #f2f2f2;
                        .status{
                            font-size: 28px;
                            width: 200px;
                            text-align: right;
                        }
                        .success{
                            color: #50C961;
                        }
                        .error{
                            color: #ff392d;
                        }
                        .time {
                            font-size: 24px;
                            color: rgba(153, 153, 153, 1);
                        }
                        button {
                            width: 150px;
                            height: 58px;
                            background: rgba(227, 227, 227, 1);
                            border-radius: 8px;
                            outline: none;
                            border: none;
                        }
                    }
                    .order_item_middle {
                        display: flex;
                        height: 200px;
                        align-items: center;
                        border-bottom: 2px solid #f2f2f2;
                        .goods_img {
                            width: 155px;
                            height: 155px;
                            margin: 0 20px;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .goods_name {
                            height: 200px;
                            font-size: 28px;
                            line-height: 100px;
                            flex: 2;
                        }
                        .goods_info {
                            height: 100%;
                            text-align: right;
                            > p {
                                line-height: 60px;
                            }
                            .price {
                                font-size: 28px;
                                color: rgba(89, 92, 161, 1);
                            }
                            .number {
                                font-size: 24px;
                                color: #666;
                            }
                            .shipment {
                                color: #666;
                                font-size: 26px;
                            }
                        }
                    }
                    .order_item_bottom {
                        display: flex;
                        height: 70px;
                        justify-content: space-between;
                        align-items: center;
                        .no {
                            font-size: 24px;
                            color: rgba(153, 153, 153, 1);
                        }
                        .out-of-pocket {
                            font-size: 26px;
                            span {
                                font-size: 28px;
                                color: #595CA1;
                            }
                        }
                    }
                }
                .no_data {
                    width: 60%;
                    margin: 50px auto;
                    text-align: center;
                    font-size: 30px;
                    img {
                        width: 100%;
                    }
                }
            }
        }
    }
</style>