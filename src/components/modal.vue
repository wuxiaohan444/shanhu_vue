<template>
    <div id="modal">
        <div class="modal_box">
            <h5 class="title">{{ modal.title}}</h5>
            <div class="content text">{{ modal.text }}</div>
            <div class="btn">
                <div @click="cancel">取消</div>
                <div @click="affirm">确认</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "modal",
        data() {
            return {
                resolve: '',
                reject: '',
                promise: '', // 保存promise对象
            }
        },
        computed: {
            modal() {
                let options = this.modalOption;
                return {
                    title: options.title || '提示',
                    text: options.text
                }
            }
        },
        props: {
            modalOption: Object
        },
        methods: {
            cancel() {
                this.reject('cancel')
            },
            affirm() {
                this.resolve('affirm')
            },
            confirm() {
                this.promise = new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                });
                return this.promise;
            }
        }
    }
</script>

<style scoped lang="less">
    #modal {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        .modal_box {
            width: 70%;
            min-height: 300px;
            background: white;
            border-radius: 15px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #333333;
            h5 {
                text-align: center;
                line-height: 60px;
                font-size: 36px;
            }
            .content {
                font-size: 30px;
                padding: 30px;
            }
            .btn {
                width: 100%;
                display: flex;
                position: fixed;
                bottom: 5px;
                > div {
                    flex: 1;
                    text-align: center;
                    height: 80px;
                    line-height: 80px;
                    border-top: 1px solid #cccccc;
                }
                > div:nth-child(2) {
                    border-left: 1px solid #cccccc;
                    color: #44C189;
                }
            }
        }
    }
</style>