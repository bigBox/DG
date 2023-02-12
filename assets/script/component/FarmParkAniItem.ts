
const { ccclass, property } = cc._decorator;

@ccclass
export default class FarmParkAniItem extends cc.Component {
    item: any;
    @property({ type: cc.Node, displayName: "ndSpine", tooltip: "动画" })
    ndSpine: cc.Node = null;
    isHarvest: boolean;
    isShow:boolean;
    type:number;
    static create(itemData, parent, position, callback) {
        let filePath = "prefab/component/FarmParkAniItem";
        global.CommonClass.Functions.setCreate(filePath, function (prefab) {
            if (prefab != null) {
                let newNode = cc.instantiate(prefab);
                let itemClass = newNode.getComponent(global.CommonClass.FarmParkAniItem);
                newNode.setPosition(position);
                parent.addChild(newNode);
                itemClass.setItem(itemData, function () {
                   
                    if (callback)
                    callback(newNode);

                });

            }
        })
    };

    constructor() {
        super();
        this.item = null;
        this.isShow = false;
        this.type = global.Enum.FarmType.FARM_ANIMAL;
    };
    getType() {
        return this.type;
    }

    // use this for initialization
    onLoad() {
       
    };

    setItem(item, callback) {
        if (item != null) {
            this.item = item;
            this.setSpine(item.templateID, callback);
            let spHarvest = this.node.getChildByName('spHarvest');
            spHarvest.active = this.item.withered == -1;
        }else{
            this.setFirstHarvest(false);
        }
    };
    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.item = global.Module.FarmParkData.getItemByType(this.item.index, this.item.type);
            let item = this.item;
           
            let IsHarvest = false
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
            if (dragLayer){
                IsHarvest = dragLayer.getIsHarvest();
                dragLayer.lockMove(true);
            }
            if (item && item.canHarvset == true) {
                let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
                if (uiParkScene)
                    uiParkScene.spOperateStart(event, this);
            }
            
           
        } else {
            let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
            if (uiParkScene)
                uiParkScene.touchEvent(event);
            if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
                let dragLayer = this.node.parent.parent.getComponent('DragLayer');
                if (dragLayer != null)
                    dragLayer.lockMove(false);
            }
            
        }
    };
    setSpine(animalId, callback) {
        let ovalNode = this.node.getChildByName("ovalNode");
        let data = global.Manager.DBManager.findData("FarmParkAnimal", 'ID', animalId);
        if (data == null)
            data = global.Manager.DBManager.findData("FarmZooAnimal", 'productId', animalId);
        if (data != null) {
            let self = this;
            let ndSpine = this.ndSpine;
            this.ndSpine.getComponent(sp.Skeleton).setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE)
            cc.loader.loadRes(data.spine, sp.SkeletonData, function (err, spData) {
                if (err == null) {
                    cc.loader.setAutoReleaseRecursively(spData, true);//销毁场景销毁资源
                    if (self.ndSpine != null) {
                        let spineScript = ndSpine.getComponent(sp.Skeleton);
                        
                        spineScript.skeletonData = spData;
                        self.ndSpine.active = !(self.item.withered == 1);
                        setTimeout(() => {
                            if (data.skin != ''&&spineScript)
                                spineScript.setSkin(data.skin);
                        }, 10);

                        if (self.ndSpine.active) {
                            if (data.uncommon == 1) {
                                ovalNode.active = false;
                                if(animalId == 260030004){
                                    self.changeAnimaAction('kaiping');
                                } else{
                                    self.changeAnimaAction('daiji');
                                }
                                
                            } else {
                                ovalNode.active = true;
                                self.changeAnimaAction('sit');
                            }

                        }

                    }
                    else {
                        global.Instance.Log.debug('','spine is null...');
                    }

                    if (callback)
                        callback();
                }
            });
        }
    };

    changeAnimaAction(actionName) { 
        let templateID = this.item.templateID
        if(templateID == 260030004&&actionName == 'daiji'){
            actionName = 'kaiping';
        }

        let ndSpine = this.ndSpine;
        if (ndSpine != null) {
            let slAnim = ndSpine.getComponent(sp.Skeleton);
            slAnim.animation = actionName;
            slAnim.loop = true;
            slAnim.paused = false;
        } else {
            global.Instance.Log.debug('', 'changeAnimaAction...');
        }
    };

    setItemWithered() {
        let spWithered = this.node.getChildByName('spWithered');
        this.ndSpine.active = false;
        spWithered.active = true;
        this.isShow = true;
        this.isHarvest = this.item.canHarvset;
    };

    setTempShovel(isTempShovel) {
        let spWithered = this.node.getChildByName('spWithered');
        spWithered.active = !isTempShovel && this.item.templateID > 0;
    };

    getIndex() {
        return this.node.tagEx;
    };

    getItemID() {
        return this.item.templateID;
    };

    isUncommon() {
        let itemData = global.Manager.DBManager.findData('FarmZooAnimal', 'ID', this.item.templateID)
        if (itemData != null) {
            return itemData.uncommon;
        }
        return 0;
    };

    showSel(isShow) {
        let spSel = this.node.getChildByName('spSel');
        spSel.active = isShow;
    };

    isPicked(touchPoint) {
        let ndPick = this.node.getChildByName('ndPick');
        var boundingBox = ndPick.getBoundingBoxToWorld();
        return boundingBox.contains(touchPoint);
    };
    isHarvestPicked(touchPoint) {
        let ndPick = this.node.getChildByName('harvest');
        var boundingBox = ndPick.getBoundingBoxToWorld();
        return boundingBox.contains(touchPoint);
    };
    setFirstHarvest(canHarvset) {
        let spHarvest = this.node.getChildByName('spHarvest');
        spHarvest.active = false;
        let harvest = this.node.getChildByName('harvest');
        harvest.active = canHarvset;
        this.showSel(canHarvset);
        if(canHarvset == true){
            this.helpNode(false);
        }
        let helpNode = harvest.getChildByName('helpNode');
        if(helpNode){
            helpNode.active = false;
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if(data){
                if (data.state == 1 && data.taskId == 10018) {
                    helpNode.active = true;
                }
            }
        }
    };
    helpNode(isShow){
        let helpNode = this.node.getChildByName('helpNode');
        if(helpNode){
            helpNode.active = isShow;
        }  
    }
    //收获处理
    playMoneyFly(callback) {
        let spMoneyFly = this.node.getChildByName('spMoneyFly');
        if (spMoneyFly) {
            let curPos = spMoneyFly.getPosition();
            curPos.y += 100;
            global.CommonClass.ItemDrop.createAndDrop2(1, 0, curPos, this.node, null, null, callback);
        }
    };
    update(){
        if (this.isShow == true)
            return;
        let UIAnimalPools = global.Manager.UIManager.get('UIAnimalPools');
        if (UIAnimalPools) {
            let scaleX = this.node.getChildByName("Node").scaleX;
            let position = this.node.getPosition();
            let positX = position.x;
            let positY = -(position.y) + 1000;
            let zIndex = positY * 10 + positX;
            this.node.zIndex = zIndex;
            let positionX = position.x
            if(scaleX==-1){
                positionX +=50;
            }else{
                positionX -=50;
            }
            let pos = new cc.Vec2(positionX, position.y - 60)
            UIAnimalPools.getShadow(this.node.name, pos,scaleX)
        }

    }
}
