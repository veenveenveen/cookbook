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

// 创建菜品
exports.createDish = async (event, context) => {
  const { name, price, pictureUrl, description } = event

  // 创建新菜品
  const createResult = await dishesCollection.add({
    data: {
      name: name,
      price: price,
      pictureUrl: pictureUrl,
      description: description
    }
  })

  return {
    code: 201,
    message: '创建菜品成功',
    data: {
      id: createResult._id,
      name: name,
      price: price,
      pictureUrl: pictureUrl,
      description: description
    }
  }
}

// 获取菜品详情
exports.getDishDetail = async (event, context) => {
  const { id } = event

  // 查询菜品信息
  const queryResult = await dishesCollection.doc(id).get()

  if (!queryResult.data) {
    return {
      code: 404,
      message: '菜品不存在'
    }
  }

  return {
    code: 200,
    message: '获取菜品详情成功',
    data: queryResult.data
  }
}

// 更新菜品信息
exports.updateDish = async (event, context) => {
  const { id, name, price, pictureUrl, description } = event

  // 检查菜品是否存在
  const checkResult = await dishesCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '菜品不存在'
    }
  }

  // 更新菜品信息
  const updateResult = await dishesCollection.doc(id).update({
    data: {
      name: name,
      price: price,
      pictureUrl: pictureUrl,
      description: description
    }
  })

  return {
    code: 200,
    message: '更新菜品信息成功'
  }
}

// 删除菜品
exports.deleteDish = async (event, context) => {
  const { id } = event

  // 检查菜品是否存在
  const checkResult = await dishesCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '菜品不存在'
    }
  }

  // 删除菜品
  await dishesCollection.doc(id).remove()

  return {
    code: 204,
    message: '删除菜品成功'
  }
}

// 获取菜品列表
exports.getDishList = async (event, context) => {
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
      dishes: queryResult.data
    }
  }
}
