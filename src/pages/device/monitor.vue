<template>
    <div id="monitor">
        <div class="test_item">
            <img src="../../assets/images/network.png" alt="" class="test_icon">
            <span>网络监控</span>
            <img src="../../assets/images/right.png" alt="" class="test_right">
        </div>
        <div class="test_item">
            <img src="../../assets/images/temperature.png" alt="" class="test_icon">
            <span>温度监控</span>
            <img src="../../assets/images/right.png" alt="" class="test_right">
        </div>
        <div class="test_item">
            <img src="../../assets/images/guang.png" alt="" class="test_icon">
            <span>光检监控</span>
            <img src="../../assets/images/right.png" alt="" class="test_right">
        </div>
        <router-link :to="'/measurement?id='+deviceId" class="test_item">
            <img src="../../assets/images/channelTest.png" alt="" class="test_icon">
            <span>货道测试</span>
            <img src="../../assets/images/right.png" alt="" class="test_right">
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "monitor",
        data() {
            return {
                deviceId: ''
            }
        },
        created() {
            this.deviceId = this.$route.query.id
        }
    }
</script>

<style scoped lang="less">
    #monitor {
        height: 100%;
        background: #f2f2f2;
        padding: 20px;
        box-sizing: border-box;
        .test_item {
            width: 100%;
            height: 160px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            padding: 0 30px;
            box-sizing: border-box;
            margin-bottom: 20px;
            .test_icon {
                width: 120px;
                height: 120px;
            }
            span {
                font-size: 30px;
                color: #333333;
                text-indent: 30px;
                flex: 2;
            }
            .test_right {
                width: 22px;
            }
        }
    }
</style>