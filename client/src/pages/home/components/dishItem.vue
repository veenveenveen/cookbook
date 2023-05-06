<template>
  <view class="dish-item">
    <image
      class="item-left"
      :src="info.img"
    />
    <view class="item-right">
      <view class="item-right__name">{{ info.name }}</view>
      <view class="item-right__sales-volume">月售900+  好评度100%</view>
      <view class="item-right__price">￥{{ info.price }}</view>
      <view class="item-right__actions">
        <at-button
          v-if="showAdd"
          type='primary'
          size='small'
          circle
          :on-click="() => handlerAdd(info)"
        >
          <AtIcon value='add' size='14'></AtIcon>
        </at-button>
        <at-button
          v-if="showDelete"
          type='text'
          size='small'
          circle
          :on-click="() => handlerDelete(info)"
        >
          删除
        </at-button>
      </view>
    </view>
  </view>
</template>
  
<script>
  
export default {
  name: "DishItem",
  props: {
    showAdd: {
      type: Boolean,
      default: false
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
  },
  methods: {
    async getData() {
      const data = await getDishList();
      console.log("tabIndex === ", this.tabIndex);
      this.list = data;
    },
    handlerAdd(item) {
      console.log('dasdas');
      this.$emit('add', item);
    },
    handlerDelete(item) {
      console.log('dasdas');
      this.$emit('delete', item);
    },
  },
};
</script>

<style lang="scss">

.dish-item {
  display: flex;
  width: calc(100% - 30rpx);
  margin: 15rpx 15rpx;
  font-size: 24rpx;
  background-color: lightblue;
  border-radius: 5rpx;
  padding: 10rpx;
  .item-left {
    width: 140rpx;
    height: 140rpx;
    margin-right: 10rpx;
  }
  .item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    &__name {
      color: orange;
      font-size: 28rpx;
      font-weight: bold;
    }
    &__sales-volume {
      color: #999;
      font-size: 22rpx;
    }
    &__price {
      color: orangered;
      font-size: 26rpx;
      height: 40rpx;
      line-height: 40rpx;
    }
    &__actions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .at-button {
        padding: 0 !important;
        background-color: orange;
        min-width: 55rpx;
        height: 55rpx;
        line-height: 55rpx;
      }
    }
  }
}

</style>