

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIUnionApply extends cc.Component {
    union: any;

    onLoad () {}

    start () {

    }
    show(union) {
        let itemNeed:any = this.node.getChildByName('ItemNeed');
        let itemNeedClass = itemNeed.getComponent(global.CommonClass.ItemNeed);
        itemNeedClass.setItem(609990004, 1);

        this.union = union;
    };

    btnYes() {
        //加入商会任务安全保护
        if (global.Module.TaskData.taskguard(10024))
            return;
        global.Proxys.ProxyUnion.addUnion(this.union.id);
        global.Manager.UIManager.close('UIUnionApply');
    };

    btnClose() {
        global.Manager.UIManager.close('UIUnionApply');
    };

    // update (dt) {}
}
