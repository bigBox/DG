
const {ccclass, property} = cc._decorator;

@ccclass
export default class HandBookItem extends cc.Component {
    ID: number;
    data: any;
    static className:string = "HandBookItem"
    constructor() {
        super();
        this.ID = 0;
        this.data = {};
   };
    // use this for initialization
    onLoad() {

       
   };

    setData(data)
    {
        this.data = data;

        if (data != null)
        {
            let itemId = data.itemId;

            let spItem = this.node.getChildByName('spItem');

            global.CommonClass.Functions.setItemTexture(spItem, itemId,null);

            let spSprite = spItem.getComponent(cc.Sprite)
            global.CommonClass.Functions.grayTexture(spSprite, data.state==0);

            let spLight = this.node.getChildByName('spLight');
            spLight.active = data.state==2;

            let lblGrow = this.node.getChildByName('lblGrow');
            if (lblGrow != null)
            {
                let itemData = global.Manager.DBManager.getItemNew(itemId);
                lblGrow.active = (itemData.subType==1);
            }
        }
   };

    getData()
    {
        return this.data;
   };

    getItemID()
    {
        return this.data.itemId;
   };

}
