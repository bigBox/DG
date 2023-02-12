

const { ccclass, property } = cc._decorator;

@ccclass
export default class FarmParkMap extends cc.Component {

    @property({ type: cc.Node, displayName: "helpNode", tooltip: "提示箭头" })
    helpNode: any[] = [];
    @property({ type: cc.Node, displayName: "fishNode", tooltip: "鱼层级" })
    fishNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpCell1", tooltip: "仙人掌拖动动画" })
    helpCell1: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpCell2", tooltip: "仙人掌手指按下动画" })
    helpCell2: cc.Node = null;
    @property({ type: cc.Sprite, displayName: "bg", tooltip: "仙人掌手指按下动画" })
    bg: cc.Sprite = null;
    @property({ type: cc.SpriteFrame, displayName: "picture", tooltip: "仙人掌手指按下动画" })
    picture: cc.SpriteFrame[] = [];
    ndFactorys: any;
    ndFarmCells: any;
    ndFarmItems: any;
    ndAnims: any;
    isInDragMap: boolean;
    touchStart: cc.Vec2;
    honeycomb: any;
    curSelCell: any;
    startPlantCell: any;
    animsTargetIdx: {};
    firstHarvestPlant: any;
    firstHarvestAnimal: any;
    firstHarvestFish: any;
    pickData: any;
    isShowTip: boolean;
    curTouchCell: any;
    curPickAnimal: any;
    touchNeighbor: any[];
    ndMap: any;
    spCross: any;
    lockOp: boolean;
    bigTextures: any[];
    isSpOperateStart: boolean;

    constructor() {
        super();
        this.ndFactorys = null;
        this.ndFarmCells = null;
        this.ndFarmItems = null;
        this.ndAnims = null;
        this.isInDragMap = false;
        this.touchStart = cc.v2(0, 0);

        this.honeycomb = null;

        this.curSelCell = null;
        this.startPlantCell = null;

        this.animsTargetIdx = {};

        this.firstHarvestPlant = null;//植物
        this.firstHarvestAnimal = null;//动物
        this.firstHarvestFish = null;//鱼塘

        this.pickData = null;
        this.isShowTip = false;
        this.isSpOperateStart = false;
        this.curTouchCell = null;
        this.curPickAnimal = null;
        this.touchNeighbor = [];
    };
    //单击收获 不需要了
    lbHarvestClick(event) {
        let item = event.target.item;
        if (item) {
            global.Module.FarmParkData.cleartempOpQueue();
            let type = item.type + 1;
            if (type == global.Enum.FarmTypeOp.FARMOP_HARVEST_ANIMAL) {//收获动物
                if (global.Module.FarmParkData.pushOperatorIdx(item.index, global.Enum.FarmTypeOp.FARMOP_HARVEST_ANIMAL)) {
                    this.harvestAnimal(item.index);
                }
                global.Module.FarmParkData.harvest(item.templateID, global.Enum.FarmType.FARM_ANIMAL);
            } else if (type == global.Enum.FarmTypeOp.FARMOP_HARVEST_PLANT) {//收获植物
                if (global.Module.FarmParkData.pushOperatorIdx(item.index, global.Enum.FarmTypeOp.FARMOP_HARVEST_PLANT)) {
                    this.harvestPlant(item.index);
                }
                global.Module.FarmParkData.harvest(item.templateID, global.Enum.FarmType.FARM_PLANT);
            } else {//收获鱼塘
                if (global.Module.FarmParkData.pushOperatorIdx(item.index, global.Enum.FarmTypeOp.FARMOP_HARVEST_FINSH)) {
                    this.harvestFish(item.index);
                }
                global.Module.FarmParkData.harvest(item.templateID, global.Enum.FarmType.FARM_FISH);
            }

        }

    };
    onLoad() {
        global.Instance.Dynamics["FarmParkMap"] = this;
        let self = this;
        global.Module.FarmParkData.loadLocal();
        global.Module.FarmParkData.setMap(this);
        // var animation = this.helpCell2.getChildByName('shou2').getComponent(cc.Animation);
        // animation.on('finished', self.reflashxiarenzhang, self);
        var animation1 = this.helpCell1.getComponent(cc.Animation);
        animation1.on('finished', self.reflashxiarenzhang1, self);
    };

    start() {
        this.ndMap = this.node.getChildByName('ndMap');
        this.spCross = this.node.getChildByName('spCross');
        this.ndFactorys = this.node.getChildByName('ndFactorys');
        this.ndFarmCells = this.node.getChildByName('ndFarmCells');
        this.ndFarmItems = this.node.getChildByName('ndFarmItems');
        this.ndAnims = this.node.getChildByName('ndAnimals');

        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        if (dragLayer) {
            dragLayer.scaleItemLayer(0.5);
            dragLayer.moveItemLayer(-300, -400);
        }
     
        cc.systemEvent.on('10001', this.setData, this);
        let uiRole = global.Manager.UIManager.getMutiPanel('UIRoleInfo');
        if (uiRole)
            uiRole.reflashEcological();

        this.scheduleOnce(function () {
            this.loadMapData();
            this.reflashGreeValue();
        }, 0.5);
        this.scheduleOnce(function () {
            this.setData();
        }, 1.5);
        
    }
    reflashGreeValue() {
        let cellsNum = global.Module.FarmParkData.getCellsNum();
        let greeValue = global.Module.FarmParkData.getGreeValue();
        let num = (greeValue - cellsNum) / cellsNum;
        if (num < 1) {
            this.bg.spriteFrame = null;
        } else if (num < 2) {
            this.bg.spriteFrame = this.picture[0];
        } else if (num < 3) {
            this.bg.spriteFrame = this.picture[1];
        } else {
            this.bg.spriteFrame = this.picture[2];
        }
    }

 
    reflashHelp(isShow){
        let nongchang1 = this.node.getChildByName('nongchang1');
        let nongchang = this.node.getChildByName('nongchang');
        let nongchang2 = this.node.getChildByName('nongchang2');
        let guideNode = this.node.getChildByName('guideNode');
        this.ndFarmItems.active = !isShow;
        this.ndFarmCells.active = !isShow;
        this.ndAnims.active = !isShow;
        this.fishNode.active = !isShow;
        nongchang1.active = isShow;
        nongchang.active = isShow;
        nongchang2.active = isShow;
        guideNode.active = !isShow;
        let dan = this.node.getChildByName('dan');
        if(isShow == false){
            dan.active = false;
        }
        
    }
    reflash(){
        let self = this;
        // var animation = this.helpCell2.getChildByName('shou2').getComponent(cc.Animation);
        // animation.off('finished', self.reflashxiarenzhang, self);
        var animation1 = this.helpCell1.getComponent(cc.Animation);
        animation1.off('finished', self.reflashxiarenzhang1, self);
        this.helpCell1.active = false;
        this.helpCell2.active = false;
        let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
        if (uiFarmParkBag != null)
            uiFarmParkBag.show(global.Enum.ParkBagType.PARKBAG_STRAW, false, null);
     }
    setData() {
        //绿化任务引导土地箭头
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        // let nongchang1 = this.node.getChildByName('nongchang1');
        let animalNum = global.Module.FarmParkData.getAllAnimalNum();
        let date = global.Module.FarmParkData.getAllFishsData();
            let isShow = false;
            for (let key in date) {
                if (date[key] && date[key].templateID > 0) {
                    isShow = true;
                }
            }
        this.helpNode[0].active = (data.state == 1 && data.taskId == 10012);//小麦任务
        this.helpNode[1].active = (data.state == 1 && data.taskId == 10013);//绿化任务
        this.helpNode[2].active = (data.state == 1 && data.taskId == 10018&&animalNum==0);//鸡蛋任务
        this.helpNode[3].active = (data.state == 1 && data.taskId == 10011);//保护区任务
        this.helpNode[4].active = (data.state == 1 && data.taskId == 10016);//水下世界
        this.helpNode[5].active = (data.state == 1 && data.taskId == 10021&&isShow == false);//养鱼  
        if((data.state == 1 && data.taskId == 10012)){
            if(this.firstHarvestPlant){
                this.firstHarvestPlant.setFirstHarvest(false);
                this.firstHarvestPlant = null;
            }
            this.reflashHelp(true);
         
            let plantItem = this.getPlantItem(26);
            if (plantItem)
                plantItem.setFirstHarvest(true);
            this.firstHarvestPlant = plantItem;
        }
        if((data.state == 1 && data.taskId == 10018)){
            // this.ndAnims.active = false;
        }
        if((data.state == 1 && data.taskId == 10013)){
            this.helpCell1.active = true;
            this.reflashHelp(true);
            let cell1 = this.getPlantItem(4);
            if (cell1)
                this.localToFishPool(cell1.node)
            let cell = this.getCellByIndex(4);
            if (cell&&cell.item.canHarvset== false)
                cell.showSel(true);
        }
    };
    reflashAnimation(isShow){
        let nongchang1 = this.node.getChildByName('nongchang1');
        let nongchang = this.node.getChildByName('nongchang');
        nongchang1.active = !isShow;
        nongchang.active = isShow;
        nongchang1.opacity = 0;
        if (isShow == true) {
            let spine = nongchang.getComponent(sp.Skeleton);
            spine.animation = 'maizi';
            nongchang.opacity = 255;
        }
    };
    getAnimation1(isShow){
        let nongchang1 = this.node.getChildByName('nongchang1');
        let spine = nongchang1.getComponent(sp.Skeleton);
        if (isShow == true)
            spine.timeScale = 1;
        else
            spine.timeScale = 0.5;
    };
    getAnimation2(skin,name){
        let nongchang = this.node.getChildByName('nongchang');
        let nongchang1 = this.node.getChildByName('nongchang1');
        nongchang.active = false;
        nongchang1.active = false;
        let nongchang2 = this.node.getChildByName('nongchang2');
        let spine = nongchang2.getComponent(sp.Skeleton);
        nongchang2.active = true;
        spine.loop = true;
        spine.setSkin(skin);
        spine.animation = name;

        nongchang2.opacity = 255;
        spine.timeScale = 1;
    };
    getAnimation(skin,name){
        let nongchang1 = this.node.getChildByName('nongchang1');
        let spine = nongchang1.getComponent(sp.Skeleton);
        let dan = this.node.getChildByName('dan');
        dan.active = (name == 'dan');
        if (name == 'dan') {
            nongchang1.setPosition(186, 179);
        } else {
            nongchang1.setPosition(-501, 556)
        }
        nongchang1.active = true;
        spine.loop = (name == 'dan');
        spine.setSkin(skin);
        spine.animation = name;

        nongchang1.opacity = 255;
        spine.timeScale = 0;
    };
    onDisable() {
        global.Module.FarmParkData.setMap(null);
        cc.systemEvent.off('10001', this.setData, this);
        global.Instance.Dynamics["FarmParkMap"] = null;
    };
    movecell(distanceW, distanceH, callback) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        dragLayer.delayMove(distanceW, distanceH, 0.5, callback)
    };
    createFactory(item, callback) {
        let self = this;
        let ID = item.templateID;

        let factoryData = global.Manager.DBManager.findData("Factory", 'ID', ID);

        if (factoryData != null && factoryData.scene == 'FarmParkScene') {
            let filePath = factoryData.prefabFile;
            cc.loader.loadRes(filePath, function (err, prefab) {
                if (err == null) {
                    let newNode = cc.instantiate(prefab);
                    if (self.ndFactorys != null)
                        self.ndFactorys.addChild(newNode, 0);
                    newNode.setPosition(item.position.x, item.position.y);

                    newNode.tagEx = (ID);
                    let level = global.Module.MainPlayerData.getLevel();
                    newNode.active = factoryData.showLevel <= level;
                    let factoryClass = newNode.getComponent(global.CommonClass.FactoryBase);
                    factoryClass.setID(ID);
                    //农场建筑名字
                    let isShow = global.Module.GameData.getIsShowFactoryName();
                    factoryClass.showName(isShow);
                }

                if (callback)
                    callback(ID);
            });

            return true;
        }

        return false;
    };

    createCells() {
        let cellsNum = global.Module.FarmParkData.getCellsNum();

        let self = this;
        let loadCount = 0;
        for (let index = 0; index < cellsNum; ++index) {
            let position = this.getPositionByIndex(index);
            let zorder = 0;
            let item = global.Module.FarmParkData.getPlantCell(index);

            if (item != null) {
              
                global.CommonClass.FarmParkCell.create(item, this.ndFarmCells, position, function (cell) {
                    let name = 'ndCell' + index.toString();
                    cell.setName(name);
                    cell.tagEx = (index);
                    zorder = index * 5;

                    cell.zIndex = (zorder);
                    cell.active = true;

                    cell.setPosition(position);

                    let cellClass = cell.getComponent(global.CommonClass.FarmParkCell);
                        cellClass.setGreenValue(item.greenValue);

                    ++loadCount;
                    if (loadCount >= 2 * cellsNum)
                        self.onLoadCell();
                });
                global.CommonClass.FarmParkItem.create(item, this.ndFarmItems, position, function (cell) {
                    let name = 'ndItem' + index.toString();
                    cell.setName(name);
                    cell.tagEx = (index);

                    zorder = index * 5;

                    cell.zIndex = (zorder);
                    cell.active = true;

                    cell.setPosition(position);

                    ++loadCount;
                    if (loadCount >= 2 * cellsNum)
                        self.onLoadCell();
                });
               
            }
        }

        let fishsNum = global.Module.FarmParkData.getFishsNum();
        for (let index = 1; index <= fishsNum; ++index) {
            let item = global.Module.FarmParkData.getFishCell(index);
            if (item != null) {
                let cell: any = this.fishNode.getChildByName('itemNode' + index.toString());
                if (cell != null) {
                    let FarmFish = cell.getComponent(global.CommonClass.FarmFish);
                    cell.tagEx = (index);
                    FarmFish.setItem(item);
                    if (index == fishsNum)
                        self.onLoadFinish();
                }
            }
        }
    };

    createAnimals() {
        let self = this;

        let animals = global.Module.FarmParkData.getAllAnimal();
        let cellNum = global.Module.FarmParkData.getCellsNum();

        let animalNum = 0;
        let loadCount = 0;

        let ndAreas = this.node.getChildByName('ndAreas').getChildByName('ndArea3');
        let length = ndAreas.children.length;
        for (let key in animals) {
            let animal = animals[key];
            let data = global.Manager.DBManager.findData("FarmParkAnimal", 'ID', animal.templateID);
            if (data.uncommon == 0) {
                let posIdx = Math.ceil(Math.random() * length);
                let ndArea = ndAreas.getChildByName('ndPos' + posIdx.toString());
                let position = ndArea.getPosition();
                ++animalNum;
                global.CommonClass.FarmParkAniItem.create(animal, this.ndAnims, position, function (item) {
                    item.tagEx = (animal.index);
                    item.setName('ndAnimal' + animal.index.toString());
                    if (animal.withered != 1) {
                        item.zIndex = (2);
                        let animalClass = item.getComponent(global.CommonClass.FarmParkAniItem);
                        var data = global.Module.TaskData.getHasAcceptTaskData();
                        if (data && data.state == 1 && data.taskId == 10018) {
                            animalClass.helpNode(true);
                            item.setPosition(240, 505);
                        }else{
                            self.randAnimalAction(item);
                        }
                        
                    } else {
                        global.Instance.Log.debug("createAnimals", animal.withered)
                        item.zIndex = (1);
                    }

                    ++loadCount;
                    if (loadCount >= animalNum)
                        self.onLoadAnimal();
                });
            }
        }
    };

    caculateCell(touchPoint) {
        let point = this.node.convertToNodeSpaceAR(touchPoint);

        let x = 1750 - point.x;
        let y = 957 - point.y;

        let N = x / 368.0 - y / 184.0;
        let M = x / 368.0 + y / 184.0;

        global.Instance.Log.debug('N: ' + N.toString(), 'M: ' + M.toString());
    };

    getPositionByIndex(index) {
        let farmCell = this.node.getChildByName('farmCell');
        let cellSize = farmCell.getContentSize();
        let startPos = farmCell.getPosition();
        // cellSize.width -= 0.3;
        // cellSize.height -= 0.3;

        let colNum = global.Module.FarmParkData.getColNum();
        let type = index % colNum; //横
        let row = Math.floor(index / colNum); //竖

        let position = cc.v2(0, 0);
        position.x = 171 * type - 197 * row + startPos.x;
        position.y = -113 * row - 97 * type + startPos.y;

        return position;
    };

    lockMove(isLock) {
        let dragLayer = this.node.parent.parent.getComponent('DragLayer');
        dragLayer.lockMove(isLock);
    };

    loadMapData() {
        let factorys = global.Module.FarmParkData.getFactorys();
        let num = 0;
        for (let key in factorys)
            ++num;

        let self = this;
        if (factorys != null) {
            let count = 0;
            this.ndFactorys.removeAllChildren();
            for (let key in factorys) {
                if (key != null) {
                    let item = factorys[key];   //{templateID position}
                    this.createFactory(item, function () {
                        ++count;
                        if (count >= num)
                            self.onLoadFactoryFinish();
                    });
                }
            }//add finish
        }
    };

    onLoadFactoryFinish() {
        this.createCells();
        this.createAnimals();
      
      
        let honeycomb = this.getFactory('bee1');
        this.honeycomb = honeycomb.getComponent(global.CommonClass.Honeycomb);

        global.Proxys.ProxyGuide.centerCurrentScene();
        
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null)
            panel.setProgress(1, 1);
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data && data.state == 1 && data.taskId == 10013) {
            this.scheduleOnce(function () {
                this.helpCell2.active = true;
                var animation = this.helpCell2.getChildByName('shou2').getComponent(cc.Animation);
                animation.play('anxia1');

            }, 1.5);
            this.scheduleOnce(function () {
                this.reflashxiarenzhang();
            }, 2.2)
        }
        global.Module.GameData.showTaskHelp();
    };
    reflashxiarenzhang(){
        this.helpCell1.getChildByName('spCell1').active = true;
        this.reflashFirstHarvest(global.Enum.FarmType.FARM_ANIMAL);
        let cell = this.getPlantItem(4);
        this.localToFishPool(cell.node)
        this.scheduleOnce(function () {
            this.helpCell2.active = false;
        }, 0.7)
        
        let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
        if (uiFarmParkBag != null) {
            uiFarmParkBag.showQuick(global.Enum.ParkBagType.PARKBAG_STRAW, true, cell);
        }
        let canvas = global.CommonClass.Functions.getRoot();
        let FarmScene = canvas.getComponent('FarmScene');
        if (FarmScene)
            FarmScene.reflashHelp();
    }
    reflashxiarenzhang1() {
        let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
        if (uiFarmParkBag != null)
            uiFarmParkBag.show(global.Enum.ParkBagType.PARKBAG_STRAW, false, null);
        this.helpCell2.active = true;
        var animation = this.helpCell2.getChildByName('shou2').getComponent(cc.Animation);
        animation.play('anxia1');
        this.scheduleOnce(function () {
            this.reflashxiarenzhang();
        }, 0.7)
        this.helpCell1.getChildByName('spCell1').active = false;
      
    };
    reflashdonghua(){
        var animation = this.helpCell1.getComponent(cc.Animation);
        animation.play('shou');
    }
    reflashHideHarvest(type){
        if (type == global.Enum.FarmType.FARM_PLANT) {
            if (this.firstHarvestPlant != null) {
                this.firstHarvestPlant.setFirstHarvest(false);
                this.firstHarvestPlant = null;
            }
        }
        else if (type == global.Enum.FarmType.FARM_ANIMAL) {
            if (this.firstHarvestAnimal != null) {
                this.firstHarvestAnimal.setFirstHarvest(false);
                this.firstHarvestAnimal = null;
                
            }
        } else if (type == global.Enum.FarmType.FARM_FISH) {
            if (this.firstHarvestFish != null) {
                this.firstHarvestFish.setFirstHarvest(false);
                this.firstHarvestFish = null;
            }
        }
    };
    /**
     * 随机提示成熟项目
     * @param type 
     */
    reflashFirstHarvest(type) {
        if (type == global.Enum.FarmType.FARM_PLANT) {
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if (this.firstHarvestPlant == null) {
                if (data && data.state == 1 && data.taskId == 10013) {
                    let plantData = global.Module.FarmParkData.findMatureHarvest(type)
                    if (plantData != null) {
                        let plantItem = this.getPlantItem(plantData.index);
                        if (plantItem != null) {
                            plantItem.setFirstHarvest(true);
                            this.firstHarvestPlant = plantItem;
                        }
                    }
                } else {
                    let plantData = global.Module.FarmParkData.findFirstHarvest(type);
                    if (plantData != null) {
                        let plantItem = this.getPlantItem(plantData.index);
                        if (plantItem != null) {
                            plantItem.setFirstHarvest(true);
                            this.firstHarvestPlant = plantItem;
                        }
                    }
                }
               
            }else{
                
                if (data && data.state == 1 && data.taskId == 10013) {
                    let templateID = this.firstHarvestPlant.item.templateID;
                    if (templateID != 110020010) {
                        let plantData = global.Module.FarmParkData.findMatureHarvest(type);
                        if (plantData != null) {
                            let plantItem = this.getPlantItem(plantData.index);
                            if (plantItem != null) {
                                plantItem.setFirstHarvest(true);
                                this.firstHarvestPlant = plantItem;
                                if (data && data.state == 1 && data.taskId == 10021) {
                                    plantItem.helpNode(true);
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (type == global.Enum.FarmType.FARM_ANIMAL) {
            if (this.firstHarvestAnimal == null) {
                let animalData = global.Module.FarmParkData.findFirstHarvest(type);
                if (animalData != null) {
                    let animal = this.getAnimal(animalData.index);
                    if (animal != null) {
                        animal.setFirstHarvest(true);
                        this.firstHarvestAnimal = animal;
                    }
                }
            }
        } else if (type == global.Enum.FarmType.FARM_FISH) {
            if (this.firstHarvestFish == null) {
                let animalData = global.Module.FarmParkData.findFirstHarvest(type);
                if (animalData != null) {
                    let finshAnimal = this.getFishNode(animalData.index);
                    if (finshAnimal != null) {
                        finshAnimal.setFirstHarvest(true);
                        this.firstHarvestFish = finshAnimal;
                    }
                }
            }
        }


    };

    onLoadCell() {
        this.reflashFirstHarvest(global.Enum.FarmType.FARM_PLANT);
        
    };
    onLoadFinish() {
        this.reflashFirstHarvest(global.Enum.FarmType.FARM_FISH);
    };
    onLoadAnimal() {
        this.reflashFirstHarvest(global.Enum.FarmType.FARM_ANIMAL);
    };

    localToFishPool(cell) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        if (dragLayer) {
            let scale = dragLayer.getItemScale();
            if (scale < 0.6) {
                dragLayer.scaleLayer(0.6);
                let position = cc.v2(cell.position.x * scale, cell.position.y * scale);
                dragLayer.setDragItemPosition(position);
            }
        }

    };

    localToFarm() {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        if (dragLayer)
            dragLayer.scaleItemLayer(0.6);

        let data = global.Manager.DBManager.findData('Factory', 'type', 'farm');
        let factory = global.Module.FarmParkData.getFactory(data.ID);

        if (factory != null) {
            let scale = dragLayer.getItemScale();
            let position = cc.v2(factory.position.x * scale, factory.position.y * scale + 150);
            dragLayer.setDragItemPosition(position);
        }
    };
    onOpenUI(factoryID) {
        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID)
        global.Instance.Log.debug("FarmParkMap OpenUI:", factory.type)
        if (factory.type == 'fishRoom') {
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { roleId: ID, type: 1 };
            this.helpNode[4].active = false;
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Proxys.ProxyGuide.stepNextGuide('OpenFishRoom');
                global.Manager.UIManager.open('UIFishRoom', null, null);
            });

        }
        else if (factory.type == 'parkanimal') {//左侧打开农场
            this.helpNode[2].active = false;
            let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
            if (uiFarmParkBag != null) {
                uiFarmParkBag.show(global.Enum.ParkBagType.PARKBAG_ANIMAL, true);
            }
        }
        else if (factory.type == 'parkrareanimal') {//打开动物园
            global.Manager.UIManager.open('UIAnimalPools', null, null);
            this.helpNode[3].active = false;//保护区任务
        }
        else if (factory.type == 'specimenRoom')       //标本
        {
        } else if (factory.type == "fishpool") {
            global.Manager.UIManager.open('UIFishPools', null, null);
            
            this.helpNode[4].active = false;//水下世界任务任务
        }
    };
    judagePick(node, touchPoint) {
        let isPick = false;

        if (!node.active)
            return false;

        let itemClass = node.getComponent(global.CommonClass.FactoryBase);
        if (itemClass != null) {
            isPick = itemClass.isPicked(touchPoint);
        }
        else {
            let boundingBox = node.getBoundingBoxToWorld();
            isPick = boundingBox.contains(touchPoint);
        }

        return isPick;
    };

    getPickFactory(touchPoint) {
        let ndFactorys = this.ndFactorys.children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];

            if (this.judagePick(curND, touchPoint)) {
                let itemClass = curND.getComponent(global.CommonClass.FactoryBase);
                return itemClass;
                /*if (itemClass != null)
                {
                    let factoryID = curND.tagEx
                   // let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID);
                   
                   return itemClass;
                }*/
            }
        }

        return null;
    };

    dealFacorysTouchEvent(event) {
        let isPicked = false;

        let touchPoint = event.getLocation();
        let itemClass = this.getPickFactory(touchPoint);
        if (itemClass) {
            itemClass.onMouseEvent(event);
            isPicked = true;
        }

        return isPicked;
    };

    getFactory(name) {
        let ndFactorys = this.ndFactorys.children;
        for (let key in ndFactorys) {
            let factory = ndFactorys[key];
            let ID = factory.tagEx;
            let data = global.Manager.DBManager.findData("Factory", 'ID', ID);
            if (data != null && data.type == name) {
                return factory;
            }
        }
    };

    pickCell(touchPoint) {
        let cell = this.getPickCell(touchPoint);
        let showItem = null;
        if (cell != null) {
            let index = cell.getIndex();
            if (index != null) {
                let item = global.Module.FarmParkData.getPlantCell(index);
                if (item != null && item.templateID > 0) {
                    showItem = item;
                }
            }
        }
        return cell;
    };
    pickFishCell(touchPoint) {
        let cell = this.getPickCells(touchPoint);
        let showItem = null;
        if (cell != null) {
            let index = cell.getIndex();
            if (index != null) {
                let item = global.Module.FarmParkData.getFishCell(index);
                if (item != null && item.templateID > 0) {
                    showItem = item;
                }
            }
        }

        let uiFarmScene = global.Manager.UIManager.get('UIFarmParkScene');
        if (uiFarmScene != null) {
            if (showItem && !this.isShowTip) {
                let ishow = showItem != null;
                uiFarmScene.showDec(ishow, showItem);
            }
        }

        return cell;
    };

    getPickCell(touchPoint) {
        /*p.x = 原点坐标X + M在像素坐标系X轴的偏移像素 × M + N在像素坐标系X轴的偏移像素 × N = originP.x + tileW /2 × M + （-tileW/2） × N = originP.x + (M – N) × tileW/2；
        p.y = 原点坐标Y + M在像素坐标系Y轴的偏移像素 × M + N在像素坐标系Y轴的偏移像素 × N = originP.y + tileH/2 × M + tileH/2 × N = originP.y + (M + N) × tileH/2;*/

        /* N=int(x/TileW - y/TileH)
         M=int(x/TileW + y/TileH)*/

        if (touchPoint == null)
            return null;

        let cellsNum = global.Module.FarmParkData.getCellsNum();

        for (let i = 0; i < cellsNum; ++i) {
            let cell = this.ndFarmCells.getChildByName('ndCell' + i.toString());
            if (cell != null) {
                if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, cell, 1, 1)) {
                    let farmCell = cell.getComponent(global.CommonClass.FarmParkCell);
                    return farmCell;
                }
            }
        }

        return null;
    };
    getPickCells(touchPoint) {
        /*p.x = 原点坐标X + M在像素坐标系X轴的偏移像素 × M + N在像素坐标系X轴的偏移像素 × N = originP.x + tileW /2 × M + （-tileW/2） × N = originP.x + (M – N) × tileW/2；
        p.y = 原点坐标Y + M在像素坐标系Y轴的偏移像素 × M + N在像素坐标系Y轴的偏移像素 × N = originP.y + tileH/2 × M + tileH/2 × N = originP.y + (M + N) × tileH/2;*/

        /* N=int(x/TileW - y/TileH)
         M=int(x/TileW + y/TileH)*/

        if (touchPoint == null)
            return null;

        for (let i = 1; i < 5; ++i) {
            let cell: any = this.fishNode.getChildByName('itemNode' + i.toString());
            if (cell != null) {
                if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, cell, 1, 1)) {
                    let farmCell = cell.getComponent(global.CommonClass.FarmFish);
                    return farmCell;
                }
            }
        }
        return null;
    };

    getDragRange(){
        return this.firstHarvestFish;
    }
    getTouchCell() {
        return this.curTouchCell;
    };
    getPrakNode() {
        return this.node.getChildByName('prakNode');
    };
    getCellByIndex(index) {
        let cell = this.ndFarmCells.getChildByName('ndCell' + index.toString());
        if (cell != null) {
            let itemClass = cell.getComponent(global.CommonClass.FarmParkCell);
            return itemClass;
        }
        return null;
    };

    getPickAnimal(touchPoint) {
        let pickAnimal = null;
        let ndAnims = this.node.getChildByName('ndAnimals').children;
        for (let key in ndAnims) {
            let animal: any = ndAnims[key];
            let animalClass = animal.getComponent(global.CommonClass.FarmParkAniItem);
            if (animalClass.isPicked(touchPoint)) {
                pickAnimal = animalClass;
                break;
            }
        }

        return pickAnimal;
    };

    getAnimal(index): any {
        let ndAnim: any = this.node.getChildByName('ndAnimals').getChildByName('ndAnimal' + index.toString());
        if (ndAnim != null) {
            return ndAnim.getComponent(global.CommonClass.FarmParkAniItem);
        }
        else {
            global.Instance.Log.debug('', 'xxxxxx');
        }
    };
    getFishNode(index): any {
        let fishcell: any = this.fishNode.getChildByName('itemNode' + index.toString());
        if (fishcell != null) {
            return fishcell.getComponent(global.CommonClass.FarmFish);
        }
        return null;
    };

    flyAnimalMoney(callback) {
        let isFirst = true;
        let ndAnims = this.node.getChildByName('ndAnimals').children;
        for (let key in ndAnims) {
            let animal: any = ndAnims[key];
            let animalClass = animal.getComponent(global.CommonClass.FarmParkAniItem);
            if (animalClass.isUncommon()) {
                if (isFirst) {
                    animalClass.playMoneyFly(callback);
                    isFirst = false;
                }
                else {
                    animalClass.playMoneyFly();
                }
            }
        }
    };

    hasUncommonAnimal() {
        let ndAnims = this.node.getChildByName('ndAnimals').children;
        for (let key in ndAnims) {
            let animal: any = ndAnims[key];
            let animalClass = animal.getComponent(global.CommonClass.FarmParkAniItem);
            if (animalClass.isUncommon()) {
                return true;
            }
        }

        return false;
    };

    getPlantCell(index)        //get palnt cell
    {
        let ndCells = this.node.getChildByName('ndFarmCells');
        let ndCell: any = ndCells.getChildByName('ndCell' + (index).toString());

        if (ndCell != null)
            return ndCell.getComponent(global.CommonClass.FarmParkCell);

        return null;
    };

    getPlantItem(index): any {
        let ndFarmItems = this.node.getChildByName('ndFarmItems');
        let ndItem: any = ndFarmItems.getChildByName('ndItem' + (index).toString());

        if (ndItem != null)
            return ndItem.getComponent(global.CommonClass.FarmParkItem);

        return null;
    };

    growPlant(itemID, touchPoint) {
        let cell = this.getPickCell(touchPoint);
        if (cell != null) {
            let growInfo = global.Module.FarmParkData.getCanGrowInfo(itemID, cell);
            if (growInfo != null) {
                global.CommonClass.UITip.showTipTxt(growInfo, global.Enum.TipType.TIP_BAD);
            }
            else {
                let index = cell.getIndex();

                let colNum = global.Module.FarmParkData.getColNum();
                let x = Math.floor(index / colNum);
                let y = Math.floor(index % colNum);
                let msgData = { x: x, y: y, plantID: itemID };

                global.Instance.AudioEngine.replaySound('seed', false, null);
                global.Instance.MsgPools.send('parkPlacePlant', msgData, function (msg) {
                    if (msg.errorID == 0) {

                    }
                });
            }
        }
    };

    growPlantSeq(itemID, index, showType) {
        let obj = global.Module.FarmParkData.getPlantCell(index);
        let plantItem = this.getPlantItem(index);
        if (plantItem != null)
            plantItem.setItem(obj);

        let colNum = global.Module.FarmParkData.getColNum();
        let x = Math.floor(index / colNum);
        let y = Math.floor(index % colNum);
        let msgData = { x: x, y: y, plantID: itemID };
        global.Module.GameData.openLockSocketOp(false);
        global.Instance.AudioEngine.replaySound('seed', false, null);
        if (showType == global.Enum.ParkBagType.PARKBAG_STRAW) {//花草
            global.Instance.MsgPools.send('parkPlacePlant', msgData, function (msg) {
                global.Module.GameData.openLockSocketOp(true);

                let obj = global.Module.FarmParkData.getPlantCell(index);
                obj.seed = false;

                if (msg.errorID != 0) {
                }
            });
        } else if (showType == global.Enum.ParkBagType.PARKBAG_PLANT) {//蔬果
            global.Instance.MsgPools.send('ParkPlaceCrops', msgData, function (msg) {
                global.Module.GameData.openLockSocketOp(true);
                let obj = global.Module.FarmParkData.getPlantCell(index);
                obj.seed = false;
                if (msg.errorID != 0) {
                }
            });
        } else if (showType == global.Enum.ParkBagType.PARKBAG_TREE) {//树木
            global.Instance.MsgPools.send('parkPlaceTree', msgData, function (msg) {
                global.Module.GameData.openLockSocketOp(true);
                let obj = global.Module.FarmParkData.getPlantCell(index);
                obj.seed = false;
                if (msg.errorID != 0) {
                }
            });
        }



    };
    growFishSeq(itemID, index, showType) {
        let msgData = { fishID: itemID, index: index };
        global.Module.GameData.openLockSocketOp(false);
        global.Instance.AudioEngine.replaySound('seed', false, null);
        global.Instance.MsgPools.send('parkPlaceFish', msgData, null);
    };
    reflashFishNode(obj) {
        let plantItem = this.getFishNode(obj.index);
        if (plantItem != null) {
            plantItem.setItem(obj);
        }

    };
    getHoneycomb() {
        return this.honeycomb;
    };

    randAnimalAction(ndAnim) {
        ndAnim.stopAllActions();
        let resulet = Math.floor(Math.random() * 3);
        if (resulet == 0) {
            this.animalMove(ndAnim);
        }
        else if (resulet == 1) {
            this.animalMove(ndAnim);
        }
        else if (resulet == 2) {
            this.animalIdle(ndAnim);
        }
    };

    caculateTargetIdx(animalName,index) {
        let curTargetIdx = this.animsTargetIdx[animalName];
        if (curTargetIdx == null)
            curTargetIdx = 304;
        let areaIdx = Math.floor(curTargetIdx / 100);
        let randAdd = Math.floor(Math.random() * 3) - 1;
        areaIdx += randAdd;
        let itemData = global.Module.FarmParkData.getAnimal(index);
        if(itemData.canHarvset == true){
            areaIdx = 6;
        }else{
            if (areaIdx > 5)
            areaIdx = 5;
        else if (areaIdx < 1)
            areaIdx = 1;
        }
      

        let ndAreas = this.node.getChildByName('ndAreas');
        let ndArea = ndAreas.getChildByName('ndArea' + areaIdx.toString());
        let areaNum = ndArea.children.length;
        let randIdx = Math.floor(Math.random() * areaNum) + 1;
        let targetIdx = areaIdx * 100 + randIdx;
        this.animsTargetIdx[animalName] = targetIdx;
        let ndPos = ndArea.getChildByName('ndPos' + randIdx.toString());
        return ndPos;
    };

    animalMove(ndAnim) {
        let animalClass = ndAnim.getComponent(global.CommonClass.FarmParkAniItem);

        animalClass.changeAnimaAction('walk');

        let ndMove = this.caculateTargetIdx(ndAnim.name,ndAnim.tagEx);
        let targetPosition = ndMove.getPosition();

        let distance = ndAnim.getPosition().sub(targetPosition).mag();

        let speed = 40;
        let timeCost = distance / speed;
        let moveAct = cc.moveTo(timeCost, targetPosition.x, targetPosition.y);
        let endFunction = cc.callFunc(this.randAnimalAction, this, ndAnim);
        let seq = cc.sequence(moveAct, endFunction);
        ndAnim.runAction(seq);

        this.setFlip(ndAnim, targetPosition);
    };

    animalIdle(ndAnim) {
        let delay = cc.delayTime(3);

        let animalClass = ndAnim.getComponent(global.CommonClass.FarmParkAniItem);
        animalClass.changeAnimaAction('sit');

        let endFunction = cc.callFunc(this.randAnimalAction, this, ndAnim);
        let seq = cc.sequence(delay, endFunction);
        ndAnim.runAction(seq);
    };
    //放置农场动物
    putNewAnimal(itemID, event) {
        if (!global.Module.FarmParkData.checkLevel(itemID, global.Enum.FarmType.FARM_ANIMAL)) {
            global.CommonClass.UITip.showTipTxt('等级不够', global.Enum.TipType.TIP_BAD);
            return;
        }
        if (global.Module.TaskData.taskguard(10018)) {
            return;
        }



        //动物任务安全保护 -鸡蛋
        if (itemID == '220020001')
            if (global.Module.TaskData.taskguard(10018))
                return;
        
        event = event.convertToWorldSpaceAR(cc.v2(0, 0));
        let boundingBox = this.node.getChildByName('putNewAnimal').getBoundingBoxToWorld();
        if (boundingBox.contains(event)) {
            let ndAnims = this.node.getChildByName('ndAnimals');
            let bornPos = ndAnims.convertToNodeSpaceAR(event);
            let targetPos = ndAnims.convertToNodeSpaceAR(event);
            if (itemID > 0) {
                let ndAnims = this.node.getChildByName('ndAnimals');

                let self = this;
                let msgData = { animalID: itemID };
                global.Instance.Log.debug('放置动物', msgData)
                global.Instance.MsgPools.send('parkPlaceAnimal', msgData, function (msg) {
                    if (msg.errorID == 0) {
                        let itemData = global.Module.FarmParkData.getAnimal(msg.animal.animalTimeID);
                        if (itemData != null) {
                            global.CommonClass.FarmParkAniItem.create(itemData, ndAnims, bornPos, function (item) {
                                item.tagEx = (msg.animal.animalTimeID);
                                item.setName('ndAnimal' + msg.animal.animalTimeID.toString());
                                
                              

                                let animalClass = item.getComponent(global.CommonClass.FarmParkAniItem);
                                animalClass.changeAnimaAction('walk');
                                var data = global.Module.TaskData.getHasAcceptTaskData();
                                let action = cc.moveTo(3, targetPos.x, targetPos.y);
                                if (data && data.state == 1 && data.taskId == 10018) {
                                    animalClass.helpNode(true);
                                    item.setPosition(240, 505);
                                } else {
                                    let delayEnd = function () {
                                        self.animalMove(item);
                                    };
                                    self.setFlip(item, targetPos);
                                    let endFunction = cc.callFunc(delayEnd);
                                    let seq = cc.sequence(action, endFunction);
                                    item.runAction(seq);
                                }
                               
                            });
                        }

                        global.Instance.AudioEngine.replaySound('putanimal', false, null);
                    }
                });
            }
            let uiRole = global.Manager.UIManager.getMutiPanel('UIRoleInfo');
            if (uiRole)
                uiRole.reflashEcological();
        }

    };

    rareAnimalGo(item, isIn) {
        let self = this;

        let ndFacotry = this.ndFactorys.getChildByName('ParkRareAnimal');

        let ndBorn = ndFacotry.getChildByName('ndBorn');
        let ndTarget1 = ndFacotry.getChildByName('ndTarget1');
        let ndTarget2 = ndFacotry.getChildByName('ndTarget2');

        let ndAnims = this.node.getChildByName('ndAnimals');

        let worldBornPos = ndBorn.convertToWorldSpaceAR(cc.v2(0, 0));
        let bornPos = ndAnims.convertToNodeSpaceAR(worldBornPos);
        let worldTargetPos1 = ndTarget1.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetPos1 = ndAnims.convertToNodeSpaceAR(worldTargetPos1);
        let worldTargetPos2 = ndTarget2.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetPos2 = ndAnims.convertToNodeSpaceAR(worldTargetPos2);

        if (isIn) {
            let delayEnd = function () {
                self.animalMove(item);
            };

            item.opacity = 0;
            let animalClass = item.getComponent(global.CommonClass.FarmParkAniItem);
            animalClass.changeAnimaAction('walk');

            this.setFlip(item, targetPos1);

            let action = cc.moveTo(3, targetPos1.x, targetPos1.y);
            let fadeOut = cc.fadeIn(3);
            let moveTo = cc.spawn(action, fadeOut);

            let moveEnd = cc.moveTo(2, targetPos2.x, targetPos2.y);

            let endFunction = cc.callFunc(delayEnd)
            let seq = cc.sequence(moveTo, moveEnd, endFunction);
            item.runAction(seq);
        }
        else {
            let delayEnd = function () {
                item.removeFromParent();
            };
            let endFunction = cc.callFunc(delayEnd)

            let animalClass = item.getComponent(global.CommonClass.FarmParkAniItem);
            animalClass.changeAnimaAction('walk');

            this.setFlip(item, targetPos2);

            let moveTo1 = cc.moveTo(3, targetPos2.x, targetPos2.y);

            let moveEndCall = function () {
                self.setFlip(item, targetPos1);
            };
            let moveEndFunc = cc.callFunc(moveEndCall)
            let moveTo2 = cc.moveTo(3, targetPos1.x, targetPos1.y);

            let fadeOut = cc.fadeOut(3);
            let moveEnd = cc.moveTo(3, bornPos.x, bornPos.y);
            let moveTo = cc.spawn(moveEnd, fadeOut);

            let seq = cc.sequence(moveTo1, moveEndFunc, moveTo2, moveTo, endFunction);
            item.runAction(seq);
        }
    };
    //农场放置动物园珍惜动物
    putNewRareAnimal(itemID, animal) {
        if (!global.Module.FarmParkData.checkLevel(itemID, global.Enum.FarmType.PARKBAG_RARE_ANIMAL)) {
            global.CommonClass.UITip.showTipTxt('等级不够', global.Enum.TipType.TIP_BAD);
            return;
        }
        if (itemID > 0) {
            let ndAnims = this.node.getChildByName('ndAnimals');

            let self = this;
            let msgData = { animalID: itemID };

            let ndFacotry = this.ndFactorys.getChildByName('ParkRareAnimal');
            let ndBorn = ndFacotry.getChildByName('ndBorn');
            let worldBornPos = ndBorn.convertToWorldSpaceAR(cc.v2(0, 0));
            let bornPos = ndAnims.convertToNodeSpaceAR(worldBornPos);

            let itemData = global.Module.FarmParkData.getAnimal(animal.animalTimeID);
            if (itemData != null) {
                global.CommonClass.FarmParkAniItem.create(itemData, ndAnims, bornPos, function (item) {
                    item.tagEx = (animal.animalTimeID);
                    item.setName('ndAnimal' + animal.animalTimeID.toString());
                    self.rareAnimalGo(item, true);
                });
            }

            global.Instance.AudioEngine.replaySound('putanimal', false, null);
        }
        let uiRole = global.Manager.UIManager.getMutiPanel('UIRoleInfo');
        if (uiRole)
            uiRole.reflashEcological();


    };


    removeAnimal(index) {
        let animal = this.getAnimal(index);
        if (animal != null) {
            animal.node.removeFromParent();
        }
    };
    //显示隐藏建筑名称
    showFactoryName(isShow) {
        let ndFactorys = this.ndFactorys.children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let factoryID = curND.tagEx;

            let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryID);
            let itemClass = curND.getComponent(factoryClass);

            itemClass.showName(isShow);
        }
    };

    setFlip(ndAnima, targetPos) {
        let position = ndAnima.getPosition();
        let moveVec = cc.v2(targetPos.x - position.x, targetPos.y - position.y);
        let Node = ndAnima.getChildByName('Node');
        Node.scaleY = 1;
        if (moveVec.x < 0) {
            Node.scaleX = 1;
        }
        else {
            Node.scaleX = -1;
        }
    };

    checkHarvestFirst(index, type) {
        if (type == global.Enum.FarmType.FARM_PLANT) {
            if (this.firstHarvestPlant != null && this.firstHarvestPlant.item.index == index) {
                this.firstHarvestPlant = null;
                return true;
            }
        }
        else if (type == global.Enum.FarmType.FARM_ANIMAL) {
            if (this.firstHarvestAnimal != null && this.firstHarvestAnimal.item.index == index) {
                this.firstHarvestAnimal = null;
                return true;
            }
        } else if (type == global.Enum.FarmType.FARM_FISH) {
            if (this.firstHarvestFish != null && this.firstHarvestFish.item.index == index) {
                this.firstHarvestFish = null;
                return true;
            }
        }

        return false;
    };

    harvestAnimal(index) {
        //收获动物
        let farmParkAnimal: any = this.getAnimal(index);
        if (farmParkAnimal != null) {
            let ndAnim = farmParkAnimal.node;
            let position: any = global.CommonClass.Functions.nodePositionToRoot(ndAnim);
            position.y += 20;

            let animalData = global.Module.FarmParkData.getAnimal(index);
            let data = global.Manager.DBManager.findData('FarmParkAnimal', 'ID', animalData.templateID);
            if (data != null && data.productId > 100000000)
                global.CommonClass.ItemDrop.createOneDrop(data.productId, data.productNum, null, position, null);

            if (animalData.harvestLeft == 1) {
                farmParkAnimal.setItemWithered();
                ndAnim.stopAllActions();
            }
            else if (animalData.harvestLeft == 0) {
                ndAnim.removeFromParent();
            }

            if (this.checkHarvestFirst(index, global.Enum.FarmType.FARM_ANIMAL))
                farmParkAnimal.setFirstHarvest(false);

            global.Instance.AudioEngine.replaySound('harvest', false, null);
        }
    };

    harvestPlant(index) {
        //收获更新植物
        let obj = global.Module.FarmParkData.getPlantCell(index);
        let plantItem: any = this.getPlantItem(index);
        if (plantItem != null)
            plantItem.setItem(obj);

        if (this.checkHarvestFirst(index, global.Enum.FarmType.FARM_PLANT))
            plantItem.setFirstHarvest(false);
        plantItem.removespItem(false);

        let data = global.Module.FarmParkData.farmData(obj.templateID);
        global.Module.GameData.setDropInstance(plantItem.node);
        if (data.productId > 100000000)
            global.CommonClass.ItemDrop.createOneDrop(data.productId, data.productNum, plantItem.node, cc.v2(0, 20), null);

        global.Instance.AudioEngine.replaySound('harvest', false, null);
    };
    harvestFish(index) {
        //收获更新鱼塘
        let obj = global.Module.FarmParkData.getFishCell(index);
        let finshAnimal: any = this.getFishNode(index);
        if (this.checkHarvestFirst(index, global.Enum.FarmType.FARM_FISH))
            finshAnimal.setFirstHarvest(false);
        let data = global.Module.FarmParkData.farmData(obj.templateID);
        global.Module.GameData.setDropInstance(finshAnimal.node);
        if (data.productId > 100000000)
            global.CommonClass.ItemDrop.createOneDrop(data.productId, data.productNum, finshAnimal.node, cc.v2(0, 20), null);

        global.Instance.AudioEngine.replaySound('harvest', false, null);
    };

    shovelPlant(index) {
        //变成了tempShovel要更新
        let obj = global.Module.FarmParkData.getPlantCell(index);
        let plantItem: any = this.getPlantItem(index);
        if (plantItem != null)
            plantItem.setItem(obj);

        global.Instance.AudioEngine.replaySound('harvest', false, null);
    };

    shovelAnimal(index) {
        let obj = global.Module.FarmParkData.getAnimal(index);
        let animalItem: any = this.getAnimal(index);
        if (animalItem != null)
            animalItem.setItem(obj);

        global.Instance.AudioEngine.replaySound('harvest', false, null);
    };
    /**
      * 生态园动物自行离开
      * @param {*} msg 
      */
    levelAnimal(index) {
        let animalItem = this.getAnimal(index);
        if (animalItem != null) {
            let ndAnim = animalItem.node;
            ndAnim.tagEx = (-1);

            this.rareAnimalGo(ndAnim, false);
        }
    };

    reflashCell(index) {
        let cell = this.getCellByIndex(index);
        if (cell != null) {
            let obj = global.Module.FarmParkData.getPlantCell(index);
            cell.setItem(obj);

            let plantItem: any = this.getPlantItem(index);
            if (plantItem != null)
                plantItem.setItem(obj);
        }
    };
    reflashAnimal(index) {
        let animalItem = this.getAnimal(index);
        if (animalItem != null) {
            let obj = global.Module.FarmParkData.getAnimal(index);
            animalItem.setItem(obj);
            this.randAnimalAction(animalItem.node);
        }
        
    };
    setPlantStage(index, stage) {
        let item: any = this.getPlantItem(index);
        if (item != null) {
            item.setItemStage(stage);
        }
    };

    setPlantGreen(index, green) {
        let cell = this.getCellByIndex(index);
        if (cell != null) {
            cell.setGreenValue(green);
        }
    };

    reflashGreenValue(index, isHarvest) {
        let FarmParkData = global.Module.FarmParkData;

        let changeIndexs = [];
        let neighbors = FarmParkData.makeNeighborArray(index, null);
        for (let key in neighbors) {
            let neighborIndex = neighbors[key];
            let item = FarmParkData.getPlantCell(neighborIndex);
            if (item.templateID <= 0) {
                if (FarmParkData.setGreenValue(neighborIndex, false))
                    changeIndexs.push(neighborIndex);
            }
        }

        if (isHarvest) {
            if (FarmParkData.setGreenValue(index, true))
                changeIndexs.push(index);
        }

        for (let i in changeIndexs) {
            let changeIdx = changeIndexs[i];
            let item = FarmParkData.getPlantCell(changeIdx);
            this.setPlantGreen(changeIdx, item.greenValue);
        }

    };
    showFishCell(isShow) {
        let fishArr: any = this.fishNode.children;
        for (let i = 0; i < fishArr.length; i++) {
            const element = fishArr[i].getComponent(global.CommonClass.FarmFish);
            element.showSel(false);
        }
        if(isShow == true)
        this.curSelCell = this.curTouchCell;
        if (this.curSelCell)
            this.curSelCell.showSel(isShow);
    };
    showSelectCell(isShow) {
        if (this.curSelCell != null && this.curSelCell != this.curTouchCell) {
            this.curSelCell.showSel(false);
        }
        this.curSelCell = this.curTouchCell;

        if (this.curSelCell != null) {
            this.curSelCell.showSel(isShow);
        }
    };

    showSelectAnimal(isShow) {
        if (this.curPickAnimal != null && this.curPickAnimal != this.curTouchCell) {
            this.curPickAnimal.showSel(false);
        }
        this.curPickAnimal = this.curTouchCell;
        if (this.curPickAnimal != null) {
            this.curPickAnimal.showSel(isShow);
        }
    };



    adjustEdge(cell, callBack) {
        let root = global.CommonClass.Functions.getRoot();
        let size = root.getContentSize();

        let edgeSpaceLW = 300;
        let edgeSpaceRW = 70;
        let edgeSpaceDH = 50;
        let edgeSpaceUH = 150;

        let distanceW = 0;
        let distanceH = 0;

        let position = cell.node.getPosition();
        let worldPos = cell.node.convertToWorldSpaceAR(cc.v2(0, 0));
        if (worldPos.x < edgeSpaceLW)
            worldPos.x = edgeSpaceLW;
        else if (worldPos.x > size.width - edgeSpaceRW)
            worldPos.x = size.width - edgeSpaceRW;

        if (worldPos.y < edgeSpaceDH)
            worldPos.y = edgeSpaceDH;
        else if (worldPos.y > size.height - edgeSpaceUH)
            worldPos.y = size.height - edgeSpaceUH;

        let newPos = cell.node.parent.convertToNodeSpaceAR(worldPos);
        distanceW = newPos.x - position.x;
        distanceH = newPos.y - position.y;

        if (Math.abs(distanceH) > 1 || Math.abs(distanceW) > 1) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
            if (dragLayer)
                dragLayer.delayMove(distanceW, distanceH, 1);

            return true;
        }
        return false;
    };

    getCrossCell(cellIdxs, touchPoint, isShow) {
        for (let i = 0; i < cellIdxs.length; ++i) {
            let cellIdx = cellIdxs[i];
            let cell;
            if (isShow) {
                cell = this.ndFarmCells.getChildByName('ndCell' + cellIdx.toString());
            } else {
                cell = this.fishNode.getChildByName('itemNode' + cellIdx.toString());
            }
            if (cell != null) {
                if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, cell, 1, 1)) {
                    let farmCell;
                    if (isShow) {
                        farmCell = cell.getComponent(global.CommonClass.FarmParkCell);
                    } else {
                        farmCell = cell.getComponent(global.CommonClass.FarmFish);
                    }
                    return farmCell;
                }
            }
        }

        return null;
    };
    /**
     * 动物
     * @param {*} touchPoint 
     */
     changeTouchCellPick(touchPoint) {
        if (this.curTouchCell != null) {
            let pickAnimal = this.getPickAnimal(touchPoint);
            if (pickAnimal != null) {
                this.curTouchCell = pickAnimal;
                this.curTouchCell = pickAnimal;
                let index = pickAnimal.getIndex();
                this.touchNeighbor = global.Module.FarmParkData.makeNeighborArray(index, true);
            }
            else {
                if (!global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, this.curTouchCell.node, 1, 1)) {
                    this.curTouchCell = null;
                }
            }
        }
        else //表示滑出界了
        {
           this.curTouchCell = this.getPickAnimal(touchPoint);
        }
    };
    /**
     * 农场
     * @param {*} touchPoint 
     */
    changeTouchCell(touchPoint) {
        if (this.curTouchCell != null) {

            let newCell = this.getCrossCell(this.touchNeighbor, touchPoint, true);
            if (newCell != null) {
                this.curTouchCell = newCell;
                this.touchNeighbor = global.Module.FarmParkData.makeNeighborArray(newCell.getIndex(), true);
            }
            else {
                if (!global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, this.curTouchCell.node, 1, 1)) {
                    this.curTouchCell = null;
                }
            }
        }
        else //表示滑出界了
        {
            //判断是否又滑进来了
            if (this.spCross != null && global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, this.spCross, 1, 1)) {
                this.curTouchCell = this.getPickCell(touchPoint);
            }
        }
    };
    /**
    * 鱼塘
    * @param {*} touchPoint 
    */
    changeTouchCells(touchPoint) {
        if (this.curTouchCell != null) {
            var touArr = [1, 2, 3, 4]
            let newCell = this.getCrossCell(touArr, touchPoint, false);
            if (newCell != null) {
                this.curTouchCell = newCell;
            }
            else {
                if (!global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, this.curTouchCell.node, 1, 1)) {
                    this.curTouchCell = null;
                }
            }
        }
        else //表示滑出界了
        {
            //判断是否又滑进来了
            if (this.spCross != null && global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, this.fishNode, 1, 1)) {
                this.curTouchCell = this.getPickCells(touchPoint);
            }
        }
    };
    //判断点击的是否是收获的标志
    reflashHarvest(touchPoint) {
        if (this.firstHarvestPlant != null) {//植物
            if (this.firstHarvestPlant.isHarvestPicked(touchPoint)) {
                let index = this.firstHarvestPlant.item.index;
                let cell = this.getCellByIndex(index);
                this.firstHarvestPlant.setFirstHarvest(false);
                if (cell != null)
                    cell.showSel(true);
                this.firstHarvestPlant = null;
                
                return cell;
            }

        }
        if (this.firstHarvestAnimal != null) {//动物
            if (this.firstHarvestAnimal.isHarvestPicked(touchPoint)) {

                let index = this.firstHarvestAnimal.item.index;
                let animal = this.getAnimal(index);
                this.firstHarvestAnimal.setFirstHarvest(false);
                this.firstHarvestAnimal.showSel(true);
                this.firstHarvestAnimal = null;
                
                return animal;
            }

        }
        if (this.firstHarvestFish != null) {//鱼塘
            if (this.firstHarvestFish.isHarvestPicked(touchPoint)) {
                let index = this.firstHarvestFish.item.index;
                let finshAnimal = this.getFishNode(index);
                this.firstHarvestFish.setFirstHarvest(false);
                this.firstHarvestFish.showSel(true);
                this.firstHarvestFish = null;
                return finshAnimal;
            }

        }
        return null;
    };
    
    onDragEvent(event) {
        if (event == null || event.touch == null)
            return;
        let touchPoint = event.getLocation();
        if (this.isSpOperateStart == true) {
            let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
            if (uiParkScene)
                uiParkScene.touchEvent(event);
            if (event.type == cc.Node.EventType.TOUCH_MOVE) {
                let distance = touchPoint.sub(this.touchStart).mag();
                if (distance > 5)
                    this.isInDragMap = true;
            } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
                this.lockMove(false);
                if (this.isInDragMap == false) {
                    if (this.curTouchCell) {
                        let type = this.curTouchCell.getType();
                        let index = this.curTouchCell.item.index
                        if (type == global.Enum.FarmType.FARM_PLANT) {
                            if (this.firstHarvestPlant == null) {
                                let plantData = global.Module.FarmParkData.findFirstHarvest(type);
                                if (plantData != null) {
                                    let plantItem = this.getPlantItem(index);
                                    if (plantItem != null) {
                                        plantItem.setFirstHarvest(true);
                                        this.firstHarvestPlant = plantItem;
                                    }
                                }
                            }
                        } else if (type == global.Enum.FarmType.FARM_ANIMAL) {
                            if (this.firstHarvestAnimal == null) {
                                let animalData = global.Module.FarmParkData.findFirstHarvest(type);
                                if (animalData != null) {
                                    let animal = this.getAnimal(index);
                                    if (animal != null) {
                                        animal.setFirstHarvest(true);
                                        this.firstHarvestAnimal = animal;
                                    }
                                }
                            }
                        } else if (type == global.Enum.FarmType.FARM_FISH) {
                            if (this.firstHarvestFish == null) {
                                let animalData = global.Module.FarmParkData.findFirstHarvest(type);
                                if (animalData != null) {
                                    let finshAnimal = this.getFishNode(index);
                                    if (finshAnimal != null) {
                                        finshAnimal.setFirstHarvest(true);
                                        this.firstHarvestFish = finshAnimal;
                                    }
                                }
                            }
                        }
                    }
                }
                this.isSpOperateStart = false;
                this.isInDragMap = false;
                let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
                if (dragLayer)
                    dragLayer.sedisScale(true);
            }
        } else {
            //处理建筑内部鼠标逻辑
            let isPickFactory = this.dealFacorysTouchEvent(event);

       

            if (event.type == cc.Node.EventType.TOUCH_START) {
                this.isInDragMap = false;
                this.touchStart = touchPoint;
                this.curTouchCell = null;
                if (isPickFactory == false) {//没有点击到建筑
                    let curTouchCell = this.reflashHarvest(touchPoint);
                    this.curTouchCell = curTouchCell;//当前选中的节点
                    if (curTouchCell == null) {

    
                   }else{
                        
                       let item = null;
                       if (this.curTouchCell) {
                           if (this.curTouchCell.item)
                               this.curTouchCell.item = global.Module.FarmParkData.getItemByType(this.curTouchCell.item.index, this.curTouchCell.item.type);
                           item = this.curTouchCell.item;
                       }
                       if (this.curTouchCell != null && item && item.canHarvset == true) {
                           this.lockMove(true)
                           let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
                           if (uiParkScene)
                               uiParkScene.spOperateStart(event, this.curTouchCell);
                           this.isSpOperateStart = true;
                       }
                   }

                }
            } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

                let distance = touchPoint.sub(this.touchStart).mag();
                if (distance > 5)
                    this.isInDragMap = true;
            }
            else if (event.type == cc.Node.EventType.TOUCH_END) {
              //this.isInDragMap == false;没有拖动 isPickFactory == false;没有点击建筑 this.getPickAnimal(touchPoint) == null; 不是点击动物
              let uiFarmScene = global.Manager.UIManager.get('UIFarmParkScene');
             
                if (this.isInDragMap == false) {
                    if (isPickFactory == true) {
                        let itemClass = this.getPickFactory(touchPoint);
                        if (itemClass) {
                            let factoryID = itemClass.node.tagEx;
                            this.onOpenUI(factoryID);
                        }
                        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
                        if (dragLayer)
                            dragLayer.sedisScale(true);
                    } else {
                        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
                        if (dragLayer)
                            dragLayer.sedisScale(false);
                        let pickAnimal = this.getPickAnimal(touchPoint);
                        if (this.curPickAnimal != null)
                            this.curPickAnimal.showSel(false);
                        if (pickAnimal != null) {
                            global.Instance.Log.debug("是生态园的动物", pickAnimal);
                            this.curTouchCell = pickAnimal;
                            let index = pickAnimal.getIndex();
                            this.touchNeighbor = global.Module.FarmParkData.makeNeighborArray(index, true);
                           
                            let item = global.Module.FarmParkData.getAnimal(index);
                            if (uiFarmScene != null)
                                uiFarmScene.showDec((item.canHarvset == false), item);
                            this.reflashHideHarvest(global.Enum.FarmType.FARM_ANIMAL);
                            this.curPickAnimal = pickAnimal;
                            this.curPickAnimal.showSel(true);
                            let animal = this.getAnimal(index);
                            if (animal != null) {
                                animal.helpNode(false);
                                if (item.canHarvset == true) {
                                    animal.setFirstHarvest(true);
                                    this.firstHarvestAnimal = animal;
                                }
                            }

                        } else {
                            this.reflashFirstHarvest(global.Enum.FarmType.FARM_ANIMAL);
                            let cell = this.pickCell(touchPoint);
                            global.Instance.Log.debug("是农场的田", cell);
                            if (cell != null) {
                                this.curTouchCell = cell;
                                this.localToFishPool(cell.node)
                                let index = cell.getIndex();
                                this.touchNeighbor = global.Module.FarmParkData.makeNeighborArray(index, true);
                                let item = global.Module.FarmParkData.getPlantCell(index);
                               
                                if (uiFarmScene != null)
                                    uiFarmScene.showDec((item.canHarvset == false && item.templateID > 0), item);
                                    this.reflashHideHarvest(global.Enum.FarmType.FARM_PLANT);
                                    this.showSelectCell(true);
                                if (item.canHarvset != true) {
                                    if (item != null && item.templateID <= 0) {
                                        this.helpNode[0].active = false;//关闭绿化任务引导土地箭头
                                        this.helpNode[1].active = false;
                                    
                                        let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
                                        //uiFarmParkBag != null  打开左侧种植列表
                                        if (uiFarmParkBag != null) {
                                            let taskdata = global.Module.TaskData.getHasAcceptTaskData();
                                            if (taskdata && (taskdata.taskId == 10012||taskdata.taskId == 10013) && taskdata.state == 1) {
                                                uiFarmParkBag.showQuick(global.Enum.ParkBagType.PARKBAG_STRAW, true, cell);
                                            }else{
                                                uiFarmParkBag.show(global.Enum.ParkBagType.PARKBAG_STRAW, true, cell);

                                            }
                                        }
                                    }
                                } else {
                                    let plantItem = this.getPlantItem(index);
                                    if (plantItem != null) {
                                        plantItem.setFirstHarvest(true);
                                        this.firstHarvestPlant = plantItem;
                                    }
                                }

                            } else {
                                let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
                                if (uiFarmParkBag != null)
                                    uiFarmParkBag.show(global.Enum.ParkBagType.PARKBAG_STRAW, false, null);
                                cell = this.getPickCells(touchPoint);
                                global.Instance.Log.debug("是鱼塘的田", cell);
                                if (this.firstHarvestPlant == null)
                                    this.showSelectCell(false);
                                this.reflashFirstHarvest(global.Enum.FarmType.FARM_PLANT);
                                if (cell != null) {
                                    
                                 
                                    this.helpNode[5].active = false;
                                    this.curTouchCell = cell;
                                    let index = cell.getIndex();
                                    this.touchNeighbor = global.Module.FarmParkData.makeNeighborArray(index, true);
                                    let item = global.Module.FarmParkData.getFishCell(index);
                                    if (uiFarmScene != null)
                                        uiFarmScene.showDec((item.canHarvset == false && item.templateID > 0), item);
                                    this.reflashHideHarvest(global.Enum.FarmType.FARM_FISH);
                                    this.showFishCell(true);
                                    let animal = this.getFishNode(index);
                                    if (animal != null)
                                        animal.helpNode(false);
                                    if (item.canHarvset != true) {
                                        if (item != null && item.templateID <= 0) {
                                            let UIDragBag = global.Manager.UIManager.get('UIDragBag');
                                            //UIDragBag != null  打开左侧种植列表
                                            if (UIDragBag != null) {
                                                if (this.adjustEdge(cell, null))
                                                    UIDragBag.showQuick(global.Enum.ParkBagType.PARKBAG_FISH, true, cell);
                                                else
                                                    UIDragBag.show(global.Enum.ParkBagType.PARKBAG_FISH, true, cell);
                                            }
                                        }
                                    } else {
                                        let finshAnimal = this.getFishNode(index);
                                        if (finshAnimal != null) {
                                            finshAnimal.setFirstHarvest(true);
                                            this.firstHarvestFish = finshAnimal;
                                        }
                                    }
                                } else {
                                    let UIDragBag = global.Manager.UIManager.get('UIDragBag');
                                    if (UIDragBag != null)
                                        UIDragBag.showQuick(global.Enum.ParkBagType.PARKBAG_FISH, false, null);
                                    if(this.firstHarvestFish == null){
                                        this.showFishCell(false);
                                        this.reflashFirstHarvest(global.Enum.FarmType.FARM_FISH);
                                    }
                                   
                                    this.lockMove(false);
                                    let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
                                    if (dragLayer)
                                        dragLayer.sedisScale(true);
                                }

                            }
                        }
                        
                    }
              }
              this.isInDragMap = false;
            }
        }

    };
   
    // update (dt) {}
}
