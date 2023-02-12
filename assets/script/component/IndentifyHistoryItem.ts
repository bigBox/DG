
const { ccclass, property } = cc._decorator;

@ccclass
export default class IndentifyHistoryItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };
    onLoad() {

    };

    setData(index, data) {
        this.data = data;

        let lblIndex = this.node.getChildByName('lblIndex').getComponent(cc.Label);
        let spItem = this.node.getChildByName('spItem');
        let lblName = this.node.getChildByName('lblName').getComponent(cc.Label);
        let lblPerson = this.node.getChildByName('lblPerson').getComponent(cc.Label);
        let lblTime = this.node.getChildByName('lblTime').getComponent(cc.Label);
        let lblTimeCut = this.node.getChildByName('lblTimeCut').getComponent(cc.Label);
        let lblDec = this.node.getChildByName('lblDec').getComponent(cc.Label);

        global.CommonClass.Functions.setItemTexture(spItem, data.itemId, null);

        let itemData = global.Manager.DBManager.getItemNew(data.itemId);
        lblIndex.string = index.toString();
        lblName.string = itemData.name;

        lblPerson.string = '鉴定人' + data.verifyRoleInfo.roleName;
        lblTimeCut.string = '减少' + data.verifyCD.toString() + '分钟';

        let date = new Date();
        let time = data.verifyTime.value;
        date.setTime(time);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? parseInt(('0' + month)) : month;
        let day = date.getDate();
        day = day < 10 ? parseInt(('0' + day)) : day;

        let timeDec = year + '年' + month + '月' + day + '日';
        lblTime.string = timeDec;

        lblDec.string = data.verifyRoleInfo.roleName + '在' + timeDec + '帮您减少了' + data.verifyCD.toString() + '分钟';
    };

    getData() {
        return this.data;
    };

    btnItemClick(event, arg) {
        let evt = new cc.Event.EventCustom('onItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };
    callKey(params) {

    };

}
