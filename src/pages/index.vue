<template>
    <div id="index">
        <div class="index_head">
            <div class="index_bottom"></div>
            <div class="index_info_top">
                <div>
                    <p>今日收入(元)</p>
                    <div>{{info.today?info.today:0}}</div>
                </div>
                <div>
                    <p>昨日收入(元)</p>
                    <div>{{info.yesterday?info.yesterday:0}}</div>
                </div>
            </div>
            <div class="index_info_bottom">
                <div>
                    <p>商品成本</p>
                    <div>{{info.todayCost?info.todayCost:0}}</div>
                </div>
                <div>
                    <p>利润</p>
                    <div>{{info.todayGain?info.todayGain:0}}</div>
                </div>
            </div>
        </div>

        <div class="index_box">
            <router-link to="/operation">
                <img src="../assets/images/operation.png" alt="">
                <span>运营监控</span>
            </router-link>
            <router-link to="/order">
                <img src="../assets/images/order.png" alt="">
                <span>订单管理</span>
            </router-link>
            <router-link to="/data">
                <img src="../assets/images/data.png" alt="">
                <span>数据分析</span>
            </router-link>
            <router-link to="/goods">
                <img src="../assets/images/goods.png" alt="">
                <span>商品管理</span>
            </router-link>
            <router-link to="device">
                <img src="../assets/images/vendingMachine.png" alt="">
                <span>售货机管理</span>
            </router-link>
            <router-link to="/my">
                <img src="../assets/images/my.png" alt="">
                <span>个人中心</span>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                info: ''
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios('get', '/partner/order/index', {}, (res) => {
                    this.info = res.data;
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #index {
        .index_head {
            width: 100%;
            height: 200px;
            background: #595CA1;
            position: relative;
            .index_bottom {
                width: 100%;
                height: 200px;
                position: absolute;
                bottom: -200px;
                overflow: hidden;
            }
            .index_bottom:after {
                content: '';
                position: absolute;
                width: 110%;
                height: 300px;
                border-radius: 50%;
                background: #595CA1;
                top: -150px;
                left: 50%;
                transform: translateX(-50%);
            }
            .index_info_top {
                width: 100%;
                height: 100%;
                display: flex;
                > div {
                    flex: 1;
                    align-items: center;
                    text-align: center;
                    padding: 50px 0;
                    line-height: 50px;
                    color: white;
                    position: relative;
                    > p {
                        font-size: 26px;
                    }
                    > div {
                        font-size: 32px;
                        font-weight: bold;
                    }
                }
                > div:nth-child(1):after {
                    content: '';
                    position: absolute;
                    height: 60px;
                    width: 2px;
                    background: rgba(255, 255, 255, .4);
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .index_info_bottom {
                width: 690px;
                height: 180px;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 8px;
                background: white;
                border: 2px solid #E8E8E8;
                box-sizing: border-box;
                display: flex;
                > div {
                    flex: 1;
                    align-items: center;
                    text-align: center;
                    padding: 50px 0;
                    line-height: 50px;
                    position: relative;
                    > p {
                        font-size: 26px;
                        color: #666666;
                    }
                    > div {
                        font-size: 32px;
                        font-weight: bold;
                    }
                }
                > div:nth-child(1):after {
                    content: '';
                    position: absolute;
                    height: 60px;
                    width: 2px;
                    background: rgba(0, 0, 0, .4);
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
        .index_box {
            display: flex;
            flex-flow: wrap row;
            margin-top: 200px;
            a {
                width: 29.4%;
                border-radius: 8px;
                border: 2px solid #E8E8E8;
                height: 217px;
                margin-left: 3%;
                margin-bottom: 20px;
                text-align: center;
                padding-top: 20px;
                box-sizing: border-box;
                img {
                    width: 128px;
                    height: 128px;
                    display: block;
                    margin: 0 auto;
                }
                span {
                    color: #333333;
                    font-size: 30px;
                }
            }
        }
    }
</style>