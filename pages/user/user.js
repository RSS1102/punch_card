// pages/user/user.js
const db = wx.cloud.database()
const dbUser = db.collection('userInfo')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Show: true,
        userInfo: {}

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.userInfo = wx.getStorageSync('userInfo')
        if (this.data.userInfo) {
            console.log("本地储存")
            this.setData({
                name: this.data.userInfo.nickName,
                avatarUrl: this.data.userInfo.avatarUrl,
                Show: false,
            })
        }
    },
    //登陆
    onLogin() {
        wx.getUserProfile({
            desc: '请登陆，体验更多内容',
            lang: 'zh_CN',
            success: (result) => {
                this.setData({
                    name: result.userInfo.nickName,
                    avatarUrl: result.userInfo.avatarUrl,
                    Show: false
                })
                this.getOpenid(result)
            },
            fail: (res) => {
                wx.showToast({
                    icon: 'error',
                    title: '登陆失败,请重试',
                })
            },
            complete: (res) => { },
        })
    },
    //getopenid
    getOpenid(result) {
        wx.cloud.callFunction({
            name: "getopneid"
        }).then(res => {
            this.data.userInfo = Object.assign(result.userInfo, { openid: res.result.openid })
            console.log(this.data.userInfo)
            this.saveUserInfo()
        }).catch(err => {
            console.log(err)
        })
    },
    // saveUserInfo
    async saveUserInfo() {
        let saveAlready = false
        let _id = ""
        await dbUser.where({
            openid: this.data.userInfo.openid
        }).get()
            .then(res => {
                saveAlready = true
                _id = res.data[0]._id
                console.log(res)
                console.log(_id)
            })
            .catch(err => {
                saveAlready = false
                console.log(err)
            })
        if (saveAlready) {
            dbUser.doc(_id).update({
                data: {
                    nickName: this.data.userInfo.nickName,
                    avatarUrl: this.data.userInfo.avatarUrl,
                    gender: this.data.userInfo.gender,
                    openid: this.data.userInfo.openid,
                }
            }).then(res => {
                wx.setStorageSync('userInfo', this.data.userInfo)
                console.log(res)
            }).catch(err => {
                console.log(err)
            })

        } else {
            dbUser.add({
                data: {
                    nickName: this.data.userInfo.nickName,
                    avatarUrl: this.data.userInfo.avatarUrl,
                    gender: this.data.userInfo.gender,
                    openid: this.data.userInfo.openid,
                }
            }).then(res => [
                wx.setStorageSync('userInfo', this.data.userInfo)
            ]).catch(err => {
                console.log(err)
            })
        }
    },
    // unlogin
    unLogin() {
        Dialog.confirm({
            title: '退出登陆',
            message: '退出登陆 则不能想享受现在的服务',
        })
            .then(() => {
                // on confirm
                this.removeStorage()
                wx.showToast({
                    icon: "success",
                    title: '退出登陆',
                })
            })
            .catch(() => {
                // on cancel
                wx.showToast({
                    icon: "none",
                    title: '取消退出',
                })
            });
    },
    removeStorage() {
        console.log("退出登陆")
        wx.removeStorageSync('userInfo')
        this.setData({
            Show: true
        })
    }


})