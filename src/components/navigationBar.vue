<template>
    <div id="navigationBar">
        <div class="navigationBar-foot">
            <router-link to="/">
                <img :src="img1" alt="">
                <p :class="pathIndex===1?'active':''">首页</p>
            </router-link>
            <router-link to="/device">
                <img :src="img2" alt="">
                <p :class="pathIndex===2?'active':''">售货机</p>
            </router-link>
            <router-link to="/personage">
                <img :src="img3" alt="">
                <p :class="pathIndex===3?'active':''">我的</p>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "navigationBar",
        data() {
            return {
                path: '',
                img1: require('../assets/images/index1.png'),
                img2: require("../assets/images/jiqi1.png"),
                img3: require("../assets/images/my1.png"),
                pathIndex: ''
            };
        },
        created() {
            this.path = this.$route.path;
            switch (this.path) {
                case '/':
                    this.img1 = require('../assets/images/index2.png');
                    this.pathIndex = 1;
                    break;
                case '/device':
                    this.img2 = require('../assets/images/10.png');
                    this.pathIndex = 2;
                    break;
                case '/personage':
                    this.img3 = require('../assets/images/9.png');
                    this.pathIndex = 3;
            }
        }
    }
</script>

<style scoped lang="less">
    .navigationBar-foot {
        height: 100px;
        width: 100%;
        position: fixed;
        bottom: 0;
        box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        background: white;
        a {
            flex: 1;
            text-align: center;
            color: #6A6A6A;
            height: 90px;
            img {
                width: 50px;
            }
            p {
                font-size: 28px;
            }
            .active {
                color: #595CA1;
            }
        }
    }
</style>