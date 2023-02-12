
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuJiCellItem extends cc.Component {
    item: any;

    static create(itemData, parent, position, callback) {
        let filePath = "prefab/component/GuJiCellItem";
        cc.loader.loadRes(filePath, function (err, newGood) {
            if (err == null) {
                let newNode = cc.instantiate(newGood);
                let itemClass = newNode.getComponent(global.CommonClass.GuJiCellItem);
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

    setItem(item) {
        if (item != null) {
            this.item = item;

            let spCell = this.node.getChildByName('spCell');
            let spWater = this.node.getChildByName('spWater');

            let proxy = global.Proxys.ProxyGuJi;
            let isShowWater = (proxy.getIsWarter(item) && item.isOpen && item.type >= 0);
            spCell.active = !isShowWater;
            spWater.active = isShowWater;
            this.showHVs(isShowWater);
        }
    };

    showHVs(isShow) {
        let ndHVs = this.node.getChildByName('ndHV').children;
        for (let key in ndHVs) {
            let ndHV = ndHVs[key];
            ndHV.active = isShow;
        }
    };

    hideItemHV(direct)//0.up 1.down 2.left 3.right
    {
        let ndHVs = this.node.getChildByName('ndHV');

        let ndHV = null;
        if (direct == 0)
            ndHV = ndHVs.getChildByName('waterRU');
        else if (direct == 1)
            ndHV = ndHVs.getChildByName('waterLD');
        else if (direct == 2)
            ndHV = ndHVs.getChildByName('waterLU');
        else if (direct == 3)
            ndHV = ndHVs.getChildByName('waterRD');

        if (ndHV != null)
            ndHV.active = false;
    };

    openItem(neighbor) {
        if (this.item != null) {
            //  let spItem  = this.node.getChildByName('spItem');
            let ndHV = this.node.getChildByName('ndHV');

            let proxy = global.Proxys.ProxyGuJi;
            let itemType = this.item.type;
            if (proxy.getIsWarter(this.item)) {
                let map = global.Instance.Dynamics["GuJiMap"];
                this.setItem(this.item);

                //0.up 1.down 2.left 3.right
                let upBarShow = !(neighbor.up && proxy.getIsWarter(neighbor.up) && neighbor.up.isOpen);
                let waterRU = ndHV.getChildByName('waterRU');
                waterRU.active = upBarShow;


                let downBarShow = !(neighbor.down && proxy.getIsWarter(neighbor.down) && neighbor.down.isOpen);
                let waterLD = ndHV.getChildByName('waterLD');
                waterLD.active = downBarShow;


                let leftBarShow = !(neighbor.left && proxy.getIsWarter(neighbor.left) && neighbor.left.isOpen);
                let waterLU = ndHV.getChildByName('waterLU');
                waterLU.active = leftBarShow;


                let rightBarShow = !(neighbor.right && proxy.getIsWarter(neighbor.right) && neighbor.right.isOpen);
                let waterRD = ndHV.getChildByName('waterRD');
                waterRD.active = rightBarShow;

            }
        }

    };

    grayItem() {
        let ndHVs = this.node.getChildByName('ndHV').children;
        for (let key in ndHVs) {
            let item = ndHVs[key].getComponent(cc.Sprite);
            global.CommonClass.Functions.grayTexture(item, true);
        }

        let spItem = this.node.getChildByName('spItem').getComponent(cc.Sprite);
        global.CommonClass.Functions.grayTexture(spItem, true);
    };
}
