import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIRoleInfo extends UIBase {
    @property({  displayName: "showBar", tooltip: "是否展示" })
    showBar: boolean = false;
    @property({ type: cc.Node, displayName: "gradeBg", tooltip: "等级收藏背景" })
    gradeBg: cc.Node = null;
    @property({ type: cc.Label, displayName: "lblName", tooltip: "名字" })
    lblName: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblMoeny", tooltip: "金币" })
    lblMoeny: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblDiamond", tooltip: "钻石" })
    lblDiamond: cc.Label = null;
    @property({ type: cc.ProgressBar, displayName: "barExp", tooltip: "等级进度" })
    barExp: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "lblLevel", tooltip: "等级级别" })
    lblLevel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblExp", tooltip: "当前经验" })
    lblExp: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblExpTitle", tooltip: "等级名称" })
    lblExpTitle: cc.Label = null;

    @property({ type: cc.Label, displayName: "lblPower", tooltip: "体力" })
    lblPower: cc.Label = null;
    @property({ type: cc.ProgressBar, displayName: "barFortune", tooltip: "收藏进度" })
    barFortune: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "lblFortune", tooltip: "收藏价值" })
    lblFortune: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblFortuneTitle", tooltip: "收藏名称" })
    lblFortuneTitle: cc.Label = null;
    @property({ type: cc.Node, displayName: "spFiveElem", tooltip: "五行石" })
    spFiveElem: cc.Node = null;
    lblTime: any;
    barMagic: any;
    lblMagic: any;
    timeCost: number;
    isFirstUpdate: boolean;
    barPower: any;
    lblUnionCoin: any;
    lblEcological: any;
    lblBoom: any;
    lblHonorLevel: any;
    lblHonorTitle: any;
    barEcological: any;
    node: any;


    // use this for initialization
    onLoad() {
        if (this.node.getChildByName('ndRole')) {
            let timeL = this.node.getChildByName('ndRole').getChildByName('lblTime');
            if (timeL != null)
                this.lblTime = timeL.getComponent(cc.Label);
            let barMagic = this.node.getChildByName('ndRole').getChildByName('barMagic');
            if (barMagic != null) {
                this.barMagic = barMagic.getComponent(cc.ProgressBar);
                this.lblMagic = barMagic.getChildByName('lblMagic').getComponent(cc.Label);
            }
        }
        
    
        global.Manager.UIManager.pushMutiPanel('UIRoleInfo', this);
    };

    ctor() {
        this.timeCost = 0;
        this.isFirstUpdate = true;
    };

    start() {
        this.scheduleOnce(function () {
            //五行状态
            let fiveElem = global.Module.MainPlayerData.getFiveElem();
            let ID = 400010005 + fiveElem
            let iconFile = 'images/pictrue/items/' + ID.toString();
            if (this.spFiveElem)
                global.CommonClass.Functions.setTexture(this.spFiveElem, iconFile, null);
        }, 0.5);
       
    };

    onEnable() {
        let baseKeyArray = ['Name', 'Gold', 'Diamond', 'Level', 'Experience', 'ShowTable', 'Stamina', 'Magic', 'Reputation', 'ReputationLevel', 'Ecology', 'Boom', 'GuildScore'];
        for (let key in baseKeyArray)
            this.reflashByKey(baseKeyArray[key], false);
    };

    onDisable() {
        global.Manager.UIManager.popMutiPanel('UIRoleInfo');
    };
     //打开主页商会消息
    btnUIChat() {
        global.CommonClass.UITip.showTipTxt('暂未开放', global.Enum.TipType.TIP_BAD);
        return;
        global.Manager.UIManager.open('UIChat', null, function (panel) {
            panel.show(true);
        });
    };
   
    update(dt) {
        this.timeCost += dt;

        if (this.timeCost > 1) {
            if (this.lblTime != null) {
                let moonCardLeft = global.Module.GameData.getMoonCardLeft();
                let dec = global.CommonClass.Functions.formatMoonCardTime(moonCardLeft);
                this.lblTime.string = dec;
            }
            this.timeCost = 0;

            if (this.isFirstUpdate) {
                this.isFirstUpdate = false;
            }
        }
    };

    playReduceNumber(parent, number) {
        let lblTempFly = parent.getChildByName('lblTempFly')
        let newItem = cc.instantiate(lblTempFly);
        newItem.active = true;

        if (number < 0)
            newItem.getComponent(cc.Label).string = number.toString();
        else
            newItem.getComponent(cc.Label).string = '+' + number.toString();

        parent.addChild(newItem);

        let endFun = function () {
            newItem.removeFromParent();
        };
        let action1 = cc.moveBy(1.7, cc.v2(0, 42));
        let action2 = cc.fadeOut(1.7);
        let action3 = cc.callFunc(endFun);

        let spawn = cc.spawn(action1, action2);
        let seq = cc.sequence(spawn, action3);

        newItem.stopAllActions();
        newItem.runAction(seq);
    };

    playChangeAction(key)      //减少或增加时候处理的逻辑
    {
        let curValue = global.Module.MainPlayerData.getDataByKey(key);
        let oldValue = global.Module.MainPlayerData.getOldData(key);
        let diff = curValue - oldValue;

        if (diff < 0) {
            if (key == 'Stamina') {
                if (this.barPower != null)
                    this.playReduceNumber(this.barPower.node, diff);
            }
            else if (key == 'Magic') {
                if (this.barMagic != null)
                    this.playReduceNumber(this.barMagic.node, diff);
            }
        }else {
            if (key == 'Stamina')
                this.playScaleAction(key);
        }

        if (key == 'ShowTable') {
            if (this.barFortune != null)
                this.playReduceNumber(this.barFortune.node, diff);
        }
    };

    playScaleAction(key) {
        if (key == 'Gold') {
            if (this.lblMoeny != null)
            global.CommonClass.Functions.runChangeAction(this.lblMoeny.node);
        }
        else if (key == 'Diamond') {
            if (this.lblDiamond != null)
            global.CommonClass.Functions.runChangeAction(this.lblDiamond.node);
        }
        else if (key == 'GuildScore') {
            if (this.lblUnionCoin != null)
            global.CommonClass.Functions.runChangeAction(this.lblDiamond.node);
        }
        else if (key == 'Level') {
            if (this.lblLevel != null)
            global.CommonClass.Functions.runChangeAction(this.lblLevel.node);
        }
        else if (key == 'Stamina') {
            if (this.lblPower != null)
            global.CommonClass.Functions.runChangeAction(this.lblPower.node);
        }
        else if (key == 'Experience') {
            if (this.lblExp != null)
            global.CommonClass.Functions.runChangeAction(this.lblExp.node);
        }
        else if (key == 'Magic') {
            if (this.lblMagic != null)
            global.CommonClass.Functions.runChangeAction(this.lblMagic.node);
        }
        else if (key == 'Ecology') {
            if (this.lblEcological != null)
            global.CommonClass.Functions.runChangeAction(this.lblEcological.node);
        }
        else if (key == 'Boom') {
            if (this.lblBoom != null)
            global.CommonClass.Functions.runChangeAction(this.lblBoom.node);
        }
        else if (key == 'Reputation' || key == 'ReputationLevel') {
            if (this.lblHonorLevel != null && this.lblHonorTitle != null) {
                global.CommonClass.Functions.runChangeAction(this.lblHonorLevel.node);
                global.CommonClass.Functions.runChangeAction(this.lblHonorTitle.node);
            }
        }
    };

    reflashByKey(key, isPlayChange) {
        if (key == 'Name') {
            if (this.lblName != null) {
                let name = global.Module.MainPlayerData.getRoleName();
                if (name != null) {
                    this.lblName.string = global.Module.MainPlayerData.getName(name);
                } else
                    this.lblName.string = '';
            }
        }
        else if (key == 'Gold') {
            if (this.lblMoeny != null) {
                let money = global.Module.MainPlayerData.getDataByKey('Gold');
                if (money != null)
                    this.lblMoeny.string = global.CommonClass.Functions.formatMoney(money);
                else
                    this.lblMoeny.string = '0';
            }
        }
        else if (key == 'Diamond') {
            if (this.lblDiamond != null) {
                let diamond = global.Module.MainPlayerData.getDataByKey('Diamond');
                if (diamond != null)
                    this.lblDiamond.string =  global.CommonClass.Functions.formatMoney(diamond);
                else
                    this.lblDiamond.string = '0';
            }
        }
        else if (key == 'Level') {
            if (this.lblLevel != null) {
                let level = global.Module.MainPlayerData.getDataByKey('Level');
                if (level != null)
                    this.lblLevel.string = level.toString() + '';
                else
                    this.lblLevel.string = '1';
            }
        }
        else if (key == 'Experience') {
            if (this.lblExp != null)
                this.reflashExp();
        }
        else if (key == 'Stamina') {
            this.reflashStamina();
        }
        else if (key == 'Magic') {
            if (this.lblMagic != null)
                this.reflashMagic();
        }
        else if (key == 'Ecology' || key == 'Boom') {
            if (this.lblEcological != null)
                this.reflashEcological();
        }
        else if (key == 'Reputation' || key == 'ReputationLevel') {
            // if (this.lblHonorLevel != null && this.lblHonorTitle != null)
        }
        else if (key == 'ShowTable') {
            if (this.lblFortune != null)
                this.reflashFortune();
        }
        else if (key == 'GuildScore') {
            if (this.lblUnionCoin != null) {
                let guildScore = global.Module.MainPlayerData.getDataByKey('GuildScore');
                if (guildScore != null)
                    this.lblUnionCoin.string = guildScore.toString() + '分';
                else
                    this.lblUnionCoin.string = '0分';
            }
        }

        if (isPlayChange) {
            if (!this.showBar) {
                // if (key!='Stamina' && key!='Magic')
                // this.playHideAction(key);
                // else if(key=='Stamina')
                // this.playScaleAction(key);
            }

            this.playChangeAction(key);
        }

    };

    reflashExp() {
        if (this.barExp == null)
            return;
        let nextNeed = 0;
        let preNeed = 0;

        let exp = global.Module.MainPlayerData.getDataByKey('Experience');
        let curLev = global.Module.MainPlayerData.getDataByKey('Level');

        if (exp != null && curLev != null) {
            let cfgData = global.Manager.DBManager.findData('ExpLevelCfg', 'Level', curLev);
            nextNeed = cfgData.UpLevelExp;//所需经验
            preNeed = cfgData.UpLevelTotalExp;//总经验
            if (this.lblExpTitle != null) {
                this.lblExpTitle.string = cfgData.name;
            }
            let showExp = Math.floor((preNeed - exp));
            let showNextNeed = Math.floor(nextNeed);
            let left = showNextNeed - showExp;
            if (left < 0)
                left = 0;
            // this.lblExp.string = showExp.toString()+'/'+showNextNeed.toString();
            this.lblExp.string = left.toString();

            let percent = 0.001;
            if (showNextNeed > 0 && showExp > 0) {
                percent = left / showNextNeed;
            }
            this.barExp.progress = percent;
        }else {
            this.lblExp.string = '0/1';
            this.barExp.progress = 0.001;
        }
    };

    reflashStamina() {

        if (this.lblPower == null)
            return;
        let power = global.Module.MainPlayerData.getDataByKey('Stamina');
        if (power != null) {
            this.lblPower.string = power.toString()
        }
        else {
            this.lblPower.string = '0/0';
        }
    };

    reflashMagic() {
        if (this.barMagic == null)
            return;

        let magic = global.Module.MainPlayerData.getDataByKey('Magic');
        if (magic != null) {
            let barProgress = magic / 1000;
            if (barProgress <= 0)
                barProgress == 0.001;

            // this.lblMagicLeft.string = '体力';//+Math.floor(barProgress*100).toString()+'%';
            this.lblMagic.string = magic.toString();//+'/1000';

            let self = this;
            self.barMagic.progress = barProgress;
        }
        else {
            // this.lblMagicLeft.string = '0';
            this.barMagic.progress = 0.001;
            this.lblMagic.string = '0/0';
        }
    };

    reflashFortune() {
        if (this.barFortune == null)
            return;

        let fortuneValue = global.Module.MainPlayerData.getDataByKey('ShowTable');
        if (fortuneValue != null) {

            let title = global.Module.MainPlayerData.getDataByKey('ShowTableLevel');
           
            let data = global.Manager.DBManager.findData('ShowTableLevel', 'Id', title);
            if (data != null) {
                let nextTitle = title + 1;
                let nextLevData = global.Manager.DBManager.findData('ShowTableLevel', 'Id', nextTitle);
                if (nextLevData != null) {
                    if (fortuneValue != 0 && nextLevData.UpLevelTotalExp != 0)
                        this.barFortune.progress = fortuneValue / nextLevData.UpLevelTotalExp;
                    else
                        this.barFortune.progress = 0.001;
                }
                else {
                    this.barFortune.progress = 1;
                }
            }
            else
                this.barFortune.progress = 1;
            if (data)
                this.lblFortuneTitle.string = data.name;
            else
                this.lblFortuneTitle.string = '';
            let fortuneString = global.Module.PreciousRoomData.formatFortune(fortuneValue);
            this.lblFortune.string = fortuneString;
        }
    };

    reflashEcological() {
        if (this.barEcological == null)
            return;

        let ecological = global.Module.MainPlayerData.getDataByKey('Ecology');
        let useEcology = global.Module.FarmParkData.getUseEcology();
        if (ecological != null && useEcology != null) {
            let barProgress = useEcology / ecological;
            if (barProgress <= 0)
                barProgress == 0.001;

            this.barEcological.progress = barProgress;
            this.lblEcological.string = useEcology.toString() + '/' + ecological.toString();

            if (useEcology > ecological) {
                this.lblEcological.node.color = cc.color(255, 0, 0, 0);
            }
        }
        else {
            this.barEcological.progress = 0.001;
            this.lblEcological.string = '0/0';
        }

        let boom = global.Module.MainPlayerData.getDataByKey('Boom');
        if (boom != null) {
            this.lblBoom.string = boom.toString();
        }
    };

    paymentclick() {
        global.Instance.MsgPools.send('mallList', { type: 0 }, function (msg) {
            global.Manager.UIManager.open('UIPayment', null, function (panel) {
                panel.show();
            }); 
        });
        // var data = { itemID: 2, count: 500, amount: 1, account: global.Module.GameData.getAccount(), roleID: global.Module.MainPlayerData.getRoleID() };
      
    };

    btnAddPower() {
        global.Manager.UIManager.open('DlgAddPower', null, function (panel) {
            panel.show();
        });
    };
    btnRole() {
        // return;
        let selfID = global.Module.MainPlayerData.getRoleID();
        global.Manager.UIManager.open('UIRole', null, function (panel) {
            panel.show(selfID);
        });
    };

    // update (dt) {}
}
