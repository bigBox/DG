import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export class UIHandCode extends UIBase {
    @property({ type: cc.EditBox, displayName: "手机号", tooltip: "请输入手机号" })
    edtphoneNum: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "验证码", tooltip: "请输入验证码" })
    edtsmsCode: cc.EditBox = null;
    @property({ type: cc.Label, displayName: "倒计时", tooltip: "验证码文字倒计时" })
    timeLabel: cc.Label = null;
    time: number;
    vericonShow: boolean;
    constructor() {
        super();
        this.time = 60; //验证码间隔60秒
        this.vericonShow = false;//是否可以请求短信验证 false可以 true不可以
    };
    // use this for initialization
    onLoad() {
    };

    onEnable() {
        cc.director.getScheduler().schedule(this.timeMethod, this, 1);
    };

    onDisable() {
        cc.director.getScheduler().unschedule(this.timeMethod, this);
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
        let data = { phoneNum: '', type: 1 };
        let phoneNum = this.edtphoneNum.string;
        data.phoneNum = phoneNum;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(phoneNum)) {
            global.CommonClass.UITip.showTipTxt('请填写正确的手机号码', global.Enum.TipType.TIP_BAD);
            return;
        }
        this.vericonShow = true;
        global.Instance.MsgPools.send('createCode', data, function (msg) {
            global.Instance.Log.debug('手机注册码 createCode',msg)
            if (msg.errorID == 0) {

            }
        });

    };

    btnRegister() {
        let data = { phoneNum: '', smsCode: '' };
        let phoneNum = this.edtphoneNum.string;
        data.phoneNum = phoneNum;
        let smsCode = this.edtsmsCode.string;
        data.smsCode = smsCode;


        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(phoneNum)) {
            global.CommonClass.UITip.showTipTxt('请填写正确的手机号码', global.Enum.TipType.TIP_BAD);
            return;
        }
        if (smsCode.length != 4) {
            global.CommonClass.UITip.showTipTxt('请输入正确验证码', global.Enum.TipType.TIP_BAD);
            return;
        }

        global.Instance.MsgPools.send('verifyCode', data, function (msg) {
            if (msg.errorID == 0) {
                global.Manager.UIManager.close('UIHandCode');
                global.Manager.UIManager.open('UICypher', null, function (panel) {
                    panel.result(phoneNum);
                });
            }
        });

    };

    btnClose() {
        global.Manager.UIManager.close('UIHandCode');
    };

    // update (dt) {}
}
