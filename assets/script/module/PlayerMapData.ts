const {ccclass, property} = cc._decorator;
@ccclass
export default class PlayerMapData extends cc.Component {
    factorys: any;
    factoryNum: number;
    animalData: any[];
    plantData: any[];
    farmCellNum: number;
    unLockNum: number;
    roleInfo: any;
    obstacles: {};

    constructor() {
        super();
        //this.mapData = {};  //{templateID, position, scaleX}
        this.factorys       = null;
        this.factoryNum     = 0;
        this.animalData     = new Array();
        this.plantData      = new Array();

        this.farmCellNum    = 15;
        this.unLockNum      = 15;
        
        this.roleInfo       =null;

        this.obstacles      = {};

     
    };

    onLoad() {

    };
    //设置好友数据
    setRoleInfo(data)
    {
        this.roleInfo = data;
    };
    //获取好友数据
    getRoleInfo()
    {
        return this.roleInfo;
    };

    getMapData()
    {
        return this.factorys;
    };

    setMapData(data)
    {
        let count = 0;
        let factorys = {};
        for (let key in data)
        {
            let position = data[key].value;

            let tempID = parseInt(key);
            let item = {templateID:tempID, scaleX:1, position:cc.v2(position.x, position.y)};

            if (tempID > 0)
                factorys[tempID] = item;

            ++count;
        }

        if (factorys != null)
        {
            this.factorys   = factorys;
            this.factoryNum = count;
        } 
    };

    setObstaclesData(data)
    {
        for (let key in data)
        {
            let item = {ID:key, isOpen:1};
            this.obstacles[key] = item;
        }
    };

    getObstacle(ID)
    {
        for (let key in this.obstacles)
        {
            let item = this.obstacles[key];
            if (item.ID == ID)
                return item;
        }

        return null;
    };

    setFarmData(data)
    {   
        this.plantData = [];

        let plantCellNum = 0;
        let plantData = data.plantData;
        for (let plantIdx in plantData)
        {
            let value = plantData[plantIdx].value;

            let growTime = 0;
            let data = global.Manager.DBManager.findData("FarmCulture", 'ID', value.seed);
            if (data != null)
                growTime = data.cookingTime*60;

            let obj = {lock:false, tempHarvest:false, hasSeed:false, plantID:value.seed, matureTime:value.leftSeconds, growTime:growTime, stage:1};
            this.plantData.push(obj);

            ++plantCellNum;
        }

        for (let i=plantCellNum; i<this.farmCellNum; ++i)
        {
            let obj = {lock:true,  tempHarvest:false, hasSeed:false, plantID:0, matureTime:0, growTime:0, stage:0};
            this.plantData.push(obj);
        }
    

        this.animalData = [];
        let animalData = data.animalData;

        for (let animalIdx in animalData)
        {
            let value = animalData[animalIdx].value;
            if (value.seed>0)
            {
                let data = global.Manager.DBManager.findData("FarmCulture", 'ID', value.seed);
                let cookingTime = data!=null?data.cookingTime*60:0;

                let obj = {index:value.index, tempHarvest:false, animalID:value.seed, matureTime:value.leftSeconds, growTime:cookingTime, stage:1};
                this.animalData.push(obj);
            }
            else
            {
                let obj = {index:value.index, tempHarvest:false, animalID:0, matureTime:0, growTime:0, stage:0};
                this.animalData.push(obj);
            }
        }
    };

    getFactory(ID)
    {
        for (let key in this.factorys)
        {
            let factory = this.factorys[key];
            if (factory.templateID == ID)
                return factory;
        }

        return null;
    };

    getPlant(idx)
    {
        if (idx>=0 && idx<this.plantData.length)
            return this.plantData[idx];
        
        return null;
    };

    getPlantStage(idx)
    {
        let item = this.getPlant(idx);
        if (item!=null && item.plantID>0)
        {
            if (item.growTime==0)
                return 3;

            let progress = item.matureTime/item.growTime;
            if (progress <= 0)
            {
                return 3;
            }
            else if(progress < 0.5)
            {
                return 2;
            }
            else if(progress < 1)
            {
                return 1;
            }
        }

        return -1;
    };

    selfUpdate(dt)
    {
        let isInOtherHome = global.Module.GameData.isInOtherHome();

        if (isInOtherHome)
        {
            for (let i=0; i<this.plantData.length; ++i)
            {
                let data = this.plantData[i];
                if (data.plantID > 0)
                {
                    if (data.matureTime>0)
                        data.matureTime -= dt;
                    
                    let stage = this.getPlantStage(i);
                    if (stage != data.stage)
                    {
                        data.stage = stage;

                        let farm = global.Proxys.ProxyFarm.getFarm();
                        farm.setPlantTexture(i, stage);
                    }
                        
                }
            }

            for (let j=0; j<this.animalData.length; ++j)
            {
                if (this.animalData[j].matureTime > 0)
                {
                    this.animalData[j].matureTime -= dt;
                }
            }
        }
    };

    getAllPlant()
    {
        return this.plantData;
    };

    getAllAnimal()
    {
        return this.animalData;
    };

    getAnimalItemByIdx(idx)
    {
        for(let i=0; i<this.animalData.length; ++i)
        {
            if (this.animalData[i].index ==idx )
            {
                return this.animalData[i];
            }
        }
    }; 

    clear()
    {
        this.setRoleInfo(null);
        this.plantData = [];
        this.animalData = [];
        this.factorys = {};

    };

}
