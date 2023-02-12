

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIDigGold extends cc.Component {
    lblCostNum: any;
    @property({ type: cc.Label, displayName: "lblTitleDec", tooltip: "名称" })
    lblTitleDec: cc.Label = null;
    onLoad() { }

    start() {

    }
    onEnable() {
        this.lblCostNum = this.node.getChildByName('ndItemCost').getChildByName('lblCostNum').getComponent(cc.Label);

        let sceneID = global.Proxys.ProxyDigGold.getSceneData().id;

        let friend = global.Module.FriendData.getFriend(sceneID);
        if (friend != null) {
            this.lblTitleDec.string = friend.roleInfo.roleName + '家的矿';
        }

        this.refalshCostItem(false);

        global.Manager.UIManager.add('UIDigGold', this);
    };

    onDisable() {
        global.Manager.UIManager.remove('UIDigGold');
    };

    btnClose() {
        let data = {};
        global.Instance.MsgPools.send('leaveDigRoom', data, function (msg) {
            if (!msg.errorID) {
                global.Proxys.ProxyGuide.stepNextGuide('DigGoldBack');

                global.Manager.DigGolderManager.clear();
                global.CommonClass.Functions.loadScene("MainScene", null);
            }
            else {
                global.CommonClass.UITip.showTipTxt('离开场景出错', global.Enum.TipType.TIP_BAD);
                global.Instance.Log.debug('', '离开场景出错' + msg.errorID.toString());
            }
        });
    };
    refalshCostItem(isPlayAction) {
        let costNum = global.Proxys.ProxyDigGold.getCostItemLeft();
        this.lblCostNum.string = costNum.toString();

        if (isPlayAction)
            global.CommonClass.Functions.runChangeAction(this.lblCostNum.node);
    };
   //打开主页商会消息
    btnUIChat() {
        global.CommonClass.UITip.showTipTxt('暂未开放', global.Enum.TipType.TIP_BAD);
        return;
        global.Manager.UIManager.open('UIChat', null, function (panel) {
            panel.show(true);
        });
    };
    // update (dt) {}
}
