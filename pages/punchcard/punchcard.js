// pages/punchcard/punchcard.js
// import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const db = wx.cloud.database()
const dbHabit = db.collection('habits')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        popupShow: false,
        columns: ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days'],
        title: "",
        encourage: "",
        img: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.userInfo = wx.getStorageSync('userInfo')

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.randomImg()
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        console.log("下拉")
        this.randomImg()
    },

    randomImg() {
        let img = ""
        let Num = parseInt(Math.random() * 4)
        console.log(Num)
        switch (Num) {
            case 0:
                img = "../../images/habit/stick0.png";
                break;
            case 1:
                img = "../../images/habit/stick1.png";
                break;
            case 2:
                img = "../../images/habit/stick2.png";
                break;
            case 3:
                img = "../../images/habit/stick3.png";
                break;
            case 4:
                img = "../../images/habit/stick4.png";
                break;

        }
        this.setData({
            img: img
        })
        this.data.img = img
    },
    setTime() {
        this.setData({
            popupShow: true
        })
    },
    onCancel() {
        this.setData({
            popupShow: false
        })
    },
    onConfirm(event) {
        this.setData({
            popupShow: false
        })
        const { picker, value, index } = event.detail;
        console.log(`当前值：${value}, 当前索引：${index}`);
        this.setData({
            time: value
        })
    },
    setPlan() {
        let userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo)
        if (userInfo) {
            if (this.data.title && this.data.time && this.data.encourage) {
                this.confirmDialog()
            } else {
                wx.showToast({
                    icon: "error",
                    title: '不能为空',
                })
            }
        } else {
            wx.showToast({
                icon: "error",
                title: '请先登陆',
            })
        }


    },
    confirmDialog() {
        Dialog.confirm({
            title: '制定计划',
            message: '你确定制定这个计划吗？',
        })
            .then(() => {
                // on confirm
                this.saveHabit()
                wx.showToast({
                    icon: "none",
                    title: '制定成功',
                })
            })
            .catch(() => {
                // on cancel
                wx.showToast({
                    icon: "none",
                    title: '取消制定',
                })
            });
    },
    saveHabit() {
        console.log(this.data.title, this.data.time, this.data.encourage, this.data.img)
        let userInfo = wx.getStorageSync('userInfo')
        dbHabit.add({
            data: {
                userInfo: userInfo,
                img: this.data.img,
                title: this.data.title,
                time: this.data.time,
                encourage: this.data.encourage,
            }
        }).then(res => {
            console.log(res)
        }).catch(console.error)

    }
})