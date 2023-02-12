import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIMakeGoods extends UIBase {
    @property({ type: cc.Node, displayName: "ndTarget", tooltip: "左边框" })
    ndTarget: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndMatriaNode", tooltip: "ndMatriaNode" })
    ndMatriaNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndInfoNode", tooltip: "ndInfoNode" })
    ndInfoNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndMakeItemNode", tooltip: "ndMakeItemNode" })
    ndMakeItemNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "dragRange", tooltip: "托盘制作拖动成功范围" })
    dragRange: cc.Node = null;
    @property({ type: cc.Node, displayName: "spnMake", tooltip: "主角动画" })
    spnMake: cc.Node = null;
    @property({ type: cc.Node, displayName: "basket", tooltip: "0静止篮子1行走篮子" })
    basketNode: cc.Node[] = [];
    @property({ type: cc.Node, displayName: "ManNode", tooltip: "加工主工具" })
    ManNode: cc.Node = null;
    topEmpty: number;
    buttomEmpty: number;
    itemSpace: number;
    curSelIdx: number;
    hasUnPutItem: boolean;
    isFree: boolean;
    lockPut: boolean;
    factoryID: number;
    ndFactory: any;
    makeItemData: any[];
    ndMove: any;
    isMoveItem: boolean;
    canDrag: boolean;
    touchStart: any;
    lastTouchPos: any;
    curTouchPos: any;
    scrollOffset: any;
    maxItemNum: number;
    dropItems: any[];
    curDropIdx: number;
    pickItem: any;
    moveDis: cc.Vec2;
    unrealIdxs: {};
    oldPositions: Map<any, any>;
    ndDropItem: cc.Node;
    curMakeData: any;
    isMoved: boolean;
    callback: any;
    itemSize: { with: number; height: number; };
    ndMatriaNodeY: number;
    posY: number;
    makeGoodisShow: boolean;
    
    constructor(){
        super();
        this.topEmpty = 0;
        this.buttomEmpty = 0;
        this.itemSize = {with:0,height:0};
        this.itemSpace = 30;
        this.curSelIdx = -1;
        this.hasUnPutItem = false;//是否在放置物品阶段 true 结束
        this.isFree = true;     //人是否在待机中
        this.lockPut = false;
        this.factoryID = -1;//建筑ID
        this.ndFactory = null;//大本营建筑方法
        this.makeItemData = new Array();
        this.ndMatriaNodeY = 0;
        this.posY = 0;

        this.ndMove = null;
        this.isMoveItem = false;//是否可以拖动
        this.canDrag = false;
        this.touchStart = null;
        this.lastTouchPos = null;
        this.curTouchPos = null;
        this.scrollOffset = null;
        this.maxItemNum = 6;//制作最大数量

        this.dropItems = [];
        this.curDropIdx = 0;

        this.pickItem = null;
        this.moveDis = cc.v2(0, 0);

        this.unrealIdxs = {};//当前位置是否有制作

        this.oldPositions = new Map();
    };
    onLoad () {
        global.Manager.UIManager.add('UIMakeGoods', this);
        let makeGoodisShow = cc.sys.localStorage.getItem('makeGoodisShow');
        makeGoodisShow = JSON.parse(makeGoodisShow);
        if (makeGoodisShow == null) {
            this.makeGoodisShow = false;
            cc.sys.localStorage.setItem('makeGoodisShow', JSON.stringify(this.makeGoodisShow));
        } else {
            this.makeGoodisShow = makeGoodisShow;
        }
        this.ndMove = this.node.getChildByName('ndMove');
        this.ndDropItem = this.ndMakeItemNode.getChildByName('ndItem1').getChildByName('ndDropItem');
       
    };

    start () {

    }
    onEnable() {
        global.Module.MakeGoodsData.setPanel(this);

        this.enableNodeTouch(true);

        this.itemSize = {with:200,height:100};
        let withX = global.Manager.Sdk.sizeMath();
        this.ndTarget.x = -590-withX
        this.ndMatriaNode.x = -502-withX
        let itemScroll = this.ndTarget.getChildByName('itemScorll');
        this.enableScrollTouch(true);

        itemScroll.on('scrolling', this.scrolling, this);

        let self = this;
        this.node.on('onMakeItemFinish', function (event) {
            self.onMakeItemFinish(event);
        });
        this.node.on('onMakeItemUpdateTime', function (event) {
            self.onMakeItemUpdateTime(event);
        });

        this.ndMove.active = false;

        global.Module.GameData.setMaskSound(true,null);
    };
    getDragRange(){
        return this.dragRange;
    }
    onDisable() {
        let itemScroll = this.ndTarget.getChildByName('itemScorll');
        itemScroll.off('scrolling', this.scrolling, this);
        global.Manager.UIManager.remove('UIMakeGoods');
        this.enableScrollTouch(false);
        this.enableNodeTouch(false);

        this.node.off('onMakeItemFinish');
        this.node.off('onMakeItemUpdateTime');

        cc.director.getScheduler().unschedule(this.updateMoveItem, this);

        global.Module.MakeGoodsData.setPanel(null);

        global.Module.GameData.setMaskSound(false,null);


        global.Instance.AudioEngine.stopSound('makegoods');
    };
    //打开展品金额
    onMakeGoodsBtn() {
        this.makeGoodisShow = !this.makeGoodisShow
        cc.sys.localStorage.setItem('makeGoodisShow', JSON.stringify(this.makeGoodisShow));
        let ndView = this.ndTarget.getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content').children;

        for (let key in ndItems) {
            let ndItem:any = ndItems[key];
            let makeItem = ndItem.getComponent(global.CommonClass.MakeGoodsItem);
            makeItem.countNum();
            makeItem.onOpen(this.makeGoodisShow);
        }
      
    };
    getFactoryID() {
        return this.factoryID;
    };
    //滚动框点击事件
    enableScrollTouch(isEnable) {
        let itemScroll = this.ndTarget.getChildByName('itemScorll');
        if (isEnable) {
            itemScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
            itemScroll.on(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
            itemScroll.on(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);
            itemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        }
        else {
            itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
            itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
            itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);
            itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        }
    };

    enableNodeTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
        else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
    };
    //获取当前制作数据
    makeItemArr(){
        let data = global.Manager.DBManager.getData("ManufactureMakeData");//所有制作数据
        global.CommonClass.Functions.sort(data, function (lhs, rhs) {
            return lhs.levelRequire < rhs.levelRequire;
        });
        for (let key in data) {
            let item = data[key];
            if (item.factory == this.factoryID) {
                this.makeItemData.push(item);
            }
        }
    };
    reflashload(){
        let itemSpace = this.itemSpace;

        let ndView = this.ndTarget.getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');

      
        let itemNum = this.makeItemData.length;

        let sizeWidth = ndItems.getContentSize().width;
        ndItems.setContentSize(sizeWidth, (this.itemSize.height + itemSpace) * (itemNum + this.topEmpty + this.buttomEmpty) + 520);
        ndItems.removeAllChildren();
        let itemPosY = -this.itemSize.height / 2 - 50;
        for (let i = 0; i < this.topEmpty; ++i) {
            global.CommonClass.MakeGoodsItem.create(null, -1, ndItems, cc.v2(0, itemPosY),null);
            itemPosY -= this.itemSize.height + itemSpace;
        }

        this.setCurSelIndex(0);
        let selIdx = this.curSelIdx;
        let isShow = this.makeGoodisShow;
        for (let key in this.makeItemData) {
            let item = this.makeItemData[key];
            let offset = 0;
            global.CommonClass.MakeGoodsItem.create(item, key, ndItems, cc.v2(offset, itemPosY), function (nodeClass) {
                if (selIdx == parseInt(key))
                    nodeClass.node.name = key;
                    nodeClass.onOpen(isShow);
            });
            itemPosY -= this.itemSize.height + itemSpace;
        }
        for (let j = 0; j < this.buttomEmpty; ++j) {
            global.CommonClass.MakeGoodsItem.create(null, -1, ndItems, cc.v2(0, itemPosY),null);
            itemPosY -= this.itemSize.height + itemSpace;
        }
    }
    show(ndFactory) {
        let factoryClass = ndFactory.getComponent(global.CommonClass.FactoryBase);
        let factoryID = factoryClass.getID();
        global.Module.MakeGoodsData.setFactoryID(factoryID);
        this.factoryID = factoryID;
        let skeleton = this.spnMake.getComponent(sp.Skeleton);
        let nameSkin = 'npc1';
        if (factoryID == 3010 ||factoryID == 3011 || factoryID == 3020 || factoryID == 3021 || factoryID == 3022 || factoryID == 3023 || factoryID == 3024)
            nameSkin = 'npc1';
        else
            nameSkin = 'npc3';
        skeleton.setSkin(nameSkin)
        this.ndFactory = ndFactory;

        let path = 'images/ui/makegoods/'+factoryID;
        global.CommonClass.Functions.setTexture(this.ManNode, path,null);
      
        this.makeItemArr();//获取当前制作数据
        this.reflashload();//加载左侧滚动条数据
       
        for (let idx = 0; idx < this.maxItemNum; ++idx)
            this.reflashMakeItem(idx);

        this.reflashHelp();
    };
    reflashNpc() {
        let makeItemNum = global.Module.MakeGoodsData.getMakeItemNum(this.factoryID);
        this.maxItemNum = makeItemNum
        let ndPos = this.node.getChildByName('ndPos');
        let ndPosItem0 = ndPos.getChildByName('spItem0');
        let ndPosItem1 = ndPos.getChildByName('spItem1');
        let ndPosItem = ndPos.getChildByName('spItem'+makeItemNum);
        this.playMake('zoulu',null);
        let itemID = global.Module.MakeGoodsData.getMakeItem(this.factoryID,makeItemNum-1);
        this.reflashTip(this.basketNode[0], itemID);
        this.reflashTip(this.basketNode[1], itemID);
        this.basketNode[0].active = true;
        this.basketNode[1].active = false;
        cc.tween(this.spnMake)
        .to(0, { position: new cc.Vec3(ndPosItem1.x, ndPosItem1.y) })
        .to(1, { position: new cc.Vec3(ndPosItem0.x, ndPosItem0.y) })
        .call(() => {
            this.basketNode[0].active = false;
            this.basketNode[1].active = true;
            this.playMake('naqi pan',null);
        })
        .delay(0.2)
        .call(() => {
            this.spnMake.scaleX = -1;
            this.playMake('zoulu pan',null);
        })
        .to(1, { position: new cc.Vec3(ndPosItem.x, ndPosItem.y) })
        .call(() => {
            this.playMake('fangxia pan',null);
        })
        .delay(0.2)
        .call(() => {
            this.basketNode[1].active = false;
            for (let idx = 0; idx < this.maxItemNum; ++idx)
            this.reflashMakeItem(idx);
            this.spnMake.scaleX = 1;
            this.playMake('zoulu',null);
        })
        .to(0.8, { position: new cc.Vec3(ndPosItem1.x, ndPosItem1.y) })
        .call(() => {
            this.hasUnPutItem = false;
            this.spnMake.scaleX = 1;
            this.playMake('zhizuo',null);
            this.setMatrial(this.curSelIdx);
        })
        .start();
    };

    reflashHelp() {
        //滚动到指定位置
        let itemScroll = this.ndTarget.getChildByName('itemScorll').getComponent(cc.ScrollView);
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.state == 1 && (data.taskId == 10005))
            this.scheduleOnce(function () {
                itemScroll.scrollToOffset(cc.v2(0, 200), 0.3);
            }, 0);//下一帧立即执行，此处需要在下一帧执行
        if ((data.taskId == '10005') && data.state == 1) {
            this.scheduleOnce(function () {
                itemScroll.enabled = false;
            }, 0.4);//下一帧立即执行，此处需要在下一帧执行
        }
          
    };

    reflashTip(ndTip, itemID) {
        let makeItem = global.Manager.DBManager.findData("ManufactureMakeData", 'ID', itemID);

        for (let i = 1; i <= 3; ++i) {
            let matrialKey = 'matrial' + i.toString();
            let matrialID = makeItem[matrialKey];

            let spItem = ndTip.getChildByName('spItem' + i.toString());
            if (matrialID > 0) {
                let matrialFile = "images/pictrue/items/default";
                let matrialData = global.Manager.DBManager.getItemNew(matrialID);
                if (matrialData != null)
                    matrialFile = matrialData.path + matrialData.picName;
                global.CommonClass.Functions.setTexture(spItem, matrialFile,null);
                spItem.active = true;
            }
            else {
                spItem.active = false;
            }
        }
    };
    /**
     * 根据场景加载制作数据
     * @param {*} idx 
     */
    reflashMakeItem(idx) {
        let data:any = global.Module.MakeGoodsData.getData(this.factoryID);
        if (data != null) {
            let ndItem = this.ndMakeItemNode.getChildByName('ndItem' + (idx + 1).toString());
            let ndTip = ndItem.getChildByName('ndTip');
            let itemID = data.makeItem[idx];
            if (itemID != null) {
                ndItem.opacity = 255;

                let lastIdx = global.Module.MakeGoodsData.getMakeItemNum(this.factoryID) - 1;
                if (idx == 0) {
                    let lblTimeNode = ndItem.getChildByName('lblTimeNode');
                    let leftTime = global.CommonClass.Functions.getLeftTime(data.makeTime[0]);
                    if (leftTime <= 0)
                        leftTime = 0;
                    let dataTime = global.CommonClass.Functions.formatSeconds3(leftTime);
                    let lblTime1 = lblTimeNode.getChildByName('lblTime1');
                    let lblTime2 = lblTimeNode.getChildByName('lblTime2');
                    let lblTimetitle1 = lblTimeNode.getChildByName('lblTimetitle1');
                    let lblTimetitle2 = lblTimeNode.getChildByName('lblTimetitle2');
                    lblTime1.getComponent(cc.Label).string = dataTime.time1;
                    lblTime2.getComponent(cc.Label).string = dataTime.time2;
                    lblTimetitle1.getComponent(cc.Label).string = dataTime.timeLabel1;
                    lblTimetitle2.getComponent(cc.Label).string = dataTime.timeLabel2;
                    lblTimeNode.active = (!(lastIdx == idx && !this.isFree)&&leftTime>0);
                    let spnSmoke = ndItem.getChildByName('spnSmoke');
                    spnSmoke.active = true;


                    let recallNode = lblTimeNode.getChildByName('recallNode');
                    let taskdata = global.Module.TaskData.getHasAcceptTaskData();
                    if ((taskdata && taskdata.taskId == 10005 && taskdata.state == 1 && data.makeItem[0] == 410240001) ||
                    (taskdata && taskdata.taskId == 10014 && taskdata.state == 1 && (data.makeItem[0] == 300200001 || data.makeItem[0] == 300200002))){
                        recallNode.getChildByName('helpNode').active = true;
                        leftTime = 0;
                    }else{
                        recallNode.getChildByName('helpNode').active = false;
                    }
                        
                    let date = global.Manager.DBManager.findData('Sundry', 'name', 'accelerateConsumption');
                    let itemNum = Math.ceil(leftTime / (date.value * 60));
                    recallNode.getChildByName('timeLabel').getComponent(cc.Label).string = itemNum.toString();
                }

                if (ndTip != null) {
                    ndTip.active = true;
                    this.reflashTip(ndTip, itemID);
                }
            }else {
        
                if (idx == 0) {
                    let lblTimeNode = ndItem.getChildByName('lblTimeNode');
                    lblTimeNode.active = false;
                    let spnSmoke = ndItem.getChildByName('spnSmoke');
                    spnSmoke.active = false;
                    this.playDropAnimation(false);
                    this.playMake('daiji',null);
                }
                if (ndTip != null) {
                    ndTip.active = false;
                }
            }
        }
    };

    isMaterialEnough(makeItemID) {
        let makeItem = global.Manager.DBManager.findData("ManufactureMakeData", 'ID', makeItemID);

        for (let idx = 1; idx <= 5; ++idx) {
            let matrialKey = 'matrial' + idx.toString();
            let numKey = 'num' + idx.toString();
            let itemID = makeItem[matrialKey];
            let number = makeItem[numKey];

            if (itemID > 0) {
                let hasNum = 0;
                let packageItem = global.Module.PackageData.getItem(itemID);
                if (packageItem != null)
                    hasNum = packageItem.Count;

                if (hasNum < number)
                    return false;
            }
        }

        return true;
    };
    //制作配方
    setMatrial(itemIdx) {
        let item = this.makeItemData[itemIdx];
        let ndNode = this.ndMatriaNode.getChildByName('Node');
        if (item != null) {
            this.dropItems = [];
            let makeItem = global.Manager.DBManager.findData("ManufactureMakeData", 'ID', item.ID);
            let k = 0;
            for (let idx = 1; idx <= 5; ++idx) {
                let matrialKey = 'matrial' + idx.toString();
                let numKey = 'num' + idx.toString();
                let itemID = parseInt(makeItem[matrialKey]);
                let number = makeItem[numKey];
                if (itemID > 0)
                k++;
                let ndItem:any = ndNode.getChildByName('ndItem' + idx.toString());
                let itemNeedClass = ndItem.getComponent(global.CommonClass.ItemNeed);
                itemNeedClass.setItem(itemID, number,105);
                if (itemID > 0)
                    this.dropItems.push(itemID);
            }
            if(k>2)
            this.ndMatriaNode.width = k*100+100
            else
            this.ndMatriaNode.width = 300
            let lblTime = this.ndInfoNode.getChildByName('lblTime').getComponent(cc.Label);
            lblTime.string ='制作时间：'+ makeItem.cookingTime.toString() + "分钟";
        }else {
            for (let idx = 1; idx <= 5; ++idx) {
                let ndItem:any = ndNode.getChildByName('ndItem' + idx.toString());
                let itemNeedClass = ndItem.getComponent(global.CommonClass.ItemNeed);
                itemNeedClass.setItem(-1, 0,105);
            }
        }
    };

    updateMoveItem() {
        for (let i = 1; i <= 5; ++i) {
            if (this.oldPositions[i] != null) {
                let spItem = this.ndMove.getChildByName('spItem' + (i + 1).toString());
                spItem.stopAllActions();
                let targetPos = this.oldPositions[i];
                targetPos.x -= 100;

                let moveAction = cc.moveTo(0.05, targetPos);
                spItem.runAction(moveAction);
            }

            let spItem = this.ndMove.getChildByName('spItem' + i.toString());
            let position = spItem.getPosition();
            this.oldPositions[i] = position;
        }
    };


    pickScrollIdx(isBack) {
        let itemScroll = this.ndTarget.getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        let offset = scrollView.getScrollOffset();

        let beginOffset = 0;
        let offTimes = (offset.y + beginOffset) / (this.itemSize.height + this.itemSpace);
        let idx = Math.floor(offTimes);

        if (isBack)
            idx += 3;

        if (idx < 0) {
            idx = 0;
        }
        else if (idx >= this.makeItemData.length) {
            idx = this.makeItemData.length - 1;
        }

        return idx;
    };

    scrolling(event) {
        let posY = event.content.y - this.ndMatriaNodeY;
        this.ndMatriaNode.y = this.posY + posY;
    };

    setCurSelIndex(index) {
        if (this.curSelIdx != index) {
            this.curSelIdx = index;
        }
    };
    //通过坐标拿到节点
    getPickTarget(touchPoint):cc.Node {
        let ndView = this.ndTarget.getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content').children;

        for (let key in ndItems) {
            let ndItem = ndItems[key];
            let spBox = ndItem.getChildByName('spBox');
            let boundingBox = spBox.getBoundingBoxToWorld();
            let isPick = boundingBox.contains(touchPoint);
            let itemIdx = ndItem.tagEx;

            if (isPick && itemIdx >= 0) {
                this.setCurSelIndex(itemIdx);
                this.setMatrial(itemIdx);
                return ndItem;
            }
        }

        return null;
    };

    pickMatrial(touchPoint) {
        let ndNode = this.ndMatriaNode.getChildByName('Node');
        for (let i = 1; i <= 5; ++i) {
            let ndItem = ndNode.getChildByName('ndItem' + i.toString());
            if (ndItem.tagEx > 0) {
                let boundingBox = ndItem.getBoundingBoxToWorld();
                let isPick = boundingBox.contains(touchPoint);

                if (isPick) {
                    return true;
                }
            }
        }
        return false;
    };

    pickCompose(touchPoint) {
        for (let i = 1; i <= this.maxItemNum; ++i) {
            let ndItem = this.ndMakeItemNode.getChildByName('ndItem' + i.toString());
            let boundingBox = ndItem.getBoundingBoxToWorld();
            let isPick = boundingBox.contains(touchPoint);

            if (isPick) {
                let data:any = global.Module.MakeGoodsData.getData(this.factoryID);
                if (data != null && data.makeItem[i - 1] > 0)
                    return i;
            }
        }
        return -1;
    };

    prepareMove(touchPoint) {
        for (let key in this.oldPositions)
            this.oldPositions[key] = null;

        let position = this.ndMove.convertToNodeSpaceAR(touchPoint);
        let item = this.makeItemData[this.curSelIdx];
        let makeItem = global.Manager.DBManager.findData("ManufactureMakeData", 'ID', item.ID);

        if (makeItem != null) {
            let spTarget = this.ndMove.getChildByName('spItem1');
            spTarget.active = true;
            let targetID = makeItem.ID;
            if (targetID > 0) {
                let iconFile = "images/pictrue/items/default";
                let data = global.Manager.DBManager.getItemNew(targetID);
                if (data != null)
                    iconFile = data.path + data.picName;
                global.CommonClass.Functions.setTexture(spTarget, iconFile,null);
            }
            spTarget.setPosition(position);
            let ndNode = this.ndMatriaNode.getChildByName('Node');
            for (let idx = 2; idx <= 6; ++idx) {
                let matrialKey = 'matrial' + (idx - 1).toString();
                let itemID = makeItem[matrialKey];

                let spItem = this.ndMove.getChildByName('spItem' + (idx).toString());
                spItem.active = (itemID != null && itemID > 0);

                if (itemID > 0) {
                    let iconFile = "images/pictrue/items/default";
                    let data = global.Manager.DBManager.getItemNew(itemID);
                    if (data != null)
                        iconFile = data.path + data.picName;
                    global.CommonClass.Functions.setTexture(spItem, iconFile,null);
                }

                let ndMatirial = ndNode.getChildByName('ndItem' + (idx - 1).toString());
                let spMatiral = ndMatirial.getChildByName('spItem');
                global.CommonClass.Functions.setNodePosToTarget(spItem, spMatiral,null);
            }

            cc.director.getScheduler().schedule(this.updateMoveItem, this, 0.04, cc.macro.REPEAT_FOREVER, 0, false);
        }
    };
    //制作结束加速刷新处理
    onMakeItemFinish(msg) {
        let newIdxs = {};
        for (let key in this.unrealIdxs) {
            let i:any = key
            if (this.unrealIdxs[i])
                newIdxs[i - 1] = true;
        }
        this.unrealIdxs = newIdxs;
        for (let idx = 0; idx < this.maxItemNum; ++idx)
            this.reflashMakeItem(idx);
        let self = this;
        let data = { actionType: 1, recipeId: this.factoryID, enqueued: 0 };
        global.Instance.MsgPools.send('manufactureAction', data, function (msg) {
            global.Instance.Log.debug('manufactureAction',msg)
            self.refreshMakeGood();
        });
    };
    /**
     * 制作倒计时赋值
     * @param {*} msg 
     */
    onMakeItemUpdateTime(msg) {
        let ndItem = this.ndMakeItemNode.getChildByName('ndItem1');
        let lblTimeNode = ndItem.getChildByName('lblTimeNode');
        //  let time = msg.time*60;
        let leftTime = msg.time;
        if (leftTime <= 0)
            leftTime = 0;
        let dataTime = global.CommonClass.Functions.formatSeconds3(leftTime);
        let lblTime1 = lblTimeNode.getChildByName('lblTime1');
        let lblTime2 = lblTimeNode.getChildByName('lblTime2');
        let lblTimetitle1 = lblTimeNode.getChildByName('lblTimetitle1');
        let lblTimetitle2 = lblTimeNode.getChildByName('lblTimetitle2');
        lblTime1.getComponent(cc.Label).string = dataTime.time1;
        lblTime2.getComponent(cc.Label).string = dataTime.time2;
        lblTimetitle1.getComponent(cc.Label).string = dataTime.timeLabel1;
        lblTimetitle2.getComponent(cc.Label).string = dataTime.timeLabel2;
        lblTimeNode.active = leftTime > 0;
    };
   

    onSuccessPutMatrial(makeItemID) {
        let lastIdx = global.Module.MakeGoodsData.getMakeItemNum(this.factoryID) - 1;
        this.hasUnPutItem = true;
       

        this.unrealIdxs[lastIdx] = false;//当前位置是否有制作
        this.reflashNpc();
        this.playDrop();
    };
    /**
     * 任务场景保护
     * @param {*} params 
     */
    taskScenprotion(tagEx) {
        //任务安全保护
       if (tagEx == 4024) {
            //火灵石任务
            if (global.Module.TaskData.taskguard(10005))
                return false;
        } else if (tagEx == 3023) {
            //牛奶任务
        } else if (tagEx == 3020) {
            //粮油任务
            if (global.Module.TaskData.taskguard(10014))
                return false;
        }
        return true;
    };
    /**
     * 请求制作
     * @param {} isShow 
     */
    onPutDownMatrial(isShow) {
        if (isShow) {
            let makeItemID = this.makeItemData[this.curSelIdx].ID;
            let len = global.Module.MakeGoodsData.getMakeItemNum(this.factoryID);
            let maxSlotNum = global.Module.MakeGoodsData.getMaxMakeSlot(this.factoryID);

            if (len >= maxSlotNum) {
                global.CommonClass.UITip.showTipTxt('超过加工上限', global.Enum.TipType.TIP_BAD);
            } else {
                let self = this;
                if (this.isMaterialEnough(makeItemID)) {
                    if (!this.hasUnPutItem) {
                        //向服务器发送制作请求
                        let data = { actionType: 1, recipeId: makeItemID, enqueued: 1 };
                         if(this.taskScenprotion(this.ndFactory.tagEx)){
                            global.Instance.MsgPools.send('manufactureAction', data, function (msg) {
                                if (!msg.errorID)
                                    self.onSuccessPutMatrial(makeItemID);
                                else if (msg.errorID == 107)
                                    global.CommonClass.UITip.showTipTxt('等级不够', global.Enum.TipType.TIP_BAD);
                                else if (msg.errorID == 130)
                                    global.CommonClass.UITip.showTipTxt('配方ID非法', global.Enum.TipType.TIP_BAD);
                            });
                        }
                    } else {
                        global.CommonClass.UITip.showTipTxt('已经有待加工物品,请耐心等制作人员取走', global.Enum.TipType.TIP_BAD);
                    }
                } else {
                    global.CommonClass.UITip.showTipTxt('材料不够', global.Enum.TipType.TIP_BAD);
                }
            }
        }
        this.ndMove.active = false;
        this.isMoveItem = false;

        cc.director.getScheduler().unschedule(this.updateMoveItem, this);
    };
    refreshMakeGood(){
        let ndView = this.ndTarget.getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content').children;

        for (let key in ndItems) {
            let ndItem:any = ndItems[key];
            let makeItem = ndItem.getComponent(global.CommonClass.MakeGoodsItem);
            makeItem.countNum();
        }
    };
    //根据名字播放动画 走路制作待机可以循环播放
    playMake(name,callback) {
        let skeleton = this.spnMake.getComponent(sp.Skeleton);
       
        if(name == 'zoulu'||name == 'zhizuo'|| name == 'zoulu pan'|| name == 'daiji'){
            skeleton.loop = true;
        } else{
            skeleton.loop = false;
        }
        skeleton.paused = false;
        skeleton.animation = name;
        
        this.callback = callback;
        if (name == 'zhizuo')
            global.Instance.AudioEngine.replaySound('makegoods', true, 0.5);
        else
            global.Instance.AudioEngine.stopSound('makegoods');
    };
    updateDrop(dt) {
        let itemID = this.dropItems[this.curDropIdx];
        let nextIdx = ++this.curDropIdx;
        let itemNum = this.dropItems.length;

        if (nextIdx >= itemNum)
            cc.director.getScheduler().unschedule(this.updateDrop, this);
    };

    playDrop() {
        this.curDropIdx = 0;
        if (this.dropItems.length > 0)
            cc.director.getScheduler().schedule(this.updateDrop, this, 0.3, cc.macro.REPEAT_FOREVER, 0, false);
    };

  

    reflashDorpItem() {
        if (this.curMakeData) {
            let ndItem = this.ndMakeItemNode.getChildByName('ndItem1');
            let ndDropItem = ndItem.getChildByName('ndDropItem');

            for (let i = 1; i <= 3; ++i) {
                let matrialKey = 'matrial' + i.toString();
                let matrialID = this.curMakeData[matrialKey];

                if (matrialID <= 0)
                    matrialID = this.curMakeData['matrial1'];

                let spDropItem = ndDropItem.getChildByName('spDropItem' + i.toString());
                global.CommonClass.Functions.setItemTexture(spDropItem, matrialID,null);
            }
        }
    };

    playDropAnimation(isPlay) {
        this.reflashDorpItem();
    };
    /**
     * 制作加速
     */
    btnQuick() {
        let factoryID = this.factoryID;
        let callBack = function (isYes) {
            if (isYes) {
                let data = { buildingId: factoryID, speedupCard: 2, index: 0 };
                global.Instance.MsgPools.send('manufactureSpeedUp', data, function (msg) {
                    if (msg.errorID) {

                    }
                });
            }
        };

        let data: any = global.Module.MakeGoodsData.getData(this.factoryID);
        if (data != null) {
            let leftTime = global.CommonClass.Functions.getLeftTime(data.makeTime[0]);
            var taskdata = global.Module.TaskData.getHasAcceptTaskData();
            if ((taskdata && taskdata.taskId == 10005 && taskdata.state == 1 && data.makeItem[0] == 410240001) ||
                (taskdata && taskdata.taskId == 10014 && taskdata.state == 1 && (data.makeItem[0] == 300200001 || data.makeItem[0] == 300200002)))
                leftTime = 0;
            global.Manager.UIManager.open('DlgCostItem', null, function (panel) {
                panel.show(leftTime, callBack);
            });
        }

    };

    btnClose() {
        global.Proxys.ProxyGuide.stepNextGuide('CloseMakeIron');
        global.Proxys.ProxyGuide.stepNextGuide('CloseMakeMeal');

        global.Manager.UIManager.close('UIMakeGoods');
    };

    touchEvent(event) {
        let touchPoint = event.getLocation();

        if (event.type == cc.Node.EventType.TOUCH_START) {

     
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
         
        }
    };
    ndMatriaClick(){
        this.ndMatriaNode.active = false;    
    }

    touchScrollEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            let touchPoint = event.getLocation();;

            this.touchStart = touchPoint;
            this.lastTouchPos = touchPoint;

            this.pickItem = this.getPickTarget(touchPoint);

            this.moveDis = cc.v2(0, 0);
            this.isMoved = false;
            let itemScroll = this.ndTarget.getChildByName('itemScorll').getComponent(cc.ScrollView);
            this.ndMatriaNodeY = itemScroll.content.y
            if (this.pickItem != null){
                var position = this.pickItem.convertToWorldSpaceAR(cc.v2(0, 0));
                this.ndMatriaNode.active = true;
                this.ndMatriaNode.y = position.y-750/2;
                this.posY = this.ndMatriaNode.y;
            }else{
                this.ndMatriaNode.active = false; 
            }
               
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touchPoint = event.getLocation();;
            let distance = touchPoint.sub(touchPoint).mag();
            if (distance > 5) {
                this.isMoved = true;
            }
                this.ndMatriaNode.active = false;
            if (this.pickItem) {
                this.moveDis.x += Math.abs(touchPoint.x - this.lastTouchPos.x);
                this.moveDis.y += Math.abs(touchPoint.y - this.lastTouchPos.y);
                let item = this.makeItemData[this.curSelIdx];
              
                if (this.moveDis.x > this.moveDis.y && this.moveDis.x > 4) {
         
                    let makeItem = this.pickItem.getComponent(global.CommonClass.MakeGoodsItem);
                    makeItem.getItemID();
                    if (this.hasUnPutItem) {

                    } else {
                        this.pickItem = null;
                        this.isMoveItem = true;
                        this.ndMove.active = true;
                        this.prepareMove(touchPoint);
                        let itemScroll = this.ndTarget.getChildByName('itemScorll').getComponent(cc.ScrollView);
                        itemScroll.enabled = false;
                    }
                }
            }

            this.lastTouchPos = touchPoint;

            if (this.isMoveItem) {
                let pos = this.ndMove.convertToNodeSpaceAR(touchPoint);
                let spItem1 = this.ndMove.getChildByName('spItem1');
                spItem1.setPosition(pos);
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this.lastTouchPos = null;

            let touchPoint = event.getLocation();
            if (this.isMoveItem) {
                this.isMoveItem = false;
                // let boundingBox = this.dragRange.getBoundingBoxToWorld();
                // let isPick = boundingBox.contains(touchPoint);
                // this.onPutDownMatrial(isPick);//拖动到盘子上放
                this.onPutDownMatrial(Math.abs(touchPoint.x-this.touchStart.x)>50);//拖动距离大于50
            }  
            let itemScroll = this.ndTarget.getChildByName('itemScorll').getComponent(cc.ScrollView);

            var data = global.Module.TaskData.getHasAcceptTaskData();
         
         
            if (data==null ||!((data.taskId == '10005' || data.taskId == '10014') && data.state == 1)) {
                itemScroll.enabled = true;
            }
            this.touchStart = null;
        }
    };
}
