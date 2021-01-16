const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const configResult = await db.collection('config')
  console.log(configResult)
  if (!Array.isArray(configResult.data) || configResult.data.length === 0) {
    return {
      isMock: false,
      ...configResult.data[0]
    }
  }
  // 等待所有
  return {
    isMock: configResult.data[0].isMock
  }
}
