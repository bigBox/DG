//生态园数据类
const {ccclass, property} = cc._decorator;
@ccclass
export default class FarmParkData {
    factorys: any;
    factoryNum: number;
    farmCells: any;
    cellsNum: number;
    map: any;
    colNum: number;
    rowNum: number;
    maxAnimal: number;
    useEcology: number;
    tempOpQueue: any[];
    curShovelLeft: number;
    beeTargetTime: number;
    beeTotalTime: number;
    plantData: { cellsNum: number; data: {}; };
    parkAnimalData: { animalNum: number; data: {}; };
    
    fishsData: { fishsNum: number; data: {}; };
    curHvstPlant: any;
    curHvstAnimal: any;
    parkDrawPrize: any;
    zooAnimalsData: { animalNum: number; data: {}; };
    points:{x:number,y:number}
    greeValue: number;

    constructor () {
        this.factorys = null;
        this.factoryNum = 0;
        this.farmCells = null;
        this.cellsNum = 0;
        this.map = null;

        this.colNum = 12;//列
        this.rowNum = 9;//行
        this.points ={x:0,y:0};
        this.plantData = { cellsNum: 0, data: {} };//植物

        this.parkAnimalData = { animalNum: 0, data: {} };//生态园动物
        this.zooAnimalsData = { animalNum: 0, data: {} };//动物园珍惜动物
        this.fishsData = { fishsNum: 0, data: {} };//鱼塘
        this.maxAnimal = 30;
        this.useEcology = 0;

        //  this.curHvstPlant   = null;
        //this.curHvstAnimal  = null;

        this.tempOpQueue = [];

        this.curShovelLeft = 0;

        this.beeTargetTime = 0;
        this.beeTotalTime = 0;
        this.greeValue = 0;//绿化值

        this.plantData.cellsNum = this.colNum * this.rowNum;
    }
    getGreeValue(){
        return this.greeValue;
    }
    
    getFarmParkID() {
        let data = JSON.parse(cc.sys.localStorage.getItem('FarmParkID'));
        if (!data){
            data = 0
        }
        return data;
    }
    setFarmParkID(id) {
        cc.sys.localStorage.setItem('FarmParkID', JSON.stringify(id));
    }
    loadLocal () {
        let factorys = {};
        let count = 0;

        let data = global.Manager.DBManager.getData('Factory');
        for (let key in data) {
            let value = data[key];

            if (value.scene == 'FarmParkScene') {
                let tempID = value.ID;
                let item = { templateID: value.ID, scaleX: 1, position: cc.v2(value.x, value.y) };
                factorys[tempID] = item;

                ++count;
            }
        }

        if (factorys != null) {
            this.factorys = factorys;
            this.factoryNum = count;
        }
    };

    clear () {
        this.initData();
        // cc.sys.localStorage.removeItem('FarmParkData');
    };

    getFactory (ID) {
        return this.factorys[ID];
    };

    getFactorys () {
        return this.factorys;
    };

    initData () {
        let cellsNum = this.rowNum * this.colNum;

        this.plantData = { cellsNum: cellsNum, data: {} };

        this.parkAnimalData = { animalNum: 0, data: {} };

        this.zooAnimalsData = { animalNum: 0, data: {} };
        this.fishsData = { fishsNum: 0, data: {} };
    };
    setMap (map) {
        this.map = map;
    };

    getMap () {
        return this.map;
    };
   //沙漠数量
    getCellsNum () {
        return this.plantData.cellsNum;
    };
    //鱼塘数量
    getFishsNum () {
        return this.fishsData.fishsNum;
    };

    getFarmCells () {
        return this.farmCells;
    };

    getColNum () {
        return this.colNum;
    };

    getRowNum () {
        return this.rowNum;
    };

    getUseEcology () {
        return this.useEcology;
    };

    selfUpdate (dt) {
        let isInOtherHome = global.Module.GameData.isInOtherHome();

        if (!isInOtherHome) {
            let farmMap = this.getMap();
            if (this.plantData != null) {
                for (let i = 0; i < this.plantData.cellsNum; ++i) {
                    let plant = this.plantData.data[i];
                    if (plant && plant.templateID > 0) {
                        if (!plant.withered) {
                            let leftTime = global.CommonClass.Functions.getLeftTime(plant.havestTime);
                            if (leftTime <= 0 && !plant.canHarvset) {
                                plant.canHarvset = true;
                                if (farmMap != null)
                                    farmMap.reflashFirstHarvest(global.Enum.FarmType.FARM_PLANT);
                            }
                        }

                        let item = this.getPlantCell(plant.index);
                        let stage = this.getPlantCellStage(item);
                        
                        if (stage != plant.stage) {
                            plant.stage = stage;

                            if (farmMap != null)
                                farmMap.setPlantStage(i, stage);
                        }
                    }
                }
            }
            if (this.fishsData) {
                for (let i = 1; i <= this.getFishsNum(); ++i) {
                    let plant = this.fishsData.data[i];
                    if (plant && plant.templateID > 0) {
                        if (!plant.canHarvset) {
                            let leftTime = global.CommonClass.Functions.getLeftTime(plant.havestTime);
                            if (leftTime <= 0) {
                                plant.canHarvset = true;
                                if (farmMap != null)
                                    farmMap.reflashFishNode(plant);
                                var taskData = global.Module.TaskData.getHasAcceptTaskData();
                                if (taskData && taskData.state == 1 && taskData.taskId == 10021) {
                                    let canvas = global.CommonClass.Functions.getRoot();
                                    let FarmScene = canvas.getComponent('FarmScene');
                                    if (FarmScene)
                                        FarmScene.reflashHelp2();
                                } 
                                farmMap.reflashFirstHarvest(global.Enum.FarmType.FARM_FISH);
                            }
                        }
                    }
                }
            }
          
            this.reflashHoneycomb();
        }
    };
    getPlantCell (idx) {
        if (idx >= 0 && idx < this.plantData.cellsNum)
            return this.plantData.data[idx];

        return null;
    };
    getFishCell (idx) {
        if (idx > 0 && idx <= this.fishsData.fishsNum)
            return this.fishsData.data[idx];
        return null;
    };

    checkGVEnough (idx, plantID) {  //绿化值是否够种植了

        let cell = this.getPlantCell(idx);
        if (cell != null) {
            let data = this.farmData(plantID);
            if (data == null || data.needGreen <= cell.greenValue) {
                return true;
            }
        }

        return false;
    };

    checkLevel (itemID, type) {
        let level = global.Module.MainPlayerData.getLevel();
        let data = null;

        if (type == global.Enum.FarmType.FARM_PLANT) {
             data = this.farmData(itemID);
        } else if (type == global.Enum.FarmType.FARM_ANIMAL) {
            data = global.Manager.DBManager.findData("FarmParkAnimal", 'ID', itemID);
        }else if(type == global.Enum.FarmType.PARKBAG_RARE_ANIMAL) {
            data = global.Manager.DBManager.findData("FarmZooAnimal", 'ID', itemID);
        }
        if (data != null && data.needLevel <= level) {
            return true;
        }

        return false;

    };
    //返回1金币不够 2数量不够 3
    checkMoney (itemID, type) {
        let gold = global.Module.MainPlayerData.getDataByKey('Gold');
        let data = null;
        if (type == global.Enum.FarmType.FARM_PLANT) {
            data = this.farmData(itemID);
        } else if (type == global.Enum.FarmType.FARM_ANIMAL)
            data = global.Manager.DBManager.findData("FarmParkAnimal", 'ID', itemID);
        if (data == null||(data&&data.costGold == 0))
            return 2;
        if (data != null && data.costGold <= gold)
            return 3;
            return 1;  
    };

    checkNum (itemID) {
        let itemCount = global.Module.PackageData.getItemCount(itemID);
        let data = this.farmData(itemID);
        if (data == null)
            return false;
        if (data.costGold && data.costGold > 0)
            return false;
        return itemCount >= 1;
        
    };

    growPlant (idx, plantID) {
        let cell = this.getPlantCell(idx);

        if (cell != null) {
            cell.templateID = plantID;
            let data = this.farmData(plantID);
            if (data != null) {
                cell.matureTime = data.cookingTime*60;
                cell.growTime = data.cookingTime*60;
            }
        }

        return cell;
    };

    getAllPlant () {
        return this.plantData.data;
    };

    getCanHarvest (idx, type) {
        if (type == global.Enum.FarmType.FARM_PLANT) {//植物
            let plant = this.getPlantCell(idx);
            if (plant != null) {
                return (plant.templateID > 0 && plant.canHarvset && !plant.tempHarvest && !plant.withered);
            }
        } else if (type == global.Enum.FarmType.FARM_ANIMAL) {//动物
            let animal = this.getAnimal(idx);
            if (animal != null) {
                return (animal.templateID > 0 && animal.canHarvset && !animal.tempHarvest && !animal.uncommon);
            }
        } else if (type == global.Enum.FarmType.FARM_FISH) {//鱼塘
            let animal = this.getFishCell(idx);
            if (animal != null) {
                return (animal.templateID > 0 && animal.canHarvset&&animal.tempShovel!=true );
            }
        }
        return false;
    };

    getPlantCellStage (item) {
        if (item != null && item.templateID > 0) {
           
            let data = this.farmData(item.templateID);
            let stageAll = data.growStep;
            if (item.growTime == 0)
                return stageAll;
            let stage = 1;
            let leftTime = global.CommonClass.Functions.getLeftTime(item.havestTime);
            if (leftTime <= 0) {
                leftTime = 0;
                stage = stageAll + 1;
            }
            else {
                let growPercent = (item.growTime - leftTime) / item.growTime;
                stage = Math.ceil(growPercent * stageAll);
            }

            return stage;
        }

        return -1;
    };
    //收获
    harvest (itemID,type) {
        cc.warn('--------------收获调用接口处理----------------',this.tempOpQueue)
        
        if (this.tempOpQueue.length > 0) {
            let msgName = '';
            let msgData = null;

            if (type == global.Enum.FarmType.FARM_ANIMAL) {//收获动物
                msgName = 'parkHarvestAnimal';

                let points = [];
                for (let key in this.tempOpQueue) {
                    let pos = cc.v2(0, 0);
                    let animalId = this.tempOpQueue[key];
                    let animal = this.map.getAnimal(animalId);
                    if (animal != null)
                        pos = animal.node.getPosition();

                    let strID = animalId.toString();
                    let obj = { animalTimeID: strID, x: parseInt(pos.x.toString()), y: parseInt(pos.y.toString()) };
                    points.push(obj);
                }
                msgData = { points: points };
            }
            else if (type == global.Enum.FarmType.FARM_PLANT) {//收获植物
                if (global.Manager.DBManager.findData("FarmParkPlant", 'ID', itemID))//草
                    msgName = 'parkHarvestPlant';
                if (global.Manager.DBManager.findData("FarmCulture", 'ID', itemID))//庄稼
                    msgName = 'ParkHarvestCrops';
                if (global.Manager.DBManager.findData("FarmParkTree", 'ID', itemID))//树
                    msgName = 'ParkHarvestTree';

                let colNum = global.Module.FarmParkData.getColNum();
                let cells = [];
              
                for (let key in this.tempOpQueue) {
                    let index = this.tempOpQueue[key];
                    let x = Math.floor(index / colNum);
                    let y = Math.floor(index % colNum);
                    cells.push({ x: x, y: y });
                }
                this.points.x = cells[cells.length-1].x;
                this.points.y = cells[cells.length-1].y;
                msgData = { points: cells };
            }else{
                msgName = 'parkHarvestFish'; 
                msgData = this.tempOpQueue
            }
            global.Instance.MsgPools.send(msgName, msgData, function (msg) {
                global.Module.GameData.setDropInstance(null);
                if (msgName == 'parkHarvestAnimal') {
                    let uiRole = global.Manager.UIManager.getMutiPanel('UIRoleInfo');
                    if (uiRole)
                        uiRole.reflashEcological();
                       
                }
            });

            return true;
        }

        return false;
    };
    //获取动物园动物数据
    getAllZooAnimal() {
        return this.zooAnimalsData.data;
    };
    //指定动物园动物数据
    getZooAnimal(index) {
        return this.zooAnimalsData.data[index];
    };
    //获取生态园动物数量
    getAllAnimalNum () {
        return this.parkAnimalData.animalNum;
    };
    //获取生态园动物数据
    getAllAnimal () {
        return this.parkAnimalData.data;
    };
    //指定生态园动物数据
    getAnimal (index) {
        return this.parkAnimalData.data[index];
    };
    //获取鱼塘数据
    getAllFishsData () {
        return this.fishsData.data;
    };
    //获取鱼塘数据
    getFish (index) {
        return this.fishsData.data[index];
    };
    //是否是珍稀动物---无用
    getIsUnCommonAnimal (index) {
        let animal = this.getAnimal(index);

        if (animal != null) {
            let parkAnimalData = global.Manager.DBManager.findData('FarmParkAnimal', 'ID', animal.templateID);
            if (parkAnimalData != null) {
                return parkAnimalData.uncommon;
            }
        }

        return false;
    };
    //  FARM_PLANT: 1 植物     FARM_ANIMAL: 3 动物
    getItemByType (index, type) {
        if (type == global.Enum.FarmType.FARM_PLANT) {
            return this.getPlantCell(index);
        }
        else if (type == global.Enum.FarmType.FARM_ANIMAL) {
            return this.getAnimal(index);
        }
        else if (type == global.Enum.FarmType.FARM_FISH) {
            return this.getFish(index);
        }
    }; 
    //生态园种田临近数组
    makeNeighborArray (index, isIncline) {
        let colNum = this.colNum;
        let rowNum = this.rowNum;

        let neighborArray = new Array();

        let maxIdx = (rowNum) * colNum - 1;
        //  let rowIdx =  Math.floor(openIdx/colNum);
        let colIdx = index % colNum;
        //up
        let upIdx = index - colNum;
        if (upIdx >= 0)
            neighborArray.push(upIdx);

        //down 
        let downIdx = index + colNum;
        if (downIdx <= maxIdx)
            neighborArray.push(downIdx);

        //left
        let leftIdx = index - 1;
        if (colIdx > 0)
            neighborArray.push(leftIdx);

        //right
        let rightIdx = index + 1;
        if (colIdx < colNum - 1)
            neighborArray.push(rightIdx);

        if (isIncline) {
            //left up
            let leftUpIdx = index - colNum - 1;
            if (colIdx > 0 && upIdx >= 0)
                neighborArray.push(leftUpIdx);

            //right up
            let rightUpIdx = index - colNum + 1;
            if (upIdx >= 0 && colIdx < colNum - 1)
                neighborArray.push(rightUpIdx);

            //left down
            let leftDownIdx = index + colNum - 1;
            if (colIdx > 0 && downIdx <= maxIdx)
                neighborArray.push(leftDownIdx);

            //right down
            let rightDownIdx = index + colNum + 1;
            if (downIdx <= maxIdx && colIdx < colNum - 1)
                neighborArray.push(rightDownIdx);
        }

        return neighborArray;
    };
    farmData(itemID) {
        let data = null;
        if (!data)
            data = global.Manager.DBManager.findData("FarmParkPlant", 'ID', itemID);
        if (!data)
            data = global.Manager.DBManager.findData("FarmCulture", 'ID', itemID);
        if (!data)
            data = global.Manager.DBManager.findData("FarmParkTree", 'ID', itemID);
        if (!data)
            data = global.Manager.DBManager.findData("PoolFishs", 'ID', itemID);
        if (!data)
            data = global.Manager.DBManager.findData("FarmZooAnimal", 'ID', itemID);
        return data;
    };
    //鱼塘初始数据
    fishCell (id) {
        let plantObj = {
            index: id,// 鱼塘索引
            templateID: 0,// 鱼ID
            leftSeconds: 2,// 距离成熟的秒数
            greenValue: 1,//收获次数
            placeTime: 0,// 放置时间
             type: global.Enum.FarmType.FARM_FISH,
            canHarvset: false,//是否可以收获
            havestTime: 0,//havestTime 目标成熟时间
            growTime: 0,//growTime 成熟总时间
            seed: false,
            stage:1,
        };

        plantObj.stage = this.getPlantCellStage(plantObj);

        return plantObj;
    };
    //鱼塘数据赋值
    getfishCell (data) {
        let canHarvset = false;
        let havestTime = 0;//havestTime 目标成熟时间
        let growTime = 0;//growTime 成熟总时间
        let fishData = this.farmData(data.fishID);
        if (fishData != null) {
            growTime = fishData.cookingTime*60;

            canHarvset = data.leftSeconds <= 0 ;
            havestTime = global.CommonClass.Functions.getTargetTime(data.leftSeconds);
        };
        let plantObj = {
            index: data.index,// 鱼塘索引
            templateID: data.fishID,// 鱼ID
            greenValue: 1,//收获次数
            type: global.Enum.FarmType.FARM_FISH,
            leftSeconds: data.leftSeconds,// 距离成熟的秒数
            placeTime: data.placeTime,// 放置时间
            growTime: growTime,
            canHarvset: canHarvset,
            havestTime: havestTime,
            tempShovel:false,
            seed: false,
            stage:1,
        };

        plantObj.stage = this.getPlantCellStage(plantObj);

        return plantObj;
    };
    //农田数据
    makePlantCell (plant) {
        let idx = plant.x * this.colNum + plant.y;
        let canHarvset = false;
        let havestTime = 0;
        let growTime = 0;
        let data = this.farmData(plant.plantID);
        if (data != null) {
            growTime = data.cookingTime*60;

            canHarvset = plant.leftSeconds <= 0 && plant.status == 0;
            havestTime = global.CommonClass.Functions.getTargetTime(plant.leftSeconds);
        };

        //havestTime 目标成熟时间 growTime 成熟总时间 withered:是否枯萎
        let plantObj = {
            index: idx,
            templateID: plant.plantID,
            withered: plant.status,
            type: global.Enum.FarmType.FARM_PLANT,
            havestTime: havestTime,
            growTime: growTime,
            stage: 1,
            greenValue: plant.green,
            tempHarvest: false,
            canHarvset: canHarvset,
            tempShovel: false,
            seed: false,
            posArr:[],
        };
        plantObj.stage = this.getPlantCellStage(plantObj);

        return plantObj;
    };
    //行走路线随机数
    getRandomArrayElements(count) {
        var arr = ['1', '2', '4', '5', '6', '7', '8', '9'];
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    };
    posArrData(data, items) {
        let stageNum = 4;
        if (items.stage == 1) {
            stageNum = data.growNum
        } else {
            stageNum = data.matureNum
        }
        let posArr = this.getRandomArrayElements(stageNum);
        let idx = items.index;
        let plantObj = this.getPlantCell(idx);
        plantObj.posArr = posArr;
        this.plantData.data[idx] = plantObj;
        return posArr;
    };
    //生成动物园动物数据
    makeZoomAnimalCell (animal) {
        let canHarvset = false;
        let growTime = 0;
        let havestTime = 0;
        let lifeTime = 0;
        let harvestLeft = 1;
        let leaveTime = 0;

        let data = global.Manager.DBManager.findData("FarmZooAnimal", 'productId', animal.animalID);
        let animalObj = null
        if (data != null) {
            growTime = data.cookingTime*60;

            canHarvset = animal.harvestState == 1 && animal.status == 0;
            havestTime = global.CommonClass.Functions.getTargetTime(animal.leftSeconds);
            lifeTime = global.CommonClass.Functions.getTargetTime(animal.liveSeconds);
            leaveTime = global.CommonClass.Functions.getTargetTime(animal.leaveSeconds);

            harvestLeft = data.harvestCount - animal.harvestNum;
            //matureTime 已经生长的时间 growTime 成熟总时间
            animalObj = {
                index: animal.animalTimeID, withered: animal.status, templateID: animal.animalID, type: global.Enum.FarmType.FARM_ANIMAL,
                havestTime: havestTime, growTime: growTime, harvestLeft: harvestLeft, lifeTime: lifeTime, leaveTime: leaveTime,
                tempHarvest: false, canHarvset: canHarvset, source: animal.source, tempShovel: false, uncommon: data.uncommon,
                pos: cc.v2(animal.x, animal.y)
            };
        };
        return animalObj;
    };
    //生成生态园动物数据
    makeAnimalCell (animal) {
        let canHarvset = false;
        let growTime = 0;
        let havestTime = 0;
        let lifeTime = 0;
        let harvestLeft = 1;
        let leaveTime = 0;

        let data = global.Manager.DBManager.findData("FarmParkAnimal", 'ID', animal.animalID);
        let animalObj = null;
        if (data != null) {
            growTime = data.cookingTime*60;

            canHarvset = animal.harvestState == 1 && animal.status == 0;
            havestTime = global.CommonClass.Functions.getTargetTime(animal.leftSeconds);
            lifeTime = global.CommonClass.Functions.getTargetTime(animal.liveSeconds);
            leaveTime = global.CommonClass.Functions.getTargetTime(animal.leaveSeconds);

            harvestLeft = data.harvestCount - animal.harvestNum;
            //matureTime 已经生长的时间 growTime 成熟总时间
            animalObj = {
                index:animal.animalTimeID , withered: animal.status, templateID: animal.animalID, type: global.Enum.FarmType.FARM_ANIMAL,
                havestTime: havestTime, growTime: growTime, harvestLeft: harvestLeft, lifeTime: lifeTime, leaveTime: leaveTime,
                tempHarvest: false, canHarvset: canHarvset, source: animal.source, tempShovel: false, uncommon: data.uncommon,
                pos: cc.v2(animal.x, animal.y)
            };
        };
        return animalObj;
    };

    tempOperator (type, idx) {
        if (type == global.Enum.FarmTypeOp.FARMOP_HARVEST_PLANT) {
            let plantItem = this.getPlantCell(idx);
            if (plantItem != null) {
                plantItem.withered = true;
                plantItem.canHarvset = false;
            }
        }
        else if (type == global.Enum.FarmTypeOp.FARMOP_HARVEST_FINSH) {
            let plantItem = this.getFishCell(idx);
            if (plantItem != null) {
                plantItem.tempShovel = true;
            }
                
        }
        else if (type == global.Enum.FarmTypeOp.FARMOP_HARVEST_ANIMAL) {
            let animalItem = this.getAnimal(idx);
            if (animalItem != null)
                animalItem.tempHarvest = true;
        }
        else if (type == global.Enum.FarmTypeOp.FARMOP_SHOVEL_ANIMAL) {
            let animalItem = this.getAnimal(idx);
            if (animalItem != null)
                animalItem.tempShovel = true;
        }
        else if (type == global.Enum.FarmTypeOp.FARMOP_GROW) {
            let plantItem = this.getPlantCell(idx);
            if (plantItem != null)
                plantItem.seed = true;
        }
        else if (type == global.Enum.FarmTypeOp.FARMOP_FINSH) {
            let plantItem = this.getFishCell(idx);
            if (plantItem != null)
                plantItem.seed = true; 
        }
    };

    pushOperatorIdx (idx, type) {
        for (let i = 0; i < this.tempOpQueue.length; ++i) {
            if (this.tempOpQueue[i] == idx)
                return false;
        }

        this.tempOpQueue.push(idx);
        this.tempOperator(type, idx);

        return true;
    };

    cleartempOpQueue () {
        this.tempOpQueue = [];
    };

    getShovelLeft () {
        return this.curShovelLeft;
    };

    costShovelItem (itemNum) {
        if (itemNum == 0)   //初始化
        {
            let data = global.Manager.DBManager.findData('Sundry', 'name', 'parkClearWitherItemID');
            if (data != null) {
                let itemID = parseInt(data.value);

                let exCount = 0;
                let changeData = global.Manager.DBManager.findData('Item2Count', 'ID', itemID);
                if (changeData != null) {
                    let fatherID = changeData.itemID;
                    let fatherNeed = changeData.itemCount;
                    let count = changeData.count;

                    let fatherItemNum = global.Module.PackageData.getItemCount(fatherID);
                    exCount = Math.floor(fatherItemNum / fatherNeed) * count;
                }

                let curNum = global.Module.PackageData.getItemCount(itemID);
                this.curShovelLeft = exCount + curNum;
            }
        }
        else {
            this.curShovelLeft -= itemNum;
            if (this.curShovelLeft < 0)
                this.curShovelLeft = 0;
        }

        return this.curShovelLeft;
    };
    //获取小麦成熟的地
    findMatureHarvest (type) {
        if (type == global.Enum.FarmType.FARM_PLANT) {
            for (let key in this.plantData.data) {
                let templateID = this.plantData.data[key].templateID;
                if (templateID == 110020010 && this.getCanHarvest(key, type))
                    return this.plantData.data[key];
            }
        }
    }
    //收获时获取数据状态
    findFirstHarvest (type) {
        if (type == global.Enum.FarmType.FARM_ANIMAL) {
            let list =[];
            for (let key in this.parkAnimalData.data) 
                list.push(key)
            list = list.sort(function(){ return Math.random() - 0.5});
            for (let i = 0; i < list.length; i++) {
               let key = list[i];
               if (this.getCanHarvest(key, type))
               return this.parkAnimalData.data[key];
            }
        }
        else if (type == global.Enum.FarmType.FARM_PLANT) {
            return this.nineQuery(type);
        }else if (type == global.Enum.FarmType.FARM_FISH) {
            let list = [];
            for (let key in this.fishsData.data)
                list.push(key)
            list = list.sort(function () { return Math.random() - 0.5 });
            for (let i = 0; i < list.length; i++) {
                let key = list[i];
                if (this.getCanHarvest(key, type))
                    return this.fishsData.data[key];
            }
        }

        return null;
    };

    getCurHvstPlant () {
        return this.curHvstPlant;
    };

    getCurHvstAnimal () {
        return this.curHvstAnimal;
    };

    getBeeLeftTime () {
        let leftTime = global.CommonClass.Functions.getLeftTime(this.beeTargetTime);
        return leftTime;
    };

    getIsDrawPrize () {
        return this.parkDrawPrize;
    };

    reflashHoneycomb () {
        let farmMap = this.getMap();
        if (farmMap != null) {
            let honeycomb = farmMap.getHoneycomb();
            if (honeycomb != null) {
                let beeLeftTime = this.getBeeLeftTime();
                honeycomb.setLeftTime(beeLeftTime, this.beeTotalTime);
            }
        }
    };

    getCanGrowInfo (itemID, cell) {
        if (cell == null)
            return null;
        if (cell.getItemID() > 0) {
            return "已经有植物了";
        } else if(itemID!=230020001) {
            let index = cell.getIndex();
            let farmMap = this.getMap();
            var data = global.Module.TaskData.gettaskphase(10013);
            //绿化任务安全保护
            if (itemID == '110020010' && (!data || data.state == 0)) {
                return "请先领取绿化任务";
            }
            else if (!global.Module.FarmParkData.checkGVEnough(index, itemID)) {
                return "绿化值不够";
            }
            else if (!global.Module.FarmParkData.checkLevel(itemID, global.Enum.FarmType.FARM_PLANT)) {
                return "等级不够";
            }
            else if (!global.Module.FarmParkData.checkNum(itemID)) {
                let isNum = global.Module.FarmParkData.checkMoney(itemID, global.Enum.FarmType.FARM_PLANT)
                if (isNum == 1){
                    return "金币不够";
                }else if(isNum == 2){
                    return "数量不够";
                }
            }
        }

        return null;
    };

    getBeeTotalTime () {
        return this.beeTotalTime;
    };
    //生态园数据
    onParkInfoRsp (msg) {
        global.Instance.Log.debug('生态园数据',msg);
        this.fishsData = { fishsNum: 4, data: {} };
        for (let i = 1; i <= 4; i++) {
            let plantObj = this.fishCell(i);
            let index = plantObj.index;
            this.fishsData.data[index] = plantObj;
        }
       
        this.useEcology = msg.useEcology;
        this.parkDrawPrize = msg.parkDrawPrize;

        let plants = msg.cells;
        let parkanimals = msg.parkAnimals;
        let zooAnimals = msg.zooAnimals;
        let fishs = msg.fishs;
        for (let i = 0; i < fishs.length; i++) {
            let plant = fishs[i];
            let plantObj = this.getfishCell(plant);
            let index = plantObj.index;
            this.fishsData.data[index] = plantObj;
        }


        let cellNum = this.colNum * this.rowNum;
        this.greeValue = 0;
        this.plantData = { cellsNum: cellNum, data: {} };
        for (let index = 0; index < cellNum; ++index) {
            let plant = plants[index];
            this.greeValue = this.greeValue + plant.green;
            let plantObj = this.makePlantCell(plant);
            let stageNum = 5
            if (plantObj.templateID!=0) {
                let data = this.farmData(plantObj.templateID);
                if (plantObj.stage == 1) {
                    stageNum = data.growNum
                } else {
                    stageNum = data.matureNum
                }
            }
            plantObj.posArr = this.getRandomArrayElements(stageNum);
            let idx = plantObj.index;
            this.plantData.data[idx] = plantObj;
        }
       
        this.parkAnimalData = { animalNum: 0, data: {} };
        for (let key in parkanimals) {
            let animal = parkanimals[key];
            if (animal.status != 1) {
                let animalObj = this.makeAnimalCell(animal);
                if (animalObj && animalObj.templateID > 0) {
                    this.parkAnimalData.data[animalObj.index] = animalObj;
                    this.parkAnimalData.animalNum++;
                }
            }
        }
        this.zooAnimalsData = { animalNum: 0, data: {} };
        for (let key in zooAnimals) {
            let animal = zooAnimals[key];
            if (animal.status != 1) {
                let animalObj = this.makeZoomAnimalCell(animal);
                if (animalObj && animalObj.templateID > 0) {
                    this.zooAnimalsData.data[animalObj.index] = animalObj;
                    this.zooAnimalsData.animalNum++;
                }
            }
        }

        this.beeTargetTime = global.CommonClass.Functions.getTargetTime(msg.honeyCD);
        let beeData = global.Manager.DBManager.findData('Sundry', 'name', 'drawHoneyRewardCD');
        this.beeTotalTime = beeData.value * 60;
        this.reflashHoneycomb();

        // global.Module.FishPoolData.onParkInfoRsp(msg);

    };

    onParkPlacePlantRsp (msg) {
        global.Instance.Log.debug("onParkPlacePlantRsp", msg)
        if (msg.errorID == 0) {
            let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
            global.Instance.Log.debug("onParkPlacePlantRsp","uiFarmParkBag3");
            if (uiFarmParkBag)
                uiFarmParkBag.refalshItem(msg.req.plantID);
        }
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        if (dragLayer) {
            dragLayer.sedisScale(true);
        }
    };
    //动物园放置珍稀动物
    onZooPlaceAnimalRsp(msg){
        if (msg.errorID == 0) {
            this.useEcology = msg.useEcology;
            let animal = msg.animal;
                global.Instance.Log.debug("onZooPlaceAnimalRsp", msg)
                let animalObj = this.makeZoomAnimalCell(animal);
                global.Instance.Log.debug("onZooPlaceAnimalRsp", animalObj)
                if (animalObj && animalObj.templateID > 0) {
                    if (this.zooAnimalsData.data[animalObj.index] == null)  //添加动物
                    {
                        this.zooAnimalsData.animalNum++;
                    }
                    this.zooAnimalsData.data[animalObj.index] = animalObj;
                }
         
            let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
            global.Instance.Log.debug("onZooPlaceAnimalRsp","onZooPlaceAnimalRsp");
            if (uiFarmParkBag)
                uiFarmParkBag.refalshItem(msg.req.animalID);
        }

    }
    //生态园放置动物
    onParkPlaceAnimalRsp (msg) {
        global.Instance.Log.debug("onParkPlaceAnimalRsp 生态园放置动物", msg)
        if (msg.errorID == 0) {
            this.useEcology = msg.useEcology;
            let animal = msg.animal;
            if (animal.status != 1) {
               
                let animalObj = this.makeAnimalCell(animal);
                global.Instance.Log.debug("onParkPlaceAnimalRsp", animalObj)
                if (animalObj && animalObj.templateID > 0) {
                    if (this.parkAnimalData.data[animalObj.index] == null)  //添加动物
                    {
                        this.parkAnimalData.animalNum++;
                    }
                    this.parkAnimalData.data[animalObj.index] = animalObj;
                }
            } else {
                let index = animal.animalTimeID;
                let farmMap = this.getMap();
                farmMap.removeAnimal(index);
            }
            let uiFarmParkBag = global.Manager.UIManager.get('UIFarmParkBag');
            global.Instance.Log.debug("this.parkAnimalData",this.parkAnimalData.data);
            if (uiFarmParkBag)
                uiFarmParkBag.refalshItem(msg.req.animalID);
        }
    };
    //收获植物
    onParkHarvestPlantRsp (msg) {
        if (msg.errorID == 0) {
            global.Instance.Log.debug('收获植物',msg);
        }
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        if (dragLayer) {
            dragLayer.sedisScale(true);
        }
    };
     //鱼塘放置鱼
    onParkPlaceFishRsp (msg) {
        global.Instance.Log.debug('鱼塘放置鱼',msg);
        if (msg.errorID == 0) {
            let plant = msg.fish;
            let plantObj = this.getfishCell(plant);
            let idx = plantObj.index;
            this.fishsData.data[idx] = plantObj;
            if (this.map != null)
                this.map.reflashFishNode(plantObj);
        }
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        if (dragLayer) {
            dragLayer.sedisScale(true);
        }
    };
    //生态园鱼塘收获
    onParkHarvestFishRsp (msg) {
        if (msg.errorID == 0) {
            global.Instance.Log.debug('生态园鱼塘收获',msg);
            let fishs = msg.successIndex
            for (let i = 0; i < fishs.length; i++) {
                let plantObj = this.fishCell(fishs[i]);
                let index = plantObj.index;
                this.fishsData.data[index] = plantObj;
                if (this.map != null)
                    this.map.reflashFishNode(plantObj);
            }
        }
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
        if (dragLayer) {
            dragLayer.sedisScale(true);
        }
    };
    //生态园加速返回
    onSpeedupRsp(msg){
        global.Instance.Log.debug('生态园加速返回',msg);
    }
    //生态园鱼塘的鱼变化推送
    onParkFishNtf (msg) {
        global.Instance.Log.debug('生态园鱼塘的鱼变化推送',msg);
        if (this.fishsData != null && this.fishsData.data != null) {
            let fishs = msg.fishs;
            for (let i = 0; i < fishs.length; i++) {
                let plantObj = this.getfishCell(fishs[i]);
                let index = plantObj.index;
                this.fishsData.data[index] = plantObj;
                if (this.map != null)
                    this.map.reflashFishNode(plantObj);
            }
            var taskData = global.Module.TaskData.getHasAcceptTaskData();
            if (taskData && taskData.state == 1 && taskData.taskId == 10021) {
                let canvas = global.CommonClass.Functions.getRoot();
                let FarmScene = canvas.getComponent('FarmScene');
                if (FarmScene)
                    FarmScene.reflashHelp2();
            }

        }
    };
    onParkHarvestAnimalRsp (msg) {
        global.Instance.Log.debug('生态园收获动物',msg);
        if (msg.errorID == 0) {
            this.useEcology = msg.useEcology;

            let ids = msg.successAnimalTimeIDs;
            for (let key in ids) {
                let id = ids[key];
                if (this.parkAnimalData.data[id]) {
                    this.parkAnimalData.data[id].tempHarvest = false;
                    this.parkAnimalData.data[id].canHarvset = false;
                    if (this.map != null)
                        this.map.reflashAnimal(id);

                }
                  
            }
        }
    };

    onParkClearWitherPlantRsp (msg) {

    };

    onParkClearWitherAnimalRsp (msg) {
        global.Instance.Log.debug("清除枯萎动物", msg)
        if (msg.errorID == 0) {
            for (let key in msg.successAnimalTimeIDs) {
                let index = msg.successAnimalTimeIDs[key];
                let farmMap = this.getMap();
                farmMap.removeAnimal(index);
            }
        }
    };

    onParkHoneyRsp (msg) {
        if (msg.errorID == 0) {
            this.beeTargetTime = global.CommonClass.Functions.getTargetTime(msg.honeyCD);
            this.reflashHoneycomb();
        }
    };
    /**
     * 九宫格排查
     */
    nineQuery(typeLevel) {
        let colNumLeft = this.colNum - (this.points.x + 1);//左边
        let colNumRight = this.colNum - (this.points.x - 0);//右边
        let colNumTop = this.rowNum - (this.points.y - 0);//上边
        let rowNumLower = this.rowNum - (this.points.y + 1);//下边
        let len = colNumLeft;
        if (len < colNumRight)
            len = colNumRight;
        if (len < colNumTop)
            len = colNumTop;
        if (len < rowNumLower)
            len = rowNumLower;
        let pointsX = this.points.x;
        let pointsY = this.points.y;
        let type = 0;//0 x加 y加 x减 y减
        let value = 0;
        for (let i = 0; i < len; i++) {
            let j = i + 1;//加数
            let lenk = j * 4 * 2;//扩散循环次数
            value = j * 2 + 1;//每一次加减截至数
            let id = 0;//加载数统计

            let points = { x: pointsX - j, y: pointsY - j - 1 };
            type = 0;
            for (let k = 0; k < lenk; k++) {
                id++;
                if (type == 0)
                    points.y++;
                if (type == 1)
                    points.x++;
                if (type == 2)
                    points.y--;
                if (type == 3)
                    points.x--;
                if (id == value) {
                    id = 1;
                    type++;
                }
                if (points.x >= 0 && points.y >= 0 && points.x < 12 && points.y < 10) {
                    let index = points.x * 12 + points.y;
                    if (this.getCanHarvest(index, typeLevel))
                        return this.plantData.data[index];
                }
            }
        }
        return null;
    };

    onParkCellNtf (msg) {
        global.Instance.Log.debug("生态园地图变化------onParkCellNtf", msg)
        let plants = msg.cells;
        let isShow = false;
        for (let index = 0; index < plants.length; index++) {
            let plant = plants[index];
            let plantObj = this.makePlantCell(plant);
            if (this.plantData.data != null) {
                if(this.plantData.data[plantObj.index]){
                    let greeValue = plantObj.greenValue - this.plantData.data[plantObj.index].greenValue
                    this.greeValue += greeValue;
                }
               

                if (!(this.plantData.data[plantObj.index] && this.plantData.data[plantObj.index].posArr)) {
                    plantObj.posArr = this.getRandomArrayElements(4)
                } else {
                    plantObj.posArr = this.plantData.data[plantObj.index].posArr
                }
                if (this.plantData.data[plantObj.index].templateID != 0 && plantObj.templateID == 0) {
                    isShow = true;
                }
                this.plantData.data[plantObj.index] = plantObj;
            }
            if (this.map != null)
                this.map.reflashCell(plantObj.index);
            if (index == plants.length - 1) {
                if (this.map != null){
                    this.map.reflashFirstHarvest(global.Enum.FarmType.FARM_FISH);
                    this.map.reflashGreeValue();
                }
                    
            }
        }
            
    };

    onParkAnimalNtf (msg) {
        let map = global.Module.FarmParkData.getMap();
        if (map == null)
            return;
        global.Instance.Log.debug("生态园动物变化", msg)
        let animals = msg.animals;
        for (let key in animals) {
            let animal = animals[key];
            if (animal.status != 1) {
                // global.Instance.Log.debug("onParkAnimalNtf",this.animalData)
                if (JSON.stringify(this.parkAnimalData) != '{}') {
                    let animalObj = this.makeAnimalCell(animal);
                    if (animalObj) {
                        if (animalObj.templateID > 0) {
                            if (this.parkAnimalData.data[animalObj.index] == null)  //添加动物
                            {
                                this.parkAnimalData.animalNum++;
                            }else{
                                if (this.map != null)
                                this.map.reflashAnimal(animalObj.index);
                            }
                            this.parkAnimalData.data[animalObj.index] = animalObj;
                        } else {
                            if (this.parkAnimalData.data[animalObj.index] != null)  //动物死亡
                            {
                                this.parkAnimalData.animalNum--;
                            }
                            this.parkAnimalData.data[animalObj.index] = null;
                        }
                    }
                }

            } else {
                let index = animal.animalTimeID;
                let farmMap = this.getMap();
                farmMap.removeAnimal(index);
            }



        }
    };

    onParkAnimalMatureNtf (msg) {
        if (this.parkAnimalData != null && this.parkAnimalData.data != null) {
            global.Instance.Log.debug("成熟状态推送",msg)
            let data = this.parkAnimalData.data[msg.animalTimeID];
            global.Instance.Log.debug("parkAnimalData",data)
            if (data != null) {
                data.canHarvset = true;
                data.tempHarvest = false;
                data.withered = 0;
                if (this.map != null){
                    this.map.reflashAnimal(data.index);
                    this.map.reflashFirstHarvest(global.Enum.FarmType.FARM_ANIMAL);
                }

                var taskData = global.Module.TaskData.getHasAcceptTaskData();
                if (taskData && taskData.state == 1 && taskData.taskId == 10018) {
                    let canvas = global.CommonClass.Functions.getRoot();
                    let FarmScene = canvas.getComponent('FarmScene');
                    if (FarmScene)
                        FarmScene.reflashHelp1();
                }


                   
            }
        }

    };

    onParkDrawPrizeRsp (msg) {

    };

    onParkAnimalAutoLeaveNtf (msg) {
        let animalObj = msg.animal;

        if (this.map != null)
            this.map.levelAnimal(animalObj.animalTimeID);


        if (this.parkAnimalData.data) {
            if (this.parkAnimalData.data[animalObj.animalTimeID]) {
                delete this.parkAnimalData.data[animalObj.animalTimeID];
                this.parkAnimalData.animalNum--;
            }
        }
    };

}
