import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRealAgree extends UIBase {
    @property({ type: cc.Toggle, displayName: "协议按钮", tooltip: "确定协议按钮" })
    conAgreeToggle: cc.Toggle = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    };
    btnRegister(event, arg) {
        var isChecked = this.conAgreeToggle.isChecked;
        if (isChecked) {
            global.Manager.UIManager.open('UIRegister',null,null);
            this.btnClose();
        } else {
            global.CommonClass.UITip.showTipTxt('请阅读并同意游戏协议', global.Enum.TipType.TIP_BAD);
        }

    };
    btnClose() {
        global.Manager.UIManager.close('UIRealAgree');
    };
    // update (dt) {}
}
