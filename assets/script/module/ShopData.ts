//
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopData {
    data: {};

    constructor() {
        this.data = {};
    };

    // use this for initialization
    onLoad() {

    };

    getData() {
        return this.data;
    };

    getDataByType(shopType) {//1.钻石 2.商会

        let data = [];
        global.Instance.Log.debug('getDataByType',this.data)
        for (let key in this.data) {
            let item = this.data[key];
            let itemData = global.Manager.DBManager.findData('MiniMall', 'Id', item.id);
            if (itemData) {
                let type = Math.floor(itemData.Id / 1000);
                if (shopType == type)
                    data.push(item);
            }

        }

        return data;
    };

    onShopListRsp(msg) {
        global.Instance.Log.debug('onShopListRsp',msg)
        if (msg.errorID == 0) {
            this.data = {};

            for (let key in msg.GoodInfos.map) {
                this.data[key] = msg.GoodInfos.map[key].value;
            }
        }
    };

    onShopMallBuyRsp(msg) {
        if (msg.errorID == 0) {

        }
    };

    onExchangeGoodsyRsp(msg) {

    };
}
