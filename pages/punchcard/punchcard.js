// pages/punchcard/punchcard.js
// import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const db = wx.cloud.database()
const dbHabit = db.collection('habits')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const util = require("../../utils/util")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        popupShow: false,
        columns: ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days'],
        title: "",
        encourage: "",
        img: "",
        dateDue: "",
        formatDate: ""
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
                img = "cloud://rss-mysql-0ggtqs6y79588e4f.7273-rss-mysql-0ggtqs6y79588e4f-1306466803/habitimg/stick0.png";
                break;
            case 1:
                img = "cloud://rss-mysql-0ggtqs6y79588e4f.7273-rss-mysql-0ggtqs6y79588e4f-1306466803/habitimg/stick1.png";
                break;
            case 2:
                img = "cloud://rss-mysql-0ggtqs6y79588e4f.7273-rss-mysql-0ggtqs6y79588e4f-1306466803/habitimg/stick2.png";
                break;
            case 3:
                img = "cloud://rss-mysql-0ggtqs6y79588e4f.7273-rss-mysql-0ggtqs6y79588e4f-1306466803/habitimg/stick3.png";
                break;
            case 4:
                img = "cloud://rss-mysql-0ggtqs6y79588e4f.7273-rss-mysql-0ggtqs6y79588e4f-1306466803/habitimg/stick4.png";
                break;

        }
        this.setData({
            img: img,
            loading:true
        })
        setTimeout(()=>{
            this.setData({
                loading:false
            })
        },1000)

        this.data.img = img
    },
    //打卡周期
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
        const {
            picker,
            value,
            index
        } = event.detail;
        console.log(`当前值：${value}, 当前索引：${index}`);
        this.setData({
            time: value
        })
        this.formatTime(index)
    },
    // 计算时间-格式化时间
    formatTime(index) {
        console.log(index)
        // 今天 - 格式化为毫秒
        let toDay = new Date()
        let todayNum = toDay.getTime()
        console.log(todayNum)
        // 将时间相加
        let thedays = (1000 * 60 * 60 * 24) * (index + 1) + todayNum
        console.log(thedays)
        // 过期时间 格式化为时间
        let dateDue = new Date()
        dateDue.setTime(thedays)
        this.data.dateDue = dateDue
        console.log(dateDue)
        //格式化时间
        this.data.formatDate = util.formatTime(this.data.dateDue)
        console.log(this.data.formatDate)
    },

    // 指定计划
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
    //确认制定
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
    // 储存内容
    saveHabit() {
        console.log(this.data.title, this.data.dateDue, this.data.encourage, this.data.img)
        let userInfo = wx.getStorageSync('userInfo')
        dbHabit.add({
            data: {
                userInfo: userInfo,
                img: this.data.img,
                title: this.data.title,
                dateDue: this.data.dateDue,
                encourage: this.data.encourage,
                formatDate: this.data.formatDate,
                alreadyDone: false,
            }
        }).then(res => {
            console.log(res)
        }).catch(console.error)
    },
})