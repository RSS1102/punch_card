// pages/index/index.js
const db = wx.cloud.database()
const dbHabit = db.collection('habits')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        habits: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let habit = options.habit
        console.log(wx.getStorageSync('userInfo').openid)
        let openid = wx.getStorageSync('userInfo').openid
        switch (habit) {
            case "allPlan":
                console.log('allPlan')
                dbHabit.orderBy('encourage', 'desc')
                    .where({
                        _openid: openid
                    })
                    .get()
                    .then(res => {
                        console.log(res)
                        this.setData({
                            habits: res.data
                        })
                    }).catch(console.error)
                break;
            case "undonePlan":
                console.log('undonePlan')
                dbHabit.orderBy('encourage', 'desc')
                    .where({
                        _openid: openid
                    })
                    .get()
                    .then(res => {
                        console.log(res)
                        this.setData({
                            habits: res.data
                        })
                    }).catch(console.error)
                break;
            case "donePlan":
                console.log('donePlan')
                dbHabit.orderBy('encourage', 'desc')
                    .where({
                        _openid: openid
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})