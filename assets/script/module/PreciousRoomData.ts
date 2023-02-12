//展厅数据类
const { ccclass, property } = cc._decorator;
@ccclass
export default class PreciousRoomData {
    qualityDec: {};
    money: number;
    otherMoney: number;
    isOther: boolean;
    curRoleID: number;//当前展架在谁家
    type: number;
    data: {};
    otherData: {};
    fortuneData: { totalMoney: number; title: number; };
    suits: {};
    totalData: {
        tradeData: any[]; //X轴架子数据
        verData: any[]; //Y轴架子数据
        sureData: any[];
    };
    page: any;

    constructor() {
        this.qualityDec = {};

        this.qualityDec[0] = '未鉴定';
        this.qualityDec[1] = '未鉴定';
        this.qualityDec[2] = '美';
        this.qualityDec[3] = '瑕';
        this.qualityDec[4] = '损';
        this.qualityDec[5] = '残';
        this.money = 0;
        this.otherMoney = 0;
        this.isOther = false;
        this.curRoleID = 0;
        this.type = -1;        //page
        this.page = -1;//page
        this.data = {};    //{key: page, vaule: Array:(obj{ID, templateID, page, position}) }  
        this.otherData = {};    //{key: page, vaule: Array:(obj{ID, templateID, page, position}) }  

        this.fortuneData = { totalMoney: 0, title: 0 };

        //1.用在宝物展厅时 格式是 this.suits[suitID]=[{1:11, 2:14, 3:13, 4:12, 5:15}]  索引是套装ID，值是宝物序列号集合
        //1.用在字画厅时 格式是 this.suits[0]=true      索引是行号(0-4) 值是 该行是否成套
        this.suits = {};

        this.totalData = {
            tradeData: [],//X轴架子数据
            verData: [],//Y轴架子数据
            sureData: [],//宝物数据
        }

    };
    /**
     * 递归深拷贝
     * @param {*} obj 
     * @returns 
     */
    deepClone(obj: any) {
        let objClone = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === "object") {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    //判断ojb子元素是否为对象，如果是，递归复制
                    if (obj[key] && typeof obj[key] === "object") {
                        objClone[key] = this.deepClone(obj[key]);
                    } else {
                        //如果不是，简单复制
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    };
    /**
     * 
     * @param {*} num 0所有数据 1 X轴货架 2 Y轴货架 3 宝物
     * @returns 
     */
    getTotalData(num: any) {
        let data = null;
        
        switch (num) {
            case 0:
                data = this.deepClone(this.totalData);
                break;
            case 1:
                data = this.deepClone(this.totalData.tradeData);
                break;
            case 2:
                data = this.deepClone(this.totalData.verData);
                break;
            case 3:
                data = this.deepClone(this.totalData.sureData);
                break;
        }
        return data;
    };
    onGetShowTableRsp(msg: { errorID: number; roleId: { toNumber: () => number; }; info: string; }) {
        global.Instance.Log.debug("PreciousRoomData ++ onGetShowTableRsp ++ msg", msg);
        if (msg.errorID == 0) {
            this.curRoleID = msg.roleId.toNumber();
            if (msg.info == "") {
                this.totalData = {
                    tradeData: [],//X轴架子数据
                    verData: [],//Y轴架子数据
                    sureData: [],//宝物数据
                }
            } else {
                this.totalData = JSON.parse(msg.info); 
            }
        }
    };
    onSaveShowTableoRsp(msg: any) {
        global.Instance.Log.debug("PreciousRoomData ++ onSaveShowTableoRsp ++ msg", msg)
    };

    getIsOther() {
        return this.isOther;
    };

    getItem(page: string | number, index: string | number, pageIdx: number) {
        if (page != null) {
            if (pageIdx == null)
                pageIdx = 0;

            let pageItems = this.data[page][pageIdx];
            if (pageItems != null) {
                return pageItems[index];
            }
        }

        return null;
    };

    getCurType() {
        return this.type;
    };
    getCurPage() {
        return this.page;
    };
    makeItem(idx: number, templateID: any, page: any, position: cc.Vec2, isInSuit: boolean, pageIdx: any, leaveSeconds: boolean) {
        let leaveTime = 0;
        if (leaveSeconds)
            leaveTime = global.CommonClass.Functions.getTargetTime(leaveSeconds);

        let item = { index: idx, templateID: templateID, page: page, position: position, isInSuit: isInSuit, pageIdx: pageIdx, leaveTime: leaveTime };

        return item;
    };

    getFreeIndex(page: string) {
        let pageData = this.data[this.type];
        let freeIdx = 0;
        if (pageData != null) {
            freeIdx = 100 * parseInt(page);
            let pageItems = pageData[this.page];
            for (let key in pageItems) {
                if (pageItems[freeIdx] == null) {
                    return freeIdx;
                }
                freeIdx += 1;
            }
        }

        return freeIdx;
    };

    addItem(item: { index: any; templateID?: any; page: any; position?: any; isInSuit?: any; pageIdx: any; leaveTime?: number; }) {
        let page = item.page;
        let pageIdx = item.pageIdx;
        if (pageIdx == null)
            pageIdx = 0;

        let pageItems = this.getPageItems(page, pageIdx);
        if (pageItems == null) {
            this.data[page] = {};

            if (this.data[page][pageIdx] == null)
                this.data[page][pageIdx] = {};

            pageItems = this.data[page][pageIdx];
        }

        pageItems[item.index] = item;
    };

    removeItem(page: string | number, index: string | number, pageIdx: number) {
        if (pageIdx == null)
            pageIdx = 0;

        if (this.data && this.data[page]) {
            let pageItems = this.data[page][pageIdx];
            if (pageItems != null) {
                delete pageItems[index];

                return true;
            }
        }

        return false;
    };

    getPageItems(page: string | number, pageIdx: number) {
        if (pageIdx == null)
            pageIdx = 0;
        if (this.isOther) {
            if (this.otherData[page] != null)
                return this.otherData[page][pageIdx];
        }
        else {
            if (this.data[page] != null)
                return this.data[page][pageIdx];
        }

        return null;
    };

    getCurRoleID() {
        return this.curRoleID;
    };

    getAllValue() {
        if (this.isOther)
            return this.otherMoney;
        else
            return this.money;
    };

    getFortuneData() {
        return this.fortuneData;
    };

    formatFortune(value: number) {
        if (value < 10000) {
            return value.toString();
        }
        else if (value) {
            return global.CommonClass.Functions.formatMoney(Math.floor(value / 10000));
        }
    };

    getUIByCurType(type: string | number, isOther: boolean) {
        let selfUI = { 0: "UIPreciousRoom", 1: "UIFishRoom", 2: "UISpecimenRoom", 3: "UIPanitRoom" };
        let otherUI = { 0: "UIPreciousFriend", 1: "UIFishRoomFriend", 2: "UISpecimenFriend", 3: "UIPanitRoomFriend" };

        if (isOther)
            return otherUI[type];
        else
            return selfUI[type];
    };
    /**
     * 跳转好友家逻辑
     * @param {*} type 
     * @param {*} targetID 
     * @param {*} isChangeSel 
     * @returns 
     */
    gotoRoom(type: any, targetID: number, isChangeSel: any) {
        if (isChangeSel)
            return false;
        let self = this;
        if (this.curRoleID != targetID) {
            let ID = global.Module.MainPlayerData.getRoleID();
            let isSelf = (ID == this.curRoleID);
            let targetIsSelf = (ID == targetID);

            let data = { roleId: targetID, page: 1 };
            global.Instance.MsgPools.send('getshowTableInfo', data, function (msg: any) {
                let selfUI = self.getUIByCurType(type, false);
                let otherUI = self.getUIByCurType(type, true);

                if (isSelf != targetIsSelf) {
                    if (isSelf) {    //自己跳到其它
                        global.Manager.UIManager.close(selfUI);
                        global.Manager.UIManager.open(otherUI,null,null);
                    } else {        //其它跳到自己
                        global.Manager.UIManager.close(otherUI);
                        global.Manager.UIManager.open(selfUI,null,null);
                    }
                } else {
                    let panel = null;
                    if (targetIsSelf) {      //自己跳到自己
                        panel = global.Manager.UIManager.get(selfUI);
                     } else  {              //其它跳到其它
                        panel = global.Manager.UIManager.get(otherUI);
                     }
                    if (panel != null){
                        let data = { roleId: targetID, type: 0, page: 1 };
                        global.Instance.MsgPools.send('showTable', data, function (msg) {
                            panel.reflash(0);
                        });
                    }
                       
                }
            });
        }

        return true;
    };

    makeSuit(page: number, isOther: boolean, pageIdx: any) {
        if (page == 0 || page == 2) {
            this.makePreciousSuit(page, isOther, pageIdx);
        }

        return false;
    };

    changeSuit(page: number, itemIdx: any, isOther: any, isAdd: any, pageIdx: any) {
        if (page == 0 || page == 2)
            return this.changePreciousSuit(page, itemIdx, isOther, isAdd, pageIdx);

        return false;
    };

    isInSuit(suitID: any, itemID: any) {
        if (suitID == itemID)
            return true;

        let antiqueData = global.Manager.DBManager.findData('Antique', 'Id', suitID);
        if (antiqueData != null) {
            for (let i = 1; i <= antiqueData.num; ++i) {
                if (antiqueData['sub' + i.toString()] == itemID) {
                    return true;
                }
            }
        }

        return false;
    };

    addPreciousItemToSuit(item: { isInSuit: any; templateID: any; page: any; pageIdx: number; }) {       // item = {index:idx, templateID:templateID, page:page, position:position, isInSuit:isInSuit};

        if (item.isInSuit)
            return null;

        let itemSuits = [];
        let itemData = global.Manager.DBManager.findData('Items', 'ID', item.templateID);
        if (itemData != null && itemData.subType != 23 && itemData.antiqueId.length > 0)
            itemSuits = itemData.antiqueId.split(';');

        for (let suitIdx = 0; suitIdx < itemSuits.length; ++suitIdx) {
            let suitID = itemSuits[suitIdx];
            //   if (this.type==2)       //标本展厅
            // {
            //suitID = itemSuits[suitIdx][0].index%4;
            // }

            let antiqueData = global.Manager.DBManager.findData('Antique', 'Id', suitID);
            if (antiqueData != null) {
                let needCount = antiqueData.num;
                let tempSuit = {};
                let items = this.getPageItems(item.page, item.pageIdx);

                for (let key in items) {
                    let itemValue = items[key];
                    if (!itemValue.isInSuit &&
                        !tempSuit[itemValue.templateID] &&
                        this.isInSuit(suitID, itemValue.templateID)) {
                        tempSuit[itemValue.templateID] = itemValue;
                        needCount--;

                        if (needCount <= 0) {
                            if (this.suits[suitID] == null) {
                                this.suits[suitID] = [];
                                //  this.suits.num++;
                            }

                            let msgItems = [];
                            for (let suitKey in tempSuit) {
                                let tempSuitItem = tempSuit[suitKey];
                                tempSuitItem.isInSuit = true;

                                let itemIdx = tempSuitItem.index;

                                if (!this.isOther)
                                    this.data[this.type][item.pageIdx][itemIdx].isInSuit = true;
                                else
                                    this.otherData[this.type][item.pageIdx][itemIdx].isInSuit = true;

                                let msgItem = { index: tempSuit[suitKey].index, itemId: tempSuit[suitKey].templateID };
                                msgItems.push(msgItem);
                            }
                            this.suits[suitID].push(tempSuit);

                            //  let self = this;
                            if (!this.isOther) {
                                global.Instance.MsgPools.send('antiqueSuit', { type: this.type, materials: msgItems, combine: true }, function (msg: { errorID: number; }) {
                                    if (msg.errorID == 0) {
                                        global.Instance.Log.debug('antiqueSuit....','');
                                    }
                                });
                            }

                            let lastIdx = this.suits[suitID].length - 1;
                            return this.suits[suitID][lastIdx];
                        }
                    }
                }
            }//for

            return null;
        }
    };

    removePreciousItemOnSuit(item: { isInSuit: any; index: any; pageIdx: string | number; }) {
        if (!item.isInSuit)
            return null;

        for (let suitID in this.suits) {
            let oneSuits = this.suits[suitID];     //oneSuits一组相同套装ID的数组
            for (let i = 0; i < oneSuits.length; ++i) {
                let suit = oneSuits[i];     //suit 一个套装
                for (let key in suit) {
                    let suitItem = suit[key];       //suitItem 一个套装元素

                    if (suitItem.index == item.index) {
                        let msgItems = [];
                        let leftItems = [];
                        for (let j in suit) {
                            suit[j].isInSuit = false;

                            let itemIdx = suit[j].index;
                            if (!this.isOther)
                                this.data[this.type][item.pageIdx][itemIdx].isInSuit = false;
                            else
                                this.otherData[this.type][item.pageIdx][itemIdx].isInSuit = false;

                            let msgItem = { index: suit[j].index, itemId: suit[j].templateID };
                            msgItems.push(msgItem);

                            if (suit[j].index != item.index)
                                leftItems.push(suit[j]);
                        }
                        oneSuits.splice(i, 1);
                        global.Instance.MsgPools.send('antiqueSuit', { type: this.type, materials: msgItems, combine: false }, function (msg: { errorID: number; }) {
                            if (msg.errorID == 0) {
                            }
                        });

                        if (oneSuits.length <= 0) {
                            delete this.suits[suitID];
                        }
                        return leftItems;
                    }
                }
            }
        }

        return null;
    };
    makePreciousSuit(page: string | number, isOther: any, pageIdx: number) {
        if (pageIdx == null)
            pageIdx = 0;

        this.suits = {};

        let data = null;
        if (!isOther)
            data = this.data[page][pageIdx];
        else
            data = this.otherData[page][pageIdx];

        for (let idx in data) {
            let value = data[idx];
            if (!value.isInSuit)
                this.addPreciousItemToSuit(value);
        }
    };

    changePreciousSuit(page: string | number, itemIdx: string | number, isOther: any, isAdd: any, pageIdx: number) {
        if (pageIdx == null)
            pageIdx = 0;

        let data = null;
        if (!isOther)
            data = this.data[page][pageIdx];
        else
            data = this.otherData[page][pageIdx];

        let item = data[itemIdx];
        if (item != null) {
            if (isAdd)
                return this.addPreciousItemToSuit(item);
            else
                return this.removePreciousItemOnSuit(item);
        }

        return null;
    };

    getSuit() {
        return this.suits;
    };

    getSuitIndex(page: number, itemIdx: number) {
        if (page == 0) {
            let index = 0;
            for (let suitKey in this.suits) {
                let oneSuits = this.suits[suitKey];
                for (let i = 0; i < oneSuits.length; ++i) {
                    for (let key in oneSuits[i]) {
                        let item = oneSuits[i][key];
                        if (item.index == itemIdx)
                            return index;
                    }
                    ++index;
                }
            }
        }
        else if (page == 2) {
            return Math.floor(itemIdx / 4);
        }

        return null;
    };

    showTableSupport(roleId: any, type: any) {
        let data = { roleId: roleId, type: type };
        global.Instance.MsgPools.send('showTableSupport', data,null);
    };

    onShowTableRsp(msg: { errorID: any; grids: { grids: any[]; money: number; }; req: { type: any; page: any; roleId: { toNumber: () => number; }; }; }) {
        global.Instance.Log.debug("PreciousRoomData onShowTableRsp msg 展厅数据", msg);
        if (!msg.errorID) {
            this.data = {};
            let grids = msg.grids.grids.map;
            let type = msg.req.type;
            this.type = type;
            let page = msg.req.page;
            this.page = page;
            this.data[type] = {};
            this.data[type][page] = {};

            this.curRoleID = msg.req.roleId.toNumber();
            global.Module.FriendChooseData.setSelectID(this.curRoleID);

            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            if (mainRoleID == this.curRoleID) {
                for (var idx in grids) {
                    var grid = grids[idx].value;
                    if (grid.itemId != null && grid.itemId > 0) {
                        var index = parseInt(idx);
                        var item = this.makeItem(parseInt(index.toString()), grid.itemId, type, cc.v2(grid.x, grid.y), false, page, grid.leaveSeconds);
                        this.data[type][page][index] = item;
                    }
                }
                this.money = msg.grids.money;

                this.isOther = false;
                this.makeSuit(type, false, page);
            } else {
                this.otherData = {};
                this.otherData[type] = {};
                this.otherData[type][page] = {};

                for (var i in grids) {
                    var grid = grids[i].value;
                    if (grid.itemId != null && grid.itemId > 0) {
                        var index = parseInt(i);
                        var item = this.makeItem(parseInt(index.toString()), grid.itemId, type, cc.v2(grid.x, grid.y), false, page, grid.leaveSeconds);

                        this.otherData[type][page][index] = item;
                    }
                }
                this.otherMoney = msg.grids.money;
                this.isOther = true;
                this.makeSuit(type, true, page);
            }
        }
    };

    onShowTablePutOnRsp(msg: { errorID: any; req: { itemId: any; type: any; index: any; x: any; y: any; page: any; }; leaveSeconds: any; money: number; }) {
        if (!msg.errorID) {
            if (msg.req.itemId) {

                let page = msg.req.type;
                let index = msg.req.index;
                let x = msg.req.x;
                let y = msg.req.y;
                let pageIdx = msg.req.page;

                let item = this.makeItem(index, msg.req.itemId, page, cc.v2(x, y), false, pageIdx, msg.leaveSeconds);
                this.addItem(item);

                let mainRoleID = global.Module.MainPlayerData.getRoleID();
                if (mainRoleID == this.curRoleID)
                    this.money = msg.money;
                else
                    this.otherMoney = msg.money;

            }
        }
    };

    onShowTablePutDownRsp(msg: { errorID: any; req: { type: any; index: any; page: any; }; money: number; }) {
        if (!msg.errorID) {
            let page = msg.req.type;
            let index = msg.req.index;
            let pageIdx = msg.req.page;

            this.removeItem(page, index, pageIdx);

            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            if (mainRoleID == this.curRoleID)
                this.money = msg.money;
            else
                this.otherMoney = msg.money;
        }
    };


    onShowTableMoveRsp(msg: { errorID: any; req: any; }) {
        if (!msg.errorID) {

            let data = msg.req;

            let pageItems = this.data[data.type];
            let item = pageItems[data.page][data.index];
            item.position = cc.v2(data.x, data.y);
        }
    };

    onShowTableChangePosRsp(msg: { errorID: any; req: { type: any; page: any; index1: number; index2: number; }; }) {
        if (!msg.errorID) {
            let page = msg.req.type;
            let pageIdx = msg.req.page;

            let data = this.data[page][pageIdx];

            let curID = data[msg.req.index1].templateID;
            let curIsSuit = data[msg.req.index1].isInSuit;

            if (data[msg.req.index2] != null) {
                let targetID = data[msg.req.index2].templateID;
                let targetIsSuit = data[msg.req.index2].isInSuit;
                data[msg.req.index1] = this.makeItem(msg.req.index1, targetID, page, cc.v2(0, 0), targetIsSuit, pageIdx, false);
            } else {
                delete data[msg.req.index1];
            }

            data[msg.req.index2] = this.makeItem(msg.req.index2, curID, page, cc.v2(0, 0), curIsSuit, pageIdx, false);

            //this.makeSuit(page, false);
        }
    };

    onShowTablePrize(msg: any) {

    };

    onShowTableInfo(msg: any) {

    };

    onAntiqueCompose(msg: any) {

    };

    onShowTableMoneyNtf(msg: { totalMoney: any; title: any; }) {
        this.fortuneData = { totalMoney: msg.totalMoney, title: msg.title };

        let uiRoleInfo = global.Manager.UIManager.get('UIRoleInfo');
        if (uiRoleInfo != null) {
            uiRoleInfo.reflashFortune();
        }
    };

    onShowTableSupportRsp(msg: { errorID: number; }) {
        if (msg.errorID == 10113) {
            // cc.CommonClass.UITip.showTipTxt('今天已经点赞过', cc.Enum.TipType.TIP_BAD);
        } else {
            global.CommonClass.UITip.showTipTxt('点赞成功', global.Enum.TipType.TIP_GOOD);
        }
    };

    onAntiqueSuitRsp(msg: any) {

    };

    onShowTableAutoPutDownNtf(msg: { type: number; index: any; page: any; }) {
        this.removeItem(msg.type, msg.index, msg.page);

        if (msg.type == 2) {
            let uiSpecimenRoom = global.Manager.UIManager.get('UISpecimenRoom');
            if (uiSpecimenRoom)
                uiSpecimenRoom.autoRemove(msg.page, msg.index);
        }
        else if (msg.type == 1) {
            let uiFishRoom = global.Manager.UIManager.get('UIFishRoom');
            if (uiFishRoom)
                uiFishRoom.autoRemove(msg.index);
        }
    };
}
