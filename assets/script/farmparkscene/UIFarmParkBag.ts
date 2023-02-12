//生态园左侧包裹
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIFarmParkBag extends cc.Component {
    @property({ type: cc.Toggle, displayName: "ToggleNode", tooltip: "ToggleNode" })
    ToggleNode: any = [];
    @property({ type: cc.Node, displayName: "ToggleContNode", tooltip: "ToggleContNode" })
    ToggleContNode: cc.Node = null;
    itemSpace: number;
    root: any;
    showtPosition: any;
    hidePosition: any;
    ndTemplateItem: any;
    ndTemplateItem1: any;
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
    isMovecell:boolean;
    constructor(){
        super();
        this.itemSpace  = 18;
        
        this.root            = null;
        this.showtPosition   = null;
        this.hidePosition    = null;
        this.ndTemplateItem  = null;
        this.ndTemplateItem1  = null;
        this.touchStart     = null;

        this.isDragItem     = false;
        this.ndDragItem     = null;

        this.isShow          = false;
        this.isShowPopBtn    = true;

        this.curPage         = 0;
        this.selectCell      = null;
        this.isInGrow        = false;
        this.canDragItem     = false;
        this.isMoved         = false;
        this.isMovecell = true;

        this.curSelItem      = null;

        this.showType        = 0;
        this.items       = new Array();
    };
    onLoad () {
        this.root = this.node.getChildByName('root');

        this.ndDragItem     = this.node.getChildByName('ndDragItem');
        this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        this.ndTemplateItem.active = false;
        this.ndTemplateItem1 = this.node.getChildByName('ndTemplateItem1');
        this.ndTemplateItem1.active = false;

        let sizeW =this.root.getContentSize().width;
        this.hidePosition = cc.v2(this.root.getPosition());
        let withX = global.Manager.Sdk.sizeMath();     
        this.showtPosition = cc.v2(this.root.getPosition());
        this.showtPosition.x += sizeW+withX;
    };

    start () {

    };
    onEnable() {
        global.Manager.UIManager.add('UIFarmParkBag', this);

        this.ndDragItem.active = false;

        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.on(cc.Node.EventType.TOUCH_MOVE,     this.touchScrollEvent, this);	
        itemScroll.on(cc.Node.EventType.TOUCH_END,      this.touchScrollEvent, this);	
        itemScroll.on(cc.Node.EventType.TOUCH_CANCEL,   this.touchScrollEvent, this);	
        itemScroll.on(cc.Node.EventType.TOUCH_START,    this.touchScrollEvent, this);

    };

    onDisable() {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.off(cc.Node.EventType.TOUCH_MOVE,    this.touchScrollEvent, this);	
        itemScroll.off(cc.Node.EventType.TOUCH_END,     this.touchScrollEvent, this);	
        itemScroll.off(cc.Node.EventType.TOUCH_CANCEL,  this.touchScrollEvent, this);	
        itemScroll.off(cc.Node.EventType.TOUCH_START,   this.touchScrollEvent, this);	

        this.enableTouch(false);
        global.Manager.UIManager.remove('UIFarmParkBag');
    };

    getIsShow() {
        return this.isShow;
    };

    showItems(type) {
        this.showType = type;
      

        this.setItemData(type);

        let itemSpace = this.itemSpace;
        let exSize    = 10;

        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndTempNode = this.ndTemplateItem
        if (global.Enum.ParkBagType.PARKBAG_PLANT == type ) {
            ndTempNode = this.ndTemplateItem1
        }

        let itemNum    =  this.items.length;
        let scale      =  ndTempNode.scale;

        let sizeWidth   = ndItems.getContentSize().width;
        let sizeHeight  = ndTempNode.getContentSize().height*scale;
        ndItems.setContentSize(sizeWidth, sizeHeight*itemNum+(itemSpace-1)*itemNum+exSize);
        ndItems.removeAllChildren();

        let itemPosY = -sizeHeight/2-exSize;
        let itemPosX = sizeWidth/2;
       
        let count = 0;
        for (let key in this.items) {
            let ID = this.items[key].ID;
            
            let item = cc.instantiate(ndTempNode);
            ndItems.addChild(item);

            this.showItemSelect(item, count==0);
            if (count==0)
                this.curSelItem = item;
    
            item.active = true;
            item.setPosition(cc.v2(itemPosX, itemPosY));
            item.tagEx = (ID);

            this.refalshItem(ID);

            itemPosY -= (sizeHeight+itemSpace);

            ++count;
        }
    };

    refalshItem(ID) {   
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let item =global.CommonClass.Functions.getChildTagEx(ndItems,ID);

        if (item != null) {
            let parkData  = null;
            
            if (this.showType == global.Enum.ParkBagType.PARKBAG_STRAW)
                parkData = global.Manager.DBManager.findData('FarmParkPlant', 'ID', ID);
            else if (this.showType == global.Enum.ParkBagType.PARKBAG_PLANT)
                parkData = global.Manager.DBManager.findData('FarmCulture', 'ID', ID);
            else if (this.showType == global.Enum.ParkBagType.PARKBAG_TREE)
                parkData = global.Manager.DBManager.findData('FarmParkTree', 'ID', ID);
            else if (this.showType == global.Enum.ParkBagType.PARKBAG_ANIMAL)
                parkData = global.Manager.DBManager.findData('FarmParkAnimal', 'ID', ID);
          
            let itemData  = global.Manager.DBManager.getItemNew(ID);

            let itemCount = global.Module.PackageData.getItemCount(ID);

            let spItem = item.getChildByName('spItem');
            let self = this;
            global.CommonClass.Functions.setItemTexture(spItem, ID, function () {
                let errText = global.Module.FarmParkData.getCanGrowInfo(ID, self.selectCell);
                self.setGray(item, errText != null);
            });
            let lblName = item.getChildByName('lblName').getComponent(cc.Label);
            lblName.string = itemData.name;


            let lblCur = item.getChildByName('lblCur').getComponent(cc.Label);
            if (lblCur) {
                lblCur.node.active = !(parkData.costGold != 0 && itemCount == 0);
                lblCur.string = itemCount.toString();//数量
            }

            let lblMoney = item.getChildByName('lblMoney').getComponent(cc.Label);
            if (lblMoney) {
                lblMoney.node.active = (parkData.costGold != 0 && itemCount == 0);
                lblMoney.string = parkData.costGold;
            }

            let goldNode = item.getChildByName('gold');
            if (goldNode)
                goldNode.active = (parkData.costGold != 0 && itemCount == 0);
         
            
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
            .to(1.3, { position: position })
            .call(() => {
                this.tween(helpNode,nodeNode)
            })
            .start()   
    }
    
    getItemNodeByItem(itemID)
    {
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndItem = ndItems.getChildByName(itemID.toString());
        return ndItem;
    };

    setItemData(showType) {
        this.showType = showType;

        this.items = [];


        if (showType==global.Enum.ParkBagType.PARKBAG_STRAW) {
            let plantData = global.Manager.DBManager.getData('FarmParkPlant');
            for (let key in plantData) {
                let plantItem = plantData[key];
                let plantItemdata = global.Manager.DBManager.findData('Items', 'ID', plantItem.ID);
                if (plantItemdata!=null)
                    this.items.push(plantItemdata);
            }
        }
        else if (showType==global.Enum.ParkBagType.PARKBAG_PLANT) {
            let plantData = global.Manager.DBManager.getData('FarmCulture');
            for (let key in plantData) {
                let plantItem = plantData[key];
                let plantItemdata = global.Manager.DBManager.findData('Items', 'ID', plantItem.ID);
                if (plantItemdata!=null)
                    this.items.push(plantItemdata);
            }
        }
        else if (showType==global.Enum.ParkBagType.PARKBAG_TREE) {
            let plantData = global.Manager.DBManager.getData('FarmParkTree');
            for (let key in plantData) {
                let plantItem = plantData[key];
                let plantItemdata = global.Manager.DBManager.findData('Items', 'ID', plantItem.ID);
                if (plantItemdata!=null)
                    this.items.push(plantItemdata);
            }
        }
        else if(showType==global.Enum.ParkBagType.PARKBAG_ANIMAL) {
            let animalData = global.Manager.DBManager.getData('FarmParkAnimal');
            for (let key in animalData) {
                let animalItem = animalData[key];
                if (!animalItem.uncommon) {
                    let animalItemData = global.Manager.DBManager.findData('Items', 'ID', animalItem.ID);
                    if (animalItemData!=null)
                        this.items.push(animalItemData);
                }
            }
        }
        else if(showType==global.Enum.ParkBagType.PARKBAG_RARE_ANIMAL) {
            let rareAnimalData = global.Manager.DBManager.getData('FarmZooAnimal');
            for (let key in rareAnimalData) {
                let rareAnimalItem = rareAnimalData[key];
                if (rareAnimalItem.uncommon) {
                    let rareAnimalItemData = global.Manager.DBManager.findData('Items', 'ID', rareAnimalItem.ID);
                    if (rareAnimalItemData!=null)
                        this.items.push(rareAnimalItemData);
                }
            }
        }

        if (this.showType == global.Enum.ParkBagType.PARKBAG_PLANT) {
            global.CommonClass.Functions.sort(this.items, function(lhs, rhs) {
                let lhsData = global.Manager.DBManager.findData('FarmCulture', 'ID', lhs.ID);
                let rhsData = global.Manager.DBManager.findData('FarmCulture', 'ID', rhs.ID);
                return lhsData.needGreen<rhsData.needGreen;
            });
        }
      
    };

    setGray(ndItem, bGray) {
        let spItem      =  ndItem.getChildByName('spItem').getComponent(cc.Sprite);
        let spDirect    =  ndItem.getChildByName('spDirect').getComponent(cc.Sprite);
        global.CommonClass.Functions.grayTexture(spItem, bGray);
        global.CommonClass.Functions.grayTexture(spDirect, bGray);
    };

    setShowPopBtn(isShow) {
        this.isShowPopBtn = isShow;
    };

    enableTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE,  this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_END,   this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE,  this.touchEvent, this);	
            this.node.off(cc.Node.EventType.TOUCH_END,   this.touchEvent, this);	
            this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.touchEvent, this);	
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
            this.ToggleNode[type].isChecked = true;
        } else {
            this.root.setPosition(this.hidePosition);
        }

        this.isShow = isShow;

        this.showItems(type);

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
        this.isMovecell = true; 
        // global.Module.FarmParkData.loadLocal();
        if(global.Enum.ParkBagType.PARKBAG_STRAW == type){
            this.ToggleContNode.active = true;
            type = global.Module.FarmParkData.getFarmParkID();
            this.ToggleNode[type].isChecked = true;
           
        }else if(global.Enum.ParkBagType.PARKBAG_ANIMAL == type){
            this.ToggleContNode.active = false;
        }
        this.selectCell = selectCell;
        this.isShow = isShow;
        if (isShow) {
            this.showItems(type);
            let self = this;
            let runEnd = function() {
                if (callback)
                    callback(isShow);
                let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
                if (uiParkScene)
                    uiParkScene.showHelp(!isShow);
                var data = global.Module.TaskData.getHasAcceptTaskData();
                if (data) {
                    if (data.taskId == '10018' && data.state == 1) {
                        let farmParkMap = global.Instance.Dynamics["FarmParkMap"];
                        if (farmParkMap != null) {
                            let ndView = self.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
                            let ndItems = ndView.getChildByName('content');
                            let item = global.CommonClass.Functions.getChildTagEx(ndItems, 220020001);
                            let helpNode = item.getChildByName('help');
                            helpNode.active = true;
                            let nodeNode = farmParkMap.getPrakNode();
                            self.tween(helpNode, nodeNode);
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
            let item = global.CommonClass.Functions.getChildTagEx(ndItems, 220020001);
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
    toggleClick (event,EnType) {
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && (taskdata.taskId == 10012||taskdata.taskId == 10013) && taskdata.state == 1) {
            global.CommonClass.UITip.showTipTxt('完成任务方可切换列表', global.Enum.TipType.TIP_BAD);
            return;
        }
        global.Module.FarmParkData.setFarmParkID(EnType);
        this.showItems(parseInt(EnType));
    };
    //农场动植物种植放下
    touchEvent(event) { 
        let itemID = this.ndDragItem.tagEx;
        if (event.type==cc.Node.EventType.TOUCH_START) {
            
        }
        else if (event.type==cc.Node.EventType.TOUCH_MOVE) {
           
        } //|| event.type==cc.Node.EventType.TOUCH_CANCEL
        else if(event.type==cc.Node.EventType.TOUCH_END) {
            global.Instance.Log.debug('touchEvent',"btnHide1");
            this.btnHide();

            let map = global.Module.FarmParkData.getMap();
            map.showSelectCell(false);

            this.ndDragItem.tagEx = (-1);
        }
        
        if (itemID <= 0) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
            if (dragLayer != null)
                dragLayer.touchEvent(event);
        }
    };

    getClickItem(position) {
        let ndView  = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let children = ndItems.getChildren();
        for (let key in children) {
            let ndItem = children[key];
            let box = ndItem.getBoundingBoxToWorld();
         
            if (box.contains(position)) {
                if (ndItem.getChildByName('help'))
                ndItem.getChildByName('help').active = false;
                return ndItem;
            }
        }

        return null;
    };

    judgeIsDragItem(startPos, curPos) {
        let moveDis =  curPos.sub(startPos);
        let rate = Math.abs(moveDis.x)/Math.abs(moveDis.y);
        if (rate>0.5 && Math.abs(moveDis.x)>4) {
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
        if (event.type==cc.Node.EventType.TOUCH_START) {
           this.touchStart  = touchPoint;
           this.canDragItem = false;
           this.isMoved     = false;

           if (this.curSelItem != null)
                this.showItemSelect(this.curSelItem, false);
        

       
           this.curSelItem = this.getClickItem(touchPoint);
           if (this.curSelItem != null) {
                this.showItemSelect(this.curSelItem, true);
                this.curSelItem.scale =1.2;
                let itemID  = this.curSelItem.tagEx;
                let errText =  global.Module.FarmParkData.getCanGrowInfo(itemID, this.selectCell);
                if (errText != null)
                    global.CommonClass.UITip.showTipTxt(errText, global.Enum.TipType.TIP_BAD);
            
                this.canDragItem = (errText==null);

                let delayEnd = function() {
                    // self.showTip(!self.isMoved, itemID, touchPoint);
                };

                let delayAction = cc.delayTime(1);
                let endFunction = cc.callFunc(delayEnd)
                let seq = cc.sequence(delayAction, endFunction);
                this.node.runAction(seq);
           }
        }
        else if(event.type==cc.Node.EventType.TOUCH_MOVE) {
            let touchPoint = event.getLocation();
            if (this.isDargItem) {
                let position = this.node.convertToNodeSpaceAR(touchPoint);
                this.ndDragItem.setPosition(position);
                if (this.curSelItem && this.curSelItem.getChildByName('help')) {
                    this.curSelItem.getChildByName('help').active = false;
                }
                
                let map = global.Module.FarmParkData.getMap();
                if (!this.selectCell) {
                    map.changeTouchCell(touchPoint);
                    map.showSelectCell(true);

                    if (this.isInGrow)      //连续播种状态
                    {
                        let itemID = this.ndDragItem.tagEx;
                        let pickCell = map.getTouchCell();
                        let isShow = false;
                        if (pickCell != null) {
                            let index = pickCell.getIndex();
                            if ( global.Module.FarmParkData.getCanGrowInfo(itemID, pickCell)==null) {
                                if (global.Module.FarmParkData.pushOperatorIdx(index, global.Enum.FarmTypeOp.FARMOP_GROW)){
                                    isShow = true;
                                    map.growPlantSeq(itemID, index, this.showType);
                                }
                                    
                            }
                            if ( isShow == false&&this.isMovecell) {
                                let position: any = global.CommonClass.Functions.nodePositionToRoot(pickCell.node);
                                let positX = position.x;
                                let positY = position.y;
                                let distanceW = 0;
                                let distanceH = 0;
                                if ((positX>600||positX<-300) || Math.abs(positY) > 200) {
                                    if (position.x > 600) {
                                        distanceW = -200
                                    } else if (position.x < -300) {
                                        distanceW = 200
                                    }
                                    if (position.y > 240) {
                                        distanceH = -200
                                    } else if (position.y < -320) {
                                        distanceH = 200
                                    }
                                    let self= this
                                    let callback=function () {
                                        self.isMovecell = true; 
                                    }
                                    this.isMovecell = false; 
                                    map.movecell(distanceW, distanceH,callback)
                                }
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
                    this.isDargItem = (dragItem!=null);

                    if (this.isDargItem) {
                        this.pickItem(dragItem, touchPoint);
                        let position = this.node.convertToNodeSpaceAR(touchPoint);
                        this.ndDragItem.setPosition(position);
                    }
                }
            }
            let distance = touchPoint.sub(this.touchStart).mag();
            if (distance > 5&&this.isMoved== false) {
                this.isMoved = true;
                if (this.ndDragItem.active == true)
                cc.director.getScheduler().schedule(this.putNewAnimal, this, 0.3, cc.macro.REPEAT_FOREVER, 0, false);
            }
        } else if (event.type==cc.Node.EventType.TOUCH_END || event.type==cc.Node.EventType.TOUCH_CANCEL) {
            global.Instance.Log.debug('touchScrollEvent  btnHide1',this.ndDragItem);
            let map = global.Module.FarmParkData.getMap();
            map.showSelectCell(false);
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
                    
                    if(item&&item.parkItemType==4) {
                        map.putNewRareAnimal(itemID, touchPoint);
                    }
                }
                this.btnHide();
            }
            cc.director.getScheduler().unschedule(this.putNewAnimal, this);
            this.touchStart = null;
        }
        this.node.stopAllActions();
    };
    //动物
    putNewAnimal() {
        if (this.isDargItem) {
            let itemID = this.ndDragItem.tagEx;
            let item = global.Manager.DBManager.getItemNew(itemID);
            if (item.parkItemType == 3) {
                let map = global.Module.FarmParkData.getMap();
                map.putNewAnimal(itemID, this.ndDragItem);
                var data = global.Module.TaskData.getHasAcceptTaskData();
                if (data && data.state == 1 && data.taskId == 10018)
                    cc.director.getScheduler().unschedule(this.putNewAnimal, this);
            }
        }
    };
    pickItem(ndItem, touchPoint) {
        let itemID = ndItem.tagEx;
        if (this.showType == global.Enum.ParkBagType.PARKBAG_PLANT) {
            let errText =  global.Module.FarmParkData.getCanGrowInfo(itemID, this.selectCell);
            if (errText != null) {
                return false;
            }
        } else  if (this.showType == global.Enum.ParkBagType.PARKBAG_ANIMAL) {
            let animalNum = global.Module.FarmParkData.getAllAnimalNum();
            let TaskData = global.Module.TaskData.gettaskphase(10018);
            if (TaskData && TaskData.state == 1 && animalNum >= 1) {
                global.CommonClass.UITip.showTipTxt('请先完成鸡蛋任务', global.Enum.TipType.TIP_BAD);
                return false;
            }
            let itemCount = global.Module.PackageData.getItemCount(itemID);
            if (itemCount<1) {
                let isNum = global.Module.FarmParkData.checkMoney(itemID,global.Enum.FarmType.FARM_ANIMAL);
                if (isNum != 3){
                    return false;
                }
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


    // update (dt) {}
}
