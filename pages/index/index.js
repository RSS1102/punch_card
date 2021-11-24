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
        wx.showLoading({
            title: '加载中',
        })
        let datas = []
        wx.cloud.callFunction({
            name: "gethabitlist"
        }).then(res => {
            console.log(res)
            for (let i = 0; i < res.result.count.total; i++) {
                let obj = {}
                if (res.result.habit.data[i].dateDue < res.result.today) {
                    console.log("jia")
                    obj = Object.assign(res.result.habit.data[i], {
                        pastDue: true
                    })
                } else {
                    console.log("zhen")
                    obj = Object.assign(res.result.habit.data[i], {
                        pastDue: false
                    })
                }
                datas.push(obj)
            }
            this.setData({
                habits: res.result.habit.data,
            })
            wx.hideLoading()
        })

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
        this.onLoad()

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