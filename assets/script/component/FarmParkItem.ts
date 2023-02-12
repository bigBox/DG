
const { ccclass, property } = cc._decorator;

@ccclass
export default class FarmParkItem extends cc.Component {
    item: any;
    isHarvest: boolean;
    type:number;
    static create(itemData, parent, position, callback) {
        let filePath = "prefab/component/FarmParkItem";
        cc.loader.loadRes(filePath, function (err, newGood) {
            if (err == null) {
                let newNode = cc.instantiate(newGood);
                parent.addChild(newNode);
                if (callback)
                    callback(newNode);
                let itemClass = newNode.getComponent(global.CommonClass.FarmParkItem);
                newNode.setPosition(position);

                itemClass.setItem(itemData);
               

                
            }
        })
    };
    constructor() {
        super();
        this.item = null;
        this.isHarvest = false;
        this.type = global.Enum.FarmType.FARM_PLANT;
    };

    // use this for initialization
    onLoad() {

    };
    getType() {
        return this.type;
    }

    setItem(item) {
        if (item != null) {
            this.item = item;
            if (!this.item.tempShovel) {
                    if (item.stage > 0) {
                      
                        this.setItemStage(item.stage);
                    }
            }

            this.setSeed(this.item.seed);
            this.setTempShovel(this.item.tempShovel);
        }
    };

    setItemStage(stage) {
        let spItemNode = this.node.getChildByName('spItemNode');

        let plantID = this.item.templateID;
        let data = global.Module.FarmParkData.farmData(plantID);
        if (data != null) {
            let posArr = this.item.posArr;
            if (!(this.item.stage == 1 && posArr.length == data.growNum) && !(this.item.stage == 2 && posArr.length == data.matureNum)) {
                posArr = global.Module.FarmParkData.posArrData(data, this.item);
                this.item.posArr = posArr;
            }
            for (let i = 1; i <= 9; i++)
                spItemNode.getChildByName('spItem' + i).active = false;
            for (let i = 0; i < this.item.posArr.length; i++) {
                let spItem = spItemNode.getChildByName('spItem' + this.item.posArr[i]);
                let num = Math.floor(Math.random() * 4) + 1;
                let image = data.growImage + stage.toString() + '-' + (num);
                global.CommonClass.Functions.setTexture(spItem, image, null);
                spItem.active = true;
            }
        } else {
            spItemNode.active = false;
            this.setFirstHarvest(false);
        }
    };
    isHarvestPicked(touchPoint) {
        let ndPick = this.node.getChildByName('harvest');
        var boundingBox = ndPick.getBoundingBoxToWorld();
        return boundingBox.contains(touchPoint);
    };
    setItemWithered() {
        let plantID = this.item.templateID;
        let data = global.Module.FarmParkData.farmData(plantID);
        if (data != null) {
            let spItemNode = this.node.getChildByName('spItemNode');
            spItemNode.active = false;
        }
    };

    setSeed(isSeed) {
        let spItemNode = this.node.getChildByName('spItemNode');
        spItemNode.active = this.item.templateID > 0 || isSeed;

        if (isSeed) {

            for (let i = 1; i <= 9; i++)
                spItemNode.getChildByName('spItem' + i).active = false;
            for (let i = 0; i < this.item.posArr.length; i++) {
                let spItem = spItemNode.getChildByName('spItem' + this.item.posArr[i]);
                let num = Math.floor(Math.random() * 4) + 1;
                let image = 'images/pictrue/farmscene/parkItems/plants/seed-' + (num);
                global.CommonClass.Functions.setTexture(spItem, image, null);
                spItem.active = true;
            }
        }
    };

    setTempShovel(isTempShovel) {
        let spItemNode = this.node.getChildByName('spItemNode');
        let isShow = !isTempShovel && this.item.templateID > 0;
        spItemNode.active = isShow;
        if (isShow == false) {
            this.setFirstHarvest(false);
           
        }
    };
    removespItem(params) {
        let spItemNode = this.node.getChildByName('spItemNode');
        spItemNode.active = false;
    };

    setFirstHarvest(canHarvset) {
        let isHarvest = (canHarvset && this.item.templateID > 0);
        let harvest = this.node.getChildByName('harvest');
        harvest.active = isHarvest;
        let map = global.Module.FarmParkData.getMap();
        let cell = map.getCellByIndex(this.item.index);
        if (cell)
            cell.showSel(isHarvest);
    };

    getIndex() {
        return this.node.tagEx;
    };

    getItemID() {
        return this.item.templateID;
    };
    update(){
       

    }
}
