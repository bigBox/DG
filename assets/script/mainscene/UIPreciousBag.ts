
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPreciousBag extends cc.Component {

  
    static  filePath: "prefab/mainscene/";
    @property({  displayName: "roomType", tooltip: "" })
    roomType:number = 1; //1.宝物，2.标本
    @property({ type: cc.Node, displayName: "GuideNode", tooltip: "" })
    GuideNode: any = [];
    @property({ type: cc.Node, displayName: "ndDragItem", tooltip: "" })
    ndDragItem: any = null;
    @property({ type: cc.Node, displayName: "ndTemplateItem", tooltip: "" })
    ndTemplateItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "rootNode", tooltip: "" })
    rootNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ToggleNode", tooltip: "切换" })
    ToggleNode: cc.Node = null;
    itemSpace: number;
    pickItem: any;
    pickItemData: any;
    showtPosition: any;
    hidePosition: any;
    isDargItem: boolean;
    autoHide: boolean;
    touchStart: any;
    showEndCall: any;
    dragBeginCall: any;
    dragEndCall: any;
    dragEventCall: any;
    isDragItem: boolean;
    isShow: boolean;
    isShowPopBtn: boolean;
    isShowHide: boolean;
    spDropItem: any;
    topSpcace: number;
    items: any[];
    timeDelay: number;
    isUpdata: boolean;
    itemPosY: number;
    itemPosX: number;
    key: number;
    itemType: any;
    isMoved: boolean;
    lastTouchPos: any;
    moveDis: cc.Vec2;
    showType: number;//宝物分类21陶瓷22玉石23金朩24杂（字画）25字画
    timedata: {};

    constructor() {
        super();
        this.itemSpace = 20;
        this.pickItem = null;//正在移动的物品
        this.pickItemData = null;//货架的数据记录
        this.showtPosition = null;
        this.hidePosition = null;
        this.isDargItem = false;
        this.autoHide = false;

        this.touchStart = null;

        this.showEndCall = null;
        this.dragBeginCall = null;//拖动物品后配合上一层级移动中
        this.dragEndCall = null;//拖动物品后移动结束放手
        this.dragEventCall = null;//只要在屏幕拖动一直返回

        this.isDragItem = false;

        this.isShow = false;
        this.isShowPopBtn = true;
        this.isShowHide = true;

        this.spDropItem = null;
        this.topSpcace = 0;

        this.items = new Array();
        this.timeDelay = -1;
        this.isUpdata = false;
        this.itemPosY = 0;
        this.itemPosX = 0;
        this.showType = 0;
        this.timedata={}
    };

    start() {

    };

    onLoad() {
        this.spDropItem = this.node.getChildByName('spDropItem');
        this.hidePosition = cc.v2(0,0);
        this.showtPosition = cc.v2(270,0);
        let ndBox = this.rootNode.getChildByName('ndBox')
        
        this.showtPosition.x += global.Manager.Sdk.sizeMath();
        ndBox.width = 270+(global.Manager.Sdk.sizeMath()/2);
        this.setGuide(0);
    };
    setGuide(num) {
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if ( this.GuideNode[0]&& this.GuideNode[1])
            if (taskdata && taskdata.taskId == 10002 && taskdata.state == 1) {
                if (num == 0) {
                    this.GuideNode[0].active = true
                } else if (num == 1) {
                    this.GuideNode[0].active = false
                } else {
                    this.GuideNode[0].active = false
                    this.GuideNode[1].active = false
                }
            } else {
                this.GuideNode[0].active = false
                this.GuideNode[1].active = false
            }
    };

    onEnable() {
        this.ndDragItem.active = false;

        let itemScroll = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

        global.Manager.UIManager.add('UIPreciousBag', this);
    };

    onDisable() {
        let itemScroll = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

        this.enableTouch(false);
        global.Manager.UIManager.remove('UIPreciousBag');
    };

    getIsShow() {
        return this.isShow;
    };

    setTopSpace(space) {
        this.topSpcace = space;
    };

    showItems(itemType, condition) {
        this.setItemData(itemType, condition);

        let itemSpace = this.itemSpace;

        let ndView = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let itemNum = this.items.length;
        let scale = this.ndTemplateItem.scale;

        let sizeWidth = ndItems.getContentSize().width;
        let siezHeight = this.ndTemplateItem.getContentSize().height * scale;
        ndItems.y = 0;
        ndItems.setContentSize(sizeWidth, siezHeight * itemNum + (itemSpace - 1) * itemNum + this.topSpcace + 50);
        ndItems.removeAllChildren();

        this.itemPosY = -siezHeight / 2 - this.topSpcace;
        this.itemPosX = 0;
        this.isUpdata = true;
        this.timeDelay = -1;
        this.key = 0;
    };
    UIPrBag(num) {
        let roomType = parseInt(num);
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && taskdata.taskId == 10002 && taskdata.state == 1){
            this.roomType = 0;
            this.ToggleNode.getChildByName('toggle0').getComponent(cc.Toggle).isChecked = true;
        }
        let self = this;
        let condition = function (item) {
            let isFit = false;
            let itemNum = global.Module.PackageData.getItemCount(item.ID);
            if (roomType == 1)
                isFit = (itemNum > 0&&(self.showType == 0||item.subType == self.showType) && ((item.isRare == 2&&item.color > 1&&item.color < 5)||(item.isRare == 1&&item.color == 2)) );
            else if (roomType == 2)
                isFit = (itemNum > 0 && item.subType == 8);
            else if (roomType == 3)
                isFit = (item.subType == 1);

            return isFit;
        };
        this.roomType = roomType;
        if (roomType == 1) {//宝物
            this.showItems(5, condition);
        } else if (roomType == 2) {
            this.showItems(2, condition);
        } else if (roomType == 3) {//展架
            this.showItems(3, condition);
        }
    };
    ToggleClick(event,num){
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && taskdata.taskId == 10002 && taskdata.state == 1){
            this.ToggleNode.getChildByName('toggle0').getComponent(cc.Toggle).isChecked = true;
            global.CommonClass.UITip.showTipTxt('请先完成任务', global.Enum.TipType.TIP_BAD);
            return;
        }
        this.showType = parseInt(num);
        let self = this
        let condition = function (item) {
            let isFit = false;
            let itemNum = global.Module.PackageData.getItemCount(item.ID);
            if (self.roomType == 1)
                isFit = (itemNum > 0&&(self.showType == 0||item.subType == self.showType)&& ((item.isRare == 2&&item.color > 1&&item.color < 5)||(item.isRare == 1&&item.color == 2)) );
            else if (self.roomType == 2)
                isFit = (itemNum > 0 && item.subType == 8);
            else if (self.roomType == 3)
                isFit = (item.subType == 1);

            return isFit;
        };
        this.showItems(5, condition);
    };
    reflashCount(itemID) {
        let itemCount = global.Module.PackageData.getItemCount(itemID);

        let item:any = this.getItemNodeByItem(itemID);
        let itemClass = item.getComponent(global.CommonClass.ItemIcon);
        itemClass.setNum(itemCount);
    };

    setItemCount(itemID, count) {
        let item:any = this.getItemNodeByItem(itemID);
        let itemClass = item.getComponent(global.CommonClass.ItemIcon);
        itemClass.setNum(count);
    };

    getItemNodeByItem(itemID) {
        let ndView = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndItem = ndItems.getChildByName(itemID.toString());
        return ndItem;
    };

    setTitle(title) {
        let lblName = this.node.getChildByName('root').getChildByName('lblName');
        lblName.getComponent(cc.Label).string = title;
    };

    setAutoHide(isAuto) {
        this.autoHide = isAuto;
    };

    setDragBeginCall(callBack) {
        this.dragBeginCall = callBack;
    };

    setDragEndCall(callBack) {
        this.dragEndCall = callBack;
    };

    setShowEndCall(callBack) {
        this.showEndCall = callBack;
    };

    setDragEventCall(callBack) {
        this.dragEventCall = callBack;
    };

    setItemData(itemType, condition) {
        this.itemType = itemType;
        if (itemType!=3) {
            this.items = global.Manager.DBManager.getItemDataByType(this.itemType);
        }else{
            this.items = global.Manager.DBManager.getData('Sysitem');  
        }
        this.items = global.CommonClass.Functions.filterItemData(this.items, condition);
     
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        global.CommonClass.Functions.sort(this.items, function (lhs, rhs) {
            
            if (taskdata && taskdata.taskId == 10002 && taskdata.state == 1)
                if (lhs.ID == 500402 || lhs.ID == 500403 || lhs.ID == 500404)
                    return true;
            if (lhs.isRare > rhs.isRare) {
                return true;
            }
            else if ((lhs.isRare == rhs.isRare) && lhs.color < rhs.color) {
                return true;
            }
            else if ((lhs.isRare == rhs.isRare) && lhs.color == rhs.color) {
                return lhs.ID < rhs.ID;
            } else {
                return lhs.ID < rhs.ID;
            }
           
        });
    };
    enableTouch(isEnable) {
        
        
        if (isEnable) {
            this.node.opacity = 255;
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
        else {
            this.node.opacity = 0;
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
    };

    scrollToItem(itemID) {
        let scale = this.ndTemplateItem.scale;
        let siezHeight = this.ndTemplateItem.getContentSize().height * scale;

        let index = 0;
        for (let key in this.items) {
            ++index;
            let item = this.items[key];

            if (itemID == item.ID) {
                let offset = siezHeight * index + this.itemSpace * index;

                let itemScroll = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
                let scrollView = itemScroll.getComponent(cc.ScrollView);
                scrollView.scrollToOffset(cc.v2(0, offset));

                return index;
            }
        }

        return -1;
    };

    show(isShow, isQuickShow) {
        let self = this;
        let ndView = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        if (isShow) {
            self.setGuide(2);
            let runEnd = function () {
                self.setGuide(1);
                if (self.showEndCall)
                    self.showEndCall(isShow);
            }
            if (this.roomType == 1) {//宝物
                this.ToggleNode.active = true;
            }else{
                this.ToggleNode.active = false;
            }
            // if (this.timedata[this.roomType]) {
            //     ndItems.y = this.timedata[this.roomType];
            // }else{
            //     this.timedata[this.roomType] = 0;
            // }
            let time = 0.5;
            if (isQuickShow)
                time = 0.00001;

            let endFunction = cc.callFunc(runEnd);
            let moveTo = cc.moveTo(time, this.showtPosition);
            let seq = cc.sequence(moveTo, endFunction);

            this.rootNode.stopAllActions();
            this.rootNode.runAction(seq);

            this.enableTouch(true);
        }
        else {

            // this.timedata[this.roomType] = ndItems.y;

            self.setGuide(2);
            this.ToggleNode.active = false;
            let moveTo = cc.moveTo(0, this.hidePosition);
            this.rootNode.stopAllActions();
            let runEnd = function () {
                self.enableTouch(false);

                if (self.showEndCall)
                    self.showEndCall(isShow);
            };

            let endFunction = cc.callFunc(runEnd);
            let seq = cc.sequence(moveTo, endFunction);

            this.rootNode.runAction(seq);
        }

        this.isShow = isShow;

        this.node.stopAllActions();
    };

    createDrop(offset, callBack) {
        if (offset == null)
            offset = cc.v2(0, 0);

        let dropPos = this.ndDragItem.getPosition();
        let position = cc.v2(dropPos.x + offset.x, dropPos.y + offset.y);
        let ndDrop = this.node.getChildByName('ndDrop');

        let itemID = this.ndDragItem.tagEx;
        let newItem = cc.instantiate(this.spDropItem);
        global.CommonClass.Functions.setItemTexture(newItem, itemID,null);

        newItem.setPosition(position);
        ndDrop.addChild(newItem);
        newItem.active = true;

        let moveTo = cc.moveTo(1, dropPos);
        let fadeIn = cc.fadeTo(0.8, 100);
        let spawn = cc.spawn(moveTo, fadeIn);
        let endFun = function () {
            let position = ndDrop.convertToWorldSpaceAR(dropPos);
            if (callBack)
                callBack(position);
            newItem.removeFromParent();
        };

        let endFunction = cc.callFunc(endFun);
        let seq = cc.sequence(spawn, endFunction);

        newItem.stopAllActions();
        newItem.runAction(seq);
    };
    touchEvent(event) {
        let itemID = this.ndDragItem.tagEx;
        let touchPoint = event.getLocation();

        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
            this.show(false,null);
        
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distance = touchPoint.sub(this.touchStart).mag();
            if (distance > 5) {
                this.isMoved = true;
                this.show(false,null);
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_END) {
            if (this.autoHide) {
                global.Instance.Log.debug('','关闭')
                this.show(false,null);
            }
            this.ndDragItem.tagEx = -1;
        }
    };

    getPickItem(touchPoint) {
        let itemScroll = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let ndView = itemScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let children = ndItems.children;
        for (let key in children) {
            let ndItem = children[key];
            let spItem = ndItem;
            let box = spItem.getBoundingBoxToWorld();
            if (box.contains(touchPoint)) {
                this.getpickItemData(ndItem);
                return ndItem;
            }
        }

        return null;
    };
    getpickItemData(ndItem){
        let uiPreciousRoom = global.Manager.UIManager.get("UIPreciousRoom")
      
        let itemClass = ndItem.getComponent(global.CommonClass.ItemIcon);
        let itemID = itemClass.getItemID();
        var data = {
            'direction':0,//方向0上下1左右
            'num':0,//拼接数量
            'templateID': itemID,//物品id
            'index':0,
        }
        switch (itemID) {
            case 500020001:
                data.direction = 1;
                data.num = 4;
                if (uiPreciousRoom != null)
                    uiPreciousRoom.dismodehandle(true)
                break;
            case 500020002:
                data.direction = 0;
                data.num = 2;
                if (uiPreciousRoom != null)
                    uiPreciousRoom.dismodehandle(true)
                break;
            default:
                data.direction = 1;
                data.num = 1;
                data.index = global.Module.PreciousRoomData.getFreeIndex(global.Module.PreciousRoomData.getCurType());
                break;
        }
        this.pickItemData = data;
    };

    touchScrollEvent(event) {
        let touchPoint = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
           
            this.touchStart = touchPoint;
            this.lastTouchPos = touchPoint;

            this.moveDis = cc.v2(0, 0);

            this.pickItem = this.getPickItem(touchPoint);
            if (this.pickItem != null) {
                this.pickItem.scale =1.2;

                let taskdata = global.Module.TaskData.getHasAcceptTaskData();
                if (taskdata && taskdata.taskId == 10002 && taskdata.state == 1) {
                    let ID = this.pickItemData.templateID;
                    if (ID == 500402 || ID == 500403 || ID == 500404) {
                        this.pickItem.getChildByName('help').active = false;
                    }else{
                        this.pickItem.scale =1;
                        this.pickItem = null;  
                        this.pickItemData ==null;
                        global.CommonClass.UITip.showTipTxt('请上展示指定宝物', global.Enum.TipType.TIP_BAD);
                    }
                }
            }
            
          
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if(this.pickItem)
            this.pickItem.scale = 1;
            if (this.isDargItem&&this.touchStart) {
                this.ndDragItem.active = false;
                this.isDargItem = false;
                this.show(false,null);

                let itemScroll = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
                let scrollView = itemScroll.getComponent(cc.ScrollView);
                scrollView.enabled = true;
             

                if (this.dragEndCall) {
                    let distance = touchPoint.sub(this.touchStart).mag();
                    if (distance > 50) {
                        let contentSize = this.ndDragItem.getContentSize();
                        touchPoint.y -= contentSize.height / 2;

                        this.dragEndCall(this.pickItemData, touchPoint,);
                    }
                }

                this.touchStart = null;
            }
            this.node.stopAllActions();
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            if (!this.touchStart)
                return;
            let touchPoint = event.getLocation();
            let distance = touchPoint.sub(this.touchStart).mag();
            if (distance > 5) {
                this.isMoved = true;
            }
            if (this.pickItem) {
                this.moveDis.x += Math.abs(touchPoint.x - this.lastTouchPos.x);
                this.moveDis.y += Math.abs(touchPoint.y - this.lastTouchPos.y);

                if (this.moveDis.x > this.moveDis.y && this.moveDis.x > 4) {
                    this.isDargItem = true;

                    let itemClass = this.pickItem.getComponent(global.CommonClass.ItemIcon);
                    let itemId = itemClass.getItemID();
                    if (itemId > 0) {
                        this.onItemClick(itemClass, touchPoint);
                        this.setGuide(2);
                        if (this.dragBeginCall)
                            this.dragBeginCall(this.pickItemData, touchPoint, this.ndDragItem);
                    }

                }
            }
            if (this.isDargItem) {
                let position = this.node.convertToNodeSpaceAR(touchPoint);
                let contentSize = this.ndDragItem.getContentSize();
                position.y -= contentSize.height / 2;
              
                this.ndDragItem.setPosition(position);
            }

            this.lastTouchPos = touchPoint;
        }

        if (this.dragEventCall)
            this.dragEventCall(event);

    };
    tween(helpNode,nodeNode){
        var animation = helpNode.getChildByName('shou1').getComponent(cc.Animation);
        var position = global.Manager.UIManager.coortrans(nodeNode, helpNode.parent);
        cc.tween(helpNode)
            .call(() => {
                helpNode.active = true;
                animation.play('anxia2');
                helpNode.setPosition(16, -11, 0);
            })
            .delay(0.5)
            .to(1.3, { position: position })
            .call(() => {
                this.tween(helpNode,nodeNode)
            })
            .start()   
    }
    onItemClick(itemClass, touchPoint) {
        let itemScroll = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        scrollView.enabled = false;

        let itemID = itemClass.getItemID();
        let dragClass = null;
        if (this.roomType == 1||this.roomType == 3)
            dragClass = this.ndDragItem.getComponent(global.CommonClass.PreciousItem);
        else
            dragClass = this.ndDragItem.getComponent(global.CommonClass.SpecimenItem);

        dragClass.setItem(this.pickItemData);

        let position = this.node.convertToNodeSpaceAR(touchPoint);
        this.ndDragItem.setPosition(position);

        this.ndDragItem.tagEx = itemID;
        this.ndDragItem.active = true;
    };

    btnHide() {
        this.show(false,null);
    };

    btnShow() {
        let uiPreciousRoom = global.Manager.UIManager.get("UIPreciousRoom")
        if (uiPreciousRoom != null) {
            if (uiPreciousRoom.selfLayer != null && uiPreciousRoom.selfLayer.scale < 0.85) {
                uiPreciousRoom.selfLayer.scale = 0.85;
                uiPreciousRoom.spMask.active = true;
            }
        }
       
        this.show(true,null);
    };
    btnSelPage(event, arg)
    {
        let pageIdx = parseInt(arg);
        let ID = global.Module.MainPlayerData.getRoleID();
        let data = {};
        let uiSpecimenRoom = global.Manager.UIManager.get('UISpecimenRoom');
      
        switch (pageIdx) {
            case 1:
                // if (uiSpecimenRoom)
                // uiSpecimenRoom.btnReturn();
                 data = { roleId: ID, type: 1 };
                global.Instance.MsgPools.send('showTable', data, function (msg) {
                    global.Manager.UIManager.open('UIFishRoom',null,null);
                });
                break;
            case 2:
                break;
            case 3:
                // if (uiSpecimenRoom)
                // uiSpecimenRoom.btnReturn();
                global.Manager.UIManager.open('UIAnimalPools',null,null);
                break;
            default:
                break;
        }
      
    };

    update(dt) {
        this.timeDelay -= 1;

        if (this.timeDelay < 0&& this.isUpdata) {
            this.timeDelay = 1;
            let itemSpace = this.itemSpace;
            let scale = this.ndTemplateItem.scale;
            let siezHeight = this.ndTemplateItem.getContentSize().height * scale;
            let ndView = this.rootNode.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
            let ndItems = ndView.getChildByName('content');

            if(this.items[this.key]){
                let ID = this.items[this.key].ID;
                let item:any = cc.instantiate(this.ndTemplateItem);
                ndItems.addChild(item);
                item.active = true;
                item.setPosition(cc.v2(this.itemPosX, this.itemPosY));
    
                let itemCount = global.Module.PackageData.getItemCount(ID);
                let itemClass = item.getComponent(global.CommonClass.ItemIcon);
                itemClass.setItem(ID, itemCount);
                if(ID == 500402||ID == 500403||ID == 500404){
                    let taskdata = global.Module.TaskData.getHasAcceptTaskData();
                    if (taskdata && taskdata.taskId == 10002 && taskdata.state == 1) {
                        let uiPreciousRoom = global.Manager.UIManager.get("UIPreciousRoom")
                        if (uiPreciousRoom != null) {
                            this.scheduleOnce(function () {
                                item.getChildByName('help').active = true;
                                let nodeNode = uiPreciousRoom.getHelpNode();
                                this.tween(item.getChildByName('help'), nodeNode)
                            }, 1)
                        }
                    }
                }
                let data = global.Manager.DBManager.findData('Sysitem', 'ID', ID);
                if (data) {
                    item.getChildByName('lblNumber').active =  false;
                }
                this.itemPosY -= (siezHeight + itemSpace);
                this.key++;
            }else{
                this.isUpdata = false;
                this.timeDelay = -1;
            }      
        }
    };
}
