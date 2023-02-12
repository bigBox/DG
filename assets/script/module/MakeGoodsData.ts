//制作数据类
const { ccclass, property } = cc._decorator;
@ccclass
export default class MakeGoodsData {
    panel: any;
    factorys: Map<any, any>;
    mapData: any;
    curPickID: number;
    factoryID: number;

    constructor() {
        this.panel = null;
        this.factorys = new Map();
        this.mapData = null;

        this.curPickID = 10000;
        this.factoryID = 0;
    };

    setPanel(panel: any) {
        this.panel = panel;
    };
    setFactoryID(factoryID) {
        this.factoryID = factoryID;
    };
    getFactoryID(factoryID) {
       return this.factoryID;
    };

    addFactory(factoryID: string | number) {
        this.factorys[factoryID] = {
            maxMakeSlotNum: 6,//制作最大数量
            makeItem: new Array(),       //templateID
            makeTime: new Array(),       //number
            pickItem: new Array(),       //{ID, templateID}
        };
    };
    /**
     * 获取制作数据
     * @param {*场景ID} factoryID 
     * @returns 
     */
    getData(factoryID: string | number) {
        return this.factorys[factoryID];
    };

    selfUpdate(dt: any) {
        for (let key in this.factorys) {
            if (this.factorys[key].makeItem.length > 0) {
                let makeItem = this.factorys[key].makeItem[0];
                let targetTime = this.factorys[key].makeTime[0];
                let leftTime = global.CommonClass.Functions.getLeftTime(targetTime);
                if (leftTime <= 0) {
                    if (this.panel != null && key == this.panel.getFactoryID()) {
                        this.panel.node.emit('onMakeItemFinish', {
                            idx: 0,
                            pickItem: makeItem,
                        });
                    }
                    let insMainMap = global.Instance.Dynamics["MainMap"];
                    if (insMainMap != null)
                        insMainMap.addFactoryPickItem(key, makeItem);

                    this.addPickItem(key, makeItem);

                    this.factorys[key].makeItem.shift();
                    this.factorys[key].makeTime.shift();
                } else {
                    if (this.panel != null && parseInt(key) == this.panel.getFactoryID()) {
                        this.panel.node.emit('onMakeItemUpdateTime', {
                            idx: 0,
                            time: leftTime
                        });
                    }
                }
            }
        }
    };
    reflashServerData(msg: { errCode: any; items: any; }) {
        if (!msg.errCode) {
            for (let idx in this.factorys) {
                let factory = this.factorys[idx];
                factory.makeItem = [];
                factory.makeTime = [];
                factory.pickItem = [];
            }

            for (let key in msg.items) {
                let factoryID = 0;
                let item = msg.items[key];
                let itemData = global.Manager.DBManager.findData('ManufactureMakeData', 'ID', item.recipeId);
                if (itemData != null)
                    factoryID = itemData.factory;

                if (this.factorys[factoryID] == null) {
                    this.factorys[factoryID] = {};
                    this.factorys[factoryID].makeItem = [];
                    this.factorys[factoryID].makeTime = [];
                    this.factorys[factoryID].pickItem = [];
                }

                let factoryData = this.factorys[factoryID];
                if (item.state == 1) {
                    factoryData.makeItem.push(item.recipeId);

                    let targetTime = global.CommonClass.Functions.getTargetTime(item.makingTime);
                    factoryData.makeTime.push(targetTime);
                }
                else if (item.state == 2) {
                    factoryData.makeItem.unshift(item.recipeId);

                    let targetTime = global.CommonClass.Functions.getTargetTime(item.countDown);
                    factoryData.makeTime.push(targetTime);
                }
                else if (item.state == 3) {
                    factoryData.pickItem.push(item.recipeId);
                }
            }
        }
    };

    addMakeItem(factoryID: string | number, itemID: any) {
        let makeItemNum = this.getMakeItemNum(factoryID);
        let maxSlot = this.getMaxMakeSlot(factoryID);

        if (maxSlot > makeItemNum) {
            let item = global.Manager.DBManager.findData("ManufactureMakeData", 'ID', itemID)

            if (item != null) {
                this.factorys[factoryID].makeItem.push(itemID);
                let targetTime = global.CommonClass.Functions.getTargetTime(item.cookingTime * 60);
                this.factorys[factoryID].makeTime.push(targetTime);
                return (makeItemNum - 1);
            }
        }

        return -1;
    };

    getMakeItem(factoryID: string | number, idx: number) {
        let makeItem = this.factorys[factoryID].makeItem;

        if (makeItem != null && makeItem.length > idx) {
            return makeItem[idx]
        }

        return null;
    };

    getMakeItemNum(factoryID: string | number) {
        if (this.factorys[factoryID]) {
            let length = this.factorys[factoryID].makeItem.length;
            return length;
        }
        return 0;
    };

    getMaxMakeSlot(factoryID: string | number) {
        if (this.factorys[factoryID]) {
            return this.factorys[factoryID].maxMakeSlotNum;
        }
        return 0;
    };

    quickFinishMake(factoryID: any, itemIdx: any) {
        return true;
    };

    addPickItem(factoryID: string, item: any) {
        this.factorys[factoryID].pickItem.push(item);
    };

    pickItem(factoryID: string | number) {
        let pickItem = this.factorys[factoryID].pickItem;

        if (pickItem.length > 0) {
            let itemID = pickItem[0].ID;
            pickItem.shift();

            return itemID;
        }

        return -1;
    };

    pickAllItem(factoryID: string | number) {
        if (this.factorys[factoryID])
            this.factorys[factoryID].pickItem = [];
    };

    getPickItems(factoryID: string | number) {
        return this.factorys[factoryID].pickItem;
    };

    getTopPickItem(factoryID: string | number) {
        let factory = this.factorys[factoryID];
        if (factory != null) {
            let pickItem = factory.pickItem;
            if (pickItem.length > 0)
                return pickItem[0];
        }

        return 0;
    };
    /**
     * 制作处理返回
     * @param msg enqueued -- 1:制作; 0:领取 recipeId 操作配方ID
     * @returns 
     */
    onManufactureActionRsp(msg: { errorID: any; req: { enqueued: number; recipeId: any; }; produceItemId: any; }) {
        if (msg.errorID) {
            return;
        }
       
        if (msg.req.enqueued == 1) {
            let item = global.Manager.DBManager.findData('ManufactureMakeData', 'ID', msg.req.recipeId);
            this.addMakeItem(item.factory, msg.req.recipeId);
        }
        else if (msg.req.enqueued == 0) {
            let item = global.Manager.DBManager.findData('ManufactureMakeData', 'ID', msg.produceItemId);
            if (item != null) {
                this.pickItem(msg.req.recipeId);
            }
        }

    };
    //请求制作信息返回
    onManufactureInfoRsp(msg: any) {
        global.Instance.Log.debug("UIMakeGoodsData ++ onManufactureInfoRsp ++ msg", msg)
        this.reflashServerData(msg);
        global.Instance.Log.debug("UIMakeGoodsData ++ onManufactureInfoRsp ++ this.factorys", this.factorys)
        for (let key in this.factorys) {
            let factoryID = parseInt(key);

            let factoryData = this.factorys[key];
            if (factoryData != null) {
                let insMainMap = global.Instance.Dynamics["MainMap"];
                if (insMainMap != null)
                    insMainMap.reflashPickItem(factoryID, factoryData.pickItem);
                // if (this.panel != null) {
                //     this.panel.node.emit('onUpdateMakeItem', {
                //         key: key,
                //     });
                // }
            }
        }
    };
    //制作加速
    onManufactureSpeedUpRsp(msg: { errCode: any; req: { buildingId: any; }; info: { makingQueue: any; }; }) {
        if (!msg.errCode) {
            let factoryID = msg.req.buildingId;

            if (msg.info != null) {
                let data = msg.info.makingQueue;

                let factory = this.factorys[factoryID];
                if (factory != null) {
                    let oldCount = factory.makeItem.length;
                    let makeItem = factory.makeItem[0];

                    let makeMsg = { errCode: msg.errCode, items: data };
                    this.reflashServerData(makeMsg);

                    let newCount = factory.makeItem.length;

                    if (newCount < oldCount) {
                        this.panel.node.emit('onMakeItemFinish', {
                            idx: 0,
                            pickItem: makeItem,
                        });
                    }
                }
            }
        }
    };


    onManufacturePickupRsp(msg: { errorID: number; }) {
        if (msg.errorID == 0) {

        }
    };
}


