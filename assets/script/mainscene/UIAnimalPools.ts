

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIAnimalPools extends cc.Component {
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "ndNext" })
    helpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnCacuNode", tooltip: "btnCacuNode" })
    btnCacuNode: cc.Node = null;
  
    ndPaoPao: any;
    curPickFish: any;
    canGetMoeny: boolean;
    firstHarvestAnimal: any;
    animsTargetIdx: {};
    itemSize: any;
    itemSpace: any;
    makeItemData: any;

    constructor(){
        super();
        this.ndPaoPao = null;
        this.curPickFish = null;
        this.canGetMoeny = false;
        this.firstHarvestAnimal = null;
        this.animsTargetIdx = {};
    };


    onLoad () {
    };

    start () {

    }
    onEnable() {
        let ndAnims = this.node.getChildByName("ndAnims");
        ndAnims.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        ndAnims.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        ndAnims.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        ndAnims.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);

        this.createAnimals();
         global.Module.GameData.setMaskSound(true,null);
        let isDrawPrize =  global.Module.FarmParkData.getIsDrawPrize();
        if (isDrawPrize) {
            this.btnCacuNode.color = cc.color(90, 96, 96, 255);
        }
        else {
            this.btnCacuNode.color = cc.color(255, 255, 255, 255);
        }
    };

    onDisable() {
        let ndAnims = this.node.getChildByName("ndAnims");
        ndAnims.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        ndAnims.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        ndAnims.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        ndAnims.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        
         global.Manager.UIManager.close('UIFriendChoose');
         global.Module.GameData.setMaskSound(false,null);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            let touchPoint = event.getLocation();

            let pickAnimal = null;
            let ndAnims = this.node.getChildByName("ndAnims").children;
            for (let key in ndAnims) {
                let animal:any = ndAnims[key];
                let animalClass = animal.getComponent( global.CommonClass.FarmParkAniItem);
                if (animalClass.isPicked(touchPoint)) {
                    pickAnimal = animalClass;
                    break;
                }
            }

             global.Instance.Log.debug('touchEvent pick',pickAnimal);
            if (pickAnimal != null) {
                let index = pickAnimal.getIndex();
                let item:any =  global.Module.FarmParkData.getZooAnimal(index);

                if (item != null) {
                    if (item.withered)
                         global.Module.FarmParkData.costShovelItem(0);
                    
                    global.Manager.UIManager.open('UIHandBook06', null, function (panel) {
                        if (panel != null) {
                            panel.show(item.templateID);
                        }
                    }.bind(this));
                }
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_END) {
            if (this.curPickFish != null) {
               
            }
        }
    };
    getShadow(name,position,scaleX){
        let shadow = this.node.getChildByName("shadow");
        let shadowNode = shadow.getChildByName(name);
        if(shadowNode){
            shadowNode.setPosition(position);
            shadowNode.scaleX = scaleX;
            
        }
        
    }
    //放置动物园珍惜动物
    putNewRareAnimal(itemID, touchPoint) {
        if (! global.Module.FarmParkData.checkLevel(itemID,  global.Enum.FarmType.PARKBAG_RARE_ANIMAL)) {
             global.CommonClass.UITip.showTipTxt('等级不够',  global.Enum.TipType.TIP_BAD);
            return;
        }
        //孔雀任务安全保护
        if (global.Module.TaskData.taskguard(10011))
            return;
        if (itemID > 0) {
            let self = this;
            let msgData = { animalID: itemID };
            let shadow = this.node.getChildByName("shadow");
            let ovalNode = this.node.getChildByName("ovalNode");
             global.Instance.MsgPools.send('zooPlaceAnimal', msgData, function (msg) {
                if (msg.errorID == 0) {
                    
                    let animal =  global.Module.FarmParkData.getZooAnimal(msg.animal.animalTimeID);

                    let ndAnims = this.node.getChildByName("ndAnims");
                    let position = this.node.convertToNodeSpaceAR(touchPoint);
                     global.CommonClass.FarmParkAniItem.create(animal, ndAnims, position, function (item) {
                        item.tagEx = (animal.index);
                        item.setName('ndAnimal' + animal.index.toString());
                        let itemNode = cc.instantiate(ovalNode);
                        itemNode.name = ('ndAnimal' + animal.index.toString());
                        shadow.addChild(itemNode);
                        itemNode.setPosition(position.x+50,position.y-60);
                        itemNode.active = true;
                        // self.randAnimalAction(item);
                        self.animalIdle(item);
                        
                    }.bind(this));
                        let uiFarmParkBag =  global.Manager.UIManager.get('UIFarmAnimalBag');
                        if (uiFarmParkBag != null) {
                            uiFarmParkBag.setItemNodeNum(itemID);
                        }
                    
                }
            }.bind(this));
        }
        let uiRole =  global.Manager.UIManager.getMutiPanel('UIRoleInfo');
        if (uiRole)
            uiRole.reflashEcological();
    };

    reflashFirstHarvest(type) {
        if (this.firstHarvestAnimal == null) {
            let animalData =  global.Module.FarmParkData.findFirstHarvest(type);
            if (animalData != null) {
                let animal = this.getAnimal(animalData.index);
                if (animal != null) {
                    animal.setFirstHarvest(true);
                    this.firstHarvestAnimal = animal;
                }
            }
        }
    };

    getAnimal(index) {
        let ndAnim:any = this.node.getChildByName('ndAnims').getChildByName('ndAnimal' + index.toString());
        if (ndAnim != null) {
            return ndAnim.getComponent(global.CommonClass.FarmParkAniItem);
        }else {
             global.Instance.Log.debug('xxxxxx','xxxxxx');
        }
    };

    onClickHideList() {
        let uiFarmParkBag =  global.Manager.UIManager.get('UIFarmAnimalBag');
        if (uiFarmParkBag != null) {
            uiFarmParkBag.show( global.Enum.ParkBagType.PARKBAG_RARE_ANIMAL, false);
        }
    };

    onClickShowList() {
        this.helpNode.active = false;
        let uiFarmParkBag =  global.Manager.UIManager.get('UIFarmAnimalBag');
        if (uiFarmParkBag != null) {
            uiFarmParkBag.show( global.Enum.ParkBagType.PARKBAG_RARE_ANIMAL, true);
        }
    };

    reflashInfo() {
        let self = this;
        let data = { type: 1 };
         global.Instance.MsgPools.send('showTableInfo', data, function (msg) {
            self.canGetMoeny = (msg.state == 0);

            if (!self.canGetMoeny)
                this.btnCacuNode.color = cc.color(90, 96, 96, 255);
            else
                this.btnCacuNode.color = cc.color(255, 255, 255, 255);
        })
    };

    btnClose() {
         global.Manager.UIManager.close('UIAnimalPools');
    };

    pickScrollIdx(isBack) {
        let itemScroll = this.node.getChildByName('ndTarget').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        let offset = scrollView.getScrollOffset();

        let beginOffset = 0;
        let offTimes = (offset.y + beginOffset) / (this.itemSize.height + this.itemSpace);
        let idx = Math.floor(offTimes);

        if (isBack)
            idx += 3;

        //let makeItemData =  global.Manager.DBManager.getData("ManufactureMakeData");

        if (idx < 0) {
            idx = 0;
        }
        else if (idx >= this.makeItemData.length) {
            idx = this.makeItemData.length - 1;
        }

        return idx;
    };

    setFlip(ndAnima, targetPos) {
        let position = ndAnima.getPosition();
        let moveVec = cc.v2(targetPos.x - position.x, targetPos.y - position.y);

        let Node = ndAnima.getChildByName('Node');
        if (moveVec.x < 0) {
            Node.scaleX = 1;
        }
        else {
            Node.scaleX = -1;
        }
    };

    animalMove(ndAnim) {
        let animalClass = ndAnim.getComponent( global.CommonClass.FarmParkAniItem);

        animalClass.changeAnimaAction('walk');

        let ndMove = this.caculateTargetIdx(ndAnim.name);
        let targetPosition = ndMove.getPosition();
       
        let distance =  ndAnim.getPosition().sub(targetPosition).mag();
        let speed = 40;
        let timeCost = distance / speed;
        let moveAct = cc.moveTo(timeCost, targetPosition.x, targetPosition.y);
        let scaleAct = cc.scaleTo(timeCost, 0.7,  0.7);
        let endFunction = cc.callFunc(this.randAnimalAction, this, ndAnim);
        var spawn = cc.spawn(moveAct, scaleAct);
        let seq = cc.sequence(spawn, endFunction);
        ndAnim.runAction(seq);

        this.setFlip(ndAnim, targetPosition);
    };

    animalIdle(ndAnim) {
        let delay = cc.delayTime(3);

        let animalClass = ndAnim.getComponent( global.CommonClass.FarmParkAniItem);
        animalClass.changeAnimaAction('daiji');
        let scaleAct = cc.scaleTo(0, 0.7,  0.7);
        let endFunction = cc.callFunc(this.randAnimalAction, this, ndAnim);
        let seq = cc.sequence(scaleAct,delay, endFunction);
        ndAnim.runAction(seq);
    };

    randAnimalAction(ndAnim) {
        let resulet = Math.floor(Math.random()*3) % 3;
        if (resulet == 0) {
            this.animalMove(ndAnim);
        } else if (resulet == 1) {
            this.animalMove(ndAnim);
        } else if (resulet == 2) {
            this.animalIdle(ndAnim);
        }
    };

    caculateTargetIdx(animalName) {
        let curTargetIdx = this.animsTargetIdx[animalName];
        if (curTargetIdx == null)
            curTargetIdx = 304;
        let areaIdx = Math.floor(curTargetIdx / 100);
        let randAdd = Math.floor(Math.random() * 3) - 1;
        areaIdx += randAdd;

        if (areaIdx > 5)
            areaIdx = 5;
        else if (areaIdx < 1)
            areaIdx = 1;

        let ndAreas = this.node.getChildByName('ndAreas');
        let ndArea = ndAreas.getChildByName('ndArea3');//'ndArea' + areaIdx.toString());
        let areaNum = ndArea.children.length;
        let randIdx = Math.floor(Math.random() * areaNum) + 1;
        let targetIdx = areaIdx * 100 + randIdx;
        this.animsTargetIdx[animalName] = targetIdx;
        let ndPos = ndArea.getChildByName('ndPos' + randIdx.toString());
        return ndPos;
    };

    createAnimals() {

        let animals =  global.Module.FarmParkData.getAllZooAnimal();


        let ndAreas = this.node.getChildByName('ndAreas').getChildByName('ndArea3');
        let length = ndAreas.children.length;

        let ndAnims = this.node.getChildByName("ndAnims");
        let shadow = this.node.getChildByName("shadow");
        let ovalNode = this.node.getChildByName("ovalNode");
        let self = this;
        for (let key in animals) {
            let animal = animals[key];
            let data =  global.Manager.DBManager.findData("FarmZooAnimal", 'productId', animal.templateID);
            if (data.uncommon == 0) {
                continue;
            }
            let posIdx = Math.floor(Math.random() * length)+1;
            let ndArea = ndAreas.getChildByName('ndPos' + posIdx.toString());
            let position = ndArea.getPosition();

             global.CommonClass.FarmParkAniItem.create(animal, ndAnims, position, function (item) {
                item.tagEx = (animal.index);
                item.setName('ndAnimal' + animal.index.toString());
                let itemNode = cc.instantiate(ovalNode);
               
                itemNode.name = ('ndAnimal' + animal.index.toString());
                shadow.addChild(itemNode);
                itemNode.setPosition(position.x+50,position.y-60);
                itemNode.active = true;
                    item.zIndex = (2);
                    self.animalIdle(item);
            });
        }
    };
    btnCaculate(msg) {
        this.btnCacuNode.color = cc.color(90, 96, 96, 255);

        let data = {};
         global.Instance.MsgPools.send('parkDrawPrize', data, function (msg) {
            if (msg.errorID == 0) {
                let farmParkMap =  global.Instance.Dynamics["FarmParkMap"];
                if (farmParkMap) {
                    farmParkMap.flyAnimalMoney(function () {
                         global.Manager.UIManager.open('DlgCaculate', null, function (panel) {
                            panel.show(msg.goldNum);
                        });
                    });
                }
            }
        });
    };
    // update (dt) {}
}
