
let Man =window["Man"];
const { ccclass, property } = cc._decorator;

@ccclass
export default class PickItem extends cc.Component {
    itemID: number;
    size: any;
    constructor() {
        super();
        this.itemID     = 0;
        this.size   = null;
    };
    static create(itemID, parent, position, callback) {
        let filePath = "prefab/component/PickItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);

                let itemIcon = newNode.getComponent(PickItem);
                itemIcon.setItem(itemID);
                itemIcon.playItemJump(2);

                if (callback)
                    callback(itemIcon);
            }
        });
    };

   
    setItem(itemId) {
        this.itemID = itemId;

        let iconFile = "images/pictrue/items/default";
        let data = global.Manager.DBManager.getItemNew(itemId);
        if (data != null)
            iconFile = data.path + data.picName;
        let ndSpItem = this.node.getChildByName('spItem');
        global.CommonClass.Functions.setTexture(ndSpItem, iconFile,null);
    };

    setItemSize(itemSize) {
        this.size = itemSize;
        let curSize = this.node.getContentSize();
        this.node.setScale(itemSize / curSize.width, itemSize / curSize.height);
    };

    playItemJump(timeSpace) {
        // let ndItem = this.node.getChildByName('spHavest').getChildByName('spHoney');
        let position = this.node.getPosition();
        position.y = 0;

        this.node.stopAllActions();
        this.node.setPosition(position);

        let goodsAct1 = cc.moveTo(0.3, cc.v2(position.x, position.y + 30));
        let goodsBack1 = cc.moveTo(0.3, cc.v2(position.x, position.y));
        let goodsAct2 = cc.moveTo(0.09, cc.v2(position.x, position.y + 5));
        let goodsBack2 = cc.moveTo(0.09, cc.v2(position.x, position.y));
        let delayEnd = cc.delayTime(timeSpace);

        let seq = cc.sequence(goodsAct1, goodsBack1, goodsAct2, goodsBack2, delayEnd);
        let repeat = cc.repeatForever(seq);

        let self = this;
        let delayCall = function () {
            self.node.runAction(repeat);
        };

        let timeDelay = Math.random() * 3;
        let delayAction = cc.delayTime(timeDelay);
        let endFunction = cc.callFunc(delayCall)
        let seque = cc.sequence(delayAction, endFunction);

        this.node.runAction(seque);
    };

}
