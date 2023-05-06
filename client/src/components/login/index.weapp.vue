<template>
    <view className='index'>
        <button @tap="getLogin">获取登录云函数</button>
        <text>context：{{context}}</text>
        <at-tag>dasda</at-tag>
    </view>
</template>

<script>
import Taro from '@tarojs/taro'

export default {
    name: 'login',
    data(){
        return {
            context: {}
        }
    },
    methods: {
        getLogin () {
            Taro.cloud
                .callFunction({
                    name: "getDishList",
                    data: {}
                })
                .then(res => {
                    this.context = JSON.stringify(res.result)
                })
        }
    },
}
</script>
