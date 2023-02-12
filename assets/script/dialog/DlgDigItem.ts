import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgDigItem extends UIBase {
    item: any;


    ctor() {
        this.item = null;
    }

    // use this for initialization
    onLoad() {

    }


    show(item) {
        let lblMine = this.node.getChildByName('lblMine');
        let spMine = this.node.getChildByName('spMine');
        //   let lblSoil  = this.node.getChildByName('lblSoil');
        // let spSoil = this.node.getChildByName('spSoil');

        let type = item.type;

        let mineData = global.Manager.DBManager.findData("DigGold", 'ID', type);
        if (mineData != null) {
            let left = Math.ceil(item.totalStage - item.stage);
            lblMine.getComponent(cc.Label).string = mineData.name + ' ' + left.toString() + '/' + item.totalStage.toString();

            global.CommonClass.Functions.setItemTexture(spMine, mineData.itemGet, null);
            //cc.CommonClass.Functions.setAtlas(spMine, mineData.path, mineData.picName);

            spMine.active = true;
        }
        else {
            spMine.active = false;
            lblMine.getComponent(cc.Label).string = '无矿';
        }

        this.item = item;
    }
    btnNo(event, arg) {
        global.Manager.UIManager.close('DlgDigItem');
    }


    // update (dt) {}
}
