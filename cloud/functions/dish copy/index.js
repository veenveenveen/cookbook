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
const usersCollection = db.collection('users')

// 注册新用户
exports.registerUser = async (event, context) => {
  const { username, password, phone, email } = event
  const currentTime = new Date()

  // 检查用户名是否已存在
  const checkResult = await usersCollection.where({
    username: username
  }).get()

  if (checkResult.data.length > 0) {
    return {
      code: 409,
      message: '用户名已存在'
    }
  }

  // 创建新用户
  const createResult = await usersCollection.add({
    data: {
      username: username,
      password: password,
      phone: phone,
      email: email,
      registerTime: currentTime
    }
  })

  return {
    code: 201,
    message: '注册成功',
    data: {
      id: createResult._id,
      username: username,
      registerTime: currentTime
    }
  }
}

// 用户登录
exports.loginUser = async (event, context) => {
  const { username, password } = event

  // 查询用户信息
  const queryResult = await usersCollection.where({
    username: username,
    password: password
  }).get()

  if (queryResult.data.length === 0) {
    return {
      code: 401,
      message: '用户名或密码错误'
    }
  }

  // 返回登录令牌
  const token = cloud.getWXContext().OPENID + '_' + new Date().getTime()

  return {
    code: 200,
    message: '登录成功',
    data: {
      token: token
    }
  }
}

// 更新用户信息
exports.updateUser = async (event, context) => {
  const { id, username, phone, email } = event

  // 检查用户是否存在
  const checkResult = await usersCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '用户不存在'
    }
  }

  // 更新用户信息
  const updateResult = await usersCollection.doc(id).update({
    data: {
      username: username,
      phone: phone,
      email: email
    }
  })

  return {
    code: 200,
    message: '更新用户信息成功'
  }
}

// 删除用户
exports.deleteUser = async (event, context) => {
  const { id } = event

  // 检查用户是否存在
  const checkResult = await usersCollection.doc(id).get()

  if (!checkResult.data) {
    return {
      code: 404,
      message: '用户不存在'
    }
  }

  // 删除用户
  await usersCollection.doc(id).remove()

  return {
    code: 204,
    message: '删除用户成功'
  }
}

// 获取用户列表
exports.getUserList = async (event, context) => {
  const { page = 1, size = 20, username = '' } = event

  // 计算数据偏移量
  const skip = (page - 1) * size

  // 查询用户总数
  const countResult = await usersCollection.where({
    username: db.RegExp({
      regexp: `.*${username}.*`,
      options: 'i'
    })
  }).count()

  // 查询用户列表
  const queryResult = await usersCollection.where({
    username: db.RegExp({
      regexp: `.*${username}.*`,
      options: 'i'
    })
  }).orderBy('registerTime', 'desc').skip(skip).limit(size).get()

  return {
    code: 200,
    message: '获取用户列表成功',
    data: {
      total: countResult.total,
      page: page,
      size: size,
      users: queryResult.data
    }
  }
}