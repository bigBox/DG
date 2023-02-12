
const { ccclass, property } = cc._decorator;

@ccclass
export default class TownListItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };
    // use this for initialization
    onLoad() {


    };

    setData(index, ID) {
        let cityData = global.Manager.DBManager.findData('CityList', 'ID', ID);
        let lblIndex = this.node.getChildByName('lblIndex');
        lblIndex.getComponent(cc.Label).string = index.toString();

        let lblTilte = this.node.getChildByName('lblTitle');
        lblTilte.getComponent(cc.Label).string = cityData.name;

        this.data = cityData;

        this.node.tagEx = ID;
    };

    getData() {
        return this.data;
    };

    btnItemClick(event, arg) {
        let evt = new cc.Event.EventCustom('onItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };
}
