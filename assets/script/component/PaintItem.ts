
const { ccclass, property } = cc._decorator;

@ccclass
export default class PaintItem extends cc.Component {

    static create(itemID, parent, position, callback) {
        let filePath = "prefab/component/PaintItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                let itemIcon = newNode.getComponent(PaintItem);
                itemIcon.setItem(itemID);

                if (callback)
                    callback(itemIcon);
            }
        });
    };
    itemID: number = 0;
    index: number = 0;

    setItem(itemId) {
        this.itemID = itemId;

        let data = global.Manager.DBManager.getItemNew(itemId);
        let isBig = (data != null && data.showtableType == 3);

        let ndSmallItem = this.node.getChildByName('ndSmallItem');
        let ndBigItem = this.node.getChildByName('ndBigItem');

        ndSmallItem.active = !isBig;
        ndBigItem.active = isBig;

        let opItem = ndSmallItem;
        if (isBig)
            opItem = ndBigItem;

        if (this.itemID > 0) {
            let iconFile = "images/pictrue/items/default";
            let itemData = global.Manager.DBManager.findData('Precious', 'ID', this.itemID);
            if (itemData != null)
                iconFile = itemData.showImage;

            let spItem = opItem.getChildByName('ndItem').getChildByName('spItem');
            global.CommonClass.Functions.setTexture(spItem, iconFile, null);
        }

        let layAdd = opItem.getChildByName('layAdd');
        let ndItem = opItem.getChildByName('ndItem');
        ndItem.active = this.itemID > 0;

        layAdd.active = this.itemID < 0;

        let lblID = this.node.getChildByName('lblID').getComponent(cc.Label);
        lblID.string = this.itemID.toString();
    };

    getItemID() {
        return this.itemID;
    };

    setIndex(index) {
        this.index = index;
    };

    getIndex() {
        return this.index;
    };

    btnAdd() {
        let evt = new cc.Event.EventCustom('onAddItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };

    btnClick() {
        let evt = new cc.Event.EventCustom('onItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };

}
