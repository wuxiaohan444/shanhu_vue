<template>
    <div id="replenishment">
        <div class="head">
            <div class="data_head_top">
                <div v-for="(item,index) in titleText" :key="index" :class="titleIndex===index?'active':''"
                     @click="chooseTitle(index)">{{item}}
                </div>
            </div>
        </div>

        <div class="replenishment_list" @scroll="scrollList" ref="list">
            <div class="list_item" v-for="(item,index) in manList" :key="index">
                <div class="item_top">
                    <div class="item_top_left">
                        <div>
                            <img src="../../assets/images/p-name.png" alt="">
                            <span>{{item.realName}}</span>
                        </div>
                        <div>
                            <img src="../../assets/images/p-phone.png" alt="">
                            <span>{{item.phone}}</span>
                        </div>
                    </div>
                    <router-link :to="'/allocation?inspectorId='+item.id" class="item_top_right">分配设备</router-link>
                </div>
                <div class="item_bottom">
                    <router-link :to="'/manifest?id='+item.id" class="bottom_btn">查看</router-link>
                    <router-link :to="'/addMan?id='+item.id" class="bottom_btn">编辑</router-link>
                    <div class="bottom_btn del" @click="deleteMan(item.id)">删除</div>
                </div>
            </div>
            <div v-show="onEarth" class="on_earth">到底了</div>
        </div>

        <router-link to="/addMan" class="save_btn">添加巡货员</router-link>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "replenishment",
        data() {
            return {
                titleText: ['设备管理', '补货员管理'],
                titleIndex: 1,
                page: 1,
                manList: [],
                modalOption: {},
                modalShow: false,
                scrollFlag:true,
                onEarth:false
            }
        },
        components: {modal},
        created() {
            this.getList();
        },
        methods: {
            chooseTitle(index) {
                if (index === 0) {
                    this.$router.replace({
                        path: '/device'
                    })
                }
            },
            getList() {
                this.$axios('get', '/partner/inspector/list', {page: this.page, limit: 10}, (res) => {
                    this.manList = this.manList.concat(res.rows);
                    if (this.manList.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = true;
                        this.scrollFlag = false;
                    }
                })
            },
            deleteMan(id) {
                this.modalShow = true;
                this.modalOption = {
                    text: '是否删除？'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                    this.getDelete(id)
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            getDelete(id) {
                this.$axios('post', '/partner/inspector/delete', {id: id}, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.page = 1;
                    this.manList = [];
                    this.getList();
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
    #replenishment {
        height: 100%;
        background: #f2f2f2;
        .head {
            padding: 10px 0;
            background: white;
            box-sizing: border-box;
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
        }
        .replenishment_list {
            height: calc(~'100% - 184px');
            overflow: scroll;
            padding: 20px;
            box-sizing: border-box;
            .list_item {
                width: 100%;
                height: 250px;
                background: white;
                border-radius: 14px;
                padding: 0 30px;
                box-sizing: border-box;
                margin-bottom: 20px;
                .item_top {
                    display: flex;
                    align-items: center;
                    .item_top_left {
                        flex: 1;
                        > div {
                            line-height: 80px;
                            font-size: 28px;
                            img {
                                width: 34px;
                                height: 41px;
                                vertical-align: middle;
                            }
                            span {
                                margin-left: 10px;
                            }
                        }
                    }
                    .item_top_right {
                        color: #CEB267;
                        font-size: 28px;
                    }
                }
                .item_bottom {
                    height: 90px;
                    border-top: 2px solid #f2f2f2;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    > .bottom_btn {
                        width: 150px;
                        height: 58px;
                        border: 2px solid #d6d6d6;
                        border-radius: 29px;
                        color: #666666;
                        text-align: center;
                        line-height: 58px;
                        font-size: 28px;
                        margin-left: 20px;
                    }
                    > div.del {
                        border: 2px solid #F54141;
                        color: #F54141;
                    }
                }
            }
        }
    }
</style>