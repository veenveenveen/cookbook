<template>
  <view class='home'>
    <AtTabs
      v-bind="tabConfig"
      :current="current"
      :onClick="handleClick"
    >
      <template v-for="item, index in tabList">
        <HomeTabPane
          ref="tabPane"
          :tab-index="index"
          @item-add="handlerAddToShoppingCart"
        >
          
        </HomeTabPane>
      </template>
    </AtTabs>
    <AtFab
      style="position: fixed; right: 15rpx; bottom: 15rpx; background-color: aquamarine;"
      :on-click="() => handlerGoShoppingCart()"
    >
      <Text className='at-fab__icon at-icon at-icon-menu'>
        {{ shoppingCart.length }}
      </Text>
    </AtFab>
    <AtFloatLayout
      title="购物车"
      :is-opened="show"
      :on-close="() => { this.show = false; }"
    >
      <view class="empty" v-if="shoppingCart.length === 0">
        暂无数据
      </view>
      <template v-else>
        <dish-item
          v-for="(item, index) in shoppingCart"
          :key="index"
          :info="item"
          show-delete
          @delete="handlerDeleteFromShoppingCart(index)"
        />
        <at-button
          type='primary'
          size='small'
          circle
          :on-click="() => handlerPlaceOrder()"
        >
          下单
        </at-button>
      </template>
    </AtFloatLayout>
  </view>
</template>

<script>
import './index.scss';
import HomeTabPane from './components/homeTabPane';
import DishItem from './components/dishItem';

export default {
  name: 'Home',
  components: {
    HomeTabPane,
    DishItem,
  },
  data() {
    const tabList = [
      { title: '测试测试1' },
      { title: '测试2' },
    ];
    return {
      show: false,
      current: 0,
      tabList,
      tabConfig: {
        scroll: true,
        animated: false,
        tabDirection: 'vertical',
        height: '100vh',
        tabList,
      },
      shoppingCart: [],
    };
  },
  methods: {
    handleClick(value) {
      console.log(value, this.$refs);
      this.current = value
      this.$refs.tabPane[value].getData();
    },
    // 添加到购物车
    handlerAddToShoppingCart(item) {
      this.shoppingCart.push(item);
    },
    // 从购物车删除
    handlerDeleteFromShoppingCart(index) {
      this.shoppingCart.splice(index, 1);
    },
    handlerGoShoppingCart() {
      this.show = true;
    },
  },
}
</script>