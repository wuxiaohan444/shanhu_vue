<template>
    <div id="configuration">
        <div class="title">运营基础信息</div>
        <div class="edit_item">
            <div class="item_main">
                <span>设备编号</span>
                <input type="text" placeholder="" v-model="deviceInfo.no">
            </div>
        </div>
        <div class="edit_item">
            <div class="item_main">
                <span>设备名称</span>
                <input type="text" placeholder="" v-model="deviceInfo.nickName">
            </div>
        </div>
        <div class="edit_item">
            <div class="item_main border_none">
                <span>设备类型</span>
                <input type="text" placeholder="" v-model="typeName">
            </div>
        </div>
        <div class="title">运营信息</div>
        <div class="edit_item">
            <div class="item_main">
                <span>补货员</span>
                <input type="text" placeholder="" v-model="deviceInfo.inspectorName">
            </div>
        </div>
        <div class="edit_item" @click="lookDetails">
            <div class="item_main">
                <span>设备二维码</span>
                <img src="../../assets/images/right.png" alt="">
            </div>
        </div>
        <div class="edit_item">
            <div class="item_main border_none">
                <span>运营开关</span>
                <div :class="enableLuck===1?'switch_open':'switch_close'" @click="operation"></div>
            </div>
        </div>

        <!--<div class="save_btn" @click="save">保存</div>-->
        <div class="modal_qr" v-show="modalShow" @click="hiddenModal">
            <div class="modal_box">
                <img :src="qRImg" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "configuration",
        data() {
            return {
                modalShow: false,
                deviceId: '',
                deviceInfo: '',
                qRImg: '',
                typeName: '',
                enableLuck: 0
            }
        },
        created() {
            this.deviceId = this.$route.query.id;
            this.getInfo();
        },
        methods: {
            // 查看设备信息
            getInfo() {
                this.$axios('get', '/partner/device/deviceInfo', {deviceId: this.deviceId}, (res) => {
                    this.deviceInfo = res.data;
                    this.typeName = this.deviceInfo.deviceType.name;
                    this.enableLuck = this.deviceInfo.enableLuck;
                })
            },
            //查看二维码
            lookDetails() {
                this.$axios('get', '/partner/device/h5DefaultQRCode', {id: this.deviceId}, (res) => {
                    this.qRImg = res.data;
                    this.modalShow = true;
                });

            },
            hiddenModal() {
                this.modalShow = false;
            },
            // 游戏开关
            operation() {
                let open;
                switch (this.enableLuck) {
                    case 0:
                        open = 1;
                        break;
                    case 1:
                        open = 0;
                        break;
                }
                this.$axios('get', '/partner/device/enableLuck', {
                    ids: this.deviceId,
                    status: open
                }, (res) => {
                    this.enableLuck = open;
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                })
            },
            save() {
                let data={
                    id:this.deviceId,
                };
                this.$axios('post', '/partner/device/updateDeviceInfo', data, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #configuration {
        height: 100%;
        background: #f2f2f2;
        .title {
            font-size: 24px;
            line-height: 60px;
            text-indent: 30px;
            color: #666666;
        }
        .edit_item {
            background: white;
            height: 80px;
            .item_main {
                margin: 0 30px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 2px solid #f2f2f2;
                box-sizing: border-box;
                > span {
                    font-size: 28px;
                }
                > input {
                    color: #999999;
                    width: 540px;
                }
                .switch_open, .switch_close {
                    width: 86px;
                    height: 46px;
                    border-radius: 23px;
                    position: relative;
                }
                .switch_open {
                    background-color: #d4a660;
                }
                .switch_close {
                    background-color: #c3c3c3;
                }
                .switch_open:after, .switch_close:after {
                    content: '';
                    position: absolute;
                    width: 42px;
                    height: 42px;
                    background-color: #ffffff;
                    border-radius: 50%;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .switch_open:after {
                    right: 2px;
                }
                .switch_close:after {
                    left: 2px;
                }
            }
            .border_none {
                border: none;
            }
        }
        .modal_qr {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .4);
            position: fixed;
            top: 0;
            right: 0;
            .modal_box {
                width: 400px;
                height: 400px;
                background-color: white;
                border-radius: 8px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>