//

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectData {
    data: any | { items: any[] };
    dataNum: number;

    constructor() {
        this.data = {};
        this.dataNum = 0;
    };
    getData() {
        return this.data;
    };
    getDataID(id) {
        for (let key in this.data) {
            let collectData = this.data[key];
            if (collectData.id == id) {
                return collectData;
            }
        }
    };
    getList() { //return ({id, state, items}) list
        return this.data;
    };
    getItem(id: number) {
        for (let key in this.data) {
            let curID = parseInt(key);

            if (curID == id) {
                let item = this.data[key];
                return item;
            }
        }

        return null;
    };
    //判断拥有物品的种类数量
    getMinCount(id) {
        let data = this.getDataID(id);
        let count = 0;
        for (let j = 0; j < data.items.length; j++) {
            let tmpData = data.items[j];
            if (tmpData.count > 0) {
                count++;
            }
        }
        return count;
    };
    getItemProgress(id: any) {
        let item = this.getItem(id);
        if (item != null) {
            let lightNUm = 0;
            for (let key in item.items) {
                let data = item.items[key];
                if (data.state != 0)
                    ++lightNUm;
            }

            return lightNUm / item.items.length;
        }

        return 0;
    };
    getItemSuitNum(id: any) {
        let min = 9999999;
        let item = this.getItem(id);
        if (item != null) {
            let lightNUm = 0;
            for (let key in item.items) {
                let data = item.items[key];
                if (data.state != 0)
                    ++lightNUm;

                if (min > data.count)
                    min = data.count;
            }

            if (lightNUm / item.items.length >= 1)
                return min;
            else
                return 0;
        }

        return 0;
    };
    getDataNum() {
        return this.dataNum;
    };
    onCollectionListRsp(msg: any) {
        if (msg.errorID == 0) {
            global.Instance.Log.debug('onCollectionListRsp ',msg)
            this.dataNum = 0;
            this.data = {};
            for (let key in msg.infos.map) {
                let item = msg.infos.map[key].value;

                if (this.data[key] == null) {
                    this.data[key] = {};
                    this.dataNum++;
                }

                this.data[key].state = item.state;
                this.data[key].id = item.id;
                this.data[key].items = [];

                for (let idx in item.items.map) {
                    let collectItem = item.items.map[idx].value;
                    this.data[key].items.push(collectItem);
                }
            }
            let UICollectionNew = global.Manager.UIManager.get("UICollectionNew");
            if (UICollectionNew)
                UICollectionNew.refreshSV()
            let panel = global.Manager.UIManager.get("UICollectionPrize");
            if (panel)
                panel.showResult();



        }
    };
    onCollectionUpdateNtf(msg: { errorID: number; infos: { map: { [x: string]: { value: any; }; }; }; }) {
        if (msg.errorID == 0) {
            for (let key in msg.infos.map) {
                let item = msg.infos.map[key].value;

                if (this.data[key] == null) {
                    this.data[key] = {};
                    this.dataNum++;
                }

                this.data[key].state = item.state;
                this.data[key].id = item.id;
                this.data.items = [];

                for (let idx in item.items.map) {
                    let collectItem = item.items.map[idx].value;
                    this.data.items.push(collectItem);
                }
            }
        }
    };
    //兑换奖励
    onCollectionRewardRsp(msg: any) {
        global.Instance.Log.debug('兑换奖励',msg)
    };
}
