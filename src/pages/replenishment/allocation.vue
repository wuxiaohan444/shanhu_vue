<template>
    <div id="allocation">
        <div class="deviceList" @scroll="scrollList" ref="list">
            <div class="item" v-for="(item,index) in deviceList" :key="index">
                <div class="item-left">
                    <div class="no">
                        <img src="../../assets/images/bianhao.png">
                        <span>{{item.no}}</span>
                    </div>
                    <div class="address">
                        <img src="../../assets/images/address.png">
                        <span>{{item.nickName}}</span>
                    </div>
                </div>
                <div class="item-right" @click="choose(item.choose,index)">
                    <img :src="item.choose===0?require('../../assets/images/noxuan1.png'):require('../../assets/images/noxuan2.png')">
                </div>
            </div>
            <div v-show="onEarth" class="on_earth">到底了</div>
        </div>
        <div class="device_btn">
            <div class="" @click="chooseAll">
                <img :src="chooseAllStatus===0?require('../../assets/images/noxuan1.png'):require('../../assets/images/noxuan2.png')"
                     alt="">
                <span>全选</span>
            </div>
            <div class="">
                <button @click="allot">确定分配</button>
            </div>
        </div>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "allocation",
        data() {
            return {
                inspectorId: '',
                deviceList: [],
                page: 1,
                scrollFlag: true,
                onEarth: false,
                modalOption: {},
                modalShow: false,
                chooseAllStatus: 0
            }
        },
        components: {modal},
        created() {
            this.inspectorId = this.$route.query.inspectorId;
            this.getList();
        },
        methods: {
            getList() {
                this.$axios('get', '/partner/inspector/devices', {page: this.page, limit: '10'}, (res) => {
                    let data = res.rows;
                    data.map(num => {
                        num.choose = 0;
                    });
                    this.deviceList = this.deviceList.concat(data);
                    if (this.deviceList.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = true;
                        this.scrollFlag = false;
                    }
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
            choose(choose, index) {
                switch (choose) {
                    case 0:
                        this.deviceList[index].choose = 1;
                        break;
                    case 1:
                        this.deviceList[index].choose = 0
                }

            },
            allot() {
                this.modalShow = true;
                this.modalOption = {
                    text: '确认分配？'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                    this.allocation();
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            allocation() {
                let deviceIds = [];
                for (let i = 0; i < this.deviceList.length; i++) {
                    if (this.deviceList[i].choose === 1) {
                        deviceIds.push(this.deviceList[i].id)
                    }
                }
                this.$axios('post', '/partner/inspector/addDevice', {
                    inspectorId: this.inspectorId,
                    deviceIds: deviceIds.join(',')
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                })
            },
            chooseAll() {
                switch (this.chooseAllStatus) {
                    case 0:
                        this.chooseAllStatus = 1;
                        this.deviceList.map((num) => {
                            num.choose = 1;
                        });
                        break;
                    case 1:
                        this.chooseAllStatus = 0;
                        this.deviceList.map((num) => {
                            num.choose = 0;
                        });
                }
            }
        }
    }
</script>

<style scoped lang="less">
    #allocation {
        height: 100%;
        background: #f2f2f2;
        .deviceList {
            height: calc(~'100% - 88px');
            overflow: scroll;
            .item {
                width: 710px;
                height: 180px;
                background: rgba(255, 255, 255, 1);
                border-radius: 8px;
                margin: 0 auto;
                margin-bottom: 20px;
                font-size: 26px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 90px;
                .item-left {
                    box-sizing: border-box;
                    width: 600px;
                    float: left;
                    height: 100%;
                    .no img {
                        width: 39px;
                        height: 40px;
                        vertical-align: middle;
                        margin: 0 20px;
                    }
                    .address img {
                        width: 39px;
                        height: 40px;
                        vertical-align: middle;
                        margin: 0 20px;
                    }
                }
                .item-right {
                    box-sizing: border-box;
                    width: 110px;
                    float: left;
                    height: 100%;
                    line-height: 180px;
                    text-align: center;
                    img {
                        width: 35px;
                        height: 35px;
                        margin-right: 10px;
                        vertical-align: middle;
                    }
                }
            }
        }
        .device_btn {
            height: 88px;
            width: 100%;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            box-sizing: border-box;
            > div {
                display: flex;
                align-items: center;
                img {
                    width: 50px;
                }
                span {
                    text-indent: 15px;
                    font-size: 28px;
                }
                button {
                    border: none;
                    outline: none;
                    width: 240px;
                    height: 70px;
                    text-align: center;
                    line-height: 70px;
                    background: #595CA1;
                    border-radius: 35px;
                    font-size: 28px;
                    color: white;
                }
            }
        }
    }
</style>