<template>
    <div id="addMan">
        <div class="add_main">
            <p>新增员工</p>
            <div class="headImg">
                <img :src="ip+img" alt="">
                <input type="file" @change="updateImg($event)">
            </div>
            <div class="add_item">
                <span>登录账号：</span>
                <input type="text" placeholder="必填" v-model="loginName">
            </div>
            <div class="add_item">
                <span>登录密码：</span>
                <input type="password" placeholder="必填" v-model="password">
            </div>
            <div class="add_item">
                <span>真实姓名：</span>
                <input type="text" placeholder="" v-model="realName">
            </div>
            <div class="add_item">
                <span>手机号：</span>
                <input type="text" placeholder="" v-model="phone">
            </div>
            <div class="add_item">
                <span>年龄：</span>
                <input type="text" placeholder="" v-model="age">
            </div>
            <div class="add_item">
                <span>身份证号：</span>
                <input type="text" placeholder="" v-model="card">
            </div>
            <div class="add_item">
                <span>性别：</span>
                <select name="" id="" v-model="sex">
                    <option value="1">男</option>
                    <option value="2">女</option>
                </select>
            </div>
            <div class="add_item">
                <span>是否启用：</span>
                <div :class="status===1?'switch-open':'switch-close'" @click="switchStatus"></div>
            </div>
        </div>
        <div class="save_btn" @click="save">保存</div>
    </div>
</template>

<script>
    export default {
        name: "addMan",
        data() {
            return {
                id: '',
                ip: this.fixedIp(),
                img: '',
                loginName: '',
                password: '',
                realName: '',
                phone: '',
                age: '',
                card: '',
                sex: '',
                status: 0
            }
        },
        created() {
            this.id = this.$route.query.id;
            if (this.id) {
                this.getInfo();
            }
        },
        methods: {
            // 上传照片
            updateImg(e) {
                let file = e.target.files[0];
                let formData = new FormData();
                formData.append('file', file);
                this.$axios('post', '/partner/file/uploadFile', formData, (res) => {
                    this.img = res.data;
                }, 'multipart/form-data', false)
            },
            getInfo() {
                this.$axios('get', '/partner/inspector/select', {id: this.id}, (res) => {
                    console.log(res.data);
                    let data = res.data;
                    this.img = data.headImg;
                    this.loginName = data.loginName;
                    this.password = data.password;
                    this.realName = data.realName;
                    this.phone = data.phone;
                    this.age = data.age;
                    this.card = data.card;
                    this.sex = data.sex;
                    this.status = data.status;
                })
            },
            switchStatus() {
                switch (this.status) {
                    case 0:
                        this.status = 1;
                        break;
                    case 1:
                        this.status = 0;
                        break;
                }
            },
            save() {
                let data = {
                    id: this.id,
                    headImg: this.img,
                    realName: this.realName,
                    loginName: this.loginName,
                    password: this.password,
                    phone: this.phone,
                    age: this.age,
                    card: this.card,
                    status: this.status,
                    sex: this.sex,
                };
                let url;
                if (this.id) {
                    url = '/partner/inspector/update'
                } else {
                    url = '/partner/inspector/add';
                }
                this.$axios('post', url, data, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.$router.back(-1)
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #addMan {
        height: 100%;
        background: #f2f2f2;
        padding: 30px;
        box-sizing: border-box;
        padding-bottom: 88px;
        overflow: scroll;
        .add_main {
            background: white;
            font-size: 28px;
            > p {
                text-align: center;
                line-height: 80px;
            }
            .headImg {
                width: 144px;
                height: 144px;
                border-radius: 50%;
                border: 1px solid #f2f2f2;
                margin: 20px auto;
                position: relative;
                img, input[type="file"] {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                input[type="file"] {
                    opacity: 0;
                }
            }
            .add_item {
                margin: 0 20px;
                line-height: 80px;
                border-bottom: 2px solid #f2f2f2;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                    display: inline-block;
                    width: 150px;
                    text-align: center;
                }
                input, select {
                    flex: 1;
                }
                .switch-open, .switch-close {
                    width: 100px;
                    height: 50px;
                    border-radius: 50px;
                    background: #595CA1;
                    position: relative;
                }
                .switch-close {
                    background: #d5d5d5;
                }
                .switch-open:after, .switch-close:after {
                    content: '';
                    position: absolute;
                    width: 47px;
                    height: 47px;
                    border-radius: 50%;
                    background: white;
                    right: 2px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .switch-close:after {
                    left: 2px;
                }
            }
        }
    }
</style>