<template>
    <div id="device">
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
        <div class="device_list" @scroll="scrollList" ref="list">
            <div class="device_item" v-for="(item,index) in deviceList" :key="index">
                <div class="device_class_left" @click="chooseDevice(index,item.choose)">
                    <img :src="item.choose===0?require('../../assets/images/noxuan1.png'):require('../../assets/images/noxuan2.png')"
                         alt="">
                </div>
                <div class="device_class_main">
                    <div>{{item.nickName}}</div>
                    <p>地址：{{item.address}}</p>
                </div>
                <div class="device_class_right">
                    <span class="handle" @click="handleDevice(index,item.handle)">操作</span>
                    <div class="handle_list" v-show="item.handle">
                        <router-link class="handle_item" :to="'/inventory?id='+item.id">
                            <img src="../../assets/images/shebeigoods.png" alt="">
                            <p>设备库存</p>
                        </router-link>
                        <router-link class="handle_item" :to="'/monitor?id='+item.id">
                            <img src="../../assets/images/test.png" alt="">
                            <p>监控测试</p>
                        </router-link>
                        <router-link class="handle_item" :to="'/configuration?id='+item.id">
                            <img src="../../assets/images/peizhi.png" alt="">
                            <p>运营配置</p>
                        </router-link>
                        <router-link class="handle_item" :to="'/manList?id='+item.id">
                            <img src="../../assets/images/fengpei.png" alt="">
                            <p>分配补货员</p>
                        </router-link>
                        <div class="handle_item" @click="switchOpen(item.id)">
                            <img src="../../assets/images/stop.png" alt="">
                            <p>{{btnText}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="onEarth" class="on_earth">到底了</div>
        </div>
        <div class="device_foot">
            <div class="foot_left">
                <div class="choose_all" @click="chooseAll">
                    <img :src="chooseAllText===0?require('../../assets/images/noxuan1.png'):require('../../assets/images/noxuan2.png')"
                         alt="">
                    <span class="text">全选</span>
                </div>
                <div class="choose_all">
                    <img src="../../assets/images/deldevice.png" alt="">
                    <span class="text" @click="delDevice">删除</span>
                </div>
            </div>
            <div class="btn" @click="switchOpen">{{btnText}}</div>
        </div>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "device",
        data() {
            return {
                titleText: ['设备管理', '补货员管理'],
                titleIndex: 0,
                timeType: ['运营中', '未运营'],
                timeIndex: 0,
                page: 1,
                type: 1,
                deviceList: [],
                chooseAllText: 0,
                modalOption: {},
                modalShow: false,
                btnText: '停止运营',
                scrollFlag: true,
                onEarth: false
            }
        },
        components: {modal},
        created() {
            this.getList();
        },
        methods: {
            chooseTitle(index) {
                if (index === 1) {
                    this.$router.replace({
                        path: '/replenishment'
                    })
                }
            },
            chooseTime(index) {
                this.timeIndex = index;
                this.page = 1;
                this.scrollFlag = true;
                this.onEarth = false;
                this.deviceList = [];
                switch (index) {
                    case 0:
                        this.btnText = '停止运营';
                        this.type = 1;
                        this.getList();
                        break;
                    case 1:
                        this.btnText = '开启运营';
                        this.type = 0;
                        this.getList();
                        break;
                }
            },
            getList() {
                let data = {
                    type: this.type,
                    page: this.page,
                    limit: 10
                };
                this.$axios('get', '/partner/device/select', data, (res) => {
                    let data = res.rows;
                    data.map(num => {
                        num.choose = 0;
                        num.handle = false;
                    });
                    this.deviceList = this.deviceList.concat(data);
                    if (this.deviceList.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = this.page !== 1;
                        this.scrollFlag = false;
                    }
                })
            },
            // 选中设备
            chooseDevice(index, choose) {
                this.deviceList.map((num) => {
                    num.handle = false;
                });
                switch (choose) {
                    case 0:
                        this.deviceList[index].choose = 1;
                        break;
                    case 1:
                        this.deviceList[index].choose = 0;
                        this.chooseAllText = 0;
                }
            },
            // 选择操作
            handleDevice(index, handle) {
                this.deviceList.map((num) => {
                    num.handle = false;
                });
                switch (handle) {
                    case true:
                        this.deviceList[index].handle = false;
                        break;
                    case false:
                        this.deviceList[index].handle = true;
                }
            },
            //全选
            chooseAll() {
                switch (this.chooseAllText) {
                    case 0:
                        this.chooseAllText = 1;
                        this.deviceList.map((num) => {
                            num.choose = 1;
                        });
                        break;
                    case 1:
                        this.chooseAllText = 0;
                        this.deviceList.map((num) => {
                            num.choose = 0;
                        });
                        break;
                }
            },
            // 是否运营
            switchOpen(id) {
                let ids = [];
                if (id) {
                    ids = [id];
                } else {
                    for (let i = 0; i < this.deviceList.length; i++) {
                        if (this.deviceList[i].choose === 1) {
                            ids.push(this.deviceList[i].id)
                        }
                    }
                }
                let text;
                switch (this.timeIndex) {
                    case 0:
                        text = '是否停止运营？';
                        break;
                    case 1:
                        text = '是否开启运营？';
                        break;
                }
                this.modalShow = true;
                this.modalOption = {
                    text: text
                };
                this.$refs.modalBox.confirm().then(() => {
                    switch (this.timeIndex) {
                        case 0:
                            this.disableDevice(ids.join(','));
                            break;
                        case 1:
                            this.enableDevice(ids.join(','));
                            break;
                    }
                    this.modalShow = false;
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            // 删除动作
            delDevice() {
                this.modalShow = true;
                this.modalOption = {
                    text: '是否删除?'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            // 删除设备
            del() {
                this.$axios('post', '/partner/device/disableDevice', {ids: ids}, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.page = 1;
                    this.deviceList = [];
                    this.getList();
                })
            },
            // 设备禁用
            disableDevice(ids) {
                this.$axios('post', '/partner/device/disableDevice', {ids: ids}, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.page = 1;
                    this.deviceList = [];
                    this.getList()
                })
            },
            // 开启设备
            enableDevice(ids) {
                this.$axios('post', '/partner/device/enableDevice', {ids: ids}, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.page = 1;
                    this.deviceList = [];
                    this.getList()
                })
            },
            scrollList() {
                let a = this.$refs.list.scrollHeight;
                let b = this.$refs.list.clientHeight;
                let c = this.$refs.list.scrollTop;
                if (a - (b + c) < 200 && this.scrollFlag && this.deviceList.length >= 10) {
                    this.scrollFlag = false;
                    this.page++;
                    this.getList();
                }
            },
        }
    }
</script>

<style scoped lang="less">
    #device {
        height: 100%;
        background: #f2f2f2;
        .data_head {
            background: white;
            padding: 0 30px;
            padding-top: 10px;
            .data_head_top {
                width: 460px;
                height: 76px;
                display: flex;
                border: 2px solid #CEB267;
                border-radius: 8px;
                box-sizing: border-box;
                overflow: hidden;
                margin: 0 auto;
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
                width: 500px;
                margin: 0 auto;
                margin-top: 25px;
                justify-content: space-between;
                > div {
                    width: 230px;
                    text-align: center;
                    line-height: 80px;
                }
                > div.active {
                    color: #595CA1;
                    border-bottom: 3px solid #595CA1;
                }
            }
        }
        .device_list {
            height: calc(~'100% - 290px');
            overflow: scroll;
            margin-top: 10px;
            .device_item {
                height: 160px;
                margin-bottom: 10px;
                background: white;
                display: flex;
                padding: 0 30px;
                box-sizing: border-box;
                align-items: center;
                .device_class_left {
                    margin-right: 30px;
                    img {
                        width: 40px;
                        height: 40px;
                    }
                }
                .device_class_main {
                    color: #333333;
                    line-height: 50px;
                    flex: 3;
                    > div {
                        font-size: 28px;
                        font-weight: bold;
                    }
                    > p {
                        font-size: 26px;
                    }
                }
                .device_class_right {
                    position: relative;
                    .handle {
                        font-size: 28px;
                        color: #595ca1;
                    }
                    .handle_list {
                        position: absolute;
                        width: 578px;
                        height: 100px;
                        background-color: #4c4c4c;
                        left: -610px;
                        top: -25px;
                        border-radius: 8px;
                        display: flex;
                        justify-content: space-around;
                        .handle_item {
                            text-align: center;
                            padding-top: 10px;
                            box-sizing: border-box;
                            img {
                                width: 50px;
                            }
                            p {
                                line-height: 6px;
                                color: white;
                                font-size: 20px;
                            }

                        }
                    }
                    .handle_list:after {
                        position: absolute;
                        content: '';
                        right: -29px;
                        top: 50%;
                        width: 0;
                        height: 0;
                        transform: translateY(-50%);
                        border-bottom: 20px solid white;
                        border-top: 20px solid white;
                        border-left: 30px solid #4c4c4c;
                    }
                }
            }
        }
        .device_foot {
            height: 88px;
            width: 100%;
            background: white;
            display: flex;
            align-items: center;
            padding: 0 30px;
            box-sizing: border-box;
            justify-content: space-between;
            .text {
                font-size: 28px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
            }
            .foot_left {
                display: flex;
            }
            .choose_all {
                display: flex;
                align-items: center;
                margin-right: 30px;
                img {
                    width: 40px;
                    margin-right: 10px;
                }
            }
            .btn {
                width: 340px;
                height: 70px;
                background: rgba(89, 92, 161, 1);
                border-radius: 35px;
                text-align: center;
                line-height: 70px;
                color: white;
                font-size: 30px;
            }
        }
    }
</style>