<template>
    <div id="operation">
        <div class="operation_head">
            <div class="head_item">
                <img src="../../assets/images/2.png" alt="">
                <div class="item_right">
                    <p>在线设备</p>
                    <p><span>{{device.onlineNum==null?0:device.onlineNum}}</span>台</p>
                </div>
            </div>
            <div class="head_item">
                <img src="../../assets/images/1.png" alt="">
                <div class="item_right">
                    <p>机器故障</p>
                    <p><span>{{device.brokenNum==null?0:device.brokenNum}}</span>台</p>
                </div>
            </div>
            <div class="head_item">
                <img src="../../assets/images/4.png" alt="">
                <div class="item_right">
                    <p>离线设备</p>
                    <p><span>{{device.loseNum==null?0:device.loseNum}}</span>台</p>
                </div>
            </div>
            <div class="head_item">
                <img src="../../assets/images/3.png" alt="">
                <div class="item_right">
                    <p>建议补货</p>
                    <p><span>{{device.needAddNum==null?0:device.needAddNum}}</span>台</p>
                </div>
            </div>
        </div>
        <div class="operation_title">收入（当日）</div>
        <div class="operation_main">
            <div class="operation_item">
                <p>营收总额</p>
                <span>{{money?money.realPrice:'0'}}</span>
            </div>
            <div class="operation_item">
                <p>商品售价</p>
                <span>{{money?money.sales:'0'}}</span>
            </div>
            <div class="operation_item">
                <p>利润</p>
                <span>{{money?money.gain:'0'}}</span>
            </div>
        </div>
        <div class="operation_title">订单（当日）</div>
        <div class="operation_main">
            <div class="operation_item">
                <p>总订单</p>
                <span>{{order?order.allNum:'0'}}</span>
            </div>
            <div class="operation_item">
                <p>销售订单</p>
                <span>{{order?order.soleNum:'0'}}</span>
            </div>
            <div class="operation_item">
                <p>其他订单</p>
                <span>{{order?order.luckDrawNum:'0'}}</span>
            </div>
            <div class="operation_item">
                <p>出货成功</p>
                <span>{{order?order.outSuccessNum:'0'}}</span>
            </div>
            <div class="operation_item">
                <p>出货失败</p>
                <span>{{order?order.outFailNum:'0'}}</span>
            </div>
            <div class="operation_item">
                <p>存货</p>
                <span>{{order?order.stockNum:'0'}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "operation",
        data() {
            return {
                device: '',
                money: '',
                order: ''
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios('get', '/partner/operate/select', {}, (res) => {
                    let data = res.data;
                    this.device = data.device;
                    this.money = data.money;
                    this.order = data.order;
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #operation {
        height: 100%;
        background: #F2F2F2;
    }

    .operation_head {
        width: 100%;
        height: 300px;
        display: flex;
        flex-flow: row wrap;
        background: white;
        .head_item {
            width: 50%;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
            .item_right {
                margin-left: 20px;
            }
        }
    }

    .operation_title {
        line-height: 80px;
        font-size: 30px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        position: relative;
        padding-left: 60px;
        border-top: 20px solid #F2F2F2;
        background: white;
    }

    .operation_title:before {
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

    .operation_main {
        display: flex;
        flex-flow: wrap row;
        background: white;
        > .operation_item {
            width: 33.3%;
            height: 150px;
            text-align: center;
            padding-top: 20px;
            box-sizing: border-box;
            p {
                color: #666666;
                font-size: 28px;
                line-height: 50px;
            }
            span {
                font-size: 32px;
                color: #333333;
            }
        }
    }
</style>