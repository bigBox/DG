import UIBase from "../common/UIBase";
const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgExtendMap extends UIBase {
    callback: any;
    ID: number;

    constructor() {
        super();
        this.ID = 0;
        this.callback = null;
    };

    // use this for initialization
    onLoad() {

    }; 

    show(ID, callback) {
        this.ID = ID;
        this.callback = callback;
        let data = global.Manager.DBManager.findData('Obstacles', 'ID', ID);
        let cellID = data.type;
        let item = global.Manager.DBManager.findData('ObstacleCell', 'ID', cellID);
        let itemID = item.itemCost;
        let itemNum = item.costNum;
        let itemNeedNode:any = this.node.getChildByName('itemNeed')
        let itemNeed = itemNeedNode.getComponent(global.CommonClass.ItemIcon);
        itemNeed.setItem(itemID);
        itemNeed.showNumber(false);
        let itemCount = global.Module.PackageData.getItemCount(itemID);
        let lblNeed = this.node.getChildByName('lblNeed').getComponent(cc.Label);
        lblNeed.string = itemNum.toString() + '/' + itemCount.toString();
        if (itemCount >= itemNum)
            lblNeed.node.color = cc.color(255, 255, 255);
        else
            lblNeed.node.color = cc.color(255, 0, 0);
        this.reflashHelp();
    };
    reflashHelp() {
        let helpNode = this.node.getChildByName('helpNode');
        if (helpNode) {
            helpNode.active = false;
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if (!data)
                return;
            if (data && data.taskId == '10026' && data.state == 1) {
                if (data.state == 1)
                    helpNode.active = true;
            }
        }
    };
    btnYes() {
        global.Manager.UIManager.close('DlgExtendMap');
        //挖地安全保护
        if (global.Module.TaskData.taskguard(10026))
            return;
        if (this.callback)
            this.callback(true);
    };

    btnNo() {
        if (this.callback)
            this.callback(false);

        global.Manager.UIManager.close('DlgExtendMap');
    };
}
