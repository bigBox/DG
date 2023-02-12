

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIFarmParkScene extends cc.Component {
    selItem: any;
    ndDec: any;
    ndHarvest: any;
    harvestID: number;
    shovelID: number;
    harvestType: number;
    isChangeSel: boolean;
    curHvstAnimal: number;
    curHvstPlant: number;
    opData: any;
    spHvstPlant: any;
    spHvstAnimal: any;
    spHvsFish: any;
    spOperate: any;
    isMovecell: boolean;
    hasOp: boolean;
    constructor(){
        super();
        this.selItem = null;

        this.ndDec = null;
        this.ndHarvest = null;

        this.harvestID = 0;
        this.shovelID  = 0;
        this.harvestType = 0;
        this.isChangeSel  = false;
        this.curHvstAnimal = 0;
        this.curHvstPlant  = 0;
        this.isMovecell = true;
        this.opData = null; //{ID:0, type:0};
        this.hasOp = false;
    };

    onLoad () {
        this.ndDec = this.node.getChildByName('ndDec');
        this.ndDec.active = false;

        this.spHvstPlant =  this.node.getChildByName('spHvstPlant');//农作物
        this.spHvstAnimal=  this.node.getChildByName('spHvstAnimal');//动物
        this.spHvsFish=  this.node.getChildByName('spHvsFish');//鱼塘
        

        this.spHvstPlant.active = false;
        this.spHvstAnimal.active = false;
        this.spHvsFish.active = false;
        this.spOperate = null;
    };

    start () {

    }
    
    onEnable() {
        global.Manager.UIManager.add('UIFarmParkScene', this);

        let btnCaculate = this.node.getChildByName('btnCaculate');
        let isDrawPrize = global.Module.FarmParkData.getIsDrawPrize();
        if (isDrawPrize) {
            btnCaculate.color = cc.color(90,96,96,255);
        } else {
            btnCaculate.color = cc.color(255,255,255,255);
        }

        cc.director.getScheduler().schedule(this.selfUpdate, this,  0.01,  cc.macro.REPEAT_FOREVER , 0, false);
    };

    onDisable()
    {
        global.Manager.UIManager.remove('UIFarmParkScene');
        cc.director.getScheduler().unschedule(this.selfUpdate,this);
    };

    openNodeTouch(isEnable) {
        this.hasOp = !isEnable;
        if (isEnable)
        {
            this.node.on(cc.Node.EventType.TOUCH_MOVE,   this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_END,    this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_START,  this.touchEvent, this);	    
        }
        else
        {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);	
            this.node.off(cc.Node.EventType.TOUCH_END,  this.touchEvent, this);	
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_START,  this.touchEvent, this);
        }
    };
    //收获统计
    operateMove(touchPoint) {

        let ndPosition =  this.node.convertToNodeSpaceAR(touchPoint);
        ndPosition.y -= 45;
        this.spOperate.setPosition(ndPosition);
        let isShow = false;
        let item = null;
        let pickCell = null;
        let map = global.Module.FarmParkData.getMap();
        if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_PLANT
            || this.opData.type == global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_ANIMAL
            || this.opData.type == global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_FINSH
            || this.opData.type == global.Enum.FarmTypeOp.FARMOP_READY_SHOVEL_PLANT) {//限制收获第一个
                isShow = true;
            if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_PLANT)
                item = map.getPickCell(touchPoint);
            if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_ANIMAL)
                item = map.getPickAnimal(touchPoint);
            if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_FINSH)
                item = map.getPickCells(touchPoint);
            if (item) {
                let index = item.item.index;
                if (index == this.selItem.index)
                    this.opData.type++;
            }
        }
        else if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_HARVEST_ANIMAL) {//收获动物
            
            map.changeTouchCellPick(touchPoint);
            map.showSelectAnimal(true);

            pickCell = map.getTouchCell();
            // pickCell = map.getPickAnimal(touchPoint);
            if (pickCell != null) {
                let index = pickCell.node.tagEx;
                item = global.Module.FarmParkData.getAnimal(index);

                let canHarvset = global.Module.FarmParkData.getCanHarvest(index, global.Enum.FarmType.FARM_ANIMAL);
                if (canHarvset && item.templateID == this.opData.ID) {
                    if (global.Module.FarmParkData.pushOperatorIdx(index, global.Enum.FarmTypeOp.FARMOP_HARVEST_ANIMAL)){
                        isShow = true;
                        map.harvestAnimal(item.index);
                    }
                        
                }
            }
        }
        else if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_HARVEST_PLANT) {//收获植物
            map.changeTouchCell(touchPoint);
            map.showSelectCell(true);

            pickCell = map.getTouchCell();
            if (pickCell != null) {
                let index = pickCell.node.tagEx;
                item = global.Module.FarmParkData.getPlantCell(index);

                let canHarvset = global.Module.FarmParkData.getCanHarvest(index, global.Enum.FarmType.FARM_PLANT);
                if (canHarvset && item.templateID == this.opData.ID) {
                    if (global.Module.FarmParkData.pushOperatorIdx(index, global.Enum.FarmTypeOp.FARMOP_HARVEST_PLANT)){
                        isShow = true;
                        map.harvestPlant(index);
                    }
                }
            }
        } else if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_HARVEST_FINSH) {//收获鱼塘
            map.changeTouchCells(touchPoint);
            map.showFishCell(true);
             pickCell = map.getTouchCell();
            if (pickCell != null) {
                let index = pickCell.node.tagEx;
                item = global.Module.FarmParkData.getFishCell(index);

                let canHarvset = global.Module.FarmParkData.getCanHarvest(index, global.Enum.FarmType.FARM_FISH);
                if (canHarvset && item.templateID == this.opData.ID) {
                    if (global.Module.FarmParkData.pushOperatorIdx(index, global.Enum.FarmTypeOp.FARMOP_HARVEST_FINSH)){
                        isShow = true;
                        map.harvestFish(index);
                    }
                        
                }
            }
        }
       
        if (this.spOperate && isShow == false&&this.isMovecell) {
            let position: any = global.CommonClass.Functions.nodePositionToRoot(this.spOperate);
            let positX = position.x;
            let positY = position.y;
            let distanceW = 0;
            let distanceH = 0;
            if (Math.abs(positX) > 600 || Math.abs(positY) > 200) {
                if (position.x > 600) {
                    distanceW = -200
                } else if (position.x < -600) {
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
        if (item != null && this.selItem != null) {
            if (item.index == this.selItem.index)
                this.selItem = null;
        }else{
            // let position: any = global.CommonClass.Functions.nodePositionToRoot(item);
          
        }
    };
    spOperateStart(event,curTouchCell){
        this.hasOp = true;
        let item = curTouchCell.item
        if (item.templateID == 110020001)//小麦收获保护
        if (global.Module.TaskData.taskguard(10012))
            return;
       
        this.selItem = item;
        this.isChangeSel = false;

        this.spHvstPlant.active = (item.canHarvset) && (item.type == global.Enum.FarmType.FARM_PLANT);
        this.spHvstAnimal.active = (item.canHarvset) && (item.type == global.Enum.FarmType.FARM_ANIMAL);
        this.spHvsFish.active = (item.canHarvset) && (item.type == global.Enum.FarmType.FARM_FISH);
        if (item.uncommon)
            this.spHvstAnimal.active = false;



        if (this.spHvstPlant.active) {
            global.CommonClass.Functions.setNodePosToTarget(this.spHvstPlant, curTouchCell.node, cc.v2(0, 67.5));
            this.spOperate = this.spHvstPlant;
            this.spOperate.tagEx = (global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_PLANT);
        } else if (this.spHvstAnimal.active) {
            global.CommonClass.Functions.setNodePosToTarget(this.spHvstAnimal, curTouchCell.node, cc.v2(0, 67.5));
            this.spOperate = this.spHvstAnimal;
            this.spOperate.tagEx = (global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_ANIMAL);
        } else if (this.spHvsFish.active) {
            global.CommonClass.Functions.setNodePosToTarget(this.spHvsFish, curTouchCell.node, cc.v2(0, 67.5));
            this.spOperate = this.spHvsFish;
            this.spOperate.tagEx = (global.Enum.FarmTypeOp.FARMOP_READY_HARVEST_FINSH);
        }else{
            this.spOperate = null;
        }
        if(this.spOperate){
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
            if (dragLayer){
                let scale = dragLayer.getItemScale();
                this.spOperate.scale = scale;
            }   
        }
            
       

        let touchPoint = event.getLocation();
        if (this.selItem) {
            if (this.spOperate != null) {
                let boundingBox = this.spOperate.getChildByName('ndPick').getBoundingBoxToWorld();
                if (boundingBox.contains(touchPoint)) {
                    let opType = this.spOperate.tagEx;
                    this.opData = { ID: this.selItem.templateID, type: opType };
                    global.Module.FarmParkData.cleartempOpQueue();
                }
            }
        }

        if (this.spOperate == null)
            this.selectItem(touchPoint);
          
        if (this.opData != null)
            this.operateMove(touchPoint);    
    }
    touchEvent(event) {
        let touchPoint = event.getLocation();
        let hasOp = this.opData!=null;

        if (event.type == cc.Node.EventType.TOUCH_START) {
            if (this.selItem) {
                if (this.spOperate != null) {
                    let boundingBox = this.spOperate.getChildByName('ndPick').getBoundingBoxToWorld();
                    if (boundingBox.contains(touchPoint)) {
                        let opType = this.spOperate.tagEx;
                        this.opData = { ID: this.selItem.templateID, type: opType };
                        global.Module.FarmParkData.cleartempOpQueue();
                    }
                }
            }
            if (this.spOperate == null)
                this.selectItem(touchPoint);
            if (this.opData != null)
                this.operateMove(touchPoint);
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
         
            if (this.opData != null)
                this.operateMove(touchPoint);
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if (this.isChangeSel)
                this.isChangeSel = false;
            else {
                let map = global.Module.FarmParkData.getMap();

                if (this.opData != null) {
                    if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_HARVEST_PLANT) {
                        global.Module.FarmParkData.harvest(this.opData.ID, global.Enum.FarmType.FARM_PLANT);
                        map.showSelectCell(false);
                        map.reflashFirstHarvest(global.Enum.FarmType.FARM_PLANT);
                    }
                    else if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_HARVEST_ANIMAL) {
                        global.Module.FarmParkData.harvest(this.opData.ID, global.Enum.FarmType.FARM_ANIMAL);
                        map.showSelectAnimal(false);
                        map.reflashFirstHarvest(global.Enum.FarmType.FARM_ANIMAL);
                    }
                    else if (this.opData.type == global.Enum.FarmTypeOp.FARMOP_HARVEST_FINSH) {
                        global.Module.FarmParkData.harvest(this.opData.ID, global.Enum.FarmType.FARM_FISH);
                        map.showFishCell(false);
                        map.reflashFirstHarvest(global.Enum.FarmType.FARM_FISH);
                    }
                    this.opData = null;
                }
                if (this.spOperate) {
                    this.spOperate.active = false;
                    this.spOperate = null;
                }

                this.showDec(false, null);

            }
        }
        if (!hasOp){
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');//收获时贴边移动屏幕功能 this.hasOp防止收获时进入死循环的判断字段
            if (dragLayer != null)
                dragLayer.touchEvent(event,this.hasOp);
        }
    };
    /**
     * 显示隐藏 说明按钮
     * @param {*} isShow 
     */
    showHelp(isShow) {
        let UIHelp = this.node.getChildByName('UIHelp');
        UIHelp.active = isShow;
    };

    selectItem(touchPoint) {
        this.opData = null;
        let index = null;
        let item:any = null;

        let map = global.Module.FarmParkData.getMap();
        item = map.getPickAnimal(touchPoint);
        if (item == null)
            item = map.getPickCell(touchPoint);
       
        if (item!=null && item.templateID>0)
        {
            index = item.node.tagEx;
            if (index != null)
            {
                let items = global.Module.FarmParkData.getItemByType(index, item.type);
                this.selItem = items;
                this.isChangeSel = true;
    
                this.showDec(true, this.selItem); 
            }
        }
    
    };

  

    showDec(isShow, selItem)  { //type 0.植物 1.动物 2鱼塘
       
       
        if (isShow) {
            let ndInfo = this.ndDec.getChildByName('ndInfo');
            this.selItem = selItem;
            if (selItem != null)
                this.selItem = global.Module.FarmParkData.getItemByType(selItem.index, selItem.type);
           
            let matrial = global.Manager.DBManager.getItemNew(selItem.templateID);
            if (matrial != null) {
                let name = matrial.name;
                let lblName = ndInfo.getChildByName('lblName');
                lblName.getComponent(cc.Label).string = name;
            }
            let helpNode = ndInfo.getChildByName('helpNode');
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if (data && data.state == 1 && data.taskId == 10018) {
                helpNode.active = true;
            }else{
                helpNode.active = false;
            }
            this.spHvstPlant.active = this.selItem && (this.selItem.canHarvset) && (this.selItem.type == global.Enum.FarmType.FARM_PLANT);
            this.spHvstAnimal.active = this.selItem && (this.selItem.canHarvset) && (this.selItem.type == global.Enum.FarmType.FARM_ANIMAL);
            this.spHvsFish.active = this.selItem && (this.selItem.canHarvset) && (this.selItem.type == global.Enum.FarmType.FARM_FISH);
            if (this.spOperate != null) {
                this.spOperate.setPosition(cc.v2(0, 0));
            }
        } else
            this.selItem = null;
    
        this.ndDec.active = isShow&&this.selItem&&!this.selItem.canHarvset;
        this.harvestID = 0;

        this.openNodeTouch(isShow);
    };

    btnReturn() {
        global.CommonClass.Functions.loadScene("MainScene",null);
    };

    btmGmCode() {
        global.Manager.UIManager.open('UIGMCode',null,null);
    };

    updateDec(item) {
        if (item!=null) {
          
            let ndInfo = this.ndDec.getChildByName('ndInfo');
            ndInfo.active = !item.canHarvset;
            if (item.canHarvset == false) {
                let lblTime = ndInfo.getChildByName('lblTime');
                let recallNode = ndInfo.getChildByName('recallNode');
                let barTime = ndInfo.getChildByName("barTime");
             
                let lblTime1 = ndInfo.getChildByName('lblTime1');
                let lblTime2 = ndInfo.getChildByName('lblTime2');
                let lblTimetitle1 = ndInfo.getChildByName('lblTimetitle1');
                let lblTimetitle2 = ndInfo.getChildByName('lblTimetitle2');
                let progress = 0.0001;
                let leftTime = global.CommonClass.Functions.getLeftTime(item.havestTime);
                if (leftTime < 0)
                    leftTime = 0;
                let dataTime = global.CommonClass.Functions.formatSeconds3(leftTime);
                if (item.type == global.Enum.FarmType.FARM_ANIMAL && item.withered == -1) {
                    // barTime.getComponent(cc.ProgressBar).progress = 1;
                    recallNode.active = true;
                    // lblTime.getComponent(cc.Label).string = '--';
                    let timeLabel = recallNode.getChildByName('timeLabel').getComponent(cc.Label);
                    let data = global.Manager.DBManager.findData('Sundry', 'name', 'accelerateConsumption');
                    let itemNum = Math.ceil(item.growTime / (data.value * 60));
                    timeLabel.string = itemNum.toString();
                    lblTime1.getComponent(cc.Label).string = '--';
                    lblTime2.getComponent(cc.Label).string = '--';
                    lblTimetitle1.getComponent(cc.Label).string = '分';
                    lblTimetitle2.getComponent(cc.Label).string = '秒';
                } else {
                    if (item.growTime != 0 && leftTime != 0)
                        progress = leftTime / item.growTime;
                    recallNode.active = (leftTime > -1);
                    if (leftTime > -1) {
                        let data = global.Manager.DBManager.findData('Sundry', 'name', 'accelerateConsumption');
                        let itemNum = Math.ceil(leftTime / (data.value * 60));
                        let timeLabel = recallNode.getChildByName('timeLabel').getComponent(cc.Label);
                        timeLabel.string = itemNum.toString();
                    }
                
                    lblTime1.getComponent(cc.Label).string = dataTime.time1;
                    lblTime2.getComponent(cc.Label).string = dataTime.time2;
                    lblTimetitle1.getComponent(cc.Label).string = dataTime.timeLabel1;
                    lblTimetitle2.getComponent(cc.Label).string = dataTime.timeLabel2;
                }
            }
            
            if (this.ndDec.active&&item.canHarvset == false) {
                let map = global.Module.FarmParkData.getMap();
    
                let lblLifeTime = ndInfo.getChildByName('lblLifeTime');
                // &&!item.withered
                // lblLifeTime.active = (item.type==global.Enum.FarmType.FARM_ANIMAL&&!item.canHarvset);
    
                if (item.type==global.Enum.FarmType.FARM_ANIMAL)
                {
                    let lifeTime    = global.CommonClass.Functions.getLeftTime(item.lifeTime);
                    if (lifeTime<0)
                        lifeTime = 0;  
    
                    // if (lifeTime > 0)
                    //     lblLifeTime.getComponent(cc.Label).string = "存活时间 "+global.CommonClass.Functions.formatSeconds(lifeTime) + " 剩余收获次数 "+item.harvestLeft.toString();
                    // else
                    //     lblLifeTime.getComponent(cc.Label).string = "剩余收获次数 "+item.harvestLeft.toString();
    
                }
               
                if (item.type == global.Enum.FarmType.FARM_PLANT) {
                    let cell = map.getCellByIndex(item.index);
                    global.CommonClass.Functions.setNodePosToTarget(this.ndDec, cell.node, cc.v2(0, 80));
                } else if (item.type == global.Enum.FarmType.FARM_ANIMAL) {
                    let animal = map.getAnimal(item.index);
                    if (animal != null)
                        global.CommonClass.Functions.setNodePosToTarget1(this.ndDec, animal.node, cc.v2(0, 0),80);
                } else if (item.type == global.Enum.FarmType.FARM_FISH){
                    let animal = map.getFishNode(item.index);
                    if (animal != null)
                        global.CommonClass.Functions.setNodePosToTarget(this.ndDec, animal.node, cc.v2(0, 80));
                }
            }      
        }else{
            let ndInfo = this.ndDec.getChildByName('ndInfo');
            ndInfo.active = false;
        }
        
    };

    onAinimalDie(index) {
        if (this.selItem==null || index==this.selItem.index)
        {
            this.showDec(false,null);
        }
    };

    selfUpdate(dt) {
        if (this.selItem != null) {
            this.selItem = global.Module.FarmParkData.getItemByType(this.selItem.index, this.selItem.type);
            this.updateDec(this.selItem);
        } else {
            // let ndInfo = this.ndDec.getChildByName('ndInfo');
            // ndInfo.active = false;
        }
    };

    shovelItem(item)
    {
        let map = global.Module.FarmParkData.getMap();
        map.shovelPlant(item.index);
    };

   

    btnHelp()
    {
        let name = this.node.name;
        global.Manager.UIManager.open('DlgHelp',null, function(panel)
        {
           panel.show(name); 
        });
    };
    /**
         * 制作加速
         */
    btnQuick() {
     
        let msgName = '';
        let msgData = null;
        if (this.selItem.type == global.Enum.FarmType.FARM_ANIMAL) {//收获动物
            msgName = 'ParkAnimalSpeedup';
            let obj = { animalTimeID: this.selItem.index, x: this.selItem.pos.x, y: this.selItem.pos.y };
         
            msgData = null;
            msgData = { points: obj };
        }
        else if (this.selItem.type == global.Enum.FarmType.FARM_PLANT) {//收获植物
            msgName = 'ParkPlantSpeedup';

            let colNum = global.Module.FarmParkData.getColNum();
            let index = this.selItem.index;
            let x = Math.floor(index / colNum);
            let y = Math.floor(index % colNum);
            msgData = null;
            msgData = { points: { x: x, y: y } };
        }else{
            msgName = 'ParkFishSpeedup'; 
            msgData = null;
            msgData = { index: this.selItem.index };
        }
        let callBack = function (isYes) {
            if (isYes) {
                global.Instance.MsgPools.send(msgName, msgData, function (msg) {
                    if (msg.errorID) {

                    }
                });
            }
        };
        {
            let leftTime = global.CommonClass.Functions.getLeftTime(this.selItem.havestTime);
            if (leftTime < 0)
                leftTime = 0;
            var taskdata = global.Module.TaskData.getHasAcceptTaskData();
            if ((taskdata && taskdata.taskId == 10013 && taskdata.state == 1 && this.selItem.templateID == 110020010) ||
                (taskdata && taskdata.taskId == 10018 && taskdata.state == 1 && this.selItem.templateID == 220020001) ||
                (taskdata && taskdata.taskId == 10021 && taskdata.state == 1 && this.selItem.templateID == 230020001))
                leftTime = 0;
            let ndInfo = this.ndDec.getChildByName('ndInfo');
            let helpNode = ndInfo.getChildByName('helpNode');
            helpNode.active = false;
            global.Manager.UIManager.open('DlgCostItem', null, function (panel) {
                panel.show(leftTime, callBack);
            });
       
        }
        
        // let data: any = global.Module.MakeGoodsData.getData(this.factoryID);
        // if (data != null) {
        //     let leftTime = global.CommonClass.Functions.getLeftTime(data.makeTime[0]);
      
        // }

    };
    btnCaculate() {
        let btnCaculate = this.node.getChildByName('btnCaculate');
        btnCaculate.color = cc.color(90,96,96,255);

        let data = {};
        global.Instance.MsgPools.send('parkDrawPrize', data, function(msg) {
            if (msg.errorID==0)
            {
                let farmParkMap = global.Instance.Dynamics["FarmParkMap"];
                if (farmParkMap)
                {
                    farmParkMap.flyAnimalMoney(function()
                    {
                        global.Manager.UIManager.open('DlgCaculate', null, function(panel)
                        {
                            panel.show(msg.goldNum);
                        });
                    });
                }
            }
        });
    };

    // update (dt) {}
}
