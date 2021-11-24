// pages/index/index.js
const db = wx.cloud.database()
const dbHabit = db.collection('habits')
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        habits: {},
        toDay: ""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.toDay = new Date()
        console.log(options)
        let habit = options.habit
        console.log(wx.getStorageSync('userInfo').openid)
        let openid = wx.getStorageSync('userInfo').openid
        switch (habit) {
            //1我的计划
            case "allPlan":
                console.log('allPlan')
                dbHabit.orderBy('encourage', 'desc')
                    .where({
                        _openid: openid
                    })
                    .get()
                    .then(res => {
                        console.log(res)
                        this.allPlan(res.data)
                    }).catch(console.error)
                break;
                //2习惯提醒
            case "undonePlan":
                console.log('undonePlan')
                dbHabit.orderBy('encourage', 'desc')
                    .where({
                        _openid: openid,
                        alreadyDone: false
                    })
                    .get()
                    .then(res => {
                        console.log(res)

                        this.setData({
                            habits: res.data
                        })
                    }).catch(console.error)
                break;
                //我已做到
            case "donePlan":
                console.log('donePlan')
                dbHabit.orderBy('encourage', 'desc')
                    .where({
                        _openid: openid,
                        alreadyDone: true

                    })
                    .get()
                    .then(res => {
                        console.log(res)
                        this.setData({
                            habits: res.data
                        })
                    }).catch(console.error)
                break;

            default:
                console.log('default')
                wx.showToast({
                    title: '还没有数据',
                    icon: 'error',
                    duration: 2000
                })
                break;
        }
    },
    async allPlan(data) {
        console.log("data", data)
        let today = new Date()
        let datas = []
        let total = 0
        await dbHabit.count().then(res => {
            total = res.total
            console.log(res.total)
        }).catch(console.error)
        for (let i = 0; i < total; i++) {
            let obj = {}
            if (data[i].dateDue < today) {
                console.log("jia")
                obj = Object.assign(data[i], {
                    pastDue: true
                })
            } else {
                console.log("zhen")
                obj = Object.assign(data[i], {
                    pastDue: false
                })
            }
            datas.push(obj)
        }
        console.log("datas", datas)
        this.setData({
            habits: datas
        })
    },
    doPlan(event,data) {
        console.log(event)
        let id = event.currentTarget.dataset.item._id
        let index =event.currentTarget.dataset.bindex
        Dialog.confirm({
                title: '完成计划',
                message: '您确定这个计划完成了吗？',
            })
            .then(() => {
                // on confirm
                let  alreadyDone= true
                dbHabit.doc(id).update({
                    data: {
                        alreadyDone: alreadyDone
                    }
                }).then(res => {
                    console.log(res)
                    this.setData({
                        // wx:for 循环
                        // wx:for-item=‘变量名(自定义)’ 代表当前循环对象
                        // wx:for-index=‘变量名(自定义)’，当前对象的索引值
                        [`habits[${index}].alreadyDone`]: alreadyDone,
                      })
                }).catch(console.catch)
               
            })
            .catch(() => {
                // on cancel
                wx.showToast({
                    title: '取消',
                    icon: "none",
                    duration: 2000
                })
            })
          


    }

})