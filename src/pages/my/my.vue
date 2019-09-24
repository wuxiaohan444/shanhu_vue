<template>
    <div id="my">
        <div class="head_text">欢迎使用</div>
        <div class="my_main">
            <router-link class="my_main_item" to="/personage">
                <div class="item_left">
                    <img src="../../assets/images/set.png" alt="">
                    <span>商户设置</span>
                </div>
                <img src="../../assets/images/right.png" alt="" class="item_right">
            </router-link>
            <router-link class="my_main_item" to="/password">
                <div class="item_left">
                    <img src="../../assets/images/pasword.png" alt="">
                    <span>修改密码</span>
                </div>
                <img src="../../assets/images/right.png" alt="" class="item_right">
            </router-link>
        </div>
        <div class="save_btn" @click="logout">退出登录</div>
    </div>
</template>

<script>
    export default {
        name: "my",
        created(){

        },
        methods:{
            logout(){
                localStorage.removeItem('loginCode');
                this.$router.push({
                    path:"/login"
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #my{
        height: 100%;
        background: #f2f2f2;
        .head_text{
            line-height: 124px;
            text-align: center;
        }
        .my_main{
            background: white;
            .my_main_item{
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 30px;
                box-shadow:0px 1px 0px 0px rgba(0, 0, 0, 0.1);
                .item_left{
                    display: flex;
                    align-items: center;
                    img{
                        width: 40px;
                        margin-right: 20px;
                    }
                }
                .item_right{
                    width: 26px;
                }
            }
        }
    }

</style>