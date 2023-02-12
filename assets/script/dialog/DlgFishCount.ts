import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgFishCount extends UIBase {
    data: any;
    ndItems: any;

    // use this for initialization
    onLoad() {
        let ndBack = this.node.getChildByName('itemBack');
        this.ndItems = ndBack.getChildByName('itemScorll').getChildByName('view').getChildByName('content');
    }

    constructor() {
        super();
        this.data = null;
    }

    onEnable() {

    }

    onDisable() {


    }

    show(data) {
        this.data = data;

        let count = 0;
        for (let key in data)
            ++count;

        let itemSpaceW = 0;
        let itemSpaceH = 50;
        let itemColNum = 1;

        let ndTempLate = this.node.getChildByName('ndTempLate');
        ndTempLate.active = false;
        let itemSize = ndTempLate.getContentSize();
        this.ndItems.removeAllChildren();

        let rowNum = Math.ceil(count / itemColNum);
        let totalHeight = (rowNum + 1) * itemSpaceH + rowNum * itemSize.height;
        let contentSize = this.ndItems.getContentSize();
        contentSize.height = totalHeight;
        this.ndItems.setContentSize(contentSize);

        let position = cc.v2(0, -itemSize.height / 2 - itemSpaceH);
        let curPos = cc.v2(position);

        let type = 0;
        for (let key in this.data) {
            let newNode = cc.instantiate(ndTempLate);
            newNode.active = true;
            this.ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.setPosition(curPos.x, curPos.y);

            let data: any = {};
            data.ID = key;
            data.count = this.data[key];

            this.setItemData(newNode, data);

            ++type;
            curPos.x += (itemSpaceW + itemSize.width);
            if (type >= itemColNum) {
                curPos.y -= (itemSpaceH + itemSize.height);
                curPos.x = position.x;
                type = 0;
            }
        }
    }

    setItemData(ndItem, data) {
        let spFish = ndItem.getChildByName('spFish');
        let lblNumber = ndItem.getChildByName('lblNumber');
        let lblName = ndItem.getChildByName('lblName');

        let tempLateID = data.ID;
        lblNumber.getComponent(cc.Label).string = 'X' + data.count.toString();
        global.CommonClass.Functions.setItemTexture(spFish, tempLateID, null);

        let itemData = global.Manager.DBManager.findData('Items', 'ID', tempLateID);
        lblName.getComponent(cc.Label).string = itemData.name;

    }

    btnClose() {
        global.Manager.UIManager.close('DlgFishCount');
    }
}
