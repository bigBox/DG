

const {ccclass, property} = cc._decorator;

@ccclass
export default class FishPoolData extends cc.Component {
    maxFishNum: number;
    fishs: any;
    fishPool: {};
    harvestQueue: any[];
    constructor(){
        super();
        this.maxFishNum = 15;
        this.fishs = {};                       //{ID, templateID}

        this.fishPool = {};
        this.harvestQueue = [];
    };

    onLoad () {}

    start () {

    }
    saveToLocal() {
        if (this.fishs != null) {
            let roleID = global.Module.MainPlayerData.getRoleID();
            let data = { fishData: this.fishs };
            let fishPoolData = JSON.parse(cc.sys.localStorage.getItem('FishPoolData'));
            if (fishPoolData == null) {
                fishPoolData = {};
            }

            fishPoolData[roleID] = data;
            cc.sys.localStorage.setItem('FishPoolData', JSON.stringify(fishPoolData));
        }
    };

    loadLocal() {
        let roleID = global.Module.MainPlayerData.getRoleID();
        let fishPoolData = JSON.parse(cc.sys.localStorage.getItem('FishPoolData'));
        if (fishPoolData == null || fishPoolData[roleID] == null) {
            this.fishs = {};
        }
        else {
            let selfData = fishPoolData[roleID];
            this.fishs = selfData.fishData;
        }

    };

    clear() {
        this.fishs = {};
        cc.sys.localStorage.removeItem('FishPoolData');
    };

    setFishPool(pool) {
        this.fishPool = pool;
    };

    getFishPool() {
        return this.fishPool;
    };

    getMaxFish() {
        return this.maxFishNum;
    };

    getFishs() {
        return this.fishs;
    };

    getFish(fishIdx) {
        for (let key in this.fishs.data) {
            let fish = this.fishs.data[key];
            if (fish.index == fishIdx)
                return fish;
        }

        return null;
    };

    getCanHarvest(fishIdx) {
        let fish = this.getFish(fishIdx);
        return (fish.canHarvset && !fish.tempHarvest);
    };

    harvestFish(fishIdx) {
        for (let key in this.fishs.data) {
            let fish = this.fishs.data[key];
            if (fish.index == fishIdx) {
                delete this.fishs.data[key];
                this.fishs.fishNum--;
            }
        }

        return null;
    };

    tempHarvest(idx, isRecover) {
        let fish = this.getFish(idx);
        if (fish != null) {
            fish.tempHarvest = !isRecover;
        }
    };

    pushHarvestIdx(idx) {
        this.tempHarvest(idx,null);

        for (let i = 0; i < this.harvestQueue.length; ++i) {
            if (this.harvestQueue[i] == idx)
                return false;
        }
        this.harvestQueue.push(idx);

        return true;
    };

    getHarvetQueue() {
        return this.harvestQueue;
    };

    clearHarvetQueue() {
        this.harvestQueue = [];
    };

    makeNewFish(fish) {
        let canHarvset = false;
        let growTime = 0;
        let havestTime = 0;

        let data = global.Manager.DBManager.findData("PoolFishs", 'ID', fish.fishID);
        if (data != null) {
            growTime = data.cookingTime*60;
            canHarvset = fish.leftSeconds <= 0;
            havestTime = global.CommonClass.Functions.getTargetTime(fish.leftSeconds);
        };
        let obj = {
            templateID: fish.fishID,
            index: fish.fishTimeID,
            havestTime: havestTime,
            growTime: growTime,
            canHarvset: canHarvset,
            tempHarvest: false
        };
        //matureTime 已经生长的时间 growTime 成熟总时间
        return obj;
    };


    selfUpdate(dt) {
        //  let isInOtherHome = global.Module.GameData.isInOtherHome();
        // if (!isInOtherHome)
        //  {

        //}
        let data = new Date();
        let time = data.getTime();

        for (let key in this.fishs.data) {
            let fish = this.fishs.data[key];
            fish.canHarvset = fish.havestTime <= time;
        }
    };

    onParkInfoRsp(msg) {
        let fishs = msg.fishs;
        global.Instance.Log.debug("xxxxx", fishs);
        this.fishs = { fishNum: 0, data: {} };
        for (let key in fishs) {
            let fish = fishs[key];
            let fishObj = this.makeNewFish(fish);
            if (fishObj.templateID > 0) {
                this.fishs.data[fishObj.index] = fishObj;
                this.fishs.fishNum++;
            }
        }
    };

    onParkPlaceFishRsp(msg) {
        if (!msg.errorID) {
            let fish = msg.fish;

            let fishObj = this.makeNewFish(fish);
            if (fishObj.templateID > 0) {
                if (this.fishs.data[fishObj.index] == null)  //添加动物
                {
                    this.fishs.fishNum++;
                }
                this.fishs.data[fishObj.index] = fishObj;
            }
        }
    };

    onParkHarvestFishRsp(msg) {
        if (!msg.errorID) {

        }
    };
    // update (dt) {}
}
