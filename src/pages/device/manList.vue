<template>
    <div id="manList">
        <div class="manList" @scroll="scrollList" ref="list">
            <div class="item" v-for="(item,index) in manList" :key="index">
                <div class="item-left">
                    <div class="no">
                        <img src="../../assets/images/p-name.png">
                        <span>{{item.realName}}</span>
                    </div>
                    <div class="address">
                        <img src="../../assets/images/p-phone.png">
                        <span>{{item.phone}}</span>
                    </div>
                </div>
                <div class="item-right" @click="chooseMan(index,item.choose)">
                    <img :src="item.choose===0?require('../../assets/images/noxuan1.png'):require('../../assets/images/noxuan2.png')">
                </div>
                <div class="item-bottom">已负责{{item.foo==null?'0':item.foo.num}}台设备</div>
            </div>
            <div v-show="onEarth" class="on_earth">到底了</div>
        </div>
        <!--确定-->
        <div class="affirm">
            <div @click="chooseALl">
                <img :src="this.chooseALlText===0?require('../../assets/images/noxuan1.png'):require('../../assets/images/noxuan2.png')">
                <span>全选</span>
            </div>
            <div @click="allocation">
                <div class="btn">确定分配</div>
            </div>
        </div>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "manList",
        data() {
            return {
                manList: [],
                chooseALlText: 0,
                deviceId: '',
                page: 1,
                scrollFlag: true,
                modalOption: {},
                modalShow: false,
                onEarth:false
            }
        },
        components: {modal},
        created() {
            this.deviceId = this.$route.query.id;
            this.getList();
        },
        methods: {
            getList() {
                this.$axios('get', '/partner/device/selectDeviceInspector', {
                    deviceId: this.deviceId,
                    page: this.page,
                    limit: 10
                }, (res) => {
                    let data = res.rows;
                    for (let i = 0; i < data.length; i++) {
                        data[i].choose = 0;
                    }
                    this.manList = this.manList.concat(data);
                    if (this.manList.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = this.page !== 1;
                        this.scrollFlag = false;
                    }


                })
            },
            chooseMan(index, choose) {
                switch (choose) {
                    case 0:
                        this.manList[index].choose = 1;
                        break;
                    case 1:
                        this.manList[index].choose = 0;
                }
            },
            chooseALl() {
                switch (this.chooseALlText) {
                    case 0:
                        this.chooseALlText = 1;
                        this.manList.map((num) => {
                            num.choose = 1;
                        });
                        break;
                    case 1:
                        this.chooseALlText = 0;
                        this.manList.map((num) => {
                            num.choose = 0;
                        });
                }
            },
            // 分配
            allocation() {
                this.modalShow = true;
                this.modalOption = {
                    text: '是否分配？'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.addInspector();
                    this.modalShow = false;
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            addInspector() {
                let ids = -1;
                for (let i = 0; i < this.manList.length; i++) {
                    if (this.manList[i].choose === 1) {
                        ids = ids + ',' + this.data.manList[i].id;
                    }
                }
                this.$axios('post', '/partner/device/addInspector', {
                    deviceId: this.deviceId,
                    inspectorIds: ids
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.$router.back(-1);
                })
            },
            scrollList() {
                let a = this.$refs.list.scrollHeight;
                let b = this.$refs.list.clientHeight;
                let c = this.$refs.list.scrollTop;
                if (a - (b + c) < 200 && this.scrollFlag && this.manList.length >= 10) {
                    this.scrollFlag = false;
                    this.page++;
                    this.getList();
                }
            },
        }
    }
</script>

<style scoped lang="less">
    #manList {
        height: 100%;
        background: #f2f2f2;
        .affirm {
            width: 100%;
            height: 88px;
            background: white;
            line-height: 88px;
            font-size: 28px;
            color: rgba(102, 102, 102, 1);
            position: fixed;
            bottom: 0;
            display: flex;
            padding: 0 30px;
            box-sizing: border-box;
            > div {
                flex: 1;
            }
            img {
                width: 35px;
                height: 35px;
                margin-right: 10px;
                vertical-align: text-top;
            }
            .btn {
                width: 240px;
                height: 70px;
                text-align: center;
                line-height: 70px;
                background: rgba(89, 92, 161, 1);
                border-radius: 35px;
                font-size: 28px;
                color: rgba(255, 255, 255, 1);
                margin-top: 10px;
                float: right;
            }
        }
        /*补货员列表*/
        .manList {
            height: calc(~'100% - 88px');
            overflow: scroll;
            padding: 20px;
            box-sizing: border-box;
            .item {
                width: 710px;
                height: 220px;
                background: rgba(255, 255, 255, 1);
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 26px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 90px;
                .item-left {
                    box-sizing: border-box;
                    width: 600px;
                    float: left;
                    height: 160px;
                    .no, .address {
                        height: 80px;
                        display: flex;
                        align-items: center;
                        img {
                            width: 39px;
                            height: 40px;
                            margin: 0 20px;
                        }
                    }
                }
                .item-right {
                    box-sizing: border-box;
                    width: 110px;
                    float: left;
                    height: 160px;
                    line-height: 180px;
                    text-align: center;
                    img {
                        width: 35px;
                        height: 35px;
                        margin-right: 10px;
                        vertical-align: middle;
                    }
                }
                .item-bottom {
                    border-top: 1px solid #f2f2f2;
                    float: left;
                    width: 690px;
                    height: 60px;
                    line-height: 60px;
                    text-align: right;
                    padding: 0 30px;
                    box-sizing: border-box;
                    margin-left: 10px;
                }
            }
        }
    }
</style>