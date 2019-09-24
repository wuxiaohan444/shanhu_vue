<template>
    <div id="goodsAdd">
        <div class="title">商品信息（必填）</div>
        <div class="goods_main">
            <div class="goods_img">
                <img :src="ip+img" alt="">
                <input type="file" @change="changeImg($event)">
            </div>
            <div class="goods_main_item">
                <span>商品名称：</span> <input type="text" placeholder="" v-model="goodsInfo.name">
            </div>
            <div class="goods_main_item">
                <span>商品分类：</span>
                <label for=""></label><select name="" id="" v-model="goodsInfo.classId">
                <option value="">请选择</option>
                <option value="" v-for="(item,index) in classArr" :key="index" :value="item.id">{{item.name}}</option>
            </select>
            </div>
            <div class="goods_main_item">
                <span>成本价：</span> <input type="text" placeholder="" v-model="goodsInfo.cost">
            </div>
            <div class="goods_main_item">
                <span>商品单位：</span> <input type="text" placeholder="如：瓶，包，盒" v-model="goodsInfo.unit">
            </div>
        </div>
        <div class="title">商品详情</div>
        <div class="goods_main">
            <div class="goods_main_item">
                <span>商品编号：</span> <input type="text" placeholder="" v-model="goodsInfo.no">
            </div>
            <div class="goods_main_item">
                <span>商品品牌：</span> <input type="text" placeholder="" v-model="goodsInfo.brand">
            </div>
            <div class="goods_main_item">
                <span>商品型号：</span> <input type="text" placeholder="" v-model="goodsInfo.model">
            </div>
            <div class="goods_main_item">
                <span>建议售价：</span> <input type="text" placeholder="" v-model="goodsInfo.price">
            </div>
        </div>
        <div class="title">其他</div>
        <div class="goods_main">
            <div class="goods_main_item">
                <span>商品标签：</span>
                <select name="" id="label" v-model="goodsInfo.labelId">
                    <option value=""></option>
                </select>
            </div>
            <div class="goods_main_item">
                <span>商品状态：</span>
                <select name="" id="status" v-model="goodsInfo.status">
                    <option value="1">上架</option>
                    <option value="0">下架</option>
                </select>
            </div>
            <div class="goods_main_item">
                <span>商品备注：</span> <input type="text" placeholder="" v-model="goodsInfo.remark">
            </div>
        </div>
        <div class="goods_btn" @click="affirm">确定</div>
    </div>
</template>

<script>
    export default {
        name: "goodsAdd",
        data() {
            return {
                img: '',
                ip: this.fixedIp(),
                id: '',
                goodsInfo: '',
                labelArr: [],
                classArr: []
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.getLabel();
        },
        methods: {
            // 上传照片
            changeImg(e) {
                let file = e.target.files[0];
                let formData = new FormData();
                formData.append('file', file);
                this.$axios('post', '/partner/file/uploadFile', formData, (res) => {
                    this.img = res.data;
                }, 'multipart/form-data', false)
            },
            // 商品信息
            getGoodsInfo() {
                this.$axios('get', '/partner/goods/info', {id: this.id}, (res) => {
                    let data = res.data;
                    data.classId = data.clazz.id;
                    this.goodsInfo = data;
                    this.img = data.img;

                })
            },
            // 商品标签
            getLabel() {
                this.$axios('get', '/partner/goods/selectAllLabel', {}, (res) => {
                    this.labelArr = res.data;
                    this.getGoodsClass();//商品分类
                })
            },
            //商品分类
            getGoodsClass() {
                this.$axios('get', '/partner/goods/selectAllClass', {}, (res) => {
                    this.classArr = res.data;
                    if (this.id) {
                        this.getGoodsInfo();
                    }
                })
            },
            // 确认
            affirm() {
                let data = {
                    id: this.goodsInfo.id,
                    classId: this.goodsInfo.classId,
                    no: this.goodsInfo.no,
                    brand: this.goodsInfo.brand,
                    name: this.goodsInfo.name,
                    model: this.goodsInfo.model,
                    unit: this.goodsInfo.unit,
                    cost: this.goodsInfo.cost,
                    price: this.goodsInfo.price,
                    discount: this.goodsInfo.discount,
                    status: this.goodsInfo.status,
                    img: this.img,
                    remark: this.goodsInfo.remark,
                    labelId: this.goodsInfo.labelId
                };
                let url;
                if (this.id) {
                    url = '/partner/goods/update';
                } else {
                    url = '/partner/goods/add';
                }
                this.$axios('post', url, data, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 500)
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #goodsAdd {
        height: 100%;
        background: #f2f2f2;
        padding-bottom: 100px;
        .title {
            line-height: 60px;
            font-size: 30px;
            padding-left: 30px;
        }
        .goods_main {
            background: white;
            padding: 0 20px;
            .goods_img {
                height: 200px;
                position: relative;
                img, input[type=file] {
                    width: 160px;
                    height: 160px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                    border: 2px solid #f2f2f2;
                }
                input[type=file] {
                    opacity: 0;
                }
            }
            .goods_main_item {
                height: 80px;
                line-height: 80px;
                border-bottom: 2px solid #f2f2f2;
                display: flex;
                font-size: 28px;
                span {
                    flex: 1;
                }
                input, select {
                    height: 100%;
                    flex: 4;
                }
            }
        }
        .goods_btn {
            width: 100%;
            height: 87px;
            background: rgba(89, 92, 161, 1);
            font-size: 30px;
            color: rgba(255, 255, 255, 1);
            position: fixed;
            bottom: 0;
            line-height: 87px;
            text-align: center;
        }
    }
</style>