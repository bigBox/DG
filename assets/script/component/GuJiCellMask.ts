
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuJiCellMask extends cc.Component {
    itemType: number;


    static create(itemData, parent, position, callback) {
        let filePath = "prefab/component/GuJiCellMask";
        cc.loader.loadRes(filePath, function (err, newMask) {
            if (err == null) {
                let newNode = cc.instantiate(newMask);
                //let itemClass = newNode.getComponent(cc.CommonClass.GuJiCellMask);
                newNode.setPosition(position);

                //itemClass.setItem(itemData);
                parent.addChild(newNode);

                if (callback)
                    callback(newNode);
            }
        })
    };

    constructor() {
        super();
        this.itemType = 0;
    };

    showSelect(isShow) {
        let ndItem = this.node.getChildByName('ndItem');
        let spSel = ndItem.getChildByName('spSel');
        spSel.active = isShow;
    };

    isPicked(worldPoint) {
        let ndItem = this.node.getChildByName('ndItem');
        let spMask = ndItem.getChildByName('spMask');

        if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(worldPoint, spMask, 1, 1)) {
            return true;
        }
        return false;
    };

}
