// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'rss-mysql-0ggtqs6y79588e4f',
})
const db = cloud.database()
const dbHabit = db.collection('habits')


// 云函数入口函数
exports.main = async (event, context) => {
    let habit = {}
    await dbHabit.orderBy('encourage', 'desc')
        .get()
        .then(res => {
            habit = res
            console.log("res:", res)

        }).catch(console.error)
    console.log("habit:", habit)
    return habit
}