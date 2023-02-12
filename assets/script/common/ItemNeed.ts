
const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemNeed extends cc.Component {
    itemID: number;
    itemNeed: number;
    isEnough: boolean;

    constructor() {
        super();
        this.itemID     = 0;
        this.itemNeed   = 0;
    };

    setItem(itemID: number, itemNeed: number,size) {
        this.itemID     = itemID;
        this.itemNeed   = itemNeed;

        let spItem = this.node.getChildByName('spItem');
        if(spItem){
            global.CommonClass.Functions.setItemTexture(spItem, this.itemID, function (msg) {
                if (size)
                    spItem.scale = global.CommonClass.Functions.getToscale(spItem, size, size);
            });
            spItem.tagEx = itemID;
            spItem.active       = itemID>0;
        }
       
        let hasNum = global.Module.PackageData.getItemCount(itemID);

        let lblNumber   = this.node.getChildByName('lblNumber');
        let lblNeed = this.node.getChildByName('lblNeed');
       
        
        lblNumber.active    = itemID>0;
        this.node.active      = itemID>0;

        let strNum = global.CommonClass.Functions.formatMoney(hasNum);
        if (this.itemNeed != null) {
            if (hasNum >= this.itemNeed )
                lblNumber.color = cc.color(255, 255, 255, 255);
            else
                lblNumber.color = cc.color(255, 0, 0, 255);
            lblNumber.getComponent(cc.Label).string = strNum;
            this.isEnough = (hasNum>=this.itemNeed);
            if (lblNeed)
            lblNeed.getComponent(cc.Label).string = this.itemNeed.toString();
        }
        else
        {
            lblNumber.getComponent(cc.Label).string = '--/'+strNum;
        }
    };

    getIsEnough() {
        return this.isEnough;
    };

    getItemID() {
        return this.itemID;
    };

    // update (dt) {}
}
