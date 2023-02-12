//用户所有物品数据类
const { ccclass, property } = cc._decorator;
@ccclass
export default class PackageData {
    _packageTypeNum: number;
    private  _panel: any;
    package: Map<any, any>;

    constructor() {
        this._packageTypeNum = 6;
        this._panel = null;
        this.package = new Map();  //物品对象模型 {ID:物品ID, num:物品数量, index:在背包分类栏中的位置}
    };
    public get panel() : any {
        return this._panel
    }
    public set panel(data: any) {
        this. _panel= data
    }
    
    public get packageTypeNum() : number {
        return this._packageTypeNum;
    }
    
    public set packageTypeNum(value : number) {
        this._packageTypeNum = value;
    }
    setPanel (panel: any) {
        this._panel = panel;
    };
    getPackageTypeNum() {
        return this._packageTypeNum;
    };


    onItemListRsp(msg: { req: { col: string; }; updateData: string | any[]; }) {
        let packageType = parseInt(msg.req.col);
        global.Instance.Log.debug('请求物品列表: ' , msg);
        this.package[packageType] = [];
        for (let i = 0; i < msg.updateData.length; ++i) {
            this.package[packageType].push(msg.updateData[i]);
        }
    };
    setOnItemList(itemID){
        let data = global.Manager.DBManager.findData('Items', 'ID', itemID);
        let packageType = data.warehouseType
        let list = [];
        if (this.package[packageType])
            list = this.package[packageType];
        let isShow = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].ItemId == itemID) {
                isShow = true;
                list[i].Count += 1
            }
        }
        if(isShow==false){
            let Message = {
                Count: 1,
                EffectsId: 0,
                EffectsLevel: 0,
                EffectsPosition: 0,
                ItemId: itemID
            }
          
            list.push(Message)
        }
        this.package[packageType] = list
    };
    
    onItemDeleteRsp(msg: any) {
        //cc.Instance.Log.debug(msg);
    };
   
    onItemUpdata(msg: { updateData: { [x: string]: any; }; visible: any; }) {
        for (let idx in msg.updateData) {
            let item = msg.updateData[idx];
            let itemData = global.Manager.DBManager.getItemNew(item.ItemId);
            if (itemData != null) {
                let packageType = itemData.warehouseType;

                if (this.package[packageType] == null)
                    this.package[packageType] = [];

                let items = this.package[packageType];
                let changeCount = null;
                for (let i in items) {
                    let curItem = items[i];
                    if (curItem.ItemId != null && curItem.ItemId == item.ItemId) {
                        changeCount = item.Count - curItem.Count;
                        curItem.Count = item.Count;
                        break;
                    }
                }
                if (changeCount == null && item.Count > 0)  //新加物品
                {
                    changeCount = item.Count;
                    items.push(item);
                }

                if (changeCount > 0 && msg.visible /*&& !isLockDrop*/)
                    global.Manager.UIDlgTipManager.addTip(global.Enum.DlgTipType.DLG_ITEMGET, { itemID: item.ItemId, num: changeCount });

                if (changeCount > 0) {
                    global.Module.GameData.addDropCount(item.ItemId, changeCount);
                }
                this.dealSpecialItem(item);
            }
            else {
                global.Instance.Log.debug('该物品物品总表不存在: ' , item.ItemId.toString());
            }
        }
    };
    onplayerMapItem(msg: any){
        global.Instance.Log.debug('onplayerMapItem',msg);
    }

    onItemFriend(msg: any) {

    };

    onItemInteract(msg: any) {
        global.Instance.Log.debug('onItemInteract',msg);
    };

    onItemInteractHistory(msg: any) {
        global.Instance.Log.debug('onItemInteractHistory',msg);
    };

    dealSpecialItem(item: { ItemId: number; }) {
        let data = global.Manager.DBManager.findData('Sundry', 'name', 'mineUseSkillCostItemID');
        let mineCostID = parseInt(data.value);
        if (item.ItemId == mineCostID)      //挖矿采集证变化
        {
            let uiDigGold = global.Manager.UIManager.get('UIDigGold');
            if (uiDigGold != null)
                uiDigGold.refalshCostItem(true);
        }
    };

    //获取某一类物品
    getItems(itemType: string | number) {
        return this.package[itemType];
    };

    //返回 ID:物品ID, Count:物品数量, index:在背包分类栏中的位置
    getItem(itemID: any) {
        let itemData = global.Manager.DBManager.getItemNew(itemID);
        if (itemData == null) return null;

        let itemType = itemData.warehouseType;
        if (this.package[itemType] != null) {
            for (let i = 0; i < this.package[itemType].length; ++i) {
                if (this.package[itemType][i].ItemId == itemID) {
                    return this.package[itemType][i];
                }
            }
        }

        return null;
    };

    //返回 0:添加成功, -1:不存在的物品类型, -2:达到叠加上限, -999999:未知错误
    addItem(itemID: any, num: number) {
        let itemData = global.Manager.DBManager.getItemNew(itemID);
        if (itemData == null) return -1;

        let itemType = itemData.warehouseType;
        if (itemType <= 0 || itemType > this.packageTypeNum)
            return -1;

        let item = this.getItem(itemID);
        if (item != null) {
            if (num == null)
                num = 1;

            let itemNum = item.num + num;
            if (itemNum < itemData.overMax) {
                item.num = itemNum;
                return 0;
            }
            else {
                return -2;
            }
        }
        else {
            item = { ID: itemID, num: 1, index: this.package[itemType].length }
            this.package[itemType].push(item);

            return 0;
        }
    };

    //返回 true:消耗成功 fasle:物品不存在
    costItem(itemID: any, itemNum: number) {
        let item = global.Manager.DBManager.getItemNew(itemID);

        if (item != null) {
            let itemType = item.warehouseType;

            if (item.num >= itemNum) {
                item.num -= itemNum;
                if (item.num <= 0)
                    this.package[itemType].splice(item.index, 1);

                return true;
            }
            else {
                return false;
            }
        }
        return false;
    };

    geVirtualItemCount(itemID: number) {
        if (itemID < 1000) {
            let baseKey = { 1: 'Gold', 2: 'Diamond', 4: 'Experience', 3: 'Stamina', 34: 'Reputation' };

            let key = baseKey[itemID];
            if (key == null)
                return 0;
            else
                return global.Module.MainPlayerData.getDataByKey(key);
        }

        return null;
    };

    getItemCount(itemID: any) {
        let item = this.getItem(itemID);
        if (item == null) {
            let virtualNum = this.geVirtualItemCount(itemID);
            if (virtualNum == null)
                return 0;
            else
                return virtualNum;
        }
        else
            return item.Count;
    };

    filterItemData(itemType: any, condition: (arg0: any) => any) {
        let resItems = new Array();

        let itemDatas = this.getItems(itemType);
        for (let key in itemDatas) {
            if (itemDatas[key].warehouseType == itemType && (condition == null || condition(itemDatas[key]))) {
                resItems.push(itemDatas[key]);
            }
        }

        return resItems;
    };
   
}
