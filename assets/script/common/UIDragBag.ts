
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIDragBag extends cc.Component {
    itemSpace: number;
    root: any;
    showtPosition: any;
    hidePosition: any;
    ndTemplateItem: any;
    touchStart: any;
    isDragItem: boolean;
    ndDragItem: any;
    isShow: boolean;
    isShowPopBtn: boolean;
    curPage: number;
    selectCell: any;
    isInGrow: boolean;
    canDragItem: boolean;
    isMoved: boolean;
    curSelItem: any;
    showType: number;
    items: any[];
    itemType: any;
    isDargItem: any;
    autoHide: any;
    dragEndCall: any;
    showEndCall: any;
    dragEventCall: any;
    constructor() {
        super();
        this.itemSpace = 18;

        this.root = null;
        this.showtPosition = null;
        this.hidePosition = null;
        this.ndTemplateItem = null;
        this.touchStart = null;

        this.isDragItem = false;
        this.ndDragItem = null;

        this.isShow = false;
        this.isShowPopBtn = true;

        this.curPage = 1;
        this.selectCell = null;
        this.isInGrow = false;
        this.canDragItem = false;
        this.isMoved = false;

        this.curSelItem = null;

        this.showType = 0;

        this.items = new Array();
    };

    start() {

    };

    onLoad() {
        this.root = this.node.getChildByName('root');

        this.ndDragItem = this.node.getChildByName('ndDragItem');
        this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        this.ndTemplateItem.active = false;

        let sizeW = this.root.getContentSize().width;
        this.hidePosition = cc.v2(this.root.getPosition());
        let withX = global.Manager.Sdk.sizeMath();
        this.showtPosition = cc.v2(this.root.getPosition());
        this.showtPosition.x += sizeW + withX;
    };

    onEnable() {
        global.Manager.UIManager.add('UIDragBag', this);

        this.ndDragItem.active = false;

        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

    };

    onDisable() {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

        this.enableTouch(false);
        global.Manager.UIManager.remove('UIDragBag');
    };

    getIsShow() {
        return this.isShow;
    };

    showItems(itemType, condition) {
        this.setItemData(itemType, condition);

        let itemSpace = this.itemSpace;
        let exSize = 50;

        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let itemNum = this.items.length;
        let scale = this.ndTemplateItem.scale;

        let sizeWidth = ndItems.getContentSize().width;
        let sizeHeight = this.ndTemplateItem.getContentSize().height * scale;
        ndItems.setContentSize(sizeWidth, sizeHeight * itemNum + (itemSpace - 1) * itemNum + exSize);
        ndItems.removeAllChildren();

        let itemPosY = -sizeHeight / 2 - exSize;
        let itemPosX = sizeWidth / 2;
        let count = 0;
        for (let key in this.items) {
            let ID = this.items[key].ID;

            let item = cc.instantiate(this.ndTemplateItem);
            ndItems.addChild(item);

            this.showItemSelect(item, count == 0);
            if (count == 0)
                this.curSelItem = item;

            item.active = true;
            item.setPosition(cc.v2(itemPosX, itemPosY));
            item.tagEx = ID;

            this.refalshItem(ID);

            itemPosY -= (sizeHeight + itemSpace);

            ++count;
        }
    };

    refalshItem(ID) {
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let item = global.CommonClass.Functions.getChildTagEx(ndItems,ID);
        if (item != null) {
            let itemData = global.Manager.DBManager.getItemNew(ID);
            let itemCount = global.Module.PackageData.getItemCount(ID);
            let lblCur = item.getChildByName('lblCur').getComponent(cc.Label);
            lblCur.node.active = (itemData.warehouseType < 100);
            lblCur.string = itemCount.toString();
            let spItem = item.getChildByName('spItem');
            global.CommonClass.Functions.setItemTexture(spItem, ID, function (msg) {
                let errText = global.Module.FarmParkData.getCanGrowInfo(ID, this.selectCell);
                this.setGray(item, errText != null);
            }.bind(this));

            let lblName = item.getChildByName('lblName').getComponent(cc.Label);
            lblName.string = itemData.name;

            let lblMoney = item.getChildByName('lblMoney').getComponent(cc.Label);
            lblMoney.node.active = (itemData.warehouseType == 100);
            // let helpNode = item.getChildByName('help');
            // if(helpNode){
            //    this.reflashHelp(helpNode,ID); 
            // }
        }
    };
    reflashHelp(helpNode,ID) {
        helpNode.stopAllActions();
        helpNode.active = false;
           
        var data = global.Module.TaskData.getHasAcceptTaskData();
        
        if (!data)
            return;
        if (data.taskId == '10021' && ID == '230020001') {
            if (data.state == 1)
            {
                let farmParkMap = global.Instance.Dynamics["FarmParkMap"];
                if ( farmParkMap != null) {
                  
                    helpNode.active = true;
                    let nodeNode = farmParkMap.getTouchCell();
                    this.tween(helpNode,nodeNode.node)
                }
                
            }
                
                    
        }
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
            .to(1.6, { position: position })
            .call(() => {
                this.tween(helpNode,nodeNode)
            })
            .start()   
    }
    getItemNodeByItem(itemID) {
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndItem = ndItems.getChildByName(itemID.toString());
      
        return ndItem;
    };
    setItemData(itemType, condition) {
        this.itemType = itemType;
        this.items = [];
        if (itemType == global.Enum.ParkBagType.PARKBAG_FISH) {
            let plantData = global.Manager.DBManager.getData('PoolFishs');
            for (let key in plantData) {
                let plantItem = plantData[key];
                let plantItemdata = global.Manager.DBManager.findData('Items', 'ID', plantItem.ID);
                if (plantItemdata != null)
                    this.items.push(plantItemdata);
            }
        }
    };
    setGray(ndItem, bGray) {
        let spItem = ndItem.getChildByName('spItem').getComponent(cc.Sprite);
        let spDirect = ndItem.getChildByName('spDirect').getComponent(cc.Sprite);
        global.CommonClass.Functions.grayTexture(spItem, bGray);
        global.CommonClass.Functions.grayTexture(spDirect, bGray);
    };

    setShowPopBtn(isShow) {
        this.isShowPopBtn = isShow;
    };

    enableTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
    };


    /**
     * 打开侧边栏
     * @param {*} type 
     * @param {*} isShow 
     * @param {*} selectCell 
     */
    showQuick(type, isShow, selectCell) {
        this.selectCell = selectCell;
        this.root.stopAllActions();
        if (isShow) {
            this.root.setPosition(this.showtPosition);
            this.enableTouch(true);
            
        } else {
            this.root.setPosition(this.hidePosition);
        }

        this.isShow = isShow;

        this.showItems(type, null);

        let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
        if (uiParkScene)
            uiParkScene.showHelp(!isShow);
    };
    /**
     * 打开侧边栏
     * @param {*} type 
     * @param {*} isShow 
     * @param {*} selectCell 
     * @param {*} callback 
     */
    show(type, isShow, selectCell, callback) {
        this.selectCell = selectCell;
        this.isShow = isShow;
        if (isShow) {
            this.showItems(type, null);
            let self = this;
            let runEnd = function () {
                if (callback)
                    callback(isShow);
                let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
                if (uiParkScene)
                    uiParkScene.showHelp(!isShow);
                var data = global.Module.TaskData.getHasAcceptTaskData();
                if (data) {
                    if (data.taskId == '10021' && data.state == 1) {
                        let farmParkMap = global.Instance.Dynamics["FarmParkMap"];
                        if (farmParkMap != null) {
                            let ndView = self.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
                            let ndItems = ndView.getChildByName('content');
                            let item = global.CommonClass.Functions.getChildTagEx(ndItems, 230020001);
                            let helpNode = item.getChildByName('help');
                            helpNode.active = true;
                            let nodeNode = farmParkMap.getTouchCell();
                            self.tween(helpNode, nodeNode.node)
                        }
                    }
                }
            }
            let endFunction = cc.callFunc(runEnd);
            let moveTo = cc.moveTo(0.5, this.showtPosition);
            let seq = cc.sequence(moveTo, endFunction);
            this.root.stopAllActions();
            this.root.runAction(seq);
            this.enableTouch(true);
        } else {
            let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
            let ndItems = ndView.getChildByName('content');
            let item = global.CommonClass.Functions.getChildTagEx(ndItems, 230020001);
            if(item){
                let helpNode = item.getChildByName('help');
                helpNode.active = false;
                helpNode.stopAllActions();
            }
         
            let moveTo = cc.moveTo(0.5, this.hidePosition);
            this.root.stopAllActions();
            let self = this;
            let runEnd = function () {
                if (callback)
                    callback(isShow);
                self.enableTouch(false);
                let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
                if (uiParkScene)
                    uiParkScene.showHelp(!isShow);
            };
            let endFunction = cc.callFunc(runEnd);
            let seq = cc.sequence(moveTo, endFunction);
            this.root.runAction(seq);
        }


    };
    //农场动植物种植放下
    touchEvent(event) {
        let itemID = this.ndDragItem.tagEx;
        if (event.type == cc.Node.EventType.TOUCH_START) {

        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

        } //|| event.type==cc.Node.EventType.TOUCH_CANCEL
        else if (event.type == cc.Node.EventType.TOUCH_END) {
            global.Instance.Log.debug('',"btnHide1");
            this.btnHide();

            let map = global.Module.FarmParkData.getMap();
            if (map)
                map.showSelectCell(false);

            this.ndDragItem.tagEx = -1;
        }

        if (itemID <= 0) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
            if (dragLayer != null)
                dragLayer.touchEvent(event);
        }
    };

    getClickItem(position) {
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let children = ndItems.getChildren();
        for (let key in children) {
            let ndItem = children[key];
            let box = ndItem.getBoundingBoxToWorld();

            if (box.contains(position)) {
                return ndItem;
            }
        }

        return null;
    };

    judgeIsDragItem(startPos, curPos) {
        let moveDis = curPos.sub(startPos);
        let rate = Math.abs(moveDis.x) / Math.abs(moveDis.y);
        if (rate > 0.5 && Math.abs(moveDis.x) > 4) {
            return this.getClickItem(startPos);
        }

        return null;
    };

    showItemSelect(ndItem, isShow) {
        let spDirect = ndItem.getChildByName('spDirect');
        spDirect.active = isShow;
    };

    touchScrollEvent(event) {
        let touchPoint = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
            this.canDragItem = false;
            this.isMoved = false;

            if (this.curSelItem != null)
                this.showItemSelect(this.curSelItem, false);

            this.curSelItem = this.getClickItem(touchPoint);
            if (this.curSelItem != null) {
                this.curSelItem.scale =1.2;
                this.showItemSelect(this.curSelItem, true);
                let helpNode = this.curSelItem.getChildByName('help');
                if(helpNode){
                    helpNode.active = false;
                    helpNode.stopAllActions();
                }
                

                let itemID = this.curSelItem.tagEx;
                let errText = global.Module.FarmParkData.getCanGrowInfo(itemID, this.selectCell);
                if (errText != null)
                    global.CommonClass.UITip.showTipTxt(errText, global.Enum.TipType.TIP_BAD);

                this.canDragItem = (errText == null);

                let delayEnd = function () {
                    // self.showTip(!self.isMoved, itemID, touchPoint);
                };

                let delayAction = cc.delayTime(1);
                let endFunction = cc.callFunc(delayEnd)
                let seq = cc.sequence(delayAction, endFunction);
                this.node.runAction(seq);
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touchPoint = event.getLocation();;
            let distance = touchPoint.sub(this.touchStart).mag();
            if (distance > 5) {
                this.isMoved = true;
            }
            if (this.isDargItem) {
                let position = this.node.convertToNodeSpaceAR(touchPoint);
                this.ndDragItem.setPosition(position);

                let map = global.Module.FarmParkData.getMap();

                if (!this.selectCell) {
                    map.changeTouchCells(touchPoint);
                    map.showFishCell(true);

                    if (this.isInGrow)      //连续播种状态
                    {
                        let itemID = this.ndDragItem.tagEx;
                        let pickCell = map.getTouchCell();
                        if (pickCell != null) {
                            let index = pickCell.getIndex();
                            if (global.Module.FarmParkData.getCanGrowInfo(itemID, pickCell) == null) {
                                if (global.Module.FarmParkData.pushOperatorIdx(index, global.Enum.FarmTypeOp.FARMOP_FINSH))
                                    map.growFishSeq(itemID, index, this.showType);
                            }
                        }
                    }
                }
                else        //准备播种模式
                {
                    let pickCell = map.getTouchCell();
                    if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, pickCell.node, 1, 1)) {
                        this.isInGrow = true;
                        this.selectCell = null;
                        global.Module.FarmParkData.cleartempOpQueue();
                    }
                }
            } else {
                if (this.canDragItem) {
                    let dragItem = this.judgeIsDragItem(this.touchStart, touchPoint);
                    this.isDargItem = (dragItem != null);

                    if (this.isDargItem) {
                        this.pickItem(dragItem, touchPoint);
                        let position = this.node.convertToNodeSpaceAR(touchPoint);
                        this.ndDragItem.setPosition(position);
                    }
                }
            }
        } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if(this.curSelItem)
            this.curSelItem.scale =1;
            if (this.isDargItem) {
                this.ndDragItem.active = false;
                this.isDargItem = false;

                let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
                let scrollView = itemScroll.getComponent(cc.ScrollView);
                scrollView.enabled = true;

                let map = global.Module.FarmParkData.getMap();
                let distance = touchPoint.sub(this.touchStart).mag();
                if (distance > 200) {
                    let itemID = this.ndDragItem.tagEx;
                    let item = global.Manager.DBManager.getItemNew(itemID);

                    if (item.parkItemType == 4) {
                        map.putNewRareAnimal(itemID, touchPoint);
                    } else if (item.parkItemType == 3) {
                        map.putNewAnimal(itemID, touchPoint);
                    }
                    map.showFishCell(false);
                }
                this.btnHide();
            }
            this.touchStart = null;
        }
        this.node.stopAllActions();
    };
    setAutoHide(isAuto) {
        this.autoHide = isAuto;
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
    pickItem(ndItem, touchPoint) {
        let itemID = ndItem.tagEx;

        if (this.showType == global.Enum.ParkBagType.PARKBAG_PLANT) {
            let errText = global.Module.FarmParkData.getCanGrowInfo(itemID, this.selectCell);
            if (errText != null) {
                return false;
            }
        } else if (this.showType == global.Enum.ParkBagType.PARKBAG_ANIMAL) {
            let itemCount = global.Module.PackageData.getItemCount(itemID);
            if (itemCount < 1) {
                return false;
            }
        }
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        scrollView.enabled = false;

        let spItem = this.ndDragItem.getChildByName('spItem');
        let picPath = global.CommonClass.Functions.getItemPicPathNew(itemID);
        global.CommonClass.Functions.setTexture(spItem, picPath, null);

        let position = this.node.convertToNodeSpaceAR(touchPoint);
        this.ndDragItem.setPosition(position);

        this.ndDragItem.tagEx = itemID;
        this.ndDragItem.active = true;

        return true;
    };

    btnHide() {
        this.show(this.showType, false, null, null);
    };

    btnShow() {
        this.show(global.Enum.ParkBagType.PARKBAG_ANIMAL, true, null, null);
    };


    // update (dt) {}
}
