
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopIndentifyItem extends cc.Component {
    itemID: number;
    itemNum: number;
    constructor() {
        super();
        this.itemID = 0;
        this.itemNum = 1;
    };
    static create(itemID: any, itemNum: any, parent: { addChild: (arg0: any, arg1: number) => void; }, position: { x: any; y: any; }, callback: (arg0: any) => void) {
        let filePath = "prefab/component/PopIndentifyItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                let itemIcon = newNode.getComponent(PopIndentifyItem);
                itemIcon.setItem(itemID, itemNum);

                //itemIcon.adjustSize();

                if (callback)
                    callback(itemIcon);
            }
        });
    };
    setItem(itemId, itemNum) {
        this.itemID = itemId;
        (itemNum != null) ? (this.itemNum = itemNum) : (this.itemNum = 0);

        let iconFile = "images/pictrue/items/default";
        let data = global.Manager.DBManager.getItemNew(itemId);
        if (data != null)
            iconFile = data.path + data.picName;
        let ndSpItem = this.node.getChildByName('spItem');
        global.CommonClass.Functions.setTexture(ndSpItem, iconFile, null);


        let lblNumber = this.node.getChildByName('lblNumber')
        let componetNumber = lblNumber.getComponent(cc.Label);
        componetNumber.string = 'X' + this.itemNum.toString();

        lblNumber.active = (this.itemNum > 0);
    };
}
