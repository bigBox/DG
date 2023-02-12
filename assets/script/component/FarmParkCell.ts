
const { ccclass, property } = cc._decorator;

@ccclass
export default class FarmParkCell extends cc.Component {
    item: any;
    type:number;
    static create(itemData, parent, position, callback) {
        let filePath = "prefab/component/FarmParkCell";
        cc.loader.loadRes(filePath, function (err, newGood) {
            if (err == null) {
                let newNode = cc.instantiate(newGood);
                let itemClass = newNode.getComponent(global.CommonClass.FarmParkCell);
                newNode.setPosition(position);

                itemClass.setItem(itemData);
                parent.addChild(newNode);

                if (callback)
                    callback(newNode);
            }
        })
    };

    constructor() {
        super();
        this.item = null;
        this.type = global.Enum.FarmType.FARM_PLANT;
    };
    // use this for initialization
    onLoad() {

    };

    setItem(item) {
        if (item != null) {
            this.item = item;
            this.setGreenValue(item.greenValue);
        }
    };

    setGreenValue(greenValue) {
        let spCell = this.node.getChildByName('spCell');

        let pathIndex = greenValue;

        let colNum = global.Module.FarmParkData.getColNum();
        let index = this.item.index;
        let row = Math.floor(index / colNum);
        let type = Math.floor(index % colNum);
        let picRow = row % 6;
        let picCol = type % 3;
        let picIdx = picRow * 3 + picCol + 1;

        // if (greenValue > 1)
        // {
        // let pic = 'images/pictrue/farmscene/parkItems/greencells/greencell'+pathIndex.toString()+'/'+picIdx.toString();
        let pic = 'images/pictrue/farmscene/parkItems/greencells/greencell5/' + pathIndex.toString();
        global.CommonClass.Functions.setTexture(spCell, pic, null);
        // }
    };

    getIndex() {
        return this.node.tagEx;
    };
    getType() {
        return this.type;
    }
    getItemID() {
        return this.item.templateID;
    };

    showSel(isShow) {
        let spSel = this.node.getChildByName('spSel');
        spSel.active = isShow;
        let index = this.node.tagEx;
        if(isShow){
            this.node.zIndex = (cc.macro.MAX_ZINDEX);
        }else{
            this.node.zIndex = (index * 5);
        }
        
    };
    showSel1(isShow) {
        let spSel = this.node.getChildByName('spSel1');
        spSel.active = isShow;
        let index = this.node.tagEx;
        if (isShow) {
            this.node.zIndex = (cc.macro.MAX_ZINDEX);
        } else {
            this.node.zIndex = (index * 5);
        }

    }

    checkIsCrossFactory(ndFactory) {
        let factoryClass = ndFactory.getComponent(global.CommonClass.FactoryBase);
        let ndCross = ndFactory.getChildByName('ndCross');
        let isCross = global.CommonClass.Geometry.checkSlantingSpIsCross(ndCross, factoryClass.xPickRate, factoryClass.yPickRate, this.node, 1, 1);

        return isCross;
    };

}
