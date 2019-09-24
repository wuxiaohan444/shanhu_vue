<template>
    <div id="app">
        <tips></tips>
        <loading></loading>
        <router-view></router-view>
    </div>
</template>

<script>
    import tips from './components/tips'
    import loading from './components/loading'
    export default {
        name: 'app',
        components:{tips,loading}
    }
</script>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    a {
        text-decoration: none;
        color: #333333;
    }

    input,select {
        border: none;
        outline: none;
    }

    body, html {
        height: 100%;
        color: #333;
    }

    #app {
        height: 100%;
    }
    .save_btn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 88px;
        line-height: 88px;
        background: #535696;
        text-align: center;
        color: white;
        font-size: 28px;
    }
    .on_earth {
        line-height: 50px;
        text-align: center;
    }
</style>
