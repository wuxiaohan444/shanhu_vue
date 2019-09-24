<template>
    <div id="measurement">
        <div class="test_main">
            <div :class="item.choose===1?'main_item active':'main_item'" v-for="(item,index) in channelList"
                 :key="index" @click="chooseChannel(index,item.choose)">{{item.realNo}}
                <span v-if="item.status!==1">!</span>
            </div>
        </div>
        <div class="footer_btn">
            <div @click="channelAll">全货道测试</div>
            <div @click="channelTest">货道测试</div>
            <div @click="recover">货道恢复</div>
        </div>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "measurement",
        data() {
            return {
                channelList: [],
                deviceId: '',
                modalOption: {},
                modalShow: false,
            }
        },
        components: {modal},
        created() {
            this.deviceId = this.$route.query.id;
            this.getChannelList();
        },
        methods: {
            // 货道测试列表
            getChannelList() {
                this.$axios("get", '/partner/channelGoods/deviceAmountGoods', {deviceId: this.deviceId}, (res) => {
                    let data = res.data;
                    data.map((num) => num.choose = 0);
                    this.channelList = data;
                });
            },

            chooseChannel(index, choose) {
                switch (choose) {
                    case 0:
                        this.channelList[index].choose = 1;
                        break;
                    case 1:
                        this.channelList[index].choose = 0;
                        break;
                }
            },
            channelTest() {
                let channelGoodsIds = [];
                this.channelList.map((num) => {
                    if (num.choose === 1) {
                        channelGoodsIds.push(num.id)
                    }
                });
                if (channelGoodsIds.length <= 0) {
                    this.bus.$emit('tips', {
                        show: true,
                        title: '请先选择货道'
                    });
                    return
                }
                this.$axios('post', '/partner/channelGoods/sendManyTest', {
                    deviceId: this.deviceId,
                    channelGoodsIds: channelGoodsIds.join(',')
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                });
            },
            channelAll() {
                this.modalShow = true;
                this.modalOption = {
                    text: '是否测试全货道'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                    this.$axios('post', '/partner/channelGoods/sendAllTest', {
                        deviceId: this.deviceId,
                    }, (res) => {
                        this.bus.$emit('tips', {
                            show: true,
                            title: res.data
                        });
                    });
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            recover() {
                let channelGoodsIds = [];
                this.channelList.map((num) => {
                    if (num.choose === 1) {
                        channelGoodsIds.push(num.id)
                    }
                });
                if (channelGoodsIds.length <= 0) {
                    this.bus.$emit('tips', {
                        show: true,
                        title: '请先选择货道'
                    });
                    return
                }
                this.$axios('post', '/partner/channelGoods/enable', {
                    deviceId: this.deviceId,
                    channelGoodsIds: channelGoodsIds.join(',')
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .test_main {
        padding: 30px;
        padding-right: 0;
        display: flex;
        flex-flow: row wrap;
        .main_item {
            width: 122px;
            height: 58px;
            border: 2px solid rgba(204, 204, 204, 1);
            border-radius: 8px;
            color: #999999;
            font-size: 30px;
            text-align: center;
            line-height: 58px;
            box-sizing: border-box;
            margin: 0 20px 30px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            span {
                width: 24px;
                height: 24px;
                display: inline-block;
                background: rgba(234, 89, 89, 1);
                border-radius: 50%;
                color: white;
                font-size: 14px;
                line-height: 24px;
                vertical-align: middle;
                margin-left: 5px;
            }
        }
        .main_item.active {
            border: 2px solid #D4A660;
            color: #D4A660;
            position: relative;
        }
        .main_item.active:before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border: 1px solid #000;
            right: 0;
            bottom: 0;
            border-left: 18px solid transparent;
            border-top: 18px solid transparent;
            border-right: 18px solid #D4A660;
            border-bottom: 18px solid #D4A660;
        }
        .main_item.active:after {
            content: 'へ';
            position: absolute;
            width: 36px;
            height: 36px;
            right: 0;
            bottom: 0;
            font-size: 18px;
            color: #ffffff;
            transform: rotateX(180deg);
            line-height: 20px;
            text-align: right;
        }
    }

    .footer_btn {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 98px;
        display: flex;
        > div {
            flex: 1;
            color: white;
            font-size: 30px;
            line-height: 98px;
            text-align: center;
        }
        div:nth-child(1) {
            background: #D4A660;
        }
        div:nth-child(2) {
            background: #5AA9E8;
        }
        div:nth-child(3) {
            background: #595CA1;
        }
    }
</style>