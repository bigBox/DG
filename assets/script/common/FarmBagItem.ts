

const { ccclass, property } = cc._decorator;

@ccclass
export default class FarmBagItem extends cc.Component {
    itemID: any;
    size: any;
    static create(itemID, itemIdx, parent, position, callback) {
        let filePath = "prefab/component/FarmBagItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                newNode.setName(itemIdx.toString());

                let itemIcon = newNode.getComponent(FarmBagItem);
                itemIcon.setItem(itemID);

                if (callback)
                    callback(newNode);
            }
        });
    };

    constructor() {
        super();
        this.itemID = null;
    };

    // use this for initialization
    onLoad() {

    };

    getItemID() {
        return this.itemID;
    };

    getIndex() {
        let name = this.node.name;
        let itemIdx = parseInt(name);
        return itemIdx;
    };

    setItem(itemID) {
        this.itemID = itemID;

        if (itemID != null) {
            let iconFile = "images/pictrue/items/default";
            let data = global.Manager.DBManager.getItemNew(itemID);
            if (data != null) {
                iconFile = data.path + data.picName;

                let spItem = this.node.getChildByName('spItem');
                global.CommonClass.Functions.setTexture(spItem, iconFile,null);

                let spGreen = this.node.getChildByName('spGreen');
                if (spGreen != null)
                    spGreen.active = (data.subType == 1);
            }

            let lblItemNum = this.node.getChildByName('lblNumber');
            lblItemNum.color = cc.color(255, 0, 0, 255);

            let itemCount = global.Module.PackageData.getItemCount(itemID);
            let farmData = global.Manager.DBManager.findData('FarmCulture', 'ID', itemID);

            let seedNum = 999999;
            if (farmData != null)
                seedNum = farmData.seedNum;

            if (itemCount >= seedNum)
                lblItemNum.color = cc.color(0, 255, 0, 255);
            lblItemNum.getComponent(cc.Label).string = seedNum.toString();//+ '/' +itemCount.toString();

            let level = global.Module.MainPlayerData.getLevel();
            this.setGray(farmData.level >= level);

            this.node.active = true;
        }
        else {
            this.node.active = false;
        }
    };

    showInfo(isShow) {
        let ndInfo = this.node.getChildByName('ndInfo');
        ndInfo.active = isShow;

        let lblNumber = this.node.getChildByName('lblNumber');
        lblNumber.active = isShow;
    };

    setItemSize(itemSize) {
        this.size = itemSize;
        let curSize = this.node.getContentSize();
        this.node.setScale(itemSize / curSize.width, itemSize / curSize.height);
    };

    showSelelct(isShow) {
        let spDirect = this.node.getChildByName('spDirect');
        spDirect.active = isShow;
    };

    setGray(bGray) {
        let spItem = this.node.getChildByName('spItem').getComponent(cc.Sprite);
        let spDirect = this.node.getChildByName('spDirect').getComponent(cc.Sprite);

        global.CommonClass.Functions.grayTexture(spItem, bGray);
        global.CommonClass.Functions.grayTexture(spDirect, bGray);

        let lblNumber = this.node.getChildByName('lblNumber');
        if (bGray)
            lblNumber.color = cc.color(144, 144, 144, 255);
        else
            lblNumber.color = cc.color(255, 255, 255, 255);
    }
    // update (dt) {}
}
