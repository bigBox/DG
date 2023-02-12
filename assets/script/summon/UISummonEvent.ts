import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UISummonEvent extends UIBase {
    @property({ type: cc.Node, displayName: "nodeContent", tooltip: "背景范围框" })
    nodeContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "spContent", tooltip: "背景" })
    spContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "spItem", tooltip: "图片" })
    spItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnGetReward", tooltip: "领取" })
    btnGetReward: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnTotalReward", tooltip: "立即领取" })
    btnTotalReward: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnInvest", tooltip: "投资" })
    btnInvest: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnGiveUp", tooltip: "放弃" })
    btnGiveUp: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeTalk", tooltip: "对话框" })
    nodeTalk: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblTalker", tooltip: "对话标头" })
    lblTalker: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblTalkContent", tooltip: "对话内容" })
    lblTalkContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeTouch", tooltip: "点击事件" })
    nodeTouch: cc.Node = null;
    @property({ type: cc.Node, displayName: "spTalker", tooltip: "精灵图片" })
    spTalker: cc.Node = null;
    
    isTotal:boolean;
    data: any;
    talks: any[];
    curTalkIdx: number;

    constructor() {
        super();
        this.data = null;
        this.talks = [];
        this.curTalkIdx = 0;
        this.isTotal = false;
    };

    onLoad() {
       
    };

    start() {

    };
    showGetReward(mail,isTotal) {
        // if(isTotal != null){
            this.isTotal = false;
        // }
        this.talks = [];
        this.curTalkIdx = 0;
        this.nodeTalk.active = false;
        this.btnGetReward.active = false;
        this.btnInvest.active = false;
        this.btnGiveUp.active = false;
        this.btnTotalReward.active = false;
        global.Instance.Log.debug('showGetReward mail', mail);
        this.data = mail;
        this.btnTotalReward.active = (this.data.rewardType != 11 && this.data.targetTime == -1);
        let eventId = mail.eventId;
        if (eventId == null || eventId == undefined) {
            eventId = 2001;
        }
        let cfgData = global.Manager.DBManager.findData('SummonEvent', 'ID', eventId);
        global.Instance.Log.debug('showGetReward cfgData', cfgData);

        {
            let pic = 'images/ui/huwai/' + cfgData.evtBG;
            global.CommonClass.Functions.setTexture(this.spContent, pic, null);
        }

        // if (mail.rewardType == 10) {
        //     let pic = 'images/ui/huwai/jlsj012';
        //     this.spItem.scale = 1
        //     global.CommonClass.Functions.setTexture(this.spItem, pic, null);
        // } else {
        //     let item = this.data.items[0];
        //     if (item != null) {
        //         let cfgItems = global.Manager.DBManager.findData('Items', 'ID', item.ID);
        //         if (cfgItems) {
        //             let pic = cfgItems.path+ cfgItems.picName;
        //             global.CommonClass.Functions.setTexture(this.spItem, pic, null);
        //         }

        //     }
        //     this.spItem.scale = 0.6
        // }
        // this.spItem.active = true;
        let isGoOut = global.Module.SummonData.getIsGoOut();
        if (this.data.targetTime == 0) {
            this.talks = [];
            this.curTalkIdx = 0;
            this.nodeTalk.active = false;
            this.gotoNextStep();
        } else {
            if (cfgData.talk1 != '') {
                this.talks.push(cfgData.talk1);
            }
            if (cfgData.talk2 != '') {
                this.talks.push(cfgData.talk2);
            }
            if (cfgData.talk3 != '') {
                this.talks.push(cfgData.talk3);
            }
            if (cfgData.talk4 != '') {
                this.talks.push(cfgData.talk4);
            }
            if (cfgData.talk5 != '') {
                this.talks.push(cfgData.talk5);
            }
            this.curTalkIdx = 0;
            this.nodeTalk.active = true;
            this.gotoNextStep();
        }
    };
  //根据精灵等级获取名称
    getByName(element) {
        let iconFile = '';
        if (element == 1)
            iconFile = 'jjjj';
        if (element == 2)
            iconFile = 'mmmm';
        if (element == 3)
            iconFile = 'ssss';
        if (element == 4)
            iconFile = 'hhhh';
        if (element == 5)
            iconFile = 'tttt';
        return iconFile;
    };
    gotoNextStep() {
        global.Instance.Log.debug('gotoNextStep', this)
        if (this.curTalkIdx < this.talks.length) {
            this.nodeTouch.active = false;
            let iconFile = 'images/plist/summon/' + this.getByName(this.data.curElement);
            global.CommonClass.Functions.setTexture(this.spTalker, iconFile, null);
            this.lblTalkContent.getComponent(cc.RichText).string = this.talks[this.curTalkIdx];
            this.curTalkIdx++;
        } else {
            this.nodeTalk.active = false;
            this.nodeTouch.active = true;
            this.btnGetReward.active = this.data.targetTime == 0 || (this.data.rewardType != 11 && this.data.targetTime == -1);
           
            this.btnInvest.active = this.data.targetTime == -1 && this.data.rewardType == 11;
            this.btnGiveUp.active = this.data.targetTime == -1 && this.data.rewardType == 11;
            this.curTalkIdx++;
        }
    };

    onClickTalk() {
        if (this.curTalkIdx <= this.talks.length) {
            this.gotoNextStep();
        }
    };

    playRewardItems() {
        let gains = [];
        for (let i = 1; i <= 3; ++i) {
            let item = this.data.items[i - 1];
            if (item != null) {
                let ganisItem = { itemID: item.ID, itemNum: item.num, type: 0 };
                gains.push(ganisItem);
            }
        }
        global.Manager.UIManager.open('DlgCollectDrop', null, function (panel) {
            let UISummon = global.Manager.UIManager.get('UISummon');
            if (UISummon) {
                UISummon.reflash();
            }

            panel.show(gains);
            let MainMap = global.Instance.Dynamics["MainMap"];
            if (MainMap != null) {
                MainMap.reflashDemonMail();
            }
            this.onClose();
        }.bind(this));
    };
    //领取
    onClickGetReward(event) {
        event.target.active = false;
        global.Module.MainPlayerData.lockDrop(true);

        let self = this;
        global.Instance.Log.debug('领取1', this.data)
        if (this.data.rewardType == 11) {
            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            global.Instance.Log.debug('onClickGetReward   mainRoleID', mainRoleID)
            global.Instance.MsgPools.send('summonPickupInvestReward', { roleId: mainRoleID }, function (msg) {
                if (msg.errorID == 0) {
                    var data = []
                    var date = {}

                    for (let key in msg.reward.map) {
                        const element = msg.reward.map[key];
                        global.Instance.Log.debug('summonPickupInvestReward  element', element)
                        date = { "ID": element.key, "num": element.value }
                        data.push(date)
                    }
                    global.Instance.Log.debug('summonPickupInvestReward  date', data)
                    self.data.items = data
                    self.playRewardItems();

                    global.Module.MainPlayerData.lockDrop(true);
                }
            });
        } else {
            global.Instance.MsgPools.send('summonMailReward', { index: this.data.ID }, function (msg) {
                if (msg.errorID == 0) {
                    self.isTotal = true;
                    self.playRewardItems();
                    global.Module.MainPlayerData.lockDrop(true);
                }
            });
        }
    };
     //一键领取
     onClickTotalReward(event) {
        event.target.active = false;
        global.Module.MainPlayerData.lockDrop(true);
        this.nodeTalk.active = false;
         let self = this;
         global.Instance.Log.debug('一键领取', this.data)
         global.Instance.MsgPools.send('SummonAllMailRewardReq', {}, function (msg) {
             if (msg.errorID == 0) {
                 global.Module.MainPlayerData.lockDrop(true);
                 global.Module.SummonData.setMailData();
                //  self.isTotal = true;
                 self.scheduleOnce(function () {
                     global.Manager.UIManager.close('UISummonEvent');
                     global.Manager.UIManager.open('UISummonFoot', null, null);
                 }, 0.5);
             }
         });
    };
    //投资
    onClickInvest() {
        let mailID = this.data.ID;
        let self = this;
        global.Instance.MsgPools.send('summonInvest', { index: mailID, gaveUp: false }, function (msg) {
            if (msg.errorID == 0) {
                let mailCount = global.Module.SummonData.getInvestCount();
                if (mailCount != 0)
                    self.isTotal = true;
                this.onClose();
                let UISummon = global.Manager.UIManager.get('UISummon');
                if (UISummon) {
                    UISummon.btnHelp();
                }
            }
        }.bind(this));
    };
    //放弃
    onClickGiveUp() {
        let mailID = this.data.ID;
      var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data&&data.state == 1 && (data.actionType == 5 || data.actionType == 7)){
           return;
        }
        let self = this;
        global.Instance.MsgPools.send('summonInvest', { index: mailID, gaveUp: true }, function (msg) {
            if (msg.errorID == 0) {
                if (msg.req.gaveUp) {
                    let mailCount = global.Module.SummonData.getInvestCount();
                    if (mailCount != 0)
                        self.isTotal = true;
                    this.onClose();
                }

            }
        }.bind(this));
    };

    onClose() { 
        if (this.isTotal == true) {
            this.scheduleOnce(function () {
                let mailCount = global.Module.SummonData.getMailCount();
                let mailArr = global.Module.SummonData.getMail();
                let mail = null;
                if(this.data.rewardType == 11){
                    mail = mailArr[0];
                }else{
                    mail = mailArr[mailArr.length-1];
                }
                if (mail&&this.data.rewardType != mail.rewardType && mail.rewardType == 11) {
                    mail = null;
                }
               
                if (mail != null && mail.ID >= 0 && mailCount != 0) {
                    this.showGetReward(mail, this.isTotal);
                } else {
                    let roleId = global.Module.MainPlayerData.getRoleID();
                    global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, null);
                    global.Manager.UIManager.close('UISummonEvent');
                }
           }, 0.5);
          
        } else {
            let roleId = global.Module.MainPlayerData.getRoleID();
            global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, null);
            global.Manager.UIManager.close('UISummonEvent');
        }
    };
    // update (dt) {}
}
