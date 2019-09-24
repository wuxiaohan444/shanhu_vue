<template>
    <div id="login">
        <div class="login_head">
            <img src="../assets/images/loginHead.png" alt="">
        </div>
        <div class="login_box">
            <div class="box_item">
                <img src="../assets/images/yonghu.png" alt="">
                <input type="text" placeholder="请输入用户名" v-model="userName">
            </div>
            <div class="box_item">
                <img src="../assets/images/mima.png" alt="">
                <input type="password" placeholder="请输入密码" v-model="password">
            </div>
        </div>
        <div class="login_btn" @click="login">登录</div>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    export default {
        name: "login",
        data() {
            return {
                userName: '',
                password: '',
            }
        },
        methods: {
            login() {
                this.$axios("post", "/partner/index/login", {
                    userName: this.userName,
                    password: md5(md5(this.password) + md5(this.userName))
                }, (res) => {
                    localStorage.setItem('loginCode', res.data);
                    this.$router.push({
                        path: '/'
                    });
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #login {
        .login_head {
            width: 100%;
            height: 436px;
            background: #595CA1;
            position: relative;
            overflow: hidden;
            img {
                position: absolute;
                width: 180px;
                height: 180px;
                left: 50%;
                transform: translateX(-50%);
                top: 60px;
            }
        }
        .login_head:before {
            content: '';
            position: absolute;
            width: 110%;
            height: 500px;
            background: #ffffff;
            border-radius: 50%;
            bottom: 0;
            left: 50%;
            transform: translateY(70%) translateX(-50%);
        }
        .login_box {
            width: 570px;
            margin: 30px auto;
            .box_item {
                display: flex;
                height: 80px;
                align-items: center;
                img {
                    width: 27px;
                    height: 30px;
                    margin-right: 20px;
                }
                input {
                    flex: 2;
                    height: 80px;
                    border-bottom: 2px solid #E3DFDF;
                    color: #999;
                    box-sizing: border-box;
                }
            }
        }
        .login_btn {
            width: 300px;
            height: 80px;
            background: rgba(89, 92, 161, 1);
            border-radius: 40px;
            color: white;
            line-height: 80px;
            text-align: center;
            margin: 50px auto;
        }
    }
</style>