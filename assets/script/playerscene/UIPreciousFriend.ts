
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIPreciousFriend extends cc.Component {
    @property({ type: cc.Node, displayName: "demoNode", tooltip: "demoNode" })
    demoNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndPickItem", tooltip: "ndPickItem" })
    ndPickItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndPickNode", tooltip: "ndPickNode" })
    ndPickNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndVirtual", tooltip: "ndVirtual" })
    ndVirtual: cc.Node = null;
    @property({ type: cc.Node, displayName: "tranNode", tooltip: "tranNode" })
    tranNode: cc.Node = null;

    @property({ type: cc.Node, displayName: "verNode", tooltip: "verNode" })
    verNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "verNode1", tooltip: "verNode1" })
    verNode1: cc.Node = null;
    @property({ type: cc.Node, displayName: "sureNode", tooltip: "sureNode" })
    sureNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "tranDemo", tooltip: "tranDemo" })
    tranDemo: cc.Node = null;
    @property({ type: cc.Node, displayName: "verDemo", tooltip: "verDemo" })
    verDemo: cc.Node = null;
    @property({ type: cc.Label, displayName: "tranDemoLabel", tooltip: "tranDemoLabel" })
    tranDemoLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "verDemoLabel", tooltip: "verDemoLabel" })
    verDemoLabel: cc.Label = null;
    tradeMoved: any;
    data: {};
    tradeData: any;
    verData: any;
    sureData: any;
    insItemNodeData: any[];
    totalData: {
        tradeData: any; //X轴架子数据
        verData: any; //Y轴架子数据
        sureData: any;
    };
    hallNum: number;
    blockvalue: number;
    halfBlockValue: number;
    listsort: (a: any, b: any) => 1 | -1 | 0;
    totalNum: { longNum: number; widthNum: number; };
    touchStart: any;
    isMoved: boolean;
    constructor() {
        super();
        this.tradeMoved = null;//横板上是否有物品,null(未计算),false(没有),true(有)
        this.data = {};//当前移动物品数据
        this.tradeData = [];//X轴架子数据
        this.verData = [];//Y轴架子数据
        this.sureData = [];//宝物数据
        this.insItemNodeData = []; //横板宝物item
        this.totalData = {
            tradeData: [],//X轴架子数据
            verData: [],//Y轴架子数据
            sureData: [],//宝物数据
        };
        this.hallNum = 1;//几号展厅
        this.blockvalue = 52;//方块数值大小
        this.halfBlockValue = 26;//方块数值的一半
        //排序方法
        this.listsort = function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        };
        this.totalNum = {
            longNum:25,
            widthNum:41,
        }
    };

    // use this for initialization
    onLoad() {
        this.demoNode.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.demoNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.demoNode.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.demoNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
    };

    onEnable() {

        this.reflash();
        global.Module.GameData.setMaskSound(true, null);
        this.playOpenAction(true);
    };
    friendBlick() {
        let UIFriendChoose = global.Manager.UIManager.get('UIFriendChoose');
        if (UIFriendChoose)
            UIFriendChoose.move(true);
    };
    onDisable() {
        this.demoNode.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);//开始
        this.demoNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);//移动
        this.demoNode.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);//内部结束
        this.demoNode.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);//外部结束
        global.Manager.UIManager.close('UIFriendChoose');
        global.Module.GameData.setMaskSound(false, null);
    };


    reflash() {
        this.totalData = global.Module.PreciousRoomData.getTotalData(0);
        this.tradeData = global.Module.PreciousRoomData.getTotalData(1);
        this.verData = global.Module.PreciousRoomData.getTotalData(2);
        this.sureData = global.Module.PreciousRoomData.getTotalData(3);
        this.loadTradeList(this.totalData.tradeData);
        this.loadVerList(this.totalData.verData);
        this.loadSurelist();
    };
    Ansmooth(isShow){
        let anNode1 = this.node.getChildByName('anNode1');
        let anNode2 = this.node.getChildByName('anNode2');
        anNode1.active = true;
        anNode2.active = true;
        {   
            let listData = this.totalData.tradeData
            let itemData = { index: -1, templateID: '500020101', direction: 1, num: 1 };
            let tranNode = anNode2.getChildByName('tranNode')
            tranNode.removeAllChildren();
            for (let i = 0; i < listData.length; i++) {
                let list = listData[i];
                if (list) {
                    for (let k = 0; k < list.length; k++) {
                        itemData = { index: -1, templateID: list[k].templateID, direction: 1, num: list[k].posnumX };
                        let insItem: any = cc.instantiate(this.ndPickNode);
                        if (insItem != null) {
                            var posX = (list[k].contennumX + (list[k].posnumX / 2)) * this.blockvalue;
                            var posY = i * this.blockvalue;
                            let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
                            itemClass.setItem(itemData);
                            insItem.setPosition(cc.v2(posX, posY));
                            insItem.zIndex = Math.ceil(posY);
                            tranNode.addChild(insItem);
                            insItem.active = true;
                            
                        }
                    }
                }
            }
        }
        {
            let listData = this.totalData.verData;
            let verNode = anNode2.getChildByName('verNode')
            let verNode1 = anNode2.getChildByName('verNode1')
            verNode.removeAllChildren();
            verNode1.removeAllChildren();
            let itemData = { index: -1, templateID: '500021004', direction: 0, num: 1 };
            for (let i = 0; i < listData.length; i++) {
                let list = listData[i];
                if (list) {
                    for (let k = 0; k < list.length; k++) {
                        let istrue = false;
                        let rangeX = i;//X轴存在范围数组
                        let largeY = list[k];//Y轴最大范围
                        let event = false;
                        if (this.tradeData[largeY] && this.tradeData[largeY].length != 0)
                            event = this.ontradeData(this.tradeData, rangeX, largeY);
                        if (list[k] == 0)
                            event = true;
                        let trade = this.tradeData[list[k] + 1];
                        if (event == true && list.indexOf(list[k] + 1) != -1 && trade && trade.length != 0) {
                            rangeX = i;//X轴存在范围数组
                            largeY = list[k] + 1;//Y轴最大范围
                            istrue = this.ontradeData(this.tradeData, rangeX, largeY);
                        }
                        if (istrue == false) {
                            let insItem: any = cc.instantiate(this.ndPickNode);
                            if (insItem != null) {
                                var posX = i * this.blockvalue
                                var posY = list[k] * this.blockvalue
                                let name = list[k] * this.totalNum.widthNum + i;
                                insItem.setName(name.toString())
                                let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
    
                                if (event == true) {
                                    itemData.templateID = '500021005';
                                } else {
                                    itemData.templateID = '500021004';
                                }
                                itemClass.setItem(itemData);
    
                                if (event == true) {
                                    insItem.setPosition(cc.v2(posX, posY + 10));
                                    insItem.zIndex = -Math.ceil(posX);
                                    verNode1.addChild(insItem);
                                } else {
                                    insItem.setPosition(cc.v2(posX, posY - 10));
                                    insItem.zIndex = -Math.ceil(posX);
                                    verNode.addChild(insItem);
                                }
                                insItem.active = true;
                            }
    
                        }
                    }
    
                }
            }
           
        }
        {
            let itemData: any = {};
            let sureNode = anNode2.getChildByName('sureNode')
            sureNode.removeAllChildren();
            for (let i = 0; i < this.sureData.length; i++) {
                if (this.sureData[i]) {
                    for (let k = 0; k < this.sureData[i].length; k++) {
                        itemData = { index: this.sureData[i][k].index, templateID: this.sureData[i][k].templateID, direction: 1, num: 1 };
                        let insItem: any = cc.instantiate(this.ndPickNode);
                        if (insItem != null) {
                            var posX = Number(this.sureData[i][k].curPosition.x);
                            var posY = i * this.blockvalue
                            let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
                            itemClass.setItem(itemData);
                            insItem.setPosition(cc.v2(posX, posY));
                            insItem.zIndex = -Math.ceil(posX);
                            insItem.active = true;
                            sureNode.addChild(insItem);
                        }
    
                    }
                }
            }
        }
        anNode2.setPosition(new cc.Vec3(0, 0, 0));
        let widthX = 0
        if (isShow == true)
            widthX = -1500
        else
            widthX = 1500
        anNode1.setPosition(new cc.Vec3(widthX, 0, 0));
        this.reflash();

        cc.tween(anNode1)
            .to(0.5, { position: new cc.Vec3(0, 0, 0) })
            .start()
        cc.tween(anNode2)
            .to(0.5, { position: new cc.Vec3(-widthX, 0, 0) })
            .start()
    }
    toggleClick(event ,num ){
        num = parseInt(num)
        if(this.hallNum != num ){
            let isShow = true;
            if (this.hallNum < num) {
                isShow = false;
            }

            this.hallNum = num;
            let self = this;
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { roleId: ID, page: this.hallNum };
            global.Instance.MsgPools.send('getshowTableInfo', data, function (msg) {
                let data = { roleId: ID, type: global.Module.PreciousRoomData.getCurType(), page: self.hallNum };
                global.Instance.MsgPools.send('showTable', data, function (msg) {
                    if (num == 1)
                        self.Ansmooth(false);
                    else
                        self.Ansmooth(true);
                });
            });
        }
    };
    pageCut(event, age) {
        let self = this;
        if (age == 1) {
            this.hallNum += 1;
            if (this.hallNum == 4)
                this.hallNum = 1;
        } else {
            this.hallNum -= 1;
            if (this.hallNum == 0)
                this.hallNum = 3;
        }
        let ID = global.Module.MainPlayerData.getCurRoleID();
        let data = { roleId: ID, page: this.hallNum };
        global.Instance.MsgPools.send('getshowTableInfo', data, function (msg) {
            self.reflash();
        });
    };
    /**
     * //根据起始点与循环次数生成数组
     * @param {*起始点} num 
     * @param {*循化次数} total 
     * @returns return新数组出去
     */
    getRanarr(num, total) {
        var arr = [];
        for (let i = 0; i < total; i++) {
            arr.push(num + i);
        }
        return arr;
    };


    /**
     * 拆分数组的连续数字
     * @param {*} arr 
     * @returns 
     */
    getSplitArray(arr) {
        var result = [],
            i = 0;
        result[i] = [arr[0]];
        arr.reduce(function (prev, cur) {
            cur - prev === 1 ? result[i].push(cur) : result[++i] = [cur];
            return cur;
        });
        return result;
    };
    /**
     * 加载宝物数据
     */
    loadSurelist() {
        let itemData = {};
        global.Instance.Log.debug('', this.sureData)
        this.sureNode.removeAllChildren();
        for (let i = 0; i < this.sureData.length; i++) {
            if (this.sureData[i]) {
                for (let k = 0; k < this.sureData[i].length; k++) {
                    itemData = { index: -1, templateID: this.sureData[i][k].templateID, direction: 1, num: 1 };
                    let insItem: any = cc.instantiate(this.ndPickNode);
                    if (insItem != null) {
                        var posX = (this.sureData[i][k].contennumX + (this.sureData[i][k].posnumX / 2)) * this.blockvalue
                        var posY = i * this.blockvalue
                        let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
                        itemClass.setItem(itemData);

                        insItem.setPosition(cc.v2(posX, posY));
                        insItem.zIndex = -Math.ceil(posX);
                        insItem.active = true;
                        this.sureNode.addChild(insItem);
                    }

                }
            }
        }

    };
    /**
     * 加载货架横板子
     * @param {*} listData 
     */
    loadTradeList(listData) {
        let itemData = { index: -1, templateID: '500020101', direction: 1, num: 1 };
        global.Instance.Log.debug('横板子', listData);
        this.tranNode.removeAllChildren();
        this.insItemNodeData = [];
        for (let i = 0; i < listData.length; i++) {
            let list = listData[i];
            if (list) {
                this.insItemNodeData[i] = [];
                for (let k = 0; k < list.length; k++) {
                    itemData = { index: -1, templateID: list[k].templateID, direction: 1, num: list[k].posnumX };
                    let insItem: any = cc.instantiate(this.ndPickNode);
                    if (insItem != null) {
                        var posX = (list[k].contennumX + (list[k].posnumX / 2)) * this.blockvalue;
                        var posY = i * this.blockvalue;
                        let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
                        itemClass.setItem(itemData);
                        this.insItemNodeData[i].push(insItem);
                        itemClass.showCanPut(0);;
                        insItem.setPosition(cc.v2(posX, posY));
                        insItem.zIndex = -Math.ceil(posX);
                        insItem.active = true;
                        this.tranNode.addChild(insItem);
                    }
                }
            }
        }

    };
    /**
    * 通过坐标找到物品
    * @param {*} list 
    * @param {*} largeY 
    * @param {*} rangeX 
    * @returns 
    */
    ontradeData(list, rangeX, largeY) {
        var listData = list[largeY];
        //等于Y轴最大范围可入判断
        if (listData) {
            let data = [];
            for (let k = 0; k < listData.length; k++) {
                let date = listData[k];
                let listX = this.getRanarr(date.contennumX, date.posnumX);
                data = data.concat(listX);
            }
            for (let j = 0; j < rangeX.length; j++) {
                if (data.indexOf(rangeX[j]) == -1)
                    return false;
            }
        } else {
            return false;
        }
        return true;
    };
    /**
     * 加载货架竖板子
     * @param {*} listData 
     */
    loadVerList(listData) {
        this.verNode.removeAllChildren();
        this.verNode1.removeAllChildren();
        let itemData = { index: -1, templateID: '500021004', direction: 0, num: 1 };
        global.Instance.Log.debug('listData', listData);
        for (let i = 0; i < listData.length; i++) {
            let list = listData[i];
            if (list) {
                for (let k = 0; k < list.length; k++) {
                    let insItem: any = cc.instantiate(this.ndPickNode);
                    if (insItem != null) {
                        var posX = i * this.blockvalue
                        var posY = list[k] * this.blockvalue
                        let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
                        let rangeX = [i, i - 1];//X轴存在范围数组
                        let largeY = list[k];//Y轴最大范围
                        let event = this.ontradeData(this.tradeData, rangeX, largeY);
                        if (list[k] == 0)
                            event = true;
                        if (event == true) {
                            itemData.templateID = '500021005';
                        } else {
                            itemData.templateID = '500021004';
                        }
                        itemClass.setItem(itemData);
                        insItem.active = true;
                        if (event == true) {
                            insItem.setPosition(cc.v2(posX, posY));
                            insItem.zIndex = -Math.ceil(posX);
                            this.verNode1.addChild(insItem);
                        } else {
                            insItem.setPosition(cc.v2(posX, posY - 10));
                            insItem.zIndex = -Math.ceil(posX);
                            this.verNode.addChild(insItem);
                        }
                    }

                }
            }
        }
    };
    /**
     * 重复数据去重
     * @param {*总数据} list 
     * @param {*重复数据} datalist 
     * @param {*重复下标} index 
     */
    setArrayRemoval(list, datalist, index) {
        var data = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i]) {
                if (i == index) {
                    if (list[i].length > datalist.length)
                        data[i] = [];
                    for (let k = 0; k < list[i].length; k++)
                        if (datalist.indexOf(list[i][k]) == -1)
                            data[i].push(list[i][k]);
                } else {
                    data[i] = [];
                    for (let k = 0; k < list[i].length; k++)
                        data[i].push(list[i][k]);
                }
            }
        }
        return data;
    };
    /**
     * 关闭
     */
    btnReturn() {
        let roleId = global.Module.PreciousRoomData.getCurRoleID();
        global.Manager.UIManager.close('UIPreciousFriend');
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        if (roleInfo == null || roleId != roleInfo.roleId) {
            let friend = global.Module.FriendData.getFriend(roleId);
            global.Module.PlayerMapData.setRoleInfo(friend.roleInfo);

            global.Instance.MsgPools.send('scenePosition', { roleId: roleId }, function (msg) {
                global.CommonClass.Functions.loadScene("PlayerScene", null);
            });
        }
               
        

    };
    verDataClear() {
        {
            let isShow = true;
            let date = [];
            for (let i = 0; i < this.totalData.verData.length; i++) {
                let list = this.totalData.verData[i];
                if (list) {
                    list.sort(this.listsort);
                    let listArray = this.getSplitArray(this.totalData.verData[i]);
                    for (let k = 0; k < listArray.length; k++) {
                        var listData = listArray[k];
                        let rangeX = [i, i - 1];
                        let rangeY = [listData[0]];
                        let largeY = [listData[0]];
                        let event = this.onDetecooritem(this.tradeData, rangeX, rangeY, largeY, true);
                        if (listData[0] == 0 || event != null) {
                            rangeY = listData[listData.length - 1] + 1;
                            largeY = [listData[listData.length - 1] + 1];
                            event = this.onDetecooritem(this.tradeData, rangeX, rangeY, largeY, true);
                            if (listData[listData.length - 1] == 11 || event != null) {
                                if (!date[i])
                                    date[i] = [];
                                Array.prototype.push.apply(date[i], listData);
                            } else {
                                isShow = false;
                            }
                        } else {
                            isShow = false;
                        }
                    }
                }
            }
            this.totalData.verData = [];
            this.verData = [];
            for (let i = 0; i < date.length; i++) {
                if (date[i]) {
                    this.totalData.verData[i] = [];
                    this.verData[i] = [];
                    for (let k = 0; k < date[i].length; k++) {
                        this.totalData.verData[i].push(date[i][k]);
                        this.verData[i].push(date[i][k]);
                    }
                }
            }
            this.loadVerList(this.verData);
        }
    };

    onDetecooritem(list, rangeX, rangeY, largeY, isShow) {
        if (isShow) {
            var listData = list[largeY];
            //等于Y轴最大范围可入判断
            if (listData) {
                for (let k = 0; k < listData.length; k++) {
                    var data = listData[k];
                    var listX = this.getRanarr(data.contennumX, data.posnumX);
                    if (this.isRepeat(rangeX, listX)) {
                        return { data: data, val: largeY, index: k, num: 1 };
                    }
                }
            }
        } else {
            for (let i = 0; i < list.length; i++) {
                var listData = list[i]; for (let i = 0; i < list.length; i++) {
                    var listData = list[i];
                    //小于Y轴最大范围可入判断
                    if (i <= largeY && listData) {
                        for (let k = 0; k < listData.length; k++) {
                            var data = listData[k];
                            var listX = this.getRanarr(data.contennumX, data.posnumX);
                            var listY = this.getRanarr(data.contennumY + 1, data.posnumY - 1);
                            if (this.isRepeat(rangeX, listX)) {
                                if (this.isRepeat(rangeY, listY)) {
                                    return { data: data, val: i, index: k, num: 1 };
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    };

    playOpenAction(isPlayTitle) {
        let ndOpenAction = this.node.getChildByName('ndOpenAction');
        let animation = ndOpenAction.getComponent(cc.Animation);

        let UITitle = this.node.getChildByName('UITitle');
        let playEnd = function () {
            // let titleAnimation = UITitle.getComponent(cc.Animation);
            // titleAnimation.play('titleMove');

            animation.off('finished');
        };


        if (animation != null) {
            animation.play('openScene');

            if (isPlayTitle)
                animation.on('finished', playEnd);
        }
    };
    /**
         * 判断两个数组是否重复
         * @param {*} arr1 
         * @param {*} arr2 
         * @returns return 真假出去
         */
    isRepeat(arr1, arr2) {
        for (var s in arr1) {
            if (arr2.indexOf(arr1[s]) != -1) {
                return true;
            }
        }
        return false;
    };


    btnHome() {
        let name = global.CommonClass.Functions.getSceneName();
        if (name == 'MainScene') {
            global.Manager.UIManager.close('UIPreciousFriend');
        } else {
            global.CommonClass.Functions.loadScene('MainScene', null);
        }
    };

    btnGoods() {
        let roleID = global.Module.PreciousRoomData.getCurRoleID();
        global.Module.PreciousRoomData.showTableSupport(roleID, 0);
    };
    touchEvent(event) {
        let point = this.verNode.convertToNodeSpaceAR(event.getLocation());
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.isMoved = false;
            if (this.touchStart == null)
                this.touchStart = point;
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distance = point.sub(this.touchStart).mag();
            if (distance > 5) {

                this.isMoved = true;
            }
        } else if (event.type == cc.Node.EventType.TOUCH_CANCEL || event.type == cc.Node.EventType.TOUCH_END) {
            //触摸结束
            let pointx = point.x - this.touchStart.x;
            if (Math.abs(pointx) > 60) {
                if (pointx < 0)
                    this.pageCut(null, 1)
                else
                    this.pageCut(null, 2)
            }
        }

    };

}
