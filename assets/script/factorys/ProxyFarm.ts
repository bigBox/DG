

const {ccclass, property} = cc._decorator;

@ccclass
export default class ProxyFarm extends cc.Component {
    curMode: number;
    plantID: number;
    farm: any;
    curHarvestIdx: number;
    curHarvestAnimIdx: number;
    plantQueue: any[];
    animQueue: any[];
    isInHarvest: boolean;
    mode: number;

    constructor() {
        super();
        //0. 无, 1.开始选种子, 2.选定种子 3.播种 4.准备收割 5.收割 6.查看信息 7.开始选动物  8.选定动物 9.准备收获动物 10. 开始收获动物
        this.curMode = 0;           
        this.plantID = 0;
        this.farm   = null;

        this.curHarvestIdx      = -1;
        this.curHarvestAnimIdx  = -1;

        this.plantQueue       = [];
        this.animQueue        = [];
        this.isInHarvest      = false;
        
    };


    getMode() {
        return this.mode;
    };

    setFarm(farm: any) {
        this.farm = farm;
    };

    getFarm() {
        return this.farm;
    };

    setMode(mode: number) {
        this.mode = mode;
    };

    setGrowItemID(plantID) {
        this.plantID = plantID;
    };

    getGrowPlantID() {
        return this.plantID;
    };

    getIsInHarvest() {
        return this.isInHarvest;
        //(this.animQueue.length>0 || this.plantQueue.length>0);
    }; 

    getFarmData(type, index) {
        let isInOtherHome = global.Module.GameData.isInOtherHome();
        let data =  null;
        if (isInOtherHome)
            data = global.Module.PlayerMapData;
        else
            data = global.Module.FarmData;

        if (type==global.Enum.FarmType.FARM_PLANT)    //植物
        {
            if (index >= 0)
                return data.getPlant(index);
            else
                return data.getAllPlant();
        }
    };

    setPlantModeByPickNode(pickCell) {
        if (pickCell!=null)        //没有点到动物点到了植物
        {
            let idx = pickCell.tagEx;
            let item = global.Module.FarmData.getPlant(idx);

            if (item!=null)
            {
                if (item.lock)
                {
                    this.setMode(0);                    //无
                }
                else 
                {
                    if(item.plantID<=0)
                    {
                        this.setMode(1);                //选植物种子
                    }
                    else
                    {
                        if (global.Module.FarmData.getCanHarvest(idx))
                        {
                            this.setMode(4);            //准备收割
                        }
                        else
                        {
                            this.setMode(6);            // 查看信息
                        }
                    }
                }
                
            }
        }
        else            //都没有点到
        {
            this.setMode(0); 
        }
    };

    getDiffIdx(largeArray, smallArray) {
        let diff = [];

        if (smallArray.length > 0 )
        {
            for (let key in largeArray)
            {
                let value = largeArray[key];
                let isHas = false;
                for (let idx in smallArray)
                {
                    if (value == smallArray[idx])
                    {
                        isHas = true;
                        break;
                    }
                }

                if (isHas)
                    continue;
                
                diff.push(value);
            }
        }
       
        return diff;
    };

    pushHarvestIdx(idx, type) {
        global.Module.FarmData.tempHarvest(type, idx);

        if (type==global.Enum.FarmType.FARM_PLANT) //植物
        {
            for (let i=0; i<this.plantQueue.length; ++i)
            {
                if (this.plantQueue[i] == idx)
                    return false;
            }

            this.plantQueue.push(idx);
        }

        global.Instance.Log.debug('success push idx '+idx.toString() , ' type '+type.toString());

        return true;
    };

    popHarvestIdx(type) {
        let idx  = -1;
        if (type==1)//植物
        {
            if (this.plantQueue.length <=0 )
                return -1; 

            idx = this.plantQueue[0];
            this.plantQueue.splice(0, 1);
        }
        return idx;
    };

    sendToHarvest() {
        if (!this.isInHarvest)
        {
            return false;
        }
        else
        {
           // global.Module.GameData.setLockItemDrop(true);
            //let farm = this.getFarm();
            //let self = this;
    
            if (this.plantQueue.length > 0)
            {
                let sendData = {index:this.plantQueue, itemId:0, itemNum:0};
                global.Instance.MsgPools.send('farmHarvest', sendData, function(msg)
                {
                    if (!msg.errorID)
                    {
                        let successIdxs = msg.successIndex;
                      
                        for (let key in successIdxs)
                        {
                            let successIdx = successIdxs[key];
                            global.Module.FarmData.harvestPlant(successIdx);
                        }
                    }
                });
            }
            this.plantQueue = [];
            this.isInHarvest = false;
            return true;
        }
    };

    harvestPlant(mousePoint) {
        let ndItem = this.farm.pickItem(mousePoint);
        if (ndItem != null)
        {
            let idx = ndItem.tagEx;
            
            let plantItem = global.Module.FarmData.getPlant(idx);
            let canHarvest = global.Module.FarmData.getCanHarvest(idx);
            if (!canHarvest)
                return false;

            let plantID = plantItem.plantID;
           
            this.isInHarvest = false;
            let needDrop = false;

            if (this.curHarvestIdx != idx)
            {
                if (plantID > 0)
                {
                    if (this.pushHarvestIdx(idx,global.Enum.FarmType.FARM_PLANT))
                    {
                        needDrop = true;
                        this.isInHarvest = true;
                    }
                }

                this.curHarvestIdx = idx;
            }
            
            if (needDrop)
            {
                if (plantID > 0)
                {
                   /* let guideData = cc.Manager.DBManager.findData('NewGuide', 'guideKey', 'HarvestPlant');
                    if (plantID==guideData.arg)
                    {
                        if (cc.Proxys.ProxyGuide.stepNextGuide('HarvestPlant'))
                            this.farm.reflashGuide();

                        let UIFarmParkScene = cc.Manager.UIManager.get('UIFarmParkScene');
                        if (UIFarmParkScene != null)
                            UIFarmParkScene.reflashGuide();
                    }*/

                    let data = global.Manager.DBManager.findData("FarmCulture", 'ID', plantID);
                    global.Module.GameData.setDropInstance(ndItem);//(itemID, itemNum, dropEnd, parent, position)
                    global.CommonClass.ItemDrop.createOneDrop(data.productId, data.productNum,  ndItem, cc.v2(0, 20),null);
                    
                    this.farm.harvestPlant(this.curHarvestIdx);
                }
            }

        }
    };
}
