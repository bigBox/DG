import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRegister extends UIBase {
    @property({ type: cc.EditBox, displayName: "手机号", tooltip: "请放入手机号" })
    edtIphone: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "验证码", tooltip: "请放入验证码" })
    edtCode: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "密码", tooltip: "请放入密码" })
    edtPassWord: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "验证密码", tooltip: "请放入验证密码" })
    edtPassWord1: cc.EditBox = null;
    @property({ type: cc.Label, displayName: "验证码倒计时文字", tooltip: "验证码倒计时文字" })
    timeLabel: cc.Label = null;
    time: number = 60;//验证码间隔60秒
    vericonShow: boolean = false;//是否可以请求短信验证 false可以 true不可以

    // use this for initialization
    onLoad() {
        global.Instance.MsgPools.register('createAccount', this.onCreateAccount.bind(this));

    };
    onEnable() {
        cc.director.getScheduler().schedule(this.timeMethod,this, 1,0, cc.macro.REPEAT_FOREVER);
    };

    onDisable() {
        cc.director.getScheduler().unschedule(this.timeMethod, this);
    };

    onCreateAccount(msg) {
        if (!msg.errorID) {
            global.CommonClass.UITip.showTipTxt('注册成功', global.Enum.TipType.TIP_GOOD);
        }
        else {
            global.CommonClass.Functions.logServerError(msg);

            if (msg.errorID == 112)
                global.CommonClass.UITip.showTipTxt('账号名不合适，请重新选择账号', global.Enum.TipType.TIP_BAD);
            else
                global.CommonClass.UITip.showTipTxt('注册失败', global.Enum.TipType.TIP_BAD);
        }

    };
    timeMethod(dt) {
        if (this.vericonShow) {
            if (this.time == 0) {
                this.time = 60;
                this.vericonShow = false;
                this.timeLabel.string = '获取验证码'
            } else {
                this.timeLabel.string = this.time + 's'
                this.time--;
            }
        }
    };
    purpleBtn() {
        let data = { phoneNum: '', type: 0 };
        let phoneNum = this.edtIphone.string;
        data.phoneNum = phoneNum;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(phoneNum)) {
            global.CommonClass.UITip.showTipTxt('请填写正确的手机号码', global.Enum.TipType.TIP_BAD);
            return;
        }
        this.vericonShow = true;
        global.Instance.MsgPools.send('createCode', data, function (msg) {
            if (msg.errorID == 0) {

            }
        });

    };
    btnRegister() {
        let data = { account: '', password: '', nickname: '', smsCode: '' };
        let txtAccount = this.edtIphone.string;
        data.account = txtAccount;
        data.nickname = '小新';//昵称
        let edtCode = this.edtCode.string;
        data.smsCode = edtCode;
        let txtPassWord = this.edtPassWord.string;
        data.password = txtPassWord;
        let txtPassWord2 = this.edtPassWord1.string;

        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(txtAccount)) {
            global.CommonClass.UITip.showTipTxt('请填写正确的手机号码', global.Enum.TipType.TIP_BAD);
            global.Instance.Log.debug('btnRegister',"请填写正确的手机号码");
            return;
        }
        if (edtCode.length != 4) {
            global.CommonClass.UITip.showTipTxt('请输入正确验证码', global.Enum.TipType.TIP_BAD);
            global.Instance.Log.debug('btnRegister',"请输入正确验证码");
            return;
        }
        if (txtPassWord == '') {
            global.CommonClass.UITip.showTipTxt('密码不合格', global.Enum.TipType.TIP_BAD);
            global.Instance.Log.debug('btnRegister',"密码不合格");
            return;
        }
        if (txtPassWord != txtPassWord2) {
            global.CommonClass.UITip.showTipTxt('两次密码不一致', global.Enum.TipType.TIP_BAD);
            global.Instance.Log.debug('btnRegister',"两次密码不一致");
            return;
        }
        global.Instance.MsgPools.send('createAccount', data, function (msg) {
            if (msg.errorID == 0) {
                global.Manager.UIManager.close('UIRegister');
            }
        });

    };

    btnClose() {
        global.Manager.UIManager.close('UIRegister');
    };

    // update (dt) {}
}
