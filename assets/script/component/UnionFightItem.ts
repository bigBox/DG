
const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionFightItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };
    setData(data) {
        this.data = data;

        let lblRoleName = this.node.getChildByName('lblRoleName');
        let spHead = this.node.getChildByName('spHead');

        if (this.data.holdRoleInfo != null) {
            lblRoleName.getComponent(cc.Label).string = this.data.holdRoleInfo.roleName;

            let roleId = global.Module.MainPlayerData.getRoleID();
            let iconFile = 'images/plist/union/headSelf';
            if (this.data.holdRoleInfo.roleId != roleId)
                iconFile = 'images/plist/union/headTarget';
            global.CommonClass.Functions.setTexture(spHead, iconFile, null);

            spHead.active = true;
        }
        else {
            lblRoleName.getComponent(cc.Label).string = '';
            spHead.active = false;
        }

    };

    getData() {
        return this.data;
    };

    playScoreFly(score) {
        let lblFlyScore = this.node.getChildByName('lblFlyScore')
        let newItem = cc.instantiate(lblFlyScore);
        newItem.active = true;

        if (score < 0)
            newItem.getComponent(cc.Label).string = score.toString();
        else
            newItem.getComponent(cc.Label).string = '+' + score.toString();

        this.node.addChild(newItem);
        newItem.setPosition(cc.v2(0, 0));

        let endFun = function () {
            newItem.removeFromParent();
        };
        let action1 = cc.moveBy(1.7, cc.v2(0, 150));
        let action2 = cc.fadeOut(1.7);
        let action3 = cc.callFunc(endFun);

        let spawn = cc.spawn(action1, action2);
        let seq = cc.sequence(spawn, action3);

        newItem.stopAllActions();
        newItem.runAction(seq);
    };

    btnFightClick(event, arg) {
        let evt = new cc.Event.EventCustom('onUnionFight', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };
}
