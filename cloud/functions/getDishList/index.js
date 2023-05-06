// 菜品模块 云函数
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 引入数据库集合
const db = cloud.database()
const dishesCollection = db.collection('Dish')

// 获取菜品列表
exports.main = async (event, context) => {
  const { page = 1, size = 20 } = event

  // 计算数据偏移量
  const skip = (page - 1) * size

  // 查询菜品总数
  const countResult = await dishesCollection.count()

  // 查询菜品列表
  const queryResult = await dishesCollection.orderBy('createTime', 'desc').skip(skip).limit(size).get()

  return {
    code: 200,
    message: '获取菜品列表成功',
    data: {
      total: countResult.total,
      page: page,
      size: size,
      list: queryResult.data
    }
  }
}
