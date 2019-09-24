<template>
    <div id="password">
        <div class="personage_main">
            <div class="personage_main_item">
                <span>旧密码：</span>
                <input type="text" placeholder="" v-model="oldPassword">
            </div>
            <div class="personage_main_item">
                <span>新密码：</span>
                <input type="text" placeholder="" v-model="newPassword">
            </div>
            <div class="personage_main_item">
                <span>确认密码：</span>
                <input type="text" placeholder="" v-model="amendPassword">
            </div>
        </div>
        <div class="save_btn" @click="update">确认修改</div>
    </div>
</template>

<script>
    export default {
        name: "personage",
        data() {
            return {
                oldPassword: '',
                newPassword: '',
                amendPassword: '',
            }
        },
        created() {

        },
        methods: {
            update() {
                let data = {
                    old: this.oldPassword,
                    new1: this.newPassword,
                    new2: this.amendPassword
                };
                this.$axios('post', '/partner/partner/modifyPassword', data, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #password {
        height: 100%;
        background: #f2f2f2;
        padding-top: 20px;
        box-sizing: border-box;
        .personage_main {
            font-size: 28px;
            background: white;
            padding: 0 10px;
            box-sizing: border-box;
            margin: 0 20px;
            .personage_main_item {
                line-height: 80px;
                border-bottom: 1px solid #f2f2f2;
            }
        }
    }
</style>