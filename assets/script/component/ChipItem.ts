
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChipItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };
    // use this for initialization
    onLoad() {
        

    };

    setData(data)
    {
        this.data = data;

        let spItem = this.node.getChildByName('spItem');
        global.CommonClass.Functions.setItemTexture(spItem, data.itemID,null);

        let lblNum = this.node.getChildByName('lblNum');
        lblNum.getComponent(cc.Label).string = 'X'+data.itemNum.toString();
        if (data.itemNum>data.itemAverage)
            lblNum.color = cc.color(0, 255, 255, 255);
        else if(data.itemNum < data.itemAverage)
            lblNum.color = cc.color(255, 0, 0, 255);

        let lblIdx = this.node.getChildByName('lblIndex');
        lblIdx.getComponent(cc.Label).string = '#'+data.index.toString();
    };

}
