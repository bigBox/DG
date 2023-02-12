//鉴定数据类
const { ccclass, property } = cc._decorator;
@ccclass
export default class IdentifyData {
    identifys: any[];
    unIdentifys: any[];
    maxUnidentify: number;
    maxIdentify: number;
    totalIdentify: number;
    totalUnIdentify: number;
    curRoleID: number;
    curOpType: number;
    verifyCount: number;
    updataCost: number;
    bagItems: any[];
    maxItem: any;
    Bootindex: number;
    panel: any;
    histories: any;


    constructor() {
        this.identifys = new Array();//鉴定列表
        this.unIdentifys = new Array();

        this.maxUnidentify = 10;
        this.maxIdentify = 10;

        this.totalIdentify = 0;
        this.totalUnIdentify = 0;

        this.curRoleID = 0;
        this.curOpType = 0;        //1 自己 2 好友
        this.verifyCount = 0;
        this.updataCost = 0;

        this.bagItems = new Array();

        this.maxItem = this.maxUnidentify + this.maxIdentify;
        this.Bootindex = 2;//指引的下标
    };

    // use this for initialization
    onLoad() {

    };

    setPanel(panel: any) {
        this.panel = panel;
    };


    getIdentify() {
        return this.identifys;
    };

    getUnIdentify() {
        return this.unIdentifys;
    };

    getIdentifyItem(index: string | number) {
        return this.identifys[index];
    };

    getIdentifyItemByID(ID: any) {
        for (let key in this.identifys) {
            let item = this.identifys[key];
            if (item.index == ID)
                return item;
        }
        return null;
    };

    getUnIdentifyItem(index: string | number) {
        return this.unIdentifys[index];
    };

    getUnIdentifyItemByID(ID: any) {
        for (let key in this.unIdentifys) {
            let item = this.unIdentifys[key];
            if (item.index == ID)
                return item;
        }

        return null;
    };

    getIdentifyNum() {
        return this.identifys.length;
    };

    getUnIdentifyNum() {
        return this.unIdentifys.length;
    };

    getMaxItem(type: number)       //1.indentify 2.unIndentify
    {
        if (type == 1) {
            return this.maxIdentify;
        }
        else {
            return this.maxUnidentify;
        }
    };

    getTotalItem(type: number) {
        if (type == 1) {
            return this.totalIdentify;
        }
        else {
            return this.totalUnIdentify;
        }
    };

    getItemNum() {
        return this.unIdentifys.length + this.identifys.length;
    };

    getTopIdentify() {
        if (this.identifys.length > 0)
            return this.identifys[0];

        return 0;
    };

    getBagItems() {
        return this.bagItems;
    };

    setCurOpType(opType: any) {
        this.curOpType = 0;
    };

    getCurOpType() {
        return this.curOpType;
    };

    getTopUnidentify() {
        if (this.unIdentifys.length > 0)
            return this.unIdentifys[0];

        return 0;
    };

    pickItem(itemIdx: number) {
        let itemID = null;
        if (this.identifys.length > itemIdx) {
            itemID = this.identifys[itemIdx];

            this.identifys.splice(itemIdx, 1);
        }

        return itemID;
    };

    identify(idx: number) {
        if (this.unIdentifys.length > 0) {
            let itemID = this.unIdentifys[idx];

            this.unIdentifys.splice(idx, 1);
            this.identifys.push(itemID);

            return itemID;
        }

        return 0;
    };

    isGuideItem(itemID: number) {
        let isOpen = global.Proxys.ProxyGuide.getIsOpen('GetIndentifyItem');
        if (isOpen) {
            let guide = global.Proxys.ProxyGuide.getGuide('GetIndentifyItem');
            let items = guide.exData.split('|');

            for (let key in items) {
                let ID = parseInt(items[key]);
                if (ID == itemID) {
                    return true;
                }
            }
        }

        return false;
    };

    finishGetItemGuide(itemID: any) {
        let isOpen = global.Proxys.ProxyGuide.getIsOpen('GetIndentifyItem');
        if (isOpen) {
            let guide = global.Proxys.ProxyGuide.getGuide('GetIndentifyItem');
            let items = global.CommonClass.Functions.splitNumbers(guide.exData, '|');

            for (let i = 0; i < items.length; ++i) {
                let ID = items[i];
                if (ID == itemID) {
                    items.splice(i, 1);
                    break;
                }
            }

            let newDatas = global.CommonClass.Functions.composeNumbers(items, '|');
            global.Proxys.ProxyGuide.setGuideExData('GetIndentifyItem', newDatas);

            if (items.length <= 0)
                global.Proxys.ProxyGuide.stepNextGuide('GetIndentifyItem');
        }
    };

    getCurRoleID() {
        return this.curRoleID;
    };

    setCurRoleID(roleId: number) {
        this.curRoleID = roleId;
    };

    getCanAutoIdentify() {
        return this.verifyCount < 3;
    };

    getHistory() {
        return this.histories;
    };

    gotoRoom( targetID: any, isChangeSel: any) {
        if (isChangeSel)
            return false;
        if (this.curRoleID == targetID)
            return true;
        let ID = global.Module.MainPlayerData.getRoleID();
        let targetIsSelf = (ID == targetID);
        let isCurSelf = (ID == this.curRoleID);
        let self = this;

        let msgName = '';
        let data = {};

        if (targetIsSelf)      //自己
        {
            msgName = 'verifiedQueue';
        }
        else     //好友
        {
            msgName = 'verifyingQueue';
            data = { roleId: targetID };
        }

        global.Instance.MsgPools.send(msgName, data, function (msg: any) {
            let selfUI = "UIIdentify";
            let otherUI = "UIIdentifyFriend";

            self.setCurRoleID(targetID);

            if (isCurSelf != targetIsSelf) {
                if (isCurSelf) {
                    //自己跳到其它
                    global.Manager.UIManager.close(selfUI);
                    global.Manager.UIManager.open(otherUI,null,null);
                }
                else {
                    //其它跳到自己
                    global.Manager.UIManager.close(otherUI);
                    global.Manager.UIManager.open(selfUI,null,null);
                }
            }
            else {
                let panel = null;
                if (targetIsSelf){
                    //自己跳到自己
                    panel = global.Manager.UIManager.get(selfUI);
                }else{
                    //其它跳到其它
                    panel = global.Manager.UIManager.get(otherUI);
                }
                    

                if (panel != null) {
                    panel.reflash();
                    if (!targetIsSelf)
                        panel.randTalk(true);
                }

            }
        });

    };

    isLast(index: number, type: number) {
        if (type == 1)      //已经鉴定
        {
            let length = this.identifys.length - 1;
            return index == length;
        }
        else {
            let length = this.unIdentifys.length - 1;
            return index == length;
        }
    };

    updateIdentifys(verifys: { [x: string]: any; }) {
        this.identifys = [];
        this.totalIdentify = 0;
        for (let key in verifys) {
            let data = verifys[key];
            let verifyName = data.verifyRoleInfo ? data.verifyRoleInfo.roleName : '';
            let pickTime = global.CommonClass.Functions.getTargetTime(data.verifyCD);

            let item = { index: data.index, itemID: data.itemId, verifyName: verifyName, state: data.state, pickTime: pickTime };
            this.identifys.push(item);
        }
        this.updateBoot();
    };
    setBootindex(index: number) {
        this.Bootindex = index;
    };
    getBootindex() {
        return this.Bootindex;
    };
    updateBoot() {
        this.Bootindex = 2
        for (let i = 0; i < this.identifys.length; i++)
            if (this.identifys[i].itemID != 0)
                this.setBootindex(i);
    };


    getHasUnIdentify(isFirend: any) {
        if (isFirend) {
            for (let i = 0; i < this.unIdentifys.length; ++i) {
                let item = this.unIdentifys[i];
                if (item.state == 1)
                    return true;
            }
        }
        else {
            for (let i = 0; i < this.identifys.length; ++i) {
                let item = this.identifys[i];
                if (item.state == 1)
                    return true;
            }
        }
        return false;
    };

    selfUpdate(dt: number) {
        if (this.panel != null) {
            let identifys = null;

            if (this.curOpType == 1)
                identifys = this.identifys;
            else if (this.curOpType == 2)
                identifys = this.unIdentifys;

            for (let key in identifys) {
                let data = identifys[key];
                if (data.itemID > 0) {
                    let pickTime = data.pickTime;

                    let leftTime = global.CommonClass.Functions.getLeftTime(pickTime);

                    if (leftTime <= 0) {
                        if(data.state != 2){
                            data.state = 2;

                            this.panel.node.emit('onIdentifyPick', {
                                idx: key,
                                pickItem: data,
                            });
                        }
                        

                    }
                    else {
                        this.updataCost += dt;
                        if (this.updataCost > 1) {
                            this.panel.node.emit('onIdentifyUpdate', {
                                idx: key,
                                pickTime: pickTime,
                            });
                        }
                    }
                }
            }//for
        }
    };
   //获取自己的鉴定队列
    onVerifiedQueueRsp(msg: { errorID: any; queues: any; items: any[]; verifyCount: number; histories: any; }) {   //自己家鉴定队列

        this.curOpType = 1;
        global.Instance.Log.debug('自己家鉴定队列', msg)
        if (!msg.errorID) {
            this.updateIdentifys(msg.queues)
            this.bagItems = msg.items;

            let roleId = global.Module.MainPlayerData.getRoleID();
            this.curRoleID = roleId;
            global.Module.FriendChooseData.setSelectID(roleId);

            this.verifyCount = msg.verifyCount;

            this.histories = msg.histories;
        }
    };

    onVerifyingQueueRsp(msg: { errorID: any; roleId: number; queues: { [x: string]: any; }; })       //好友家鉴定队列
    {
        this.curOpType = 2;

        if (!msg.errorID) {
            this.unIdentifys = [];

            this.curRoleID = msg.roleId;
            global.Module.FriendChooseData.setSelectID(this.curRoleID);

            for (let key in msg.queues) {
                let data = msg.queues[key];
                let pickTime = global.CommonClass.Functions.getTargetTime(data.verifyCD);

                let item = { index: data.index, itemID: data.itemId, state: data.state, pickTime: pickTime };//state: 0.待添加 1.待鉴定 2.待揭晓
                this.unIdentifys.push(item);
            }
        }
    };

    onVerifyDequeueRsp(msg: { errorID: number; req: { index: any; }; })    //取物品
    {
        if (!msg.errorID || msg.errorID == 10370) //已被好友鉴定
        {
            this.updateBoot();
            let identifyItem = this.getIdentifyItemByID(msg.req.index);
            identifyItem.verifyName = '';
            identifyItem.state = 0;
            identifyItem.itemID = 0;
        }
    };

    onVerifyEnqueueRsp(msg: { errorID: number; items: any[]; req: { index: any; itemId: any; }; verifyCD: any; })  {      //添加鉴定物品
        if (msg.errorID == 0) {
            this.updateBoot();
            this.bagItems = msg.items;

            let identifyItem = this.getIdentifyItemByID(msg.req.index);
            identifyItem.verifyName = '';
            identifyItem.state = 1;             //未鉴定
            identifyItem.itemID = msg.req.itemId;

            let pickTime = global.CommonClass.Functions.getTargetTime(msg.verifyCD);
            identifyItem.pickTime = pickTime;
        }
    };

    onVerifyItemRsp(msg: { errorID: number; verifyCD: any; req: { roleId: any; index: any; }; })      //帮朋友鉴定物品 
    {
        if (!msg.errorID || msg.errorID == 10370)//已被好友鉴定
        {
            this.updateBoot();
            let pickTime = global.CommonClass.Functions.getTargetTime(msg.verifyCD);

            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            if (msg.req.roleId == mainRoleID) {
                let identifyItem = this.getIdentifyItemByID(msg.req.index);
                identifyItem.state = 2;     //已经鉴定 可以取
                identifyItem.pickTime = pickTime;

                this.verifyCount++;
            }
            else {
                let unIdentifyItem = this.getUnIdentifyItemByID(msg.req.index);
                unIdentifyItem.state = 2;
                unIdentifyItem.pickTime = pickTime;
            }
        }
    };

    onVerifyLeaveRsp(msg: { errorID: any; }) {
        if (msg.errorID) {

        }
    };

    onVerifySpeedupRsp(msg: { errorID: any; req: { index: any; }; verifyCD: number; }) {
        if (!msg.errorID) {
            let item = this.getIdentifyItem(msg.req.index);
            if (item != null) {
                let pickTime = global.CommonClass.Functions.getTargetTime(msg.verifyCD);
                item.pickTime = pickTime;

                if (msg.verifyCD <= 0) {
                    item.state = 2;
                    //item.itemID = msg.resultItem;
                }
                else {
                    global.Instance.Log.debug("onVerifySpeedupRsp",'xxx');
                }
            }
        }
    };
}
