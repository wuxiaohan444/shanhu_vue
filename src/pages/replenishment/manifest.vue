<template>
    <div id="manifest">
        <div class="head">
            <img :src="ip+info.headImg" alt="">
            <div>
                <p>{{info.realName}}</p>
                <span>{{info.phone}}</span>
            </div>
        </div>
        <div class="item" v-for="(item,index) in info.devices" :key="index">
            <div>
                <img src="../../assets/images/bianhao.png" alt="">
                <span>{{item.no}}</span>
            </div>
            <div>
                <img src="../../assets/images/address.png" alt="">
                <span>{{item.nickName}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "manifest",
        data() {
            return {
                ip: this.fixedIp(),
                id: '',
                info: '',
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.$axios('get', '/partner/inspector/select', {id: this.id}, (res) => {
                    this.info = res.data;
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #manifest {
        background: #f2f2f2;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        overflow: scroll;
        .head {
            width: 100%;
            height: 180px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            img {
                width: 124px;
                height: 124px;
                border-radius: 50%;
                margin: 0 20px;
                border: 2px solid #f2f2f2;
                box-sizing: border-box;
            }
            > div {
                font-size: 28px;
                line-height: 50px;
                span {
                    color: #666666;
                }
            }
        }
        .item{
            background: #ffffff;
            margin-top: 20px;
            padding: 0 20px;
            box-sizing: border-box;
            div{
                display: flex;
                align-items: center;
                height: 80px;
                img{
                    width: 50px;
                }
                span{
                    text-indent: 10px;
                    font-size: 26px;
                }
            }
        }
    }
</style>