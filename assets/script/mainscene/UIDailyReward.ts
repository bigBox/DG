import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIDailyReward extends UIBase {
    curPickItem: any;

    onLoad() { }

    start() {

    }
    onEnable() {
 
        this.reflash();
    };

    onDisable() {
    };

    getClickItem(touchPos) {
        for (let idx = 1; idx <= 2; ++idx) {
            let ndRewards = this.node.getChildByName('rewardItem' + idx.toString()).getChildByName('ndRewards');

            for (let i = 1; i <= 2; ++i) {
                let ndReward = ndRewards.getChildByName('rewardItem' + i.toString());
                let box = ndReward.getBoundingBoxToWorld();

                if (box.contains(touchPos)) {
                    return ndReward;
                }
            }
        }

        return null;
    };

    reflashReward() {
        let data = global.Manager.DBManager.findData('MonthCard', 'ID', 1);
        for (let idx = 1; idx <= 2; ++idx) { //1.非月卡用户 2.月卡用户
            let isMoonCard = false;
            if(idx == 1)
            isMoonCard = global.Module.GameData.getCanRewardCard();
            if(idx == 2)
            isMoonCard = global.Module.GameData.getCanRewardMoonCard();
        
            let ndItem = this.node.getChildByName('rewardItem' + idx.toString());
            let ndRewards = ndItem.getChildByName('ndRewards');
            let btnReward = ndItem.getChildByName('btnReward');
            let receivedBtn = ndItem.getChildByName('receivedBtn');

            for (let i = 1; i <= 2; ++i) {
                let ndReward = ndRewards.getChildByName('rewardItem' + i.toString());
                let spItem = ndReward.getChildByName('spItem');
                let lblNumber = ndReward.getChildByName('lblNumber');

                let itemID = data['item' + i.toString()];
                ndReward.tagEx = itemID;
                ndReward.active = (itemID > 0);

                global.CommonClass.Functions.setItemTexture(spItem, itemID, function () {
                    spItem.scale = global.CommonClass.Functions.getToscale(spItem, 50, 50);
                }.bind(this));

                if (idx == 1) {   //基本奖励

                    lblNumber.getComponent(cc.Label).string = 'X2';
                    btnReward.active = global.Module.GameData.getCanRewardCard();
                    receivedBtn.active = !global.Module.GameData.getCanRewardCard();
                }
                if (idx == 2) { //月卡奖励
                    let bg5 = ndItem.getChildByName('bg5');
                    bg5.active = isMoonCard;
                    btnReward.active = global.Module.GameData.getCanRewardMoonCard();
                    receivedBtn.active = !global.Module.GameData.getCanRewardMoonCard();
                    lblNumber.getComponent(cc.Label).string = 'X' + data['item' + i.toString() + 'Num'];
                }

                   
            }
        }
    };

    reflash() {
        this.reflashReward();
    };

    btnClose(evnet, arg) {
        global.Manager.UIManager.close('UIDailyReward');
    };

    btnGetReward(evnet, arg) {
        let type = parseInt(arg);
        global.Instance.MsgPools.send('monthCardDraw', { type: type }, function (msg) {
            let rewardBtn = evnet.target;
            rewardBtn.active = false;

            global.Manager.UIManager.close('UIDailyReward');

            if (msg.errorID == 0) {

                let data = global.Manager.DBManager.findData('MonthCard', 'ID', 1);
                let allItems = [];

                for (let i = 1; i <= 2; ++i) {
                    let itemID = data['item' + i.toString()];
                    let itemNum = 0;

                    if (type == 1)
                        itemNum = 2;          //非月卡用户先写死
                    else if (type == 2)
                        itemNum = data['item' + i.toString() + 'Num'];

                    let item = { itemID: itemID, itemNum: itemNum, type: 0 };
                    allItems.push(item);
                }

                if (allItems.length > 0) {
                    global.Manager.UIManager.open('DlgCollectDrop', null, function (panel) {
                        panel.show(allItems);
                    });
                }

                let uiMainScene = global.Manager.UIManager.get('UIMainScene');
                if (uiMainScene)
                    uiMainScene.reflashDailyReward();
            }

            //rewardBtn.getComponent(cc.Button).interactable = global.Module.GameData.getCanRewardCard();
        });
    };


    btnClickItem(event, arg) {

    };
    // update (dt) {}
}
