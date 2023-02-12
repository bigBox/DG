
import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIUnionFight extends UIBase {
    ndFightItems: cc.Node;
    gameTime: any;
    bulids: any;
    lblTime: cc.Node;


    // use this for initialization
    onLoad() {


    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);

        let self = this;
        this.node.on('onUnionFight', function (event) {
            self.onUnionFight(event);
        });

        this.ndFightItems = this.node.getChildByName('ndFightItems');

        global.Module.GuildBattleData.setPanel(this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);

        this.node.off('onUnionFight');

        global.Module.GuildBattleData.setPanel(null);
        global.Module.GuildBattleData.clear();
    }

    btnClose() {
        global.Manager.UIManager.close('UIUnionFight');

        let uiUnion = global.Manager.UIManager.get('UIUnion');
        if (uiUnion)
            uiUnion.reflashFight();

        global.Instance.MsgPools.send('exitBattleBuildList', null, null);
    }

    touchEvent(event) {

    }

    show(bulids, gameTime) {
        this.gameTime = gameTime;
        this.bulids = bulids;

        this.lblTime = this.node.getChildByName('lblTime');
        this.lblTime.getComponent(cc.Label).string = gameTime.toString();
        cc.director.getScheduler().schedule(this.reflashGameCD, this, 1, cc.macro.REPEAT_FOREVER, 0, false);

        this.reflashBuilds(bulids);
        this.reflashBaseInfo();
    }

    reflashGameCD(dt) {
        this.gameTime--;

        if (this.gameTime <= 0) {
            cc.director.getScheduler().unschedule(this.reflashGameCD, this);
            this.lblTime.active = false;

            global.Manager.UIManager.close('UIUnionFight');
            global.CommonClass.UITip.showTipTxt('游戏时间已满', global.Enum.TipType.TIP_BAD);
        }
        else {
            this.lblTime.active = true;
            let strTime = global.CommonClass.Functions.formatSeconds2(this.gameTime);
            this.lblTime.getComponent(cc.Label).string = strTime;
        }
    }

    reflashBuilds(bulids) {
        this.bulids = bulids;

        let fightItems: any = this.ndFightItems.children;
        let idx = 0;

        for (let key in this.bulids) {
            let bulild = this.bulids[key];
            let fightItem = fightItems[idx].getComponent(global.CommonClass.UnionFightItem);

            fightItem.setData(bulild);

            ++idx;
        }
    }

    reflashBuild(buildData) {
        let fightItems: any = this.ndFightItems.children;
        for (let key in fightItems) {
            let fightItem = fightItems[key].getComponent(global.CommonClass.UnionFightItem);
            if (fightItem.getData().buildID == buildData.buildID) {
                fightItem.setData(buildData);
                return;
            }

        }
    }

    getBuildByRole(roleId) {
        let fightItems: any = this.ndFightItems.children;
        for (let key in fightItems) {
            let fightItem = fightItems[key].getComponent(global.CommonClass.UnionFightItem);
            let data = fightItem.getData();

            if (data.holdRoleInfo && data.holdRoleInfo.roleId == roleId)
                return fightItem;

        }
    }

    reflashBaseInfo() {
        this.reflashScores();
        this.reflashPlayerCD();
    }

    playScoreFly(score) {
        let roleId = global.Module.MainPlayerData.getRoleID();
        let buildClass = this.getBuildByRole(roleId);
        if (buildClass)
            buildClass.playScoreFly(score);
    }

    reflashScores() {
        let ndSelf = this.node.getChildByName('ndSelf');
        let ndOther = this.node.getChildByName('ndOther');

        let lblSelfScore = ndSelf.getChildByName('lblScore').getComponent(cc.Label);
        let lblOtherScore = ndOther.getChildByName('lblScore').getComponent(cc.Label);

        let selfScore = global.Module.GuildBattleData.getScore(true);
        lblSelfScore.string = selfScore.toString() + '分';
        let otherScore = global.Module.GuildBattleData.getScore(false);
        lblOtherScore.string = otherScore.toString() + '分';
    }

    reflashPlayerCD() {
        let selfCD = global.Module.GuildBattleData.getCD(true);
        let otherCD = global.Module.GuildBattleData.getCD(false);

        let ndSelfList = this.node.getChildByName('ndSelfList');
        let ndOtherList = this.node.getChildByName('ndOtherList');

        let selfCDBar = ndSelfList.getChildByName('barCD').getComponent(cc.ProgressBar);
        let otherCDBar = ndOtherList.getChildByName('barCD').getComponent(cc.ProgressBar);

        selfCDBar.progress = selfCD / 60;
        otherCDBar.progress = otherCD / 60;
    }

    showFightDlg(dec) {
        let dlgFight = this.node.getChildByName('dlgFight');
        let lblDec = dlgFight.getChildByName('lblDec');
        lblDec.getComponent(cc.Label).string = dec;

        dlgFight.active = true;

        dlgFight.on(cc.Node.EventType.TOUCH_START, this.touchFight, this);
        dlgFight.on(cc.Node.EventType.TOUCH_MOVE, this.touchFight, this);
        dlgFight.on(cc.Node.EventType.TOUCH_END, this.touchFight, this);
        dlgFight.on(cc.Node.EventType.TOUCH_CANCEL, this.touchFight, this);
    }

    btnEnterFight() {
        global.Manager.UIManager.open('UICatchGoodsNet', null, function (panel) {
            panel.btnStartGame();
        });

        this.btnHideFight();
    }

    btnHideFight() {
        let dlgFight = this.node.getChildByName('dlgFight');
        dlgFight.active = false;

        dlgFight.off(cc.Node.EventType.TOUCH_START, this.touchFight, this);
        dlgFight.off(cc.Node.EventType.TOUCH_MOVE, this.touchFight, this);
        dlgFight.off(cc.Node.EventType.TOUCH_END, this.touchFight, this);
        dlgFight.off(cc.Node.EventType.TOUCH_CANCEL, this.touchFight, this);
    }

    onUnionFight(event) {
        if (this.gameTime > 0) {
            let data = event.getUserData().getData();
            if (data != null) {
                let sendData = { buildID: data.buildID };
                global.Module.CatchGoodsNetData.setFightBuild(data.buildID);

                let CD = global.Module.GuildBattleData.getCD(true);
                if (CD <= 0) {
                    if (data.holdRoleInfo != null) {
                        let roleId = data.holdRoleInfo.roleId;

                        if (roleId == global.Module.MainPlayerData.getRoleID()) {
                            global.CommonClass.UITip.showTipTxt('不能挑战自己', global.Enum.TipType.TIP_BAD);
                        }
                        else {
                            global.Instance.MsgPools.send('captureBattleBuild', sendData, function (msg) {
                                global.Instance.Log.debug('captureBattleBuild',msg)
                                global.Manager.UIManager.open('UICatchGoodsNet', null, function (panel) {
                                    if (panel != null)
                                        panel.btnStartGame();
                                });
                            });
                        }
                    }
                    else {
                        global.Instance.MsgPools.send('holdBattleBuild', sendData, function (msg) {
                        });
                    }
                }
                else {
                    global.CommonClass.UITip.showTipTxt('挑战还在冷却中', global.Enum.TipType.TIP_BAD);
                }
            }
        }
    }

    touchFight() {

    };

    // update (dt) {}
}
