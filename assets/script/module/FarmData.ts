//农场数据类
const { ccclass, property } = cc._decorator;

@ccclass
export default class FarmData {
    farmCellNum: number;
    unLockNum: number;
    plantData: any[];

    constructor() {
        this.farmCellNum = 15;
        this.unLockNum = 15;

        this.plantData = new Array();
        for (let i = 0; i < this.farmCellNum; ++i) {
            let lockState = i >= this.unLockNum;
            let obj = { lock: lockState, tempHarvest: false, hasSeed: false, plantID: 0, matureTime: 0, growTime: 0, stage: 1 };//matureTime 已经生长的时间 growTime 成熟总时间
            this.plantData.push(obj);
        }
    };
    selfUpdate(dt: number) {
        let isInOtherHome = global.Module.GameData.isInOtherHome();

        if (!isInOtherHome) {
            for (let i = 0; i < this.unLockNum; ++i) {
                let data = this.plantData[i];
                if (data != null) {
                    if (data.plantID > 0) {
                        if (data.matureTime > 0)
                            data.matureTime -= dt;
                        let stage = this.getPlantStage(i);
                        if (stage != data.stage) {
                            data.stage = stage;
                            let farm = global.Proxys.ProxyFarm.getFarm();
                            if (farm != null)
                                farm.setPlantTexture(i, stage);
                        }
                    }
                }
            }
        }
    };

    getPlant(idx: number) {
        if (idx >= 0 && idx < this.plantData.length)
            return this.plantData[idx];

        return null;
    };

    getAllPlant() {
        return this.plantData;
    };

    getCanHarvest(idx: any) {
        let item = this.getPlant(idx);
        if (item != null) {
            return (item.plantID > 0 && item.matureTime <= 0 && !item.tempHarvest);
        }
        return false;
    };

    getPlantStage(idx: number) {
        let item = this.getPlant(idx);
        if (item != null && item.plantID > 0) {
            if (item.growTime == 0)
                return 3;

            let progress = item.matureTime / item.growTime;
            if (progress <= 0) {
                return 3;
            }
            else if (progress < 0.5) {
                return 2;
            }
            else if (progress < 1) {
                return 1;
            }
        }

        return -1;
    };

    getCanSeed(idx: any) {
        let item = this.getPlant(idx);

        return (item != null && !item.lock && item.plantID <= 0 && !item.hasSeed);
    };

    seed(idx: any, isSeed: any) {
        let item = this.getPlant(idx);
        if (item != null)
            item.hasSeed = isSeed;
    };

    getCanGrow(idx: any) {
        let item = this.getPlant(idx);

        return (item != null && !item.lock && item.plantID <= 0);
    };

    growPlant(idx: any, plantID: any) {
        let item = this.getPlant(idx);

        item.plantID = plantID;
        let data = global.Manager.DBManager.findData("FarmCulture", 'ID', plantID);
        if (data != null) {
            item.matureTime = data.cookingTime*60;
            item.growTime = data.cookingTime*60;
            item.hasSeed = false;
        }
    };

    harvestPlant(idx: string | number) {
        if (this.getCanHarvest(idx) || this.plantData[idx].tempHarvest) {
            let id = this.plantData[idx].plantID;
            this.plantData[idx].plantID = 0;
            this.plantData[idx].hasSeed = false;
            this.plantData[idx].tempHarvest = false;

            return id;
        }

        return 0;
    };


    tempHarvest(type: any, idx: any, isRecover: any) {
        if (type == global.Enum.FarmType.FARM_PLANT) {
            let plantItem = this.getPlant(idx);
            if (plantItem != null) {
                plantItem.tempHarvest = !isRecover;
            }
        }
    };

    onFarmListRsp(msg: { cells: any[]; plaintCells: any[]; }) {
        let isInOtherHome = global.Module.GameData.isInOtherHome();

        if (!isInOtherHome) {
            this.plantData = new Array();

            let plantCellNum = 0;
            let plantData = msg.cells.map;
            for (let plantIdx in plantData) {
                let value = plantData[plantIdx].value;

                let growTime = 0;
                let data = global.Manager.DBManager.findData("FarmCulture", 'ID', value.seed);
                if (data != null)
                    growTime = data.cookingTime*60;

                let obj = { lock: false, tempHarvest: false, hasSeed: false, plantID: value.seed, matureTime: value.leftSeconds, growTime: growTime, stage: 1 };
                this.plantData.push(obj);

                ++plantCellNum;
            }

            for (let i = plantCellNum; i < this.farmCellNum; ++i) {
                let obj = { lock: false, tempHarvest: false, hasSeed: false, plantID: 0, matureTime: 0, growTime: 0, stage: 0 };
                this.plantData.push(obj);
            }
        }
        else {
            let farmData = { plantData: msg.plaintCells.map };
            global.Module.PlayerMapData.setFarmData(farmData);
        }

        this.selfUpdate(0);
    };

    onFarmPlaintRsp(msg: any) {

    };

    onFarmHarvestRsp(msg: any) {

    };
}
