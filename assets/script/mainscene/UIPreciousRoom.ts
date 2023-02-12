
const { ccclass, property } = cc._decorator;

@ccclass()
export default class UIPreciousRoom extends cc.Component {

    @property({ type: cc.Node, displayName: "baMapNode", tooltip: "baMapNode" })
    baMapNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "demoNode", tooltip: "demoNode" })
    demoNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndPickItem", tooltip: "ndPickItem" })
    ndPickItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndPickNode", tooltip: "ndPickNode" })
    ndPickNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndVirtual", tooltip: "ndVirtual" })
    ndVirtual: cc.Node = null;
    @property({ type: cc.Node, displayName: "tranNode", tooltip: "横板内容" })
    tranNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "verNode", tooltip: "竖版内容" })
    verNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "verNode1", tooltip: "竖版1内容" })
    verNode1: cc.Node = null;
    @property({ type: cc.Node, displayName: "sureNode", tooltip: "宝物内容" })
    sureNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "tranDemo", tooltip: "横板加减" })
    tranDemo: cc.Node = null;
    @property({ type: cc.Node, displayName: "verDemo", tooltip: "竖版加减" })
    verDemo: cc.Node = null;
    @property({ type: cc.Label, displayName: "tranDemoLabel", tooltip: "tranDemoLabel" })
    tranDemoLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "verDemoLabel", tooltip: "verDemoLabel" })
    verDemoLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "settleBtn", tooltip: "settleBtn" })
    settleBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: "moveNode1", tooltip: "左拖动1" })
    moveNode1: cc.Node = null;
    @property({ type: cc.Node, displayName: "moveNode2", tooltip: "右拖动2" })
    moveNode2: cc.Node = null;
    @property({ type: cc.Node, displayName: "moveToNode1", tooltip: "移动" })
    moveToNode1: cc.Node = null;
    @property({ type: cc.Node, displayName: "moveToNode2", tooltip: "移动" })
    moveToNode2: cc.Node = null;
    @property({ type: cc.Node, displayName: "DlgBoxNode", tooltip: "保存页面" })
    DlgBoxNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "onSave", tooltip: "保存" })
    onSave: cc.Node = null;
    @property({ type: cc.Node, displayName: "offSave", tooltip: "退出" })
    offSave: cc.Node = null;
    @property({ type: cc.Node, displayName: "ToggleNode", tooltip: "页数节点" })
    ToggleNode: cc.Node = null;
    
    touchStart: any;
    ndTouchStart: cc.Vec2;
    isMoved: boolean;
    // tradeMoved: any;
    tranisShow: boolean;
    touchPos: any;
    isDrag: boolean;
    addisShow: boolean;
    data: any;
    dragItemData: any;
    tradeData: any;
    verData: any;
    sureData: any;
    insItemNodeData: any;
    totalData: {//暂缓保存数据,另外的是实施修改数据
        tradeData: any; //X轴架子数据
        verData: any; //Y轴架子数据
        sureData: any;
    };
    page: number;
    hallNum: number;
    blockvalue: number;
    halfBlockValue: number;
    listsort: (a: any, b: any) => 0 | 1 | -1;
    UIDragBag: any;
    canGetMoeny: boolean;
    pickItemData: any;
    curOpItem: any;
    dismodeisShow: boolean;
    surefault: boolean;
    precisShow: boolean;
    blockvaluenum: number;
    totalNum: { longNum: number; widthNum: number; };
    isOnMoved: boolean;
    touchBegin: any;
    position: cc.Vec2;
    isHandle: boolean;
    outsureData: any[];
    mullionArr: any[];
    
    
    constructor() {
        super();
        this.position = new cc.Vec2(0,0);
        this.touchStart = null;//点击初始坐标
        this.ndTouchStart = null;//拖动初始坐标
        this.isMoved = false;//是否滑动宝物用
        this.isOnMoved = false;//是否滑动展架用
        // this.tradeMoved = null;//横板上是否有物品,null(未计算),false(没有),true(有)
        this.touchPos = null;//记录的XY物品方块点
        this.tranisShow = true;//是否可以上传
        this.isDrag = false;//false新拉宝物，场景内拖动宝物
        this.isHandle = false;//横板架子是否有操作

        this.addisShow = false;//是否打开加减点
        this.data = null;//当前移动物品数据
        this.dragItemData = null;
        this.tradeData = [];//X轴架子数据
        this.verData = [];//Y轴架子数据
        this.sureData = [];//宝物数据
        this.outsureData = [];//宝物数据
        this.insItemNodeData = []; //横板宝物item
        this.totalData = {
            tradeData: [],//X轴架子数据
            verData: [],//Y轴架子数据
            sureData: [],//宝物数据
        },
            this.page = 0;
        this.hallNum = 1;//几号展厅
        this.blockvalue = 25;//方块数值大小
        this.halfBlockValue = 12.5;//方块数值的一半
        this.totalNum = {
            longNum:25,
            widthNum:41,
        }

        this.blockvaluenum = 0;//宝物y轴高度
        this.dismodeisShow = false;//展架模式
        this.surefault = false;//宝物是否出错
        this.precisShow = true;//是否显示展品金额
        this.mullionArr = [];//选中的竖框数据
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
    };

    // use this for initialization
    onLoad() {

        let precisShow = cc.sys.localStorage.getItem('precisShow');
        precisShow = JSON.parse(precisShow);
        if (precisShow == null) {
            this.precisShow = true;
            cc.sys.localStorage.setItem('precisShow', JSON.stringify(this.precisShow));
        } else {
            this.precisShow = precisShow;
        }
        let self = this;
        this.onSave.active = false;
        this.offSave.active = false;
        let UIPreciouNode: any = this.node.getChildByName('UIPreciousBag')
        this.UIDragBag = UIPreciouNode.getComponent(global.CommonClass.UIPreciousBag);
        this.UIDragBag.setDragEndCall(this.onDragItemEnd.bind(this));
        this.UIDragBag.setDragBeginCall(this.onDragBeginCall.bind(this));
        this.UIDragBag.setDragEventCall(this.onDragPackageItem.bind(this));
        let ID = global.Module.MainPlayerData.getRoleID();
        let data = { roleId: ID, type: 0, page: self.hallNum };
        global.Instance.MsgPools.send('showTableInfo', data.type, function (msg) {
            self.canGetMoeny = (msg.state == 0);
            if (!self.canGetMoeny)
                self.settleBtn.color = cc.color(90, 96, 96, 255);
            else
                self.settleBtn.color = cc.color(255, 255, 255, 255);
        })
        this.resultonClick();
    };

    start() {
        this.result();
       
    };
    getHelpNode(){
        return this.node.getChildByName('helpNode');
    }
    
    result() {
        this.totalData = global.Module.PreciousRoomData.getTotalData(0);
        this.tradeData = global.Module.PreciousRoomData.getTotalData(1);
        this.verData = global.Module.PreciousRoomData.getTotalData(2);
        this.loadTradeList(this.totalData.tradeData);
        this.loadVerList(this.totalData.verData, false);
        this.reflash();
        this.dismodehandle(false);
    };
    //加载数据
    reflash() {
        this.dragItemData = null;
        this.data = null;
        this.pickItemData = null;
        this.curOpItem = null;
        let pageItems = global.Module.PreciousRoomData.getPageItems(0, this.hallNum);
        this.ToggleNode.getChildByName('toggle' + (this.hallNum)).getComponent(cc.Toggle).isChecked = true
        this.sureData = [];
        this.totalData.sureData = [];
        let arr = [];
        for (let i in pageItems) {
            if (Object.hasOwnProperty.call(pageItems, i)) {
                let arrData = pageItems[i];
                arr.push(arrData)
            }
        }
        for (let i = 0; i < arr.length; i++) {
            let arrData = arr[i];
            if (arrData) {
                let position = arrData.position;
                let preciousData = global.Manager.DBManager.findData('THandBook', 'ID', arrData.templateID);
                let boxSize = cc.size(preciousData.doorW, preciousData.doorH);
                let getData = this.setData(position, boxSize,arrData, true);
                getData.index = arrData.index;
                getData.templateID = arrData.templateID;
                if (this.sureData[getData.contennumY]) {
                    this.sureData[getData.contennumY].push(getData);
                    this.totalData.sureData[getData.contennumY].push(getData);
                } else {
                    this.sureData[getData.contennumY] = [];
                    this.sureData[getData.contennumY].push(getData);
                    this.totalData.sureData[getData.contennumY] = [];
                    this.totalData.sureData[getData.contennumY].push(getData);
                }
            }
        }
        this.loadSurelist();
        this.baMapNode.active = false;

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
                            itemClass.goldNum(this.precisShow);
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
        this.result();

        cc.tween(anNode1)
            .to(0.5, { position: new cc.Vec3(0, 0, 0) })
            .start()
        cc.tween(anNode2)
            .to(0.5, { position: new cc.Vec3(-widthX, 0, 0) })
            .start()
    }
   
    
    toggleClick(event ,num ){
        num = parseInt(num)
        if(this.dismodeisShow == true || this.surefault == true){
            global.CommonClass.UITip.showTipTxt('请先处理完成当前展架', global.Enum.TipType.TIP_BAD); 
            this.ToggleNode.getChildByName('toggle' + (this.hallNum)).getComponent(cc.Toggle).isChecked = true
            return;
        }
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
                    self.Ansmooth(isShow);
                    
                });
            });
        }
    };
    //结算处理
    btnCaculate() {
        let self = this;

        if (this.canGetMoeny) {
            let data = { type: 0 };
            global.Instance.MsgPools.send('showTablePrize', data, function (msg) {
                if (msg.errorID == 0) {
                    global.CommonClass.UITip.showTipTxt('获得奖励 <color=#FFEB00>X' + msg.goldNum.toString() + '</color>金币', global.Enum.TipType.TIP_NORMAL);
                    global.Instance.Log.debug('', "UIPreciousRoom");
                    global.Instance.AudioEngine.replaySound('gold', false, null);
                }
                else {
                    global.CommonClass.UITip.showTipTxt('不能结算', global.Enum.TipType.TIP_BAD);
                }
                self.canGetMoeny = false;
                self.settleBtn.color = cc.color(90, 96, 96, 255);
            });
        }
        else {
            global.CommonClass.UITip.showTipTxt('不能结算', global.Enum.TipType.TIP_BAD);
        }
    };
    //打开展品金额
    precigoldBtn() {
        this.precisShow = !this.precisShow
        cc.sys.localStorage.setItem('precisShow', JSON.stringify(this.precisShow));
        let sureNode = this.sureNode.children
        for (let i = 0; i < sureNode.length; i++) {
            let insItem: any = sureNode[i];
            if (insItem != null) {
                let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
                itemClass.goldNum(this.precisShow);
            }
        }
    };
    //展架模式处理
    dismodehandle(isShow) {
        
        if (!isShow) {
            if (!this.tranisShow) {
                global.CommonClass.UITip.showTipTxt('请先拼完货架', global.Enum.TipType.TIP_BAD);
                return;
            }
            this.DlgBoxNode.active = false;
            this.onSave.active = false;
            this.offSave.active = false;
        }
        this.offSave.active = isShow;
        this.dismodeisShow = isShow;
        this.baMapNode.active = isShow;
        this.sureNode.opacity = (isShow == true) ? 120 : 255;
    };
    pageCut(event, age) {
        if(this.dismodeisShow == true || this.surefault == true){
            global.CommonClass.UITip.showTipTxt('请先处理完成当前展架', global.Enum.TipType.TIP_BAD); 
            return;
        }
        
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
        let ID = global.Module.MainPlayerData.getRoleID();
        let data = { roleId: ID, page: this.hallNum };
        global.Instance.MsgPools.send('getshowTableInfo', data, function (msg) {
            let data = { roleId: ID, type: global.Module.PreciousRoomData.getCurType(), page: self.hallNum };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                if (age == 1)
                    self.Ansmooth(false);
                else
                    self.Ansmooth(true);
            });
        });
    };
    onSaveClick(event,age){
        let ID = global.Module.MainPlayerData.getRoleID();
        if (this.pickItemData != null) {
            this.tranDemo.active = false;//关闭展架加减页面
            this.verDemo.active = false;//关闭展架加减页面
            this.addisShow = false;
            this.touchStart = null;
            this.onShowItem(false);
        }
        
        let self = this;
        if (age == 1) {
            //保存
            if (this.tranisShow == false) {
                global.CommonClass.UITip.showTipTxt('请先拼完货架!', global.Enum.TipType.TIP_BAD);
                return;
            }
            
            if (this.surefault) {
              
                let i = 0;
                let nextMove = function (isShow) {
                    if (isShow == false) {
                        let totalData = { tradeData: self.totalData.tradeData, verData: self.totalData.verData }
                        let data = { roleId: ID, page: self.hallNum, info: JSON.stringify(totalData) };
                        global.Instance.MsgPools.send('saveshowTableInfo', data, function (msg) {

                            let ID = global.Module.MainPlayerData.getRoleID();
                            let tableData = { roleId: ID, type: 0, page: self.hallNum };
                            global.Instance.MsgPools.send('showTable', tableData, function (msg) {
                                global.CommonClass.UITip.showTipTxt('原位置摆不了的宝物，已卸入仓库!', global.Enum.TipType.TIP_BAD);
                                self.reflash();
                                self.dismodehandle(false);
                            });
                        });
                    }else{
                        let list = [];
                        for (let i = 0; i < self.outsureData.length; i++)
                            list.push(self.outsureData[i].index);
                        let data = { type: 0, index: list, page: self.hallNum };
                        global.Instance.MsgPools.send('showTablePutDown', data, function (msg) {
                            if (!msg.errorID) {
                                nextMove(false);
                            }
                        }); 
                    }
                  
                }
                nextMove(self.outsureData.length != 0)
                return;
            }
            let totalData = { tradeData: this.totalData.tradeData, verData: this.totalData.verData }
            let data = { roleId: ID, page: this.hallNum, info: JSON.stringify(totalData) };
            global.Instance.MsgPools.send('saveshowTableInfo', data, function (msg) {
                self.dismodehandle(false);
            });
           

        } else if (age == 2) {
            //拒绝保存，打开弹框
            if (this.isHandle) {
                this.DlgBoxNode.active = true;
            } else {
                let data = { roleId: ID, page: this.hallNum };
                global.Instance.MsgPools.send('getshowTableInfo', data, function (msg) {
                    self.result();
                });
            }
        } else if (age == 3) {
            //拒绝保存,关闭弹框
            let data = { roleId: ID, page: this.hallNum };
            global.Instance.MsgPools.send('getshowTableInfo', data, function (msg) {
                self.result();
            });
            
        } else {
            //关闭弹框
            this.DlgBoxNode.active = false;
        }
    };
    /**
     * 打开左侧栏
     * @param {*} event 
     * @param {1 宝物 3 货架} num 
     */
    UIPBagBtn(event, num) { 
        //展架任务
        if (global.Module.TaskData.taskguard(10002))
            return;
        if (this.pickItemData != null) {
            this.tranDemo.active = false;//关闭展架加减页面
            this.verDemo.active = false;//关闭展架加减页面
            this.addisShow = false;
            this.touchStart = null;
            this.onShowItem(false);
        }
        if ((this.tranisShow == false && num == 1)||(this.dismodeisShow == true && num == 1)) {
            // global.CommonClass.UITip.showTipTxt('请先拼完货架', global.Enum.TipType.TIP_BAD);
            // global.CommonClass.UITip.showTipTxt('请先退出展架模式', global.Enum.TipType.TIP_BAD);
            this.onSaveClick(null,2)
            return;
        }
        if (this.surefault && num == 1) {
            global.CommonClass.UITip.showTipTxt('请优先调整错误宝物', global.Enum.TipType.TIP_BAD);
            return;
        }
        if (num == 3)
            this.dismodehandle(true);
        this.touchEndClick();
        this.UIDragBag.UIPrBag(num);
        this.UIDragBag.show(true);
       
    };
    onEnable() {
        this.demoNode.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.demoNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.demoNode.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.demoNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
    };
    resultonClick(){
        this.moveNode1.on(cc.Node.EventType.TOUCH_START, this.onPlusClick, this);
        this.moveNode1.on(cc.Node.EventType.TOUCH_MOVE, this.onPlusClick, this);
        this.moveNode1.on(cc.Node.EventType.TOUCH_END, this.onPlusClick, this);
        this.moveNode1.on(cc.Node.EventType.TOUCH_CANCEL, this.onPlusClick, this);
        this.moveNode2.on(cc.Node.EventType.TOUCH_START, this.onPlusClick, this);
        this.moveNode2.on(cc.Node.EventType.TOUCH_MOVE, this.onPlusClick, this);
        this.moveNode2.on(cc.Node.EventType.TOUCH_END, this.onPlusClick, this);
        this.moveNode2.on(cc.Node.EventType.TOUCH_CANCEL, this.onPlusClick, this);
        this.moveToNode1.on(cc.Node.EventType.TOUCH_START, this.onMoveClick, this);
        this.moveToNode1.on(cc.Node.EventType.TOUCH_MOVE, this.onMoveClick, this);
        this.moveToNode1.on(cc.Node.EventType.TOUCH_END, this.onMoveClick, this);
        this.moveToNode1.on(cc.Node.EventType.TOUCH_CANCEL, this.onMoveClick, this);
        this.moveToNode2.on(cc.Node.EventType.TOUCH_START, this.onMoveClick, this);
        this.moveToNode2.on(cc.Node.EventType.TOUCH_MOVE, this.onMoveClick, this);
        this.moveToNode2.on(cc.Node.EventType.TOUCH_END, this.onMoveClick, this);
        this.moveToNode2.on(cc.Node.EventType.TOUCH_CANCEL, this.onMoveClick, this);

        
    };
    onDisable() {
        this.demoNode.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);//开始
        this.demoNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);//移动
        this.demoNode.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);//内部结束
        this.demoNode.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);//外部结束
        this.moveNode1.off(cc.Node.EventType.TOUCH_START, this.onPlusClick, this);
        this.moveNode1.off(cc.Node.EventType.TOUCH_MOVE, this.onPlusClick, this);
        this.moveNode1.off(cc.Node.EventType.TOUCH_END, this.onPlusClick, this);
        this.moveNode1.off(cc.Node.EventType.TOUCH_CANCEL, this.onPlusClick, this);
        this.moveNode2.off(cc.Node.EventType.TOUCH_START, this.onPlusClick, this);
        this.moveNode2.off(cc.Node.EventType.TOUCH_MOVE, this.onPlusClick, this);
        this.moveNode2.off(cc.Node.EventType.TOUCH_END, this.onPlusClick, this);
        this.moveNode2.off(cc.Node.EventType.TOUCH_CANCEL, this.onPlusClick, this);
        this.moveToNode1.off(cc.Node.EventType.TOUCH_START, this.onMoveClick, this);
        this.moveToNode1.off(cc.Node.EventType.TOUCH_MOVE, this.onMoveClick, this);
        this.moveToNode1.off(cc.Node.EventType.TOUCH_END, this.onMoveClick, this);
        this.moveToNode1.off(cc.Node.EventType.TOUCH_CANCEL, this.onMoveClick, this);
        this.moveToNode2.off(cc.Node.EventType.TOUCH_START, this.onMoveClick, this);
        this.moveToNode2.off(cc.Node.EventType.TOUCH_MOVE, this.onMoveClick, this);
        this.moveToNode2.off(cc.Node.EventType.TOUCH_END, this.onMoveClick, this);
        this.moveToNode2.off(cc.Node.EventType.TOUCH_CANCEL, this.onMoveClick, this);
    };
    friendBlick() {
        let UIFriendChoose = global.Manager.UIManager.get('UIFriendChoose');
        if (UIFriendChoose) {
            UIFriendChoose.move(true);
        } else {
            global.Manager.UIManager.open('UIFriendChoose', null, function (panel) {
                panel.show();
                panel.move(true);
            })
        }
    };
    showPickItem(pickItemData, position) {
        let ndPickItem: any = this.ndPickItem
        let itemClass = ndPickItem.getComponent(global.CommonClass.PreciousItem);
        itemClass.setItem(pickItemData);
        if (position) {
            this.ndPickItem.setPosition(position);
            this.ndPickItem.zIndex = -Math.ceil(position.x);
            this.ndVirtual.setPosition(position);
            this.tranDemo.setPosition(position);
            this.verDemo.setPosition(position);
        }
      
        let size = this.ndPickItem.getChildByName('check').getContentSize();
        this.ndVirtual.setContentSize(size);
        this.curOpItem = this.ndPickItem;
        this.dragItemData = pickItemData;
        ndPickItem.active = true;
        this.baMapNode.active = true;
    };
    onDragPackageItem(event) {
        let point = event.touch.getLocation();

        if (event.type == cc.Node.EventType.TOUCH_START) {
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            this.onMoveItem(point);
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {

        }
    };
    onMoveItem(point) {
        if (this.dragItemData != null) {
            this.adjustMousePoint(point);
        }
    };
    /**
     *设置红蓝框
     * @param {坐标*} point 
     */
    adjustMousePoint(point) {
        let canPut = this.canPutItem(this.ndVirtual);
        if (this.curOpItem != null) {
            if (point) {
                let position = this.demoNode.convertToNodeSpaceAR(point);
                let itemClass = this.curOpItem.getComponent(global.CommonClass.PreciousItem);
                let itemId = itemClass.item.templateID;
                if(itemId == 500020001||itemId == 500020002){
                    position.x = Math.round(position.x/25)*25;
                    position.y = Math.round(position.y/25)*25;
                }
                let itemPosition = cc.v2(position.x, position.y);
                this.curOpItem.setPosition(itemPosition);
                this.curOpItem.zIndex = -Math.ceil(itemPosition.x);
            }
            let itemClass = this.curOpItem.getComponent(global.CommonClass.PreciousItem);
            if (canPut)
                itemClass.showCanPut(1);
            else
                itemClass.showCanPut(2);
        }
    };
    /**
     * 确定是物品否可以放下
     * @param {*} ndItem 
     * @returns 
     */
    canPutItem(ndItem) {
        let box = ndItem.getBoundingBoxToWorld();
        let curPosition = this.ndPickItem.getPosition();
        let contentSize = this.ndPickItem.getChildByName("check").getContentSize();

        if (curPosition.x - contentSize.width / 2 < -10 || curPosition.x + contentSize.width / 2 > this.demoNode.width + 5) {
            if (this.dragItemData.templateID == '500020001' && this.addisShow) {
                if (curPosition.x - contentSize.width / 2 <= -this.halfBlockValue || curPosition.x + contentSize.width / 2 >= 1092){
                    return false;
                }
                    
            } else {
                return false;
            }
        }
        if (this.dragItemData.templateID != '500020001') {
            if (curPosition.y < -5 || curPosition.y + contentSize.height > this.demoNode.height + 5) {
                return false;
            }
        } else {
            if (curPosition.y  - contentSize.height / 2 < 0 || curPosition.y + contentSize.height  > this.demoNode.height) {
                return false;
            }
        }
        this.data = this.setData(curPosition, contentSize,this.dragItemData, false);//数据
        if (this.dragItemData.templateID == '500020001') {
            //X轴架子与X轴已经放入架子判断
            var rangeX = this.getRanarr(this.data.contennumX, this.data.posnumX);
            for (let i = 0; i < this.data.posnumX; i++) {
                let contNumY =this.data.contennumY;
                if (this.tradeData[contNumY]) {
                    for (let k = 0; k < this.tradeData[contNumY].length; k++) {
                        var listX = this.getRanarr(this.tradeData[contNumY][k].contennumX, this.tradeData[contNumY][k].posnumX);
                        if (this.isRepeat(rangeX, listX))
                            return false;
                    }
                }
                // for (let i = 1; i < 2; i++) {
                //     let contNumY1 = contNumY + i;
                //     let contNumY2 = contNumY - i;
                //     if (this.tradeData[contNumY1]) {
                //         for (let k = 0; k < this.tradeData[contNumY1].length; k++) {
                //             var listX = this.getRanarr(this.tradeData[contNumY1][k].contennumX, this.tradeData[contNumY1][k].posnumX);
                //             if (this.isRepeat(rangeX, listX))
                //                 return false;
                //         }
                //     }
                //     if (this.tradeData[contNumY2]) {
                //         for (let k = 0; k < this.tradeData[contNumY2].length; k++) {
                //             var listX = this.getRanarr(this.tradeData[contNumY2][k].contennumX, this.tradeData[contNumY2][k].posnumX);
                //             if (this.isRepeat(rangeX, listX))
                //                 return false;
                //         }
                //     }
                // }
               
            }
            if (this.data.contennumY <0){
                return false;
            }
                
            // //架子与物品冲突
            // if (!this.isPutGoods()){
            //     return false;
            // }
               
        } else if (this.dragItemData.templateID == '500020002') {
            //Y轴架子与Y轴已经放入架子判断
            for (let i = 0; i < this.data.posnumY; i++) {
                if (this.verData[this.data.contennumX]) {
                    if (this.verData[this.data.contennumX].indexOf(this.data.contennumY + i) != -1) {
                        return false;
                    }
                }
            }
            if (this.data.contennumX == 0) {
                return false;
            }
        } else {
            //物品下没有可承接架子  或者与其他物品冲突 或者与其他架子冲突 
            if (!this.isPutDown(this.data) || !this.collision() || !this.isShelf(this.data))
                return false;
        }
        return true;
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
    /**
     * 判断物品下方是否有可承接架子
     * @returns 返回真假没有承接架子为假
     */
    isPutDown(pickData) {
        
        if (pickData.contennumY == 0) {
            return true;
        }
        let date = this.tradeData[pickData.contennumY];
        if (date) {
            var data = []
            for (let i = 0; i < date.length; i++) {
                var listX = this.getRanarr(date[i].contennumX, date[i].posnumX);
                data = data.concat(listX);
            }
            data.sort(this.listsort);
            if (data.indexOf(pickData.contennumX) != -1 && data.indexOf(pickData.contennumX + pickData.posnumX - 1) != -1) {
                return true;
            }
            if (data.indexOf(pickData.contennumX + Math.ceil(pickData.posnumX) / 2) != -1 && data.indexOf(pickData.contennumX + Math.ceil(this.data.posnumX / 2) - 1) != -1) {
                return true;
            }
            let num = parseInt((pickData.posnumX / 2).toString()) + 1
            let finalBeNum = 0;
            let BeNum = 0;
            for (let i = 0; i < pickData.posnumX; i++) {
                if (data.indexOf(pickData.contennumX + i) != -1) {
                    BeNum += 1;
                } else {
                    BeNum = 0;
                }
                if (BeNum > finalBeNum)
                    finalBeNum = BeNum;
            }
            if (finalBeNum >= num)
                return true;
        }
        return false;
    };
    
    /**
     * 对于物品与物品
     */
    collision() {
        this.ndVirtual.y = this.data.contennumY * this.blockvalue
        let ndPickRed = this.ndVirtual;
        let a = ndPickRed.getBoundingBoxToWorld();
        let array = this.sureNode.children;
        for (let i = 0; i < array.length; i++) {
            let itemArrRed = array[i].getChildByName("check");
            let b = itemArrRed.getBoundingBoxToWorld();
            let isIntersect: boolean = a.intersects(b);
            // if (((a.xMax > b.xMax && a.xMin < b.xMax) || (a.xMax < b.xMax && a.xMax > b.xMin))
            //     && ((a.yMax > b.yMax && a.yMin < b.yMax) || (a.yMax < b.yMax && a.yMax > b.yMin)))
            if (isIntersect == true)
                return false;
        }
        return true;
    }
    /**
     * 或者物品与X轴货架判断
     * @returns 返回真假有冲突为假
     */
    isPutGoods() {
        var rangeX = this.getRanarr(this.data.contennumX, this.data.posnumX);//X轴存在范围数组
        var rangeY = this.getRanarr(this.data.contennumY, this.data.posnumY);//Y轴存在范围数组
        var largeY = this.data.contennumY + this.data.posnumY - 1;//Y轴最大范围
        var list = this.sureData//已经放入架子的物品数据

        for (let i = 0; i < list.length; i++) {
            var listData = list[i];
            
            //小于Y轴最大范围可入判断
            if (i <= largeY && listData) {
                for (let k = 0; k < listData.length; k++) {
                    var listX = this.getRanarr(listData[k].contennumX, listData[k].posnumX);
                    var listY = this.getRanarr(listData[k].contennumY + 1, listData[k].posnumY - 1);
                    if (this.isRepeat(rangeX, listX)) {

                        if (this.isRepeat(rangeY, listY))
                            return false;
                    }
                }
            }
        }
        return true;
    };
    isShelf(date) {
        var rangeX = this.getRanarr(date.contennumX, date.posnumX);//X轴存在范围数组
        var rangeY = this.getRanarr(date.contennumY, date.posnumY);//Y轴存在范围数组
        var tradelist = this.tradeData;//X轴架子数据

        for (let i = 1; i < rangeY.length; i++) {
            for (let k = 0; k < rangeX.length; k++) {
                var data = [];
                let value = rangeY[i];
                if (tradelist[value]) {
                    for (let index = 0; index < tradelist[value].length; index++) {
                        var listX = this.getRanarr(tradelist[value][index].contennumX, tradelist[value][index].posnumX);
                        data = data.concat(listX);
                    }
                }
                if (data && data.indexOf(rangeX[k]) != -1) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * 根据物品生成data数据
     * @param {*} curPosition 
     * @param {*} contentSize 
     */
    setData(curPosition, contentSize,arrData, isShow): any {
        var posX = Number(curPosition.x);//x轴坐标
        var posY = Number(curPosition.y);//y轴坐标
        var contewidth = Number(contentSize.width);//宽
        var conteheight = Number(contentSize.height);//高
        var contennumX = Math.round((posX - contewidth / 2) / this.blockvalue);//x轴格子
      
        
        if (contennumX < 0)
            contennumX = 0;
        var contennumY = Math.round(posY / this.blockvalue);//Y轴格子
       
        if (contennumY > (this.totalNum.longNum - 1)) {
            contennumY -= 1
        }
        if (!isShow) {
            var determine = false
            if (!this.dragItemData || (this.dragItemData && this.dragItemData.templateID != '500020001' && this.dragItemData.templateID != '500020002')) {
                for (let i = contennumY; i >= 0; i--) {
                    let isShow = false;
                    if (this.tradeData[i]) {
                        var date = this.tradeData[i];
                        var data = [];
                        for (let i = 0; i < date.length; i++) {
                            var listX = this.getRanarr(date[i].contennumX, date[i].posnumX);
                            data = data.concat(listX);
                        }
                        data.sort(this.listsort);
                        for (let k = 0; k < Math.ceil(contewidth / this.blockvalue); k++) {

                            if (data.indexOf(contennumX + k) != -1) {
                                determine = true;
                                contennumY = i;
                                isShow = true;
                                break;
                            }
                        }
                    }
                    if (i == 0 && !determine) {
                        contennumY = 0;
                    }
                    if (isShow)
                        break;
                }
            }
        }
       
       let conData =  {
            contewidth: contewidth,//宽
            conteheight: conteheight,//高
            contennumX: contennumX,//左边所占格子
            contennumY: contennumY,//下边所占格子
            curPosition: curPosition,
            posnumX: Math.ceil(contewidth / this.blockvalue),//横线数量
            posnumY: Math.ceil(conteheight / this.blockvalue),//竖线数量
        }
        return conData;
    };
    onDragItemEnd(itemID, touchPoint, pickItemData) {

        if(this.pickItemData.templateID == 500020001){
            let canPut = this.canPutItem(this.ndVirtual);
            if(canPut ==true){
                this.pickItemData = pickItemData;
                this.onShowItem(false); 
            }else{
               
                this.tranDemo.active = true;//关闭展架加减页面
                this.verDemo.active = false;//关闭展架加减页面
                this.addisShow = true;
                this.touchStart = null;
            }
            this.UIDragBag.setAutoHide(false);
        }else{
            this.pickItemData = pickItemData;
            this.UIDragBag.setAutoHide(false);
            this.onShowItem(false);
        }
        
    };
    /**
     * 检索木板是否正确
     * @param {*} params 
     */
    getRetrieval(itemData,cate) {
        let num = 0;
        if (itemData.step.indexOf('1') != -1)
            return num += 1;
        if (itemData.step.indexOf('2') != -1)
            return num += 1;
        let listX = this.getRanarr(itemData.contennumX, itemData.posnumX);
        if (itemData.contennumY ==  this.totalNum.longNum-1)
            return num += 1;
        if (itemData.contennumY == 1)
            return num += 1;
           if(listX.length!=0){
            listX.push(listX[listX.length-1]+1)
           }
        for (let i = 0; i < listX.length; i++) {
            let val = listX[i];
            let list = this.totalData.verData[val];
            if (list && list.length != 0) {
                list.sort(this.listsort);
                let verData = this.getSplitArray(list);
                for (let k = 0; k < verData.length; k++) {
                    
                    let numY = itemData.contennumY;
                    if (verData[k][0] < itemData.contennumY) {
                        numY = itemData.contennumY - 1;
                    } 
                    if (verData[k].indexOf(numY) != -1) {
                        if (num == 1)
                            break;
                        if (verData[k][0] == 0 || verData[k][verData[k].length - 1] == (this.totalNum.longNum - 1)) {
                             num += 1;
                        } else {
                            let disShow = true;//方向true上false下
                            let rangeX = [val, val + 1, val - 1];//X轴存在范围数组
                            let rangeY = [numY];//Y轴存在范围数组
                            let largeY = numY;//Y轴最大范围
                            if (verData[k][0] != 0 && verData[k][0] != numY) {
                                rangeY = [verData[k][0]];
                                largeY = verData[k][0];
                                disShow = false;
                            } else {
                                rangeY = [verData[k][verData[k].length - 1] + 1];
                                largeY = verData[k][verData[k].length - 1] + 1;
                                disShow = true;
                            }
                            {
                                let event = this.onDetecooritem(this.totalData.tradeData, rangeX, rangeY, largeY, true);
                                if (event) {
                                    let isShow = this.getTradeEval(event.data, disShow, val);
                                    if (isShow == true)
                                         num += 1;
                                }
                            }

                        }

                    }
                }
            }
        }
        if(num==0){
            if (cate == 0) {
                if (this.adhesion(itemData, 1) == 1)
                    return num += 1;
                if (this.adhesion(itemData, 2) == 1)
                    return num += 1;
            } else {
                if (this.adhesion(itemData, cate) == 1)
                    return num += 1;
            }
        }
        
        return num;


    };
    //横板子上下相邻格子也能支撑 cate 0  1向上查找 2 向下查找 (cate不能为0)
    adhesion(itemData,cate){
       
        let listX = this.getRanarr(itemData.contennumX, itemData.posnumX);
        let tradeData = this.totalData.tradeData
        let key = itemData.contennumY
        if (cate == 1)
            key += 1;
        else if (cate == 2)
            key -= 1;
        if(tradeData[key]){
            for (let i = 0; i < tradeData[key].length; i++) {
                let data = tradeData[key][i];
                let dataListX = this.getRanarr(data.contennumX, data.posnumX);
                
                if (this.isRepeat(dataListX, listX) == true) {
                    if (this.getRetrieval(data, cate) != 0)
                        return 1;
                }   
            }
        }
        return 0;
    }
    /**
     * 检索木板是是否连接上边 连接就返回
     * @param {*} params 
     */
    getTradeEval(itemData, isShow, itemval) {
       
        if (itemData.step.indexOf('1') != -1 || itemData.step.indexOf('2') != -1)
            return true;
           
        var listX = this.getRanarr(itemData.contennumX, itemData.posnumX);
        for (let i = 0; i <= listX.length; i++) {
            let val = listX[0] + i;
            let list = [];
            if (this.totalData.verData[val]) {
                list = this.totalData.verData[val];
                list.sort(this.listsort);
                let verData = this.getSplitArray(list);
                for (let k = 0; k < verData.length; k++) {
                    let numY = itemData.contennumY;
                    if (verData[k][0] >= itemData.contennumY) {
                        numY = itemData.contennumY;
                    } else {
                        numY -= 1;
                    }
                    if (verData[k].indexOf(numY) != -1) {
                        if (verData[k][0] == 0 || verData[k][verData[k].length - 1] == (this.totalNum.longNum - 1)) {
                            return true;
                        } else {
                            let disShow = true; //方向true上false下
                            let rangeX = [val, val - 1];//X轴存在范围数组
                            let rangeY = [numY];//Y轴存在范围数组
                            let largeY = numY;//Y轴最大范围
                            if (verData[k][0] != 0 && verData[k][0] != numY) {
                                rangeY = [verData[k][0]];
                                largeY = verData[k][0];
                                disShow = false;
                            } else {
                                rangeY = verData[k][verData[k].length - 1] + 1;
                                largeY = verData[k][verData[k].length - 1] + 1;
                                disShow = true;
                            }
                            if (disShow == isShow || (itemval != val)) {
                                let event = this.onDetecooritem(this.totalData.tradeData, rangeX, rangeY, largeY, true);
                                if (event) {
                                    let getTradData = this.getTradeEval(event.data, disShow, val);
                                    if (getTradData)
                                        return getTradData;
                                }
                            }

                        }

                    }
                }
            }

        }
        return false;
    };
    /**
     * 竖木板自动生长
     * @param {*} key 
     * @param {*} value 
     * @param {*} tradeData 
     */
    getVerplate(tradeData, key, value) {
        let maxNum = 0;//最大
        let minNum = 0;//最小
        let ArrDate = [];
        for (let i = 0; i <= this.totalNum.longNum; i++) {
            let date = tradeData[i];
            let data = [];
            if (date) {
                for (let k = 0; k < date.length; k++) {
                    var listX = this.getRanarr(date[k].contennumX, date[k].posnumX);
                    data = data.concat(listX);
                }
                if (data != null && (data.indexOf(value) != -1 || data.indexOf(value - 1) != -1)){
                    if (i <= key)
                        minNum = i;
                    if (i > key){
                        maxNum = i;
                        break;
                    } 
                }
            }
            {
                if (i == this.totalNum.longNum)
                    maxNum = i;
            }
        }
        for (let i = minNum; i < maxNum; i++) {
            if (ArrDate[value] == null)
            ArrDate[value] = [];
            ArrDate[value].push(i);
        }
        return ArrDate;
    };
    onShowItem(isShow) {
        if (this.canPutItem(this.ndVirtual) && !isShow) {

            let posX = this.data.contennumX * this.blockvalue + (this.data.contewidth / 2);
            var size = cc.v2(posX, this.data.contennumY * this.blockvalue);
            this.ndVirtual.setPosition(size);
            this.tranDemo.setPosition(size);
            this.ndPickItem.setPosition(size);
            // this.ndVirtual.active = false;
            this.ndPickItem.active = false;
            if (this.dragItemData.templateID == '500020002') {
                this.getRackData(this.data);
            } else {
                let step = '';
                if (this.data.contennumX == 0) {
                    step += '1;';
                }
                if ((this.data.contennumX + this.data.posnumX) == this.totalNum.widthNum) {
                    step += '2;';
                }
                var data = {
                    templateID: this.dragItemData.templateID,
                    conteheight: this.data.conteheight,
                    curPosition: this.data.curPosition,
                    contennumX: this.data.contennumX,
                    contennumY: this.data.contennumY,
                    contewidth: this.data.contewidth,
                    posnumX: this.data.posnumX,
                    posnumY: this.data.posnumY,
                    index: this.dragItemData.index,
                    step: step,
                };
                if (this.dragItemData.templateID == '500020001') {
                    if (this.tradeData[data.contennumY]) {
                        let rangeX = this.getRanarr(data.contennumX, data.posnumX);
                        for (let i = 0; i < this.tradeData[data.contennumY].length; i++) {
                            let date = this.tradeData[data.contennumY][i];
                            let listX = this.getRanarr(date.contennumX, date.posnumX);
                            rangeX = rangeX.concat(listX);
                        }
                        rangeX.sort(this.listsort);
                        //横板差一个格子也能相连
                        let arr = [];
                        let rangeXID = -2;
                        for (let i = 0; i < rangeX.length; i++) {

                            if (arr.length != 0) {
                                if (rangeXID + 2 == rangeX[i])
                                    arr.push(rangeXID + 1)
                            }
                            rangeXID = rangeX[i];
                            arr.push(rangeX[i]);
                        }
                        let listArray = this.getSplitArray(arr);
                        this.tradeData[this.data.contennumY] = [];
                        for (let index = 0; index < listArray.length; index++) {
                            data.conteheight = 50;
                            let date = {
                                templateID: this.dragItemData.templateID,
                                conteheight: this.data.conteheight,
                                contennumX: listArray[index][0],
                                contennumY: this.data.contennumY,
                                contewidth: listArray[index].length * this.blockvalue,
                                posnumX: listArray[index].length,
                                posnumY: this.data.posnumY,
                                index: this.dragItemData.index,
                                step: '',
                            };
                            if (date.contennumX == 0) {
                                date.step += '1;';
                            }
                            if ((date.contennumX + date.posnumX) == this.totalNum.widthNum) {
                                date.step += '2;';
                            }
                            this.tradeData[this.data.contennumY].push(date);
                        }
                    } else {
                        this.tradeData[this.data.contennumY] = [];
                        this.tradeData[this.data.contennumY].push(data);
                    }
                    for (let i = 0; i < this.tradeData.length; i++) {
                        if (this.tradeData[i]) {
                            this.totalData.tradeData[i] = [];
                            for (let k = 0; k < this.tradeData[i].length; k++)
                                this.totalData.tradeData[i].push(this.tradeData[i][k]);
                        }
                    }
                    this.loadTradeList(this.totalData.tradeData)
                } else {
                    if (this.sureData[this.data.contennumY]) {
                        this.sureData[this.data.contennumY].push(data);
                    } else {
                        this.sureData[this.data.contennumY] = [];
                        this.sureData[this.data.contennumY].push(data);
                    }
                    if (!this.totalData.sureData)
                        this.totalData.sureData = [];
                    for (let i = 0; i < this.sureData.length; i++) {
                        if (this.sureData[i]) {
                            this.totalData.sureData[i] = [];
                            for (let k = 0; k < this.sureData[i].length; k++)
                                this.totalData.sureData[i].push(this.sureData[i][k]);
                        }
                    }

                }
            }
        } else {
            // this.ndVirtual.active = false;
            this.ndPickItem.active = false;
            if (this.dragItemData.templateID == '500020001') {
                this.tradeData = [];
                for (let i = 0; i < this.totalData.tradeData.length; i++) {
                    if (this.totalData.tradeData[i]) {
                        this.tradeData[i] = [];
                        for (let k = 0; k < this.totalData.tradeData[i].length; k++)
                            this.tradeData[i].push(this.totalData.tradeData[i][k]);
                    }
                }
                this.loadTradeList(this.totalData.tradeData);

            } else if (this.dragItemData.templateID == '500020002') {
                for (let i = 0; i < this.totalData.verData.length; i++) {
                    if (this.totalData.verData[i]) {
                        this.verData[i] = [];
                        for (let k = 0; k < this.totalData.verData[i].length; k++)
                            this.verData[i].push(this.totalData.verData[i][k]);
                    }
                }
                this.revampLoad(this.mullionArr, 2,false);
            } else {
                this.sureData = [];
                if (this.totalData.sureData) {
                    for (let i = 0; i < this.totalData.sureData.length; i++) {
                        if (this.totalData.sureData[i]) {
                            this.sureData[i] = [];
                            for (let k = 0; k < this.totalData.sureData[i].length; k++)
                                this.sureData[i].push(this.totalData.sureData[i][k]);
                        }
                    }
                }
            }
            this.data = null;
        }
        this.loadSurelist();
        if (this.dragItemData.templateID == '500020001'|| this.dragItemData.templateID == '500020002')
            this.verDataClear();//清空空出来的竖展架
        if (this.tranisShow == true && this.data != null) {
            let data = {};
            if (this.dragItemData.templateID != '500020001' && this.dragItemData.templateID != '500020002') {
                let posX = parseInt((this.data.contennumX * this.blockvalue + (this.data.contewidth / 2)).toString());;
                let posY = parseInt((this.data.contennumY * this.blockvalue).toString());
                if (this.isDrag) {
                    data = { type: 0, index: this.dragItemData.index, x: posX, y: posY, page: this.hallNum };
                    global.Instance.MsgPools.send('showTableMove', data, function (msg) { });
                } else {
                    data = { type: 0, index: this.dragItemData.index, itemId: this.dragItemData.templateID, x: posX, y: posY, page: this.hallNum };
                    global.Instance.MsgPools.send('showTablePutOn', data, null);
                }
            }
           
        }
        if (this.dragItemData.templateID == '500020001' || this.dragItemData.templateID == '500020002') {
            this.onSave.active = true;
            this.isHandle = true;
        }
        
        this.baMapNode.active = this.dismodeisShow;
        this.dragItemData = null;
        this.data = null;
        this.pickItemData = null;
        this.curOpItem = null;
        // this.tradeMoved = null;
        this.mullionArr = [];
    };
    /**
     * 拆分数组的连续数字
     * @param {*} arr 
     * @returns 
     */
    getSplitArray(arr) {
        if (arr.length == 0)
            return arr;
        let result = [],
            i = 0;
        result[i] = [arr[0]];
        arr.reduce(function (prev, cur) {
            cur - prev === 1 ? result[i].push(cur) : result[++i] = [cur];
            return cur;
        });
        return result;
    };
    /**
     * 修改货架数据
     * @param {*数据} data 
     */
    getRackData(data) {
        let date = [];
        if (!this.isDrag) {
            date = this.getVerplate(this.totalData.tradeData, data.contennumY, data.contennumX);
            for (let i = 0; i < date.length; i++) {
                if (date[i]) {
                    if (this.totalData.verData[i] == null)
                        this.totalData.verData[i] = [];
                    for (let k = 0; k < date[i].length; k++){
                        this.totalData.verData[i].push(date[i][k]);
                    }     
                }
            }
            this.verData = [];
            for (let i = 0; i < this.totalData.verData.length; i++) {
                if (this.totalData.verData[i]) {
                    this.verData[i] = [];
                    for (let k = 0; k < this.totalData.verData[i].length; k++)
                        this.verData[i].push(this.totalData.verData[i][k]);
                }
            }
        } else {
            date = this.getVerplate(this.tradeData,  data.contennumY, data.contennumX);
            for (let i = 0; i < date.length; i++) {
                if (date[i]) {
                    if (this.verData[i] == null)
                        this.verData[i] = [];
                    for (let k = 0; k < date[i].length; k++){
                        this.verData[i].push(date[i][k]);
                    }     
                }
            }
            this.totalData.verData = [];
            for (let i = 0; i < this.verData.length; i++) {
                if (this.verData[i]) {
                    this.totalData.verData[i] = [];
                    for (let k = 0; k < this.verData[i].length; k++)
                        this.totalData.verData[i].push(this.verData[i][k]);
                }
            }
        }
        this.revampLoad(date,2, false);

    };
    /**
     * 加载宝物数据
     */
    loadSurelist() {
        let itemData: any = {};
        this.sureNode.removeAllChildren();
        let surefault = false;
        this.outsureData = [];
        for (let i = 0; i < this.sureData.length; i++) {
            if (this.sureData[i]) {
                for (let k = 0; k < this.sureData[i].length; k++) {
                    itemData = { index: this.sureData[i][k].index, templateID: this.sureData[i][k].templateID, direction: 1, num: 1 };
                    let insItem: any = cc.instantiate(this.ndPickNode);
                    if (insItem != null) {
                        var posX = this.sureData[i][k].curPosition.x
                        var posY = i * this.blockvalue
                        let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
                        itemClass.setItem(itemData);
                        itemClass.goldNum(this.precisShow);
                        insItem.setPosition(cc.v2(posX, posY));
                        insItem.zIndex = -Math.ceil(posX);
                      
                        {
                            let curPosition = insItem.getPosition();
                            let contentSize = insItem.getChildByName("check").getContentSize();
                            let data = this.setData(curPosition, contentSize,this.sureData[i][k], true);
                            let isPutDown = this.isPutDown(data)
                         
                            if (!isPutDown|| !this.isShelf(this.sureData[i][k])) {
                                this.outsureData.push(this.sureData[i][k]);
                                surefault = true;
                                itemClass.showCanPut(2);
                            }
                        }
                        insItem.active = true;
                        this.sureNode.addChild(insItem);
                        
                        
                    }

                }
            }
        }
        this.surefault = surefault;
    };
    /**
     * 加载货架横板子
     * @param {*} listData 
     */
    loadTradeList(listData) {
        let itemData = { index: -1, templateID: '500020101', direction: 1, num: 1 };
        this.tranNode.removeAllChildren();
        this.insItemNodeData = [];
        let tranisShow = true;
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

                        let isShow = (this.getRetrieval(list[k],0) != 0) ? true : false;
                        if (tranisShow == true)
                            tranisShow = isShow;
                        if (isShow)
                            itemClass.showCanPut(0);
                        else
                            itemClass.showCanPut(2);
                        insItem.setPosition(cc.v2(posX, posY));
                        insItem.zIndex = Math.ceil(posY);
                        this.tranNode.addChild(insItem);
                        insItem.active = true;
                        
                    }
                }
            }
        }
        this.tranisShow = tranisShow;

    };
    /**
    * 通过坐标找到物品
    * @param {*} list 
    * @param {*} largeY 
    * @param {*} rangeX 
    * @returns 
    */
    ontradeData(list, rangeX, largeY) {
        let listData = list[largeY];
        //等于Y轴最大范围可入判断
        let data = [];
        for (let k = 0; k < listData.length; k++) {
            let date = listData[k];
            if ((date.contennumX+date.posnumX) - rangeX >= 0) {
                let listX = this.getRanarr(date.contennumX, date.posnumX);
                data = data.concat(listX);
            }
        }
        let listArray = this.getSplitArray(data);
        if (data.length != 0) {
            for (let i = 0; i < listArray.length; i++) {
              let date = listArray[i];
              let arr = [rangeX];
              if ((date[date.length - 1] < rangeX) && (date[date.length - 1] + 1 == rangeX))
                  arr.push(rangeX - 1)
              if ((date[0] > rangeX) && (date[0] + 1 == rangeX))
                  arr.push(rangeX + 1)
              for (let j = 0; j < arr.length; j++) {
                  if (date.indexOf(arr[j]) != -1)
                      return true;
              } 
            }
            
        }
        return false;
    };
    /**
     * 加载货架竖板子
     * @param {*} listData 
     */
    loadVerList(listData, isShow) {
        this.verNode.removeAllChildren();
        this.verNode1.removeAllChildren();
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
                                this.verNode1.addChild(insItem);
                            } else {
                                insItem.setPosition(cc.v2(posX, posY - 10));
                                insItem.zIndex = -Math.ceil(posX);
                                this.verNode.addChild(insItem);
                            }
                            insItem.active = true;
                        }

                    }
                }

            }
        }
        if (!isShow) {
            let tranisShow = true;
            for (let i = 0; i < this.insItemNodeData.length; i++) {
                if (this.insItemNodeData[i]) {
                    for (let k = 0; k < this.insItemNodeData[i].length; k++) {
                        let itemClass = this.insItemNodeData[i][k].getComponent(global.CommonClass.PreciousItem);
                        let isShow = (this.getRetrieval(this.totalData.tradeData[i][k],0) != 0) ? true : false;
                        if (tranisShow == true)
                            tranisShow = isShow;
                        if (isShow)
                            itemClass.showCanPut(0);
                        else
                            itemClass.showCanPut(2);
                    }
                }
            }
            this.tranisShow = tranisShow;
        }

    };
    revampLoad(listData,type, isShow){
        let itemData = { index: -1, templateID: '500021004', direction: 0, num: 1 };
        for (let i = 0; i < listData.length; i++) {
            let list = listData[i];
            if (list) {
                for (let k = 0; k < list.length; k++) {
                    if(type == 1){
                        let name = list[k] * this.totalNum.widthNum + i;
                        let demoNode1 = this.verNode.getChildByName(name.toString());
                        let demoNode2 = this.verNode1.getChildByName(name.toString());
                        if (demoNode1)
                            demoNode1.removeFromParent();
                        if (demoNode2)
                            demoNode2.removeFromParent();
                    }else{
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
                                var posY = list[k] * this.blockvalue;
                                let name = list[k] * this.totalNum.widthNum + i;
                                insItem.setName(name.toString())
                                let itemClass = insItem.getComponent(global.CommonClass.PreciousItem);
    
                                if (event == true) {
                                    itemData.templateID = '500021005';
                                } else {
                                    itemData.templateID = '500021004';
                                }
                                itemClass.setItem(itemData);
                                let demoNode = null;
                                if (event == true) {
                                    insItem.setPosition(cc.v2(posX, posY + 10));
                                    insItem.zIndex = -Math.ceil(posX);
                                    this.verNode1.addChild(insItem);
                                    demoNode = this.verNode.getChildByName(name.toString());
                                } else {
                                    insItem.setPosition(cc.v2(posX, posY - 10));
                                    insItem.zIndex = -Math.ceil(posX);
                                    this.verNode.addChild(insItem);
                                    demoNode = this.verNode1.getChildByName(name.toString());
                                }
                                if (demoNode)
                                    demoNode.removeFromParent();
                                insItem.active = true;
                            }
    
                        }
                    }
                    
                }

            }
        }
        if (!isShow) {
            let tranisShow = true;
            for (let i = 0; i < this.insItemNodeData.length; i++) {
                if (this.insItemNodeData[i]) {
                    for (let k = 0; k < this.insItemNodeData[i].length; k++) {
                        let itemClass = this.insItemNodeData[i][k].getComponent(global.CommonClass.PreciousItem);
                        let isShow = (this.getRetrieval(this.totalData.tradeData[i][k],0) != 0) ? true : false;
                        if (tranisShow == true)
                            tranisShow = isShow;
                        if (isShow)
                            itemClass.showCanPut(0);
                        else
                            itemClass.showCanPut(2);
                    }
                }
            }
            this.tranisShow = tranisShow;
        }
    };
    /**
     * 板子加减按钮
     * @param {*} event 
     * @param {*} num 
     */
    resizeBtn(numCont,name,isShow,call) {
        let position= new cc.Vec2(this.position.x,this.position.y);
        let pickItemData = {
            direction: this.pickItemData.direction,
            index: this.pickItemData.index,
            num: this.pickItemData.num,
            templateID: this.pickItemData.templateID
        }
        let datanum = pickItemData.num;
        if (name == 'moveNode1') {
            let num = Math.round(numCont / 25);
            if ((datanum + num) > this.totalNum.widthNum)
                num = this.totalNum.widthNum - datanum;
            if ((datanum + num) < 4)
                num = 4 - datanum;
                if ((position.x - (this.halfBlockValue * num)) - (this.halfBlockValue * (datanum + num)) >= 0) {
                    position.x = position.x - (this.halfBlockValue * num);
                    pickItemData.num = datanum + num;
                    isShow = true;
                }else{
                    num = (position.x - this.halfBlockValue * datanum) / this.halfBlockValue * datanum / 2;
                    position.x = position.x - (this.halfBlockValue * num);
                    pickItemData.num = datanum + num;
                    isShow = true;
                }
        } else {
            let num = -Math.round(numCont / 25);
            if ((datanum + num) > this.totalNum.widthNum)
                num = this.totalNum.widthNum - datanum;
            if ((datanum + num) < 4)
                num = 4 - datanum;
                if ((position.x + (this.halfBlockValue * num)) + (this.halfBlockValue * (datanum + num)) <= 1025) {
                    position.x = position.x + (this.halfBlockValue * num);
                    pickItemData.num = datanum + num;
                    isShow = true;
                }else{
                    num = (1025 - position.x - this.halfBlockValue * datanum) / this.halfBlockValue / 2;
                    position.x = position.x + (this.halfBlockValue * num);
                    pickItemData.num = datanum + num;
                    isShow = true;
                }
        }

        if (call&&isShow)
            call(pickItemData, position);
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
                    if (list[i].length > datalist.length||!data[i])
                        data[i] = [];
                    for (let k = 0; k < list[i].length; k++)
                        if (datalist.indexOf(list[i][k]) == -1){
                            data[i].push(list[i][k]);
                        }
                            
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
        if (this.pickItemData != null) {
            this.tranDemo.active = false;//关闭展架加减页面
            this.verDemo.active = false;//关闭展架加减页面
            this.addisShow = false;
            this.touchStart = null;
            this.onShowItem(false);
        }
        if ((!this.tranisShow )||(this.dismodeisShow == true)) {
            this.onSaveClick(null,3)
        }
        
        let name = global.CommonClass.Functions.getSceneName();
        if (name == 'MainScene') {
            global.Manager.UIManager.close('UIPreciousRoom');
        } else {
            global.CommonClass.Functions.loadScene('MainScene', null);
        }
        
    };
    /**
     * 删除货架
     */
    deletebtn() {
        // if (this.dragItemData.templateID == 500020001 && this.tradeMoved == true)
        //     return;

        if (this.dragItemData.templateID == 500020002) {
            this.totalData.verData = [];
            for (let i = 0; i < this.verData.length; i++) {
                if (this.verData[i]) {
                    this.totalData.verData[i] = [];
                    for (let k = 0; k < this.verData[i].length; k++)
                        this.totalData.verData[i].push(this.verData[i][k]);
                }
            }
        } else {
            this.totalData.tradeData = [];
            for (let i = 0; i < this.tradeData.length; i++) {
                if (this.tradeData[i]) {
                    this.totalData.tradeData[i] = [];
                    for (let k = 0; k < this.tradeData[i].length; k++)
                        this.totalData.tradeData[i].push(this.tradeData[i][k]);
                }
            }
        }
        this.addisShow = false;
        this.tranDemo.active = false;
        this.verDemo.active = false;
        this.onShowItem(true);
    };
    //处理空出竖架子
    verDataClear() {
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
                        if (listData[listData.length - 1] == (this.totalNum.longNum - 1) || event != null) {
                            if (!date[i])
                                date[i] = [];
                            Array.prototype.push.apply(date[i], listData);
                        }
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
        this.loadVerList(this.verData, true);
    };
    getPickItemData(list, posX, posY, sunID, itemID, index,touchPoint) {
        let data = {
            'direction': 0,//方向0上下1左右
            'num': 0,//拼接数量
            'templateID': itemID,//物品id
            'index': 0,
        }
        let listData = null;
        let position = cc.v2(0, 0);
        if (sunID == 0) {
            listData = this.setConData(list, posY, posX);
            // this.blockvalue * listData.maxnum 
            position = cc.v2(this.blockvalue * posX, touchPoint.y);
            data.direction = 0;
            data.num = 2;
            this.touchPos = cc.v2(this.blockvalue * posX, touchPoint.y + this.halfBlockValue);
            let listY = this.getRanarr(listData.maxnum, listData.num);
            this.verData = this.setArrayRemoval(this.verData, listY, posX);
            this.mullionArr[posX] = listY;
            this.revampLoad(this.mullionArr, 1,true);
        } else if (sunID == 1) {
            data.direction = 1;
            data.num = list.posnumX;
            position = cc.v2(this.blockvalue * (list.contennumX + (list.posnumX / 2)), this.blockvalue * list.contennumY);
            if (position.y > 250)
                this.touchPos = cc.v2(position.x, this.blockvalue * posY - 200);
            else
                this.touchPos = cc.v2(position.x, this.blockvalue * posY + 30);
        } else if (sunID == 2) {
            data.direction = 1;
            data.num = 1;
            data.index = index;
            position = cc.v2(list.curPosition.x, this.blockvalue * list.contennumY);
            this.ndTouchStart = position;
        }
        this.isDrag = true;
        this.pickItemData = data;
        this.showPickItem(data, position);
        if(sunID !=2){
            this.adjustMousePoint(null);
        }
       
    };
    /**
     * 根据数组确定木板占位
     * @param {*} list 一排的数组占位
     * @param {*} listnum 起始位置
     * @param {*} isShow 竖木板被横木板分节 true 为竖木板
     * @returns 
     */
    setConData(list, listnum, posX) {
        let num = 1;
        let maxnum = 0;
        list.sort(this.listsort);
        for (let i = 1; i < list.length; i++) {
            if (list.indexOf(listnum + i) != -1) {
                let date = this.tradeData[listnum + i];
                let data = [];
                if (date) {
                    for (let k = 0; k < date.length; k++) {
                        var listX = this.getRanarr(date[k].contennumX, date[k].posnumX);
                        data = data.concat(listX);
                    }
                }

                if (data.indexOf(posX) != -1 || data.indexOf(posX - 1) != -1)
                    break;
                num += 1;
            }else{
                num += 1;
                break;
            }
        }
        for (let i = 1; i < list.length; i++) {
            if (list.indexOf(listnum - i) != -1) {
                let date = this.tradeData[listnum - i];
                let data = [];
                if (date) {
                    for (let k = 0; k < date.length; k++) {
                        var listX = this.getRanarr(date[k].contennumX, date[k].posnumX);
                        data = data.concat(listX);
                    }
                }
                maxnum = listnum - i;
                num += 1;
                if (data.indexOf(posX) != -1 || data.indexOf(posX - 1) != -1)
                    break;
            } else {
                break;
            }
        }
        var corenum = num / 2 + maxnum;
        return { maxnum: maxnum, num: num, corenum: corenum };
    };
    onDragBeginCall(pickItemData, touchPoint, ndDragItem) {
        this.pickItemData = pickItemData;
        let size = ndDragItem.getChildByName('check').getContentSize();
        this.ndVirtual.setContentSize(size);
        let position = this.demoNode.convertToNodeSpaceAR(touchPoint);
        if(this.pickItemData.templateID == 500020001||this.pickItemData.templateID == 500020002){
            position.x = Math.round(position.x/this.blockvalue)*this.blockvalue;
            position.y = Math.round(position.y/this.blockvalue)*this.blockvalue;
        }
        this.ndVirtual.setPosition(position);
        this.tranDemo.setPosition(position);
        this.verDemo.setPosition(position);
        this.isDrag = false;
        this.showPickItem(pickItemData, position);
        ndDragItem.active = false;
    };
    /**
     * 通过坐标找到物品
     * @param {*} list 
     * @param {*} largeY 
     * @param {*} rangeX 
     * @returns 
     */
    onDetecooritem(list, rangeX, rangeY, largeY, isShow) {
        let onData = null;
        if (isShow) {
            for (let i = 1; i >=0; i--) {
                let val = largeY-i;
                var listData = list[largeY-i]; 
                 //等于Y轴最大范围可入判断
                if (listData) {
                    for (let k = 0; k < listData.length; k++) {
                        var data = listData[k];
                        var listX = this.getRanarr(data.contennumX, data.posnumX);
                        if (this.isRepeat(rangeX, listX)) {
                            onData = { data: data, val: val, index: k, num: 1 };
                            break;
                        }
                    }
                }
            }
        } else {
                 for (let i = 0; i < list.length; i++) {
                    let listData = list[i];
                    //小于Y轴最大范围可入判断
                    if (i <= largeY && listData) {
                        for (let k = 0; k < listData.length; k++) {
                            var data = listData[k];
                            var listX = this.getRanarr(data.contennumX, data.posnumX);
                            var listY = this.getRanarr(data.contennumY + 1, data.posnumY - 1);
                            if (this.isRepeat(rangeX, listX)) {
                                if (this.isRepeat(rangeY, listY)) {
                                    onData = { data: data, val: i, index: k, num: 1 };
                                    break;
                                }
                            }
                        }
                    }
            }
        }
        return onData;
    };
    /**
     * 通过坐标转换点击物品
     * @param {坐标} point 
     */
    onItemclickpoint(point) {
        var posX = Math.floor(point.x / this.blockvalue);//x轴坐标
        var posY = Math.floor(point.y / this.blockvalue);//y轴坐标
        if (posX >= 0 && posY >= 0) {
            let rangeX = [posX];//X轴存在范围数组
            let rangeY = [posY];//Y轴存在范围数组
            let largeY = [posY];//Y轴最大范围
            if (this.dismodeisShow == true) {//展架模式点击
                {
                    rangeY = [posY];//Y轴存在范围数组
                    largeY = [posY+1];//Y轴最大范围
                    let event = this.onDetecooritem(this.tradeData, rangeX, rangeY, largeY, true);
                    if (event != null) {
                        this.tradeData[event.val].splice(event.index, event.num);
                        this.getPickItemData(event.data, posX, posY, 1, event.data.templateID, null,point);
                        this.loadTradeList(this.tradeData);
                        this.loadVerList(this.totalData.verData, false);
                        return;
                    }
                }
                {
                    posX = Math.round(point.x / this.blockvalue);//x轴坐标
                    posY = Math.round(point.y / this.blockvalue);//y轴坐标
                    rangeY = [posY];//Y轴存在范围数组
                    largeY = [posY];//Y轴最大范围
                    if (this.verData[posX] && this.verData[posX].indexOf(posY) != -1) {
                        this.getPickItemData(this.verData[posX], posX, posY, 0, 500020002, null, point);
                        return;
                    }

                }
            } else {//非展架模式点击
                {
                    let event = this.onDetecooritem(this.sureData, rangeX, rangeY, largeY, false);
                    if (event != null) {
                        this.sureData[event.val].splice(event.index, event.num);
                        this.getPickItemData(event.data, posX, posY, 2, event.data.templateID, event.data.index,point);
                        this.loadSurelist();
                        return;
                    }
                }
            }



        }

    };
    touchResize() {
        if (this.pickItemData) {
            if (this.pickItemData.templateID == '500020001') {
                this.tranDemo.active = true;
                this.tranDemoLabel.string = this.pickItemData.num;
                let width = this.pickItemData.num * this.blockvalue + 100;
                this.moveNode1.x = -(width / 2);
                this.moveNode2.x = (width / 2);
            } else if (this.pickItemData.templateID == '500020002') {
                this.verDemo.active = true;
                this.verDemoLabel.string = this.pickItemData.num;
                this.verDemo.setPosition(this.touchPos);
            } else {
                let templateID = this.pickItemData.templateID
                this.showItemDecDlg(templateID);
            }
        }

    };
    onMoveClick(event){
        let point = this.demoNode.convertToNodeSpaceAR(event.getLocation());
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.isMoved = false;
            this.touchStart = null;
            this.ndTouchStart = null
            if (this.touchStart == null){
                this.touchStart = point;
                this.ndTouchStart =  this.ndPickItem.getPosition();
            }
            // if (this.pickItemData.templateID == 500020002)
            //     this.tradeMoved = false;
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distance = point.sub(this.touchStart).mag();
            if (distance > 5) {
                this.isMoved = true;
            }
            if (this.isMoved && this.pickItemData) {
                let pointX = this.touchStart.x -point.x;
                let pointY = this.touchStart.y -point.y;
            
                
                let position = new cc.Vec2(this.ndTouchStart.x-pointX, this.ndTouchStart.y-pointY)
                if (position.x - this.halfBlockValue * this.pickItemData.num < -5){
                    position.x = this.halfBlockValue * this.pickItemData.num -5;
                }
                if (position.x + this.halfBlockValue * this.pickItemData.num > 1030){
                    position.x = 1030 -this.halfBlockValue * this.pickItemData.num;
                }
                if(this.pickItemData.templateID == 500020001||this.pickItemData.templateID == 500020002){
                    
                    position.x = Math.round(position.x/this.blockvalue)*this.blockvalue;
                    position.y = Math.round(position.y/this.blockvalue)*this.blockvalue;
                    if(this.pickItemData.templateID == 500020001&&this.pickItemData.num%2!=0){
                        if (pointX > 0)
                            position.x += this.halfBlockValue
                        else if (pointX < 0)
                            position.x -= this.halfBlockValue
                    }
                }
                    this.showPickItem(this.pickItemData, position);
                    this.adjustMousePoint(null);
            }

        } else if (event.type == cc.Node.EventType.TOUCH_CANCEL || event.type == cc.Node.EventType.TOUCH_END) {
            //触摸结束
            this.touchEndClick();
            
        }
    };
    onPlusClick(event){
        let self = this;
        let touchPoint = event.getLocation();
        let name = event.target.name;
        let point = self.tranDemo.convertToNodeSpaceAR(event.getLocation());
        if (event.type == cc.Node.EventType.TOUCH_START) {
            self.touchBegin = touchPoint;
            this.position.x =this.ndPickItem.x;
            this.position.y =this.ndPickItem.y;
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let xMove = Math.abs(touchPoint.x - self.touchBegin.x);
            if (xMove > 5) {
                self.isOnMoved = true;
            }
            if(self.isOnMoved){
                if (name == 'moveNode1')
                    self.moveNode1.x = point.x;
                else
                    self.moveNode2.x = point.x;
                let posX = self.touchBegin.x - touchPoint.x;
                self.resizeBtn(posX, name,false, function (pickItemData, position) {
                    let ndPickItem: any = self.ndPickItem
                    let itemClass = ndPickItem.getComponent(global.CommonClass.PreciousItem);
                    itemClass.setItem(pickItemData);
                    if (position) {
                        self.addisShow = true;
                        self.ndPickItem.setPosition(position);
                        self.ndPickItem.zIndex = -Math.ceil(position.x);
                        self.ndVirtual.setPosition(position);
                        self.tranDemo.getChildByName('deletebtn').active = false;
                        self.tranDemo.getChildByName('moveToNode1').active = false;
                        self.adjustMousePoint(null);
                    }
                    ndPickItem.active = true;
                    
                    let size = self.ndPickItem.getChildByName('check').getContentSize();
                    self.ndVirtual.setContentSize(size);
                })
            }
           
        
        } else if (event.type == cc.Node.EventType.TOUCH_CANCEL || event.type == cc.Node.EventType.TOUCH_END) {
            //触摸结束
            let posX = self.touchBegin.x - touchPoint.x
            self.resizeBtn(posX, name,true, function (pickItemData, position) {
                self.addisShow = true;
                self.pickItemData = pickItemData;
                self.showPickItem(pickItemData, position);
                self.adjustMousePoint(null);
                self.tranDemo.getChildByName('deletebtn').active = true;
                self.tranDemo.getChildByName('moveToNode1').active = true;
                let width = pickItemData.num * self.blockvalue + 100;
                self.moveNode1.x = -(width / 2);
                self.moveNode2.x = (width / 2);
            })
        }
    };
    touchEvent(event) {
        let point = this.verNode.convertToNodeSpaceAR(event.getLocation());
        let touchPoint = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.isMoved = false;
            if (!this.dragItemData) {
                this.dragItemData = null;
                this.ndTouchStart =null;
                this.data = null;
                this.pickItemData = null;
                this.curOpItem = null;
                this.touchStart = point;
                this.onItemclickpoint(point);
            }
            if (this.touchStart == null)
                this.touchStart = point;
                // this.tradeMoved == null &&
            if ( this.dragItemData && this.dragItemData.templateID == '500020001') {
                //生成数据
                let curPosition = this.ndPickItem.getPosition();
                let contentSize = this.ndPickItem.getChildByName("check").getContentSize();
                this.data = this.setData(curPosition, contentSize,this.dragItemData, false);
                // //判断横板上方是否存在物品
                // this.tradeMoved = false;
                // var rangeX = this.getRanarr(this.data.contennumX, this.data.posnumX);
                // for (let i = 0; i < this.data.posnumX; i++) {
                //     if (this.sureData[this.data.contennumY]) {
                //         for (let k = 0; k < this.sureData[this.data.contennumY].length; k++) {
                //             let listX = this.getRanarr(this.sureData[this.data.contennumY][k].contennumX, this.sureData[this.data.contennumY][k].posnumX);
                //             if (this.isRepeat(rangeX, listX))
                //                 this.tradeMoved = true;
                //         }
                //     }
                // }
               
            }
            if (this.pickItemData && !(this.pickItemData.templateID == 500020001 || this.pickItemData.templateID == 500020002)){
                this.scheduleOnce(function(){
                    if(this.isMoved== false){
                       this.adjustMousePoint(null);
                    }
               },1)
            }
           
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distance = point.sub(this.touchStart).mag();
            if (distance > 5) {
                if (this.pickItemData && (this.pickItemData.templateID == 500020001 || this.pickItemData.templateID == 500020002))
                    return;
                this.isMoved = true;
            }
           
            if (this.isMoved && this.pickItemData) {
                let pointX = this.touchStart.x -point.x;
                let pointY = this.touchStart.y -point.y;
                let position = new cc.Vec2(this.ndTouchStart.x-pointX, this.ndTouchStart.y-pointY)
                this.showPickItem(this.pickItemData, position);
                // let eventpoint = event.touch.getLocation();
                // this.onMoveItem(eventpoint);
                this.adjustMousePoint(null);
            }

        } else if (event.type == cc.Node.EventType.TOUCH_CANCEL || event.type == cc.Node.EventType.TOUCH_END) {
            //触摸结束
            
             this.unscheduleAllCallbacks();
            if (this.dragItemData == null && this.dismodeisShow == false && this.surefault == false){
                let pointx = point.x-this.touchStart.x;
                if(Math.abs(pointx)>200){
                    if(pointx<0)
                    this.pageCut(null,1)
                    else
                    this.pageCut(null,2)
                }
            }
            this.touchEndClick();
           
        }

    };
    showItemDecDlg(itemID) {
        let self = this;
        global.Manager.UIManager.open('UIHandBook06', null, function (panel) {
            if (panel != null) {

                panel.showPutDown(self.putDownItem.bind(self));
                panel.show(itemID);
                panel.showPut(true);
            }
        }.bind(this));
    };
    putDownItem(isShow) {
        let self = this;
        if (isShow) {
            let index = this.pickItemData.index;
            let data = { type: 0, index: [index], page: self.hallNum };
            this.ndPickItem.active = false;
            this.dragItemData = null;
            this.data = null;
            this.pickItemData = null;
            this.curOpItem = null;
            this.addisShow = false;
            let taskdata = global.Module.TaskData.getHasAcceptTaskData();
            if (taskdata && taskdata.taskId == 10002 && taskdata.state == 1) {
                    global.CommonClass.UITip.showTipTxt('完成任务后方可卸下展架宝物', global.Enum.TipType.TIP_BAD);
                    return;
            }
            global.Instance.MsgPools.send('showTablePutDown', data, function (msg) {
                if (!msg.errorID) {
                    let ID = global.Module.MainPlayerData.getRoleID();
                    let tableData = { roleId: ID, type: 0, page: self.hallNum };
                    global.Instance.MsgPools.send('showTable', tableData, function (msg) {
                            self.reflash();  
                    });
                }
            });
        } else {
            this.addisShow = false;
            this.tranDemo.active = false;
            this.verDemo.active = false;
            this.onShowItem(true);
        }

    };
    /**
     * 触摸结束
     * 
     */
    touchEndClick() {
        if (this.isMoved && this.pickItemData) {//有数据有拖动
            let canPut = this.canPutItem(this.ndVirtual);
            if(this.pickItemData.templateID == 500020001){
                if (canPut == true) {
                    this.tranDemo.active = false;//关闭展架加减页面
                    this.verDemo.active = false;//关闭展架加减页面
                    this.onShowItem(false);
                    this.addisShow = false;
                    this.touchStart = null;
                }
            }else{
                this.tranDemo.active = false;//关闭展架加减页面
                this.verDemo.active = false;//关闭展架加减页面

                this.onShowItem(false);
                this.addisShow = false;
                this.touchStart = null;
            }
           
        } else {//无数据或者无拖动
            if (this.curOpItem != null) { //当前选中节点是否存在东西
                if (this.addisShow) {//打开展架加减页面
                    if (this.tranDemo.active || this.verDemo.active) {
                        this.tranDemo.active = false;//关闭展架加减页面
                        this.verDemo.active = false;//关闭展架加减页面
                        this.touchStart = null;
                        this.adjustMousePoint(null);//设置红框蓝框
                    } else {
                        this.onShowItem(false); //保存当前状态
                        this.addisShow = false;//关闭展架加减页面

                    }
                } else {
                    if (this.tranDemo.active || this.verDemo.active) {//打开详情
                        this.tranDemo.active = false;
                        this.verDemo.active = false;//关闭展架加减页面
                        this.onShowItem(true);//回到初始状态
                    } else {//初次点击弹出宝物或者展架界面
                        this.touchResize();
                    }


                }
            }

        }
    };

    // update (dt) {}
}
