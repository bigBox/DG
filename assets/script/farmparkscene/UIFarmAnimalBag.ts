

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIFarmAnimalBag extends cc.Component {
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "任务提示箭头" })
    helpNode:  cc.Node = null;
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
    isDargItem: any;
    constructor(){
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
    onLoad () {
        this.root = this.node.getChildByName('root');

        this.ndDragItem = this.node.getChildByName('ndDragItem');
        this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        this.ndTemplateItem.active = false;

        let sizeW = this.root.getContentSize().width;
        this.hidePosition = cc.v2(this.root.getPosition());

        this.showtPosition = cc.v2(this.root.getPosition());
        this.showtPosition.x += sizeW;
    };

    start () {

    };
    onEnable() {
        global.Manager.UIManager.add('UIFarmAnimalBag', this);

        this.ndDragItem.active = false;

        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

        this.setData();
    };
    setData(){
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.taskId == 10011 && data.state == 1)
            this.helpNode.active = true;
   };

    onDisable() {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

        this.enableTouch(false);
        global.Manager.UIManager.remove('UIFarmAnimalBag');
    };

    getIsShow() {
        return this.isShow;
    };

    showItems(type) {
        this.showType = type;
        this.setItemData(type);

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
        let itemPosX = sizeWidth / 2-20;
       
        let count = 0;
        for (let key in this.items) {
            let ID = this.items[key].ID;

            let item = cc.instantiate(this.ndTemplateItem);
            ndItems.addChild(item);
            global.Instance.Log.debug('showItems',this.items[key])
           
            this.showItemSelect(item, count == 0);
            if (count == 0)
                this.curSelItem = item;
            let data = global.Module.TaskData.getHasAcceptTaskData();
            item.getChildByName('help').active = (ID == '260030005' && data && data.taskId == 10011 && data.state == 1);
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
        let ndItems:cc.Node = ndView.getChildByName('content');
        
        let item = global.CommonClass.Functions.getChildTagEx(ndItems,ID);

        if (item != null) {
            let parkData = null;
            if (this.showType == global.Enum.ParkBagType.PARKBAG_PLANT)
                parkData = global.Module.FarmParkData.farmData(ID);
            else if (this.showType == global.Enum.ParkBagType.PARKBAG_ANIMAL)
                parkData = global.Manager.DBManager.findData('FarmParkAnimal', 'ID', ID);
            

            let itemData = global.Manager.DBManager.getItemNew(ID);

            let itemCount = global.Module.PackageData.getItemCount(ID);
            let lblCur = item.getChildByName('lblCur').getComponent(cc.Label);
            lblCur.node.active = (itemData.warehouseType < 100);

            let lblNeed = item.getChildByName('lblNeed').getComponent(cc.Label);
            // lblNeed.node.active = (itemData.warehouseType<100);

            let itemNeed = 1;

            if (itemData.warehouseType < 100) {
                lblCur.string = itemCount.toString();
                if (parseInt(itemCount) < itemNeed)
                    lblCur.node.color = cc.color(255, 0, 0, 255);
                else
                    lblCur.node.color = cc.color(0, 255, 0, 255);

                lblNeed.string = '/' + itemNeed.toString();
            }
            let self = this;
            let spItem = item.getChildByName('spItem');
            global.CommonClass.Functions.setItemTexture(spItem, ID, function () {
                let errText = global.Module.FarmParkData.getCanGrowInfo(ID, self.selectCell);
                self.setGray(item, errText != null);
            });

            let lblName = item.getChildByName('lblName').getComponent(cc.Label);
            lblName.string = itemData.name;

            let lblMoney = item.getChildByName('lblMoney').getComponent(cc.Label);
            lblMoney.node.active = (itemData.warehouseType == 100);
            

           
        }

    };
    setItemNodeNum(itemID){
        let itemNeed = 1;
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems:cc.Node = ndView.getChildByName('content');
        let item = global.CommonClass.Functions.getChildTagEx(ndItems,itemID);
        let lblCur = item.getChildByName('lblCur').getComponent(cc.Label);
        let itemData = global.Manager.DBManager.getItemNew(itemID);
        let itemCount =  parseInt(lblCur.string)-1
        if (itemData.warehouseType < 100) {
            lblCur.string = itemCount.toString();
            // if (itemCount < itemNeed)
            //     lblCur.node.color = cc.color(255, 0, 0, 255);
            // else
            //     lblCur.node.color = cc.color(255, 255, 255, 255);

        }
    }


    getItemNodeByItem(itemID) {
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndItem = ndItems.getChildByName(itemID.toString());
        return ndItem;
    };

    setItemData(showType) {
        this.showType = showType;

        this.items = [];
        if (showType == global.Enum.ParkBagType.PARKBAG_PLANT) {
            let plantData = global.Manager.DBManager.getData('FarmParkPlant');
            for (let key in plantData) {
                let plantItem = plantData[key];
                let plantItemdata = global.Manager.DBManager.findData('Items', 'ID', plantItem.ID);
                if (plantItemdata != null)
                    this.items.push(plantItemdata);
            }
        }
        else if (showType == global.Enum.ParkBagType.PARKBAG_ANIMAL) {
            let animalData = global.Manager.DBManager.getData('FarmParkAnimal');
            for (let key in animalData) {
                let animalItem = animalData[key];
                if (!animalItem.uncommon) {
                    let animalItemData = global.Manager.DBManager.findData('Items', 'ID', animalItem.ID);
                    if (animalItemData != null)
                        this.items.push(animalItemData);
                }
            }
        }
        else if (showType == global.Enum.ParkBagType.PARKBAG_RARE_ANIMAL) {
            let rareAnimalData = global.Manager.DBManager.getData('FarmZooAnimal');
            for (let key in rareAnimalData) {
                let rareAnimalItem = rareAnimalData[key];
                if (rareAnimalItem.uncommon) {
                    let rareAnimalItemData = global.Manager.DBManager.findData('Items', 'ID', rareAnimalItem.ID);
                    if (rareAnimalItemData != null)
                        this.items.push(rareAnimalItemData);
                }
            }
        }

        if (this.showType == global.Enum.ParkBagType.PARKBAG_PLANT) {
            global.CommonClass.Functions.sort(this.items, function (lhs, rhs) {
                let lhsData = global.Module.FarmParkData.farmData(lhs.ID);
                let rhsData = global.Module.FarmParkData.farmData(rhs.ID);

                return lhsData.needGreen < rhsData.needGreen;
            });
        }

    };

    setGray(ndItem, bGray) {
        let spItem = ndItem.getChildByName('spItem').getComponent(cc.Sprite);
        let spDirect = ndItem.getChildByName('spDirect').getComponent(cc.Sprite);
        let lblMoney = ndItem.getChildByName('lblMoney');
        let lblCur = ndItem.getChildByName('lblCur');

        global.CommonClass.Functions.grayTexture(spItem, bGray);
        global.CommonClass.Functions.grayTexture(spDirect, bGray);

        if (bGray) {
            lblMoney.color = cc.color(144, 144, 144, 255);
            lblCur.color = cc.color(144, 144, 144, 255);
        }
        else {
            lblMoney.color = cc.color(255, 255, 255, 255);
            lblCur.color = cc.color(255, 255, 255, 255);
        }

    };

    setShowPopBtn(isShow) {
        this.isShowPopBtn = isShow;

        let btnShow = this.node.getChildByName('root').getChildByName('btnShow');
        btnShow.active = isShow;
    };

    enableTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
        else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
    };

    scrollToItem(itemID) {
        let scale = this.ndTemplateItem.scale;
        let sizeHeight = this.ndTemplateItem.getContentSize().height * scale;

        let index = 0;
        for (let key in this.items) {
            ++index;

            let item = this.items[key];

            if (itemID == item.ID) {
                let offset = sizeHeight * index + this.itemSpace * index;

                let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
                let scrollView = itemScroll.getComponent(cc.ScrollView);
                scrollView.scrollToOffset(cc.v2(0, offset));

                return index;
            }
        }

        return -1;
    };

    showQuick(type, isShow, selectCell) {
        this.selectCell = selectCell;

        this.root.stopAllActions();
        if (isShow) {
            let btnShow = this.root.getChildByName('btnShow');
            btnShow.active = false;

            this.root.setPosition(this.showtPosition);
            this.enableTouch(true);
        }
        else {
            this.root.setPosition(this.hidePosition);
            let btnShow = this.root.getChildByName('btnShow');
            btnShow.active = this.isShowPopBtn;
        }

        this.isShow = isShow;

        this.showItems(type);
    };

    show(type, isShow, selectCell, callback) {
        this.selectCell = selectCell;
        this.isShow = isShow;

        if (isShow) {
            let runEnd = function () {
                if (callback)
                    callback(isShow);
            }

            let endFunction = cc.callFunc(runEnd);
            let moveTo = cc.moveTo(0.5, this.showtPosition);
            let seq = cc.sequence(moveTo, endFunction);

            this.root.stopAllActions();
            this.root.runAction(seq);
            this.showItems(type);
            this.enableTouch(true);
        }
        else {
            // this.helpNode[1].active = false;
            let moveTo = cc.moveTo(0.5, this.hidePosition);
            this.root.stopAllActions();

            let self = this;
            let runEnd = function () {
                let ndView = self.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
                let ndItems = ndView.getChildByName('content');
                ndItems.removeAllChildren();

                if (callback)
                    callback(isShow);

                self.enableTouch(false);
            };

            let endFunction = cc.callFunc(runEnd);
            let seq = cc.sequence(moveTo, endFunction);

            this.root.runAction(seq);
        }
    };

    touchEvent(event) {
        let itemID = this.ndDragItem.tagEx;

        if (event.type == cc.Node.EventType.TOUCH_START) {

        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

        }//|| event.type == cc.Node.EventType.TOUCH_CANCEL
        else if (event.type == cc.Node.EventType.TOUCH_END ) {
            this.btnHide();

            let map = global.Module.FarmParkData.getMap();
            if (map)
            map.showSelectCell(false);

            this.ndDragItem.tagEx = (-1);
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
        var data = global.Module.TaskData.getHasAcceptTaskData();


        let spDirect = ndItem.getChildByName('spDirect');
        spDirect.active = isShow && !(data && data.taskId == 10011 && data.state == 1);
        if (isShow == false)
            ndItem.getChildByName('help').active = false;
    };

    touchScrollEvent(event) {
        // this.helpNode[1].active = false;
        let touchPoint = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
            this.canDragItem = false;
            this.isMoved = false;

            if (this.curSelItem != null)
                this.showItemSelect(this.curSelItem, false);

            this.curSelItem = this.getClickItem(touchPoint);

            let helpNode = this.curSelItem.getChildByName('help')
            if (helpNode)
                helpNode.active = false;
            if (this.curSelItem != null) {
                this.showItemSelect(this.curSelItem, true);
                this.curSelItem.scale =1.2;
                let itemID = this.curSelItem.tagEx;
                let errText = global.Module.FarmParkData.getCanGrowInfo(itemID, this.selectCell);
                if (errText != null)
                    global.CommonClass.UITip.showTipTxt(errText, global.Enum.TipType.TIP_BAD);

                this.canDragItem = (errText == null);

                
                let delayEnd = function () {
                   
                };

                let delayAction = cc.delayTime(1);
                let endFunction = cc.callFunc(delayEnd)
                let seq = cc.sequence(delayAction, endFunction);
                this.node.runAction(seq);
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touchPoint = event.getLocation();
            let distance =  touchPoint.sub(this.touchStart).mag();
            if (distance > 5) {
                this.isMoved = true;
            }
            let map = global.Module.FarmParkData.getMap();
            if (this.isDargItem && map) {
                let position = this.node.convertToNodeSpaceAR(touchPoint);
                this.ndDragItem.setPosition(position);



                if (!this.selectCell) {
                    map.changeTouchCell(touchPoint);
                    map.showSelectCell(true);

                    if (this.isInGrow)      //连续播种状态
                    {
                        let itemID = this.ndDragItem.tagEx;
                        let pickCell = map.getTouchCell();
                        if (pickCell != null) {
                            let index = pickCell.getIndex();
                            if (global.Module.FarmParkData.getCanGrowInfo(itemID, pickCell) == null) {
                                if (global.Module.FarmParkData.pushOperatorIdx(index, global.Enum.FarmTypeOp.FARMOP_GROW))
                                    map.growPlantSeq(itemID, index);
                            }
                        }
                    }
                } else {     //准备播种模式

                    let pickCell = map.getTouchCell();
                    if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, pickCell.node, 1, 1)) {
                        this.isInGrow = true;
                        this.selectCell = null;
                        global.Module.FarmParkData.cleartempOpQueue();
                    }
                }
            }
            else {
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
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
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

                        let uiAnimalPools = global.Manager.UIManager.get('UIAnimalPools');
                        if(uiAnimalPools != null) {
                            uiAnimalPools.putNewRareAnimal(itemID, touchPoint);
                        }
                    }
                    else if (item.parkItemType == 3) {
                        map.putNewAnimal(itemID, touchPoint);
                    }
                }
            }

            this.touchStart = null;
        }
        this.node.stopAllActions();
    };

    pickItem(ndItem, touchPoint) {
        let itemID = ndItem.tagEx;

        //let map = global.Module.FarmParkData.getMap();
        if (this.showType == global.Enum.ParkBagType.PARKBAG_PLANT) {
            let errText = global.Module.FarmParkData.getCanGrowInfo(itemID, this.selectCell);
            if (errText != null) {
                // global.CommonClass.UITip.showTipTxt(errText, global.Enum.TipType.TIP_BAD);
                return false;
            }
        }
        else if (this.showType == global.Enum.ParkBagType.PARKBAG_ANIMAL) {
            let itemCount = global.Module.PackageData.getItemCount(itemID);

            if (itemCount < 1) {
                // global.CommonClass.UITip.showTipTxt('物品数量不足', global.Enum.TipType.TIP_BAD);
                return false;
            }
        }

        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        scrollView.enabled = false;

        let spItem = this.ndDragItem.getChildByName('spItem');
        let picPath = global.CommonClass.Functions.getItemPicPathNew(itemID);
        global.CommonClass.Functions.setTexture(spItem, picPath,null);

        let position = this.node.convertToNodeSpaceAR(touchPoint);
        this.ndDragItem.setPosition(position);

        this.ndDragItem.tagEx = (itemID);
        this.ndDragItem.active = true;

        return true;
    };

    btnHide() {
        this.show(this.showType, false,null,null);
    };

    btnShow() {
        this.show(global.Enum.ParkBagType.PARKBAG_ANIMAL, true,null,null);
    };

    btnSelPage(event, arg) {
        let pageIdx = parseInt(arg);
        for (let i = 1; i <= 4; ++i) {
            let btnPage = this.root.getChildByName('ndItems').getChildByName('ndPages').getChildByName('btnPage' + i.toString());
            btnPage.getComponent(cc.Button).interactable = (pageIdx != i);

            if (pageIdx == i)
                btnPage.zIndex = (cc.macro.MAX_ZINDEX);
            else
                btnPage.zIndex = (-1);
        }

        this.curPage = pageIdx;
        this.showItems(this.curPage);

    };


    // update (dt) {}
}
