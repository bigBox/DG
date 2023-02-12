import UIBase from "../common/UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgAdult extends UIBase {
    item: any;

    ctor () {
        this.item = null;
    }

    // use this for initialization
    onLoad () {

    }

    onEnable () {

    }

    onDisable () {
    }

    btnClose () {
        global.Manager.UIManager.close('DlgAdult');
        let roleID = global.Module.MainPlayerData.getRoleID();
        global.Instance.MsgPools.send('scenePosition', { roleId: roleID }, function (msg) {
            if (!msg.errorID) {
                global.Module.GameData.loadLocalDropData();
                global.CommonClass.Functions.loadScene("MainScene",null);
            }
        });

    }
}
