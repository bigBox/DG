
import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgAdultTip extends UIBase {
    item: any;

    constructor() {
        super();
        this.item = null;
    }

    // use this for initialization
    onLoad() {

    }

    setDec(tip) {
        let lblDec = this.node.getChildByName('lblDec').getComponent(cc.Label);
        lblDec.string = tip;
    }

    btnClose() {
        global.Manager.UIManager.close('DlgAdultTip');
        global.CommonClass.Functions.loadScene("LoginScene", null);
    }

    // update (dt) {}
}
