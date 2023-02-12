import FactoryBase from "./FactoryBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class FishRoom extends FactoryBase {


    onLoad() {

        return FactoryBase.prototype.onLoad.apply(this, arguments);
    };

    onEnable() {
    };

    getClickFlag(touchPoint) {
        let ndTouch = this.node.getChildByName('ndTouch');
        let ndItems = ndTouch.children;
        for (let i = 0; i < ndItems.length; ++i) {
            let ndItem: any = ndItems[i];
            let boundingBox = ndItem.getBoundingBoxToWorld();
            if (boundingBox.contains(touchPoint)) {
                let userData = ndItem.getComponent(global.CommonClass.UserData);
                let flag = userData.iData;
                global.Instance.Log.debug('flag', flag);
                return flag;
            }
        }

        return -1;
    };

    isPicked(touchPoint) {
        if (this.getClickFlag(touchPoint) > 0)
            return true;

        return FactoryBase.prototype.isPicked.apply(this, arguments);
    };

    onClick(touchPoint) {
        let flag = this.getClickFlag(touchPoint);
        if (flag > 0)
            this.openUI(flag);
    };

    openUI(flag) {
        if (flag == 1) {
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { roleId: ID, type: 1 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Manager.UIManager.open('UIFishRoom', null, null);
            });
        }
        else if (flag == 2) {
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { roleId: ID, type: 1 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Manager.UIManager.open('UIPoolFish', null, null);
            });
        }
    };   

    // update (dt) {}
}
