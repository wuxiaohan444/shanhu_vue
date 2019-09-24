<template>
    <div id="deviceList" @scroll="scrollList" ref="list">
        <div class="list_item" @click="chooseDevice('','全部售货机')">
            <span>全部售货机</span> <img src="../../assets/images/right.png" alt="">
        </div>
        <div class="list_item">
            <span>全部售货机</span> <img src="../../assets/images/right.png" alt="">
        </div>
        <div v-show="onEarth" class="on_earth">到底了</div>
    </div>
</template>

<script>
    export default {
        name: "deviceList",
        data() {
            return {
                page: 1,
                deviceList: [],
                scrollFlag:true,
                onEarth:false
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.$axios('get', 'partner/device/select', {
                    page: this.page,
                    limit: 10
                }, (res) => {
                    this.deviceList = this.deviceList.concat(res.rows);
                    if (this.deviceList.length < res.total) {
                        this.scrollFlag = true;
                    } else {
                        this.onEarth = this.page !== 1;
                        this.scrollFlag = false;
                    }
                });

            },
            chooseDevice(id, name) {
                localStorage.setItem('deviceId', id);
                localStorage.setItem('deviceType', name);
                this.$router.replace({
                   path:'/data'
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
    #deviceList {
        height: 100%;
        background: white;
        padding: 0 30px;
        width: 100%;
        box-sizing: border-box;
        overflow: scroll;
        .list_item {
            height: 88px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.1);
            > span {
                font-size: 30px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
            }
            > img {
                width: 24px;
            }
        }
    }
</style>