const { ccclass, property } = cc._decorator;

@ccclass
export default class TownCellItem extends cc.Component {
    static className: string = "FrogJump";
    item: any;
    static create(itemData, parent, position, callback) {
        let filePath = "prefab/component/TownCellItem";
        cc.loader.loadRes(filePath, function (err, newGood) {
            if (err == null) {
                let newNode = cc.instantiate(newGood);
                let itemClass = newNode.getComponent(global.CommonClass.TownCellItem);
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
    };
    // use this for initialization
    onLoad() {

    };
    setItem(item) {
        if (item != null) {
            this.item = item;
        }
    };
    isPicked(worldPoint) {
        //let spMask  = this.node.getChildByName('spMask');
        let spMask = this.node;
        if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(worldPoint, spMask, 1, 1)) {
            return true;
        }
        return false;
    };

}
