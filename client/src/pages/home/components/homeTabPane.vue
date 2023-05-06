<template>
  <view class="home-tab-pane-view" style="height: 100%">
    <AtTabsPane class="home-tab-pane" tabDirection="vertical" :index="tabIndex">
      <dish-item
        v-for="(item, index) in list"
        :key="index"
        :info="item"
        show-add
        @add="handlerAdd"
      />
    </AtTabsPane>
  </view>
</template>

<script>
import { getDishList } from "@/apis/dist";
import DishItem from './dishItem';

export default {
  name: "HomeTabPane",
  components: {
    DishItem,
  },
  props: {
    tabIndex: {
      type: Number,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const data = await getDishList();
      console.log("tabIndex === ", this.tabIndex);
      this.list = data;
    },
    handlerAdd(item) {
      console.log('dasdas');
      this.$emit('item-add', item);
    }
  },
};
</script>

<style lang="scss">
.home-tab-pane-view {
  .home-tab-pane {
    .at-tabs__item {
      background-color: orangered !important;
      width: 200rpx !important;
    }
  }
  .item {
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
}
</style>