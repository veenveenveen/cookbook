// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

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
    test: 'himin',
  }
}

// 初始化 cloud
const cloud = require('wx-server-sdk')
cloud.init()

// 引入数据库集合
const db = cloud.database()
const evaluationsCollection = db.collection('evaluations')

// 创建评价
exports.createEvaluation = async (event, context) => {
  const { orderId, userId, score, comment } = event

  // 创建新评价
  const createResult = await evaluationsCollection.add({
    data: {
      orderId: orderId,
      userId: userId,
      score: score,
      comment: comment,
      createTime: new Date()
    }
  })

  return {
    code: 201,
    message: '创建评价成功',
    data: {
      id: createResult._id,
      orderId: orderId,
      userId: userId,
      score: score,
      comment: comment,
      createTime: new Date()
    }
  }
}

// 获取评价详情
exports.getEvaluationDetail = async (event, context) => {
  const { id } = event

  // 查询评价信息
  const queryResult = await evaluationsCollection.doc(id).get()

  if (!queryResult.data) {
    return {
      code: 404,
      message: '评价不存在'
    }
  }

  return {
    code: 200,
    message: '获取评价详情成功',
    data: queryResult.data
  }
}

// 更新评价
exports.updateEvaluation = async (event, context) => {
  const { id, score, comment } = event

  // 检查评价是否存在
  const checkResult = await evaluationsCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '评价不存在'
    }
  }

  // 更新评价信息
  const updateResult = await evaluationsCollection.doc(id).update({
    data: {
      score: score,
      comment: comment
    }
  })

  return {
    code: 200,
    message: '更新评价成功'
  }
}

// 删除评价
exports.deleteEvaluation = async (event, context) => {
  const { id } = event

  // 检查评价是否存在
  const checkResult = await evaluationsCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '评价不存在'
    }
  }

  // 删除评价
  await evaluationsCollection.doc(id).remove()

  return {
    code: 204,
    message: '删除评价成功'
  }
}

// 获取评价列表
exports.getEvaluationList = async (event, context) => {
  const { page = 1, size = 20, orderId } = event

  // 计算数据偏移量
  const skip = (page - 1) * size

  // 查询评价总数
  let countResult = null
  if (orderId) {
    countResult = await evaluationsCollection.where({
      orderId: orderId
    }).count()
  } else {
    countResult = await evaluationsCollection.count()
  }

  // 查询评价列表
  let queryResult = null
  if (orderId) {
    queryResult = await evaluationsCollection.where({
      orderId: orderId
    }).orderBy('createTime', 'desc').skip(skip).limit(size).get()
  } else {
    queryResult = await evaluationsCollection.orderBy('createTime', 'desc').skip(skip).limit(size).get()
  }

  return {
    code: 200,
    message: '获取评价列表成功',
    data: {
      total: countResult.total,
      page: page,
      size: size,
      evaluations: queryResult.data
    }
  }
}