
import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgItemDec extends UIBase {
    item: any;
    itemID: any;
    callback: any;

    ctor() {
        this.item = null;
    }

    // use this for initialization
    onLoad() {

    }

    onEnable() {
        this.node.zIndex = 999;
    }

    onDisable() {
    }

    show(itemID, callback) {
        this.itemID = itemID;

        let spItem = this.node.getChildByName('spItem');
        global.CommonClass.Functions.setItemTexture(spItem, itemID, null);

        let itemData = global.Manager.DBManager.getItemNew(itemID);
        let lblName = this.node.getChildByName('lblName');
        lblName.getComponent(cc.Label).string = itemData.name;

        this.callback = callback;
    }

    btnNo(event, arg) {
        global.Manager.UIManager.close('DlgItemDec');

        if (this.callback)
            this.callback();
    }


}
