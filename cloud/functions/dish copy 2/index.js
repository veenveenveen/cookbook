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
const dishesCollection = db.collection('dishes')

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}
// 初始化 cloud
const cloud = require('wx-server-sdk')
cloud.init()

// 引入数据库集合
const db = cloud.database()
const ordersCollection = db.collection('orders')

// 创建订单
exports.createOrder = async (event, context) => {
  const { dishes, totalPrice, address } = event
  const { OPENID } = cloud.getWXContext()

  // 创建新订单
  const createResult = await ordersCollection.add({
    data: {
      openid: OPENID,
      dishes: dishes,
      totalPrice: totalPrice,
      address: address,
      createTime: new Date(),
      status: '待付款'
    }
  })

  return {
    code: 201,
    message: '创建订单成功',
    data: {
      id: createResult._id,
      openid: OPENID,
      dishes: dishes,
      totalPrice: totalPrice,
      address: address,
      createTime: new Date(),
      status: '待付款'
    }
  }
}

// 获取订单详情
exports.getOrderDetail = async (event, context) => {
  const { id } = event

  // 查询订单信息
  const queryResult = await ordersCollection.doc(id).get()

  if (!queryResult.data) {
    return {
      code: 404,
      message: '订单不存在'
    }
  }

  return {
    code: 200,
    message: '获取订单详情成功',
    data: queryResult.data
  }
}

// 更新订单状态
exports.updateOrderStatus = async (event, context) => {
  const { id, status } = event

  // 检查订单是否存在
  const checkResult = await ordersCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '订单不存在'
    }
  }

  // 更新订单状态
  const updateResult = await ordersCollection.doc(id).update({
    data: {
      status: status
    }
  })

  return {
    code: 200,
    message: '更新订单状态成功'
  }
}

// 删除订单
exports.deleteOrder = async (event, context) => {
  const { id } = event

  // 检查订单是否存在
  const checkResult = await ordersCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '订单不存在'
    }
  }

  // 删除订单
  await ordersCollection.doc(id).remove()

  return {
    code: 204,
    message: '删除订单成功'
  }
}

// 获取订单列表
exports.getOrderList = async (event, context) => {
  const { page = 1, size = 20, status = '全部' } = event
  const { OPENID } = cloud.getWXContext()

  // 计算数据偏移量
  const skip = (page - 1) * size

  // 查询订单总数
  let countResult = null
  if (status === '全部') {
    countResult = await ordersCollection.where({
      openid: OPENID
    }).count()
  } else {
    countResult = await ordersCollection.where({
      openid: OPENID,
      status: status
    }).count()
  }

  // 查询订单列表
  let queryResult = null
  if (status === '全部') {
    queryResult = await ordersCollection.where({
      openid: OPENID
    }).orderBy('createTime', 'desc').skip(skip).limit(size).get()
  } else {
    queryResult = await ordersCollection.where({
      openid: OPENID,
      status: status
    }).orderBy('createTime', 'desc').skip(skip).limit(size).get()
  }

  return {
    code: 200,
    message: '获取订单列表成功',
    data: {
      total: countResult.total,
      page: page,
      size: size,
      orders: queryResult.data
    }
  }
}