import Taro from "@tarojs/taro";

async function getDishList() {
  const res = await Taro.cloud.callFunction({
    name: "getDishList",
    data: {}
  });
  const result = res.result;
  return result?.data?.list;
}

export {
  getDishList
};