<template>
    <div id="personage">
        <div class="personage_main">
            <div class="personage_main_item">
                <span>合作商名称：</span>
                <input type="text" placeholder="" v-model="info.name">
            </div>
            <div class="personage_main_item">
                <span>合作商编号：</span>
                <input type="text" placeholder="" v-model="info.no">
            </div>
            <div class="personage_main_item">
                <span>手机号码：</span>
                <input type="text" placeholder="" v-model="info.phone">
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
                info: ''
            }
        },
        created() {
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.$axios('get', "/partner/partner/person", {}, (res) => {
                    this.info = res.data;
                })
            },
            update(){
                this.$axios('post','/partner/partner/modifyInfo',this.info,(res)=>{
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
    #personage {
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