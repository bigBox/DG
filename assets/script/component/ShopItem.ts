
const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopItem extends cc.Component {
    index: any;

    onLoad() {

    };
    setItem(index, shopType) {
        this.index = index;
        let data = global.Manager.DBManager.findData('MiniMall', 'Id', index);
        if (data != null) {
            let lblNumber = this.node.getChildByName('lblNumber').getComponent(cc.Label);
            let lblDiamond = this.node.getChildByName('lblDiamond').getComponent(cc.Label);
            let lblFeng = this.node.getChildByName('lblFeng');
            let spItem = this.node.getChildByName('spItem');

            lblNumber.string = 'X' + data.NumPerPackage.toString();


            let iconFile = "images/pictrue/items/default";
            let itemData = global.Manager.DBManager.getItemNew(data.ItemId);
            if (itemData != null)
                iconFile = itemData.path + itemData.picName;
            global.CommonClass.Functions.setTexture(spItem, iconFile, null);

            let spDiamond = this.node.getChildByName('spDiamond');
            if (shopType == 2) {
                let filePath = "images/pictrue/virtualitem/union";
                global.CommonClass.Functions.setTexture(spDiamond, filePath, null);
                spDiamond.active = false;
                lblFeng.active = true;

                lblDiamond.string = data.guildScore.toString();
            }
            else {
                let filePath = "images/pictrue/virtualitem/2";
                global.CommonClass.Functions.setTexture(spDiamond, filePath, null);

                lblDiamond.string = data.Price.toString();

                spDiamond.active = true;
                lblFeng.active = false;
            }
        }
    };

    getIndex() {
        return this.index;
    };

    btnBuy() {
        // this.itemID
        let event = new cc.Event.EventCustom('onItemBuyClick', true);
        event.setUserData(this);
        this.node.dispatchEvent(event);
    };
}
