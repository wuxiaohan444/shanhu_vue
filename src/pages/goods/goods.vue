<template>
    <div id="goods" @click.stop="closeBath">
        <div class="goods_class">
            <div class="goods_class_main">
                <div :class="classIndex===index?'active':''" v-for="(item,index) in classText"
                     @click="chooseClass(index)">{{item}}
                </div>
            </div>
        </div>
        <div class="goods_main" v-if="classIndex===0">
            <div class="goods_main_title">
                <div :class="sellStatus===index?'active':''" v-for="(item,index) in sellText"
                     @click="chooseSell(index)">{{item}}
                </div>
            </div>
            <div class="goods_list" @scroll="scrollList" ref="list">
                <div class="goods_list_item" v-for="(item,index) in goodsItem" :key="index">
                    <div class="item_left">
                        <img :src="ip+item.img" alt="">
                    </div>
                    <div class="item_right">
                        <div class="goods_name">{{item.name}}</div>
                        <p class="goods_price"><span
                                class="goods_discount">￥{{item.price}}</span><span>进价：{{item.cost}}</span></p>
                        <p class="goods_category">分类：{{item.clazz.name}}</p>
                        <div class="goods_btn">
                            <div @click="deleteGoods(item.id)">删除</div>
                            <div @click="updateGoods(item.id)">修改</div>
                        </div>
                    </div>
                    <img :src="item.choose===0?require('../../assets/images/noxuan1.png'):require('../../assets/images/noxuan2.png')"
                         alt="" class="choose" @click.stop="chooseGoods(index,item.choose)">
                </div>
                <div v-show="onEarth" class="on_earth">到底了</div>
                <div class="no_data" v-show="noData">
                    <img src="../../assets/images/no-goods.png" alt="">
                    <p>暂无商品</p>
                </div>
            </div>
        </div>
        <div class="goods_grouping" v-if="classIndex===1">
            <div class="goods_grouping_item" v-for="(item,index) in classList" :key="index"
                 @click="skipGoodsClass(item.id)">
                <span>{{item.name}}</span> <img src="../../assets/images/right.png" alt="">
            </div>
        </div>
        <div class="goods_foot">
            <div class="batch_manage" @click.stop="batchManage">批量管理</div>
            <router-link class="add_goods" to="/goodsAdd">添加商品</router-link>
        </div>
        <div class="goods_batch_btn" v-show="bathShow">
            <div @click="bathDelete">批量删除</div>
            <div @click="bathUpDown">{{bathText}}</div>
        </div>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "goods",
        data() {
            return {
                classText: ['商品管理', '分组管理'],
                classIndex: 0,
                sellText: ['出售中', '已下架'],
                sellStatus: 0,
                status: 1,
                page: 1,
                goodsItem: [],
                ip: this.fixedIp(),
                scrollFlag: true,
                noData: false,
                onEarth: false,
                classList: '',
                bathShow: false,
                modalOption: {},
                modalShow: false,
                bathText: '批量下架'
            }
        },
        components: {modal},
        created() {
            this.getList();
            this.getClass();
        },
        methods: {
            closeBath() {
                this.bathShow = false;
            },
            chooseClass(index) {
                this.classIndex = index;
            },
            chooseSell(index) {
                this.sellStatus = index;
                this.page = 1;
                this.scrollFlag = true;
                this.goodsItem = [];
                switch (index) {
                    case 0:
                        this.status = 1;
                        this.bathText = '批量下架';
                        this.getList();
                        break;
                    case 1:
                        this.status = 0;
                        this.bathText = '批量上架';
                        this.getList();
                }
            },
            getList() {
                this.$axios('get', '/partner/goods/selectGoods', {
                    status: this.status,
                    page: this.page,
                    limit: '10'
                }, (res) => {
                    let data = res.rows;
                    this.noData = res.total === 0;
                    data.map((num) => num.choose = 0);
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
            getClass() {
                this.$axios('get', '/partner/goods/selectAllClass', {}, (res) => {
                    this.classList = res.data;
                })
            },
            batchManage() {
                this.bathShow = true;
            },
            updateGoods(id) {
                this.$router.push({
                    path: '/goodsAdd',
                    query: {
                        id: id
                    }
                })
            },
            // 删除单个
            deleteGoods(id) {
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
            // 批量删除
            bathDelete() {
                let ids = [];
                this.goodsItem.map((num) => {
                    if (num.choose === 1) {
                        ids.push(num.id)
                    }
                });
                if (ids.length <= 0) {
                    this.bus.$emit('tips', {
                        show: true,
                        title: '请至少选择一个商品',
                    });
                    return
                }
                this.modalShow = true;
                this.modalOption = {
                    text: '是否删除？'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                    this.getDelete(ids.join(","))
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            //批量上下架
            bathUpDown() {
                let ids = [];
                this.goodsItem.map((num) => {
                    if (num.choose === 1) {
                        ids.push(num.id)
                    }
                });
                if (ids.length <= 0) {
                    this.bus.$emit('tips', {
                        show: true,
                        title: '请至少选择一个商品',
                    });
                    return
                }
                this.modalShow = true;
                this.modalOption = {
                    text: '是否执行操作？'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                    if (this.status === 1) {
                        this.getOperation(0, ids.join(","))
                    } else {
                        this.getOperation(1, ids.join(","))
                    }
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            // 选择
            chooseGoods(index, choose) {
                switch (choose) {
                    case 0:
                        this.goodsItem[index].choose = 1;
                        break;
                    case 1:
                        this.goodsItem[index].choose = 0;
                        break;
                }
            },
            getDelete(id) {
                this.$axios('post', '/partner/goods/delete', {ids: id}, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.page = 1;
                    this.scrollFlag = true;
                    this.goodsItem = [];
                    this.getList();
                })
            },
            getOperation(status, ids) {
                this.$axios('post', '/partner/goods/operation', {status: status, ids: ids}, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.page = 1;
                    this.scrollFlag = true;
                    this.goodsItem = [];
                    this.getList();
                });
            },
            skipGoodsClass(id) {
                this.$router.push({
                    path: '/goodsClass',
                    query: {
                        id: id
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #goods {
        height: 100%;
        background: #f2f2f2;
        .goods_class {
            width: 100%;
            height: 100px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            .goods_class_main {
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

        .goods_main {
            width: 96%;
            margin: 0 auto;
            margin-top: 20px;
            background: white;
            height: calc(~'100% - 208px');
            .goods_main_title {
                height: 80px;
                font-size: 30px;
                display: flex;
                > div {
                    height: 80px;
                    line-height: 80px;
                    flex: 1;
                    text-align: center;
                }
                > div.active {
                    color: #595CA1;
                    position: relative;
                }
                > div.active:after {
                    content: '';
                    position: absolute;
                    width: 84px;
                    height: 6px;
                    background: #595CA1;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            .goods_list {
                height: calc(~'100% - 80px');
                overflow: scroll;
                .goods_list_item {
                    display: flex;
                    align-items: center;
                    height: 240px;
                    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
                    position: relative;
                    .item_left {
                        width: 180px;
                        height: 180px;
                        margin: 0 30px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .item_right {
                        flex: 2;
                        .goods_name {
                            font-size: 28px;
                        }
                        .goods_price {
                            color: #666666;
                            font-size: 26px;
                            line-height: 60px;
                        }
                        .goods_discount {
                            color: #595CA1;
                            font-size: 32px;
                            margin-right: 30px;
                        }
                        .goods_category {
                            font-size: 26px;
                            color: #666666;
                        }
                        .goods_btn {
                            height: 56px;
                            display: flex;
                            justify-content: flex-end;
                            > div {
                                width: 120px;
                                height: 56px;
                                background: rgba(206, 178, 103, 1);
                                border-radius: 8px;
                                text-align: center;
                                color: white;
                                font-size: 30px;
                                line-height: 56px;
                                margin-right: 20px;
                            }
                        }
                    }
                    .choose {
                        width: 40px;
                        height: 40px;
                        position: absolute;
                        right: 20px;
                        top: 30px;
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

        .goods_grouping {
            background: white;
            .goods_grouping_item {
                height: 88px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                border-bottom: 1px solid #f1f1f1
            }
        }

        .goods_foot {
            width: 100%;
            height: 88px;
            position: fixed;
            bottom: 0;
            left: 0;
            color: white;
            font-size: 30px;
            text-align: center;
            line-height: 88px;
            display: flex;
            .batch_manage {
                background: #CEB267;
                flex: 1;
            }
            .add_goods {
                background: #595CA1;
                flex: 2;
                color: white;
            }
        }
        .goods_batch_btn {
            height: 100px;
            width: 100%;
            background: white;
            position: fixed;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border-top: 2px solid #efefef;
            > div {
                width: 150px;
                height: 58px;
                border: 2px solid rgba(214, 214, 214, 1);
                border-radius: 29px;
                font-size: 26px;
                color: rgba(102, 102, 102, 1);
                text-align: center;
                line-height: 58px;
                margin-right: 20px;
            }
        }
    }
</style>