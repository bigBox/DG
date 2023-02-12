
const {ccclass, property} = cc._decorator;

@ccclass
export default class NpcListItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };

    setData(index, data) {
        this.data = data;

        let npcData = global.Manager.DBManager.findData('CityNpc', 'ID', data.ID);

        let lblIndex = this.node.getChildByName('lblIndex');
        lblIndex.getComponent(cc.Label).string = index.toString();

        let lblName = this.node.getChildByName('lblName');
        lblName.getComponent(cc.Label).string = npcData.name;

        let barVisit = this.node.getChildByName('barVisit').getComponent(cc.ProgressBar);
        if (barVisit != null)
        {
           barVisit.progress = data.visit/npcData.visitValue;

           let lblVisit = barVisit.node.getChildByName('lblVisit').getComponent(cc.Label);
           lblVisit.string = data.visit.toString() + '/' + npcData.visitValue.toString();
        }

        this.node.tagEx = data.ID;
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
