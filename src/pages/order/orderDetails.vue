<template>
    <div id="orderDetails">
        <div class="device_name">{{orderInfo.no}}</div>
        <div class="goods_info" v-for="(item,index) in goodsDetails" :key="index">
            <img :src="ip+item.goods.img" alt="" class="goods_img">
            <div class="goods_name">{{item.goods.name}}</div>
            <div class="goods_right">
                <p class="price">￥{{item.price}}</p>
                <p class="shipment">出货口：{{item.channelShowNo}}</p>
            </div>
        </div>
        <div class="out-of-pocket">
            <span>实付金额</span>
            <div>￥{{orderInfo.price}}</div>
        </div>
        <div class="order_info">
            <div class="info_title">订单信息</div>
            <div class="order_info_item">售货机昵称：{{deviceInfo.nickName}}</div>
            <div class="order_info_item">售货机编号：{{deviceInfo.no}}</div>
            <div class="order_info_item">交易日期：{{orderInfo.payTime}}</div>
            <div class="order_info_item">订单编号：{{orderInfo.no}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "orderDetails",
        data() {
            return {
                id: '',
                ip: this.fixedIp(),
                goodsDetails: [],
                orderInfo: '',
                deviceInfo: ''
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.getData()
        },
        methods: {
            getData() {
                this.$axios('get', '/partner/order/select', {id: this.id}, (res) => {
                    this.orderInfo = res.data;
                    this.goodsDetails = this.orderInfo.details;
                    this.deviceInfo = this.orderInfo.device;
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #orderDetails {
        height: 100%;
        background: #f2f2f2;
        .device_name {
            line-height: 88px;
            padding-left: 30px;
            font-size: 30px;
            font-weight: bold;
            background: white;
        }
        .goods_info {
            padding: 0 30px;
            height: 155px;
            display: flex;
            align-items: center;
            border-top: 2px solid #f2f2f2;
            border-bottom: 2px solid #f2f2f2;
            background: white;
            .goods_img {
                width: 112px;
                height: 112px;
                margin-right: 20px;
            }
            .goods_name {
                font-size: 26px;
                flex: 2;
            }
            .goods_right {
                text-align: right;
                .price {
                    font-size: 28px;
                    color: rgba(51, 51, 51, 1);
                }
                .shipment {
                    font-size: 26px;
                    color: #666666;
                }
            }
        }
        .out-of-pocket {
            padding: 0 30px;
            height: 88px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 30px;
            background: white;
            > div {
                color: #595CA1;
                font-size: 32px;
            }
        }
        .order_info {
            background: white;
            .info_title {
                line-height: 88px;
                font-size: 30px;
                position: relative;
                padding-left: 60px;
            }
            .info_title:after {
                content: '';
                position: absolute;
                width: 5px;
                height: 33px;
                background: rgba(89, 92, 161, 1);
                top: 50%;
                left: 30px;
                transform: translateY(-50%);
            }
            .order_info_item {
                font-size: 26px;
                color: #666;
                line-height: 60px;
                padding-left: 30px;
            }
        }
    }

</style>