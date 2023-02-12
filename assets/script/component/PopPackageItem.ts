
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopPackageItem extends cc.Component {
    itemID: number;
    itemNum: number;
    constructor() {
        super();
        this.itemID = 0;
        this.itemNum = 1;
    };
    static create(itemID, itemNum, parent, position, callback) {
        let filePath = "prefab/component/PopPackageItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                let itemIcon = newNode.getComponent(PopPackageItem);
                itemIcon.setItem(itemID, itemNum);

                //itemIcon.adjustSize();

                if (callback)
                    callback(itemIcon);
            }
        });
    };
    setItem(itemId, itemNum) {
        this.itemID = itemId;

        let iconFile = "images/pictrue/items/default";
        let data = global.Manager.DBManager.getItemNew(itemId);
        if (data != null)
            iconFile = data.path + data.picName;
        let ndSpItem = this.node.getChildByName('spItem');
        global.CommonClass.Functions.setTexture(ndSpItem, iconFile, null);

        this.setNum(itemNum);

        this.node.name = itemId.toString();
    };

    setNum(itemNum) {
        (itemNum != null) ? (this.itemNum = itemNum) : (this.itemNum = 0);
        let lblNumber = this.node.getChildByName('lblNumber').getComponent(cc.Label);
        lblNumber.string = this.itemNum.toString();
        lblNumber.node.active = true;
    };
}
