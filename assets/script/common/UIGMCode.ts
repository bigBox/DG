import UIBase from "./UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIGMCode extends UIBase {

    onLoad() { }

    start() {

    }
    btnSend() {
        let strCode = this.node.getChildByName('editbox').getComponent(cc.EditBox).string;
        if (strCode.length <= 0)
            return;

        let data = { cmd: strCode };

        let strArray = strCode.split(' ');
        if (strArray[0] == 'GotoGuide') {
            if (global.Proxys.ProxyGuide.goToGuide(strArray[1])) {
                global.CommonClass.UITip.showTipTxt('跳转引导成功', global.Enum.TipType.TIP_GOOD);
            }
        }
        else if (strArray[0] == 'UIHelp') {
            // 2021-11-12 11:26 删除资源 
            // global.Manager.UIManager.open('UIHelpCheck')
        }
        else if (strArray[0] == 'ClearFarmPark') {
            global.Module.FarmParkData.clear();
            global.Module.FishPoolData.clear();
            global.CommonClass.UITip.showTipTxt('清除生态园数据成功', global.Enum.TipType.TIP_GOOD);
        }
        else {
            global.Instance.MsgPools.send('gmCode', data, function (msg) {
                if (msg.errorID == 0) {
                    global.CommonClass.UITip.showTipTxt('指令执行成功', global.Enum.TipType.TIP_GOOD);
                }
                else {
                    global.CommonClass.UITip.showTipTxt('指令执行失败 ' + msg.errorID.toString(), global.Enum.TipType.TIP_BAD);
                }
            });
        }

    };

    btnClose() {
        global.Manager.UIManager.close('UIGMCode');
    };

    // update (dt) {}
}
