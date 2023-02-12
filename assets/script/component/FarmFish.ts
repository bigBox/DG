
const { ccclass, property } = cc._decorator;

@ccclass
export default class FarmFish extends cc.Component {
    item: any;
    isHarvest: boolean;
    type:number;

    constructor() {
        super();
        this.item = null;
        this.type = global.Enum.FarmType.FARM_FISH;
    };

    getType() {
        return this.type;
    }

    // use this for initialization
    onLoad() {

    };

    setItem(item) {
        if (item != null) {
            this.item = item;
            this.setGreenValue(item);
        }else{
            this.item = null;
            this.setFirstHarvest(false)
        }
    };

    setGreenValue(item) {
        let paopao1 = this.node.getChildByName('paopao1');
        paopao1.active = (item.templateID > 0 && !item.canHarvset);
        let paopao2 = this.node.getChildByName('paopao2');
        paopao2.active = (item.templateID > 0 && item.canHarvset);
        let lotusPic = this.node.getChildByName('lotusPic');
        lotusPic.active =  (item.templateID > 0 && item.canHarvset);

    };
    setFirstHarvest(canHarvset) {
        let isHarvest = (canHarvset && this.item.templateID > 0);
        let harvest = this.node.getChildByName('harvest');
        if(canHarvset == true){
            this.helpNode(false);
        }
        harvest.active = isHarvest;
        this.showSel(isHarvest);
    };
    getIndex() {
        return this.node.tagEx;
    };

    getItemID() {
        return this.item.templateID;
    };

    showSel(isShow) {
        let spSel = this.node.getChildByName('spSel');
        spSel.active = isShow;
    };
    isHarvestPicked(touchPoint) {
        let ndPick = this.node.getChildByName('harvest');
        var boundingBox = ndPick.getBoundingBoxToWorld();
        return boundingBox.contains(touchPoint);
    };
    checkIsCrossFactory(ndFactory) {
        let factoryClass = ndFactory.getComponent(global.CommonClass.FactoryBase);
        let ndCross = ndFactory.getChildByName('ndCross');
        let isCross = global.CommonClass.Geometry.checkSlantingSpIsCross(ndCross, factoryClass.xPickRate, factoryClass.yPickRate, this.node, 1, 1);

        return isCross;
    };
    helpNode(isShow){
        let helpNode = this.node.getChildByName('helpNode');
        if(helpNode){
            helpNode.active = isShow;
        }  
    }
    update(){
       

    }
}

