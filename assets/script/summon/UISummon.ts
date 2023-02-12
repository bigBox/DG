import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UISummon extends UIBase {
    @property({ type: cc.Node, displayName: "maskNode", tooltip: "maskNode" })
    maskNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "summonNode", tooltip: "summonNode" })
    summonNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndMatrialsNode", tooltip: "ndMatrialsNode" })
    ndMatrialsNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnSummonNode", tooltip: "召唤按钮" })
    btnSummonNode: cc.Node = null;
    

    @property({ type: cc.Node, displayName: "ndCoinNode", tooltip: "ndCoinNode" })
    ndCoinNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "成长任务引导" })
    helpNode: any = [];
    @property({ type: cc.Node, displayName: "cloudNode", tooltip: "精灵节点" })
    cloudNode1: cc.Node = null;
    @property({ type: cc.Node, displayName: "cloudNode", tooltip: "精灵节点" })
    cloudNode2: cc.Node = null;
    @property({ type: cc.Label, displayName: "cloudNumLabel", tooltip: "普通邮件" })
    cloudNumLabel1: cc.Label = null;
    @property({ type: cc.Label, displayName: "cloudNumLabel", tooltip: "投资邮件" })
    cloudNumLabel2: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblNumbeLabel", tooltip: "消耗五行石金币数量" })
    lblNumbeLabel: any = [];
    @property({ type: cc.Node, displayName: "timeNode", tooltip: "时间框" })
    timeNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "timeLabel", tooltip: "时间" })
    timeLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "recallNode", tooltip: "立即召回" })
    recallNode: cc.Node = null;
    
    
    summonTxtBegin: cc.Vec2;
    summoniShow: boolean;
    positions: {};
    isNeedLock: boolean;
    storeDropIns: any;
    data: any;
    panel: any;
    upSummon: any;
    sumondata: any;
    mountainLevel: number;
    isShow: boolean;

    constructor() {
        super();
        this.isShow = true;
        this.summonTxtBegin = cc.v2(0, 0);
        this.summoniShow = false;//邮件有没有处理完
        this.positions = {};
        this.isNeedLock = false;
        this.panel = null;
        this.upSummon = null;//最新召唤精灵信息
        this.sumondata = null;//当前精灵信息
        this.mountainLevel = 1;//当前山的等级
    };
    setPanel(panel: any) {
        this.panel = panel;
        let level = global.Module.SummonData.getCurLevel();
        this.panel.initAngle(level);
    };
    getPanel() {
        let level = global.Module.SummonData.getCurLevel();
        this.panel.initAngle(level);
    }
    /**
     * 山与按钮的状态
     */
    mountSummon(level,iShow){
        let curLevel = global.Module.SummonData.getCurLevel();
        if (iShow)
            this.mountainLevel = level;
        let spiritGoiShow = (global.Module.SummonData.getCurElement() != 0);//精灵是否外出
        if ((!iShow || level != curLevel)||spiritGoiShow) {
            this.btnSummonNode.getChildByName('callBtn1').active = true
            this.btnSummonNode.getComponent(cc.Button).interactable = false;
        }else{
            this.btnSummonNode.getChildByName('callBtn1').active = false
            this.btnSummonNode.getComponent(cc.Button).interactable = true;
        }
        let data = global.Manager.DBManager.findData('Summons', 'level', level);
        this.lblNumbeLabel[0].string = data.num1
        this.lblNumbeLabel[1].string = data.money


    };
    onLoad() {
        global.Manager.UIManager.add('UISummon', this);
        this.sumondata = global.Module.SummonData.getDemonCurrent();
        this.summoniShow = global.Module.SummonData.getMailCount() <= 0;
        this.ontime();
    };

    start() {

    }
    onEnable() {
        this.reflash();
        this.reflashCoin();

        this.storeDropIns = global.Module.GameData.getDropInstance();
        global.Module.GameData.setDropInstance(null);

    };
    reflashHelp(){
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.state == 1 && (data.actionType == 5 || data.actionType == 7)) {
            let mailArr = global.Module.SummonData.getinvestmentMail();
            if (this.sumondata) {
                if (this.sumondata.sendTime == null) {
                    this.helpNode[1].active = true;
                } else {
                    if (this.sumondata.countDown > 0)
                        this.helpNode[2].active = true;
                    else if (this.sumondata.countDown == 0&&(mailArr.length==0))
                        this.helpNode[3].active = true;
                    else{
                        this.helpNode[4].active = (mailArr.length!=0)
                    }
                }
                
            } else {
                
                this.helpNode[0].active = (mailArr.length==0);
            }
        }
    };
    onDisable() {
        global.Module.GameData.setDropInstance(this.storeDropIns);
        global.Manager.UIManager.remove('UISummon');
    };

    reflash() {
        this.reflashState();
        this.reflashMatrial();
    };

    reflashMatrial() {
        let level = global.Module.SummonData.getCurLevel();
        let nextLevel = level;

        let data = global.Manager.DBManager.findData('Summons', 'level', nextLevel);
        if (data != null) {
            for (let i = 1; i <= 5; ++i) {
                let matrialIdx = 'matrial' + i.toString();
                let matrialID = data[matrialIdx];

                let ndMatrial = this.ndMatrialsNode.getChildByName('ndMatrial' + i.toString());

                let lblNumber = ndMatrial.getChildByName('lblNumber').getComponent(cc.Label);

                let numIdx = 'num' + i.toString();
                let needNum = data[numIdx];
                let itemCount = global.Module.PackageData.getItemCount(matrialID);
                if (itemCount >= needNum) {
                    lblNumber.string = itemCount;
                } else {
                    lblNumber.string = itemCount;
                }
            }
        }
    };
    
    getByName(element,level){
        let type = '';
        if (element == 1)
            type = 'j';
        if (element == 2)
            type = 'm';
        if (element == 3)
            type = 's';
        if (element == 4)
            type = 'h';
        if (element == 5)
            type = 't';
         let iconFile = ''
        for (let i = 0; i < level; i++) {
            iconFile = iconFile + type
        }
       return iconFile;
    };
    reflashCoin() {
        let level = global.Module.SummonData.getCurLevel();
        let nextLevel = level;
        let cost = 0;

        let data = global.Manager.DBManager.findData('Summons', 'level', nextLevel);
        if (data != null)
            cost = data.money;
        let ndCoinNode: any = this.ndCoinNode;
        let itemNeedClass = ndCoinNode.getComponent(global.CommonClass.ItemNeed);
        itemNeedClass.setItem(1, cost);
    };

    reflashState() {
        this.sumondata = global.Module.SummonData.getDemonCurrent();//当前精灵
        let newdemon = global.Module.SummonData.getNewDemon();//新精灵
        if (newdemon && this.sumondata)
            if (newdemon.level == this.sumondata.level) {
                global.Manager.UIManager.open('UIDemoReplace', null, null);
            } else {
                let data = { summonID: newdemon.summonID, isRetain: (newdemon.level > this.sumondata.level) }
                if(data.isRetain)
                global.Module.SummonData.setupLevel(true)
                global.Instance.MsgPools.send('SummonRetain', data,null)
            }
        this.reflashBackOut();
    };
    reflashBackOut() {
        this.summoniShow = global.Module.SummonData.getMailCount() <= 0;
        let mailCount1 = global.Module.SummonData.getPlainCount();//普通邮件数
        let mailCount2 = global.Module.SummonData.getInvestCount();//投资邮件数
        let lotusNode1 = this.cloudNode1.getChildByName('lotus1');//荷叶1
        let lotusNode2 = this.cloudNode1.getChildByName('lotus2');//荷叶2
        let spirit = this.cloudNode1.getChildByName('spirit');//精灵
        let spiritBtn = this.cloudNode1.getChildByName('spiritBtn');//派出
        let sack1 = this.cloudNode1.getChildByName('sack');//袋子
        let sack2 = this.cloudNode2.getChildByName('sack');//袋子
        this.sumondata = global.Module.SummonData.getDemonCurrent();//当前精灵
        




        let isGoOut = global.Module.SummonData.getIsGoOut();//精灵是否回家
        let spiritiShow = (this.sumondata != null);//精灵是否存在
        let spiritGoiShow = (global.Module.SummonData.getCurElement() != 0);//精灵是所有邮件处理完回家
        lotusNode1.active = !spiritiShow;
        lotusNode2.active = spiritiShow;
        spirit.active = (spiritiShow && !spiritGoiShow);



        let Farmdata = global.Module.TaskData.gettaskphase(10007)
        spiritBtn.active = (spiritiShow && !spiritGoiShow&&(Farmdata && Farmdata.state != 0));//派出任务没领取时，先不显示派出精灵按钮
        sack1.active = (spiritiShow && spiritGoiShow);
        sack2.active = (spiritiShow && spiritGoiShow);
        this.timeLabel.node.active = (spiritiShow && spiritGoiShow);
        this.timeNode.active = (spiritiShow && spiritGoiShow);
        this.recallNode.active = (isGoOut);
        this.mountSummon(this.mountainLevel, true)

        
        if (spiritiShow) {
            if (spiritGoiShow) {
                this.cloudNumLabel1.string = mailCount1;
                this.cloudNumLabel2.string = mailCount2;
            } else {
                if (this.sumondata) {
                    let sprite = spirit.getChildByName('sprite');
                    let iconFile = 'images/plist/summon/' + this.getByName(this.sumondata.element, this.sumondata.level);
                    global.CommonClass.Functions.setTexture(sprite, iconFile, null);
                }
            }
        }
        this.reflashHelp();
    };
    onRecallNodeClick(){
        global.Instance.MsgPools.send('summonFastMail', { costItemID: 2 ,costItemCount:100}, function (msg) {
             if(msg.errorID  == 0){
                this.recallNode.active = false;
                this.helpNode[2].active = false;
                this.helpNode[3].active = true;
                this.timeLabel.getComponent(cc.Label).string = '精灵已回家';
             }
             
        }.bind(this));
    };
    cloudLabel() {
        let mailCount = global.Module.SummonData.getMailCount();
        let mailCount1 = global.Module.SummonData.getPlainCount();
        let mailCount2 = global.Module.SummonData.getInvestCount();
        this.cloudNumLabel1.string = mailCount1;
        this.cloudNumLabel2.string = mailCount2;
        if (mailCount == 0) {
            let roleId = global.Module.MainPlayerData.getRoleID();
            global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, function (msg) {
                if (msg.errorID == 0)
                    this.reflashBackOut();
            }.bind(this));
        }
            
    };
    ontime(){
        let isGoOut = global.Module.SummonData.getIsGoOut();
        if (isGoOut) {
            let genieData = global.Module.SummonData.getDemonCurrent();
            if(genieData){
                let sendTime = genieData.sendTime.value.toNumber();
                let data = new Date();
                let time = data.getTime();
                let moonCardLeft = time- sendTime;
                let dec = global.CommonClass.Functions.formatMoonCardTime(moonCardLeft);
                this.timeLabel.getComponent(cc.Label).string = '精灵在外探险已经'+dec;
            }
          
        } else {
            this.timeLabel.getComponent(cc.Label).string = '精灵已回家';
            this.recallNode.active = false;
        }
    }

    onGoOutBack() {
        this.summoniShow = global.Module.SummonData.getMailCount() <= 0;
        this.sumondata = null;
        this.recallNode.active = false;
    };
    //精灵召唤动画
    playRotateEffect(msg,level) {
        let self = this;
        global.Manager.UIManager.open('summonAnima', this.node, function (panel) {
            cc.tween(self.summonNode)
                .delay(0.2)
                .to(0.6, { opacity: 0 }, { easing: 'fade' })
                .call(() => {
                    self.summonNode.active = false;
                    self.summonNode.opacity = 255;
                })
                .start();
            cc.tween(self.btnSummonNode)
                .delay(0.2)
                .to(0.6, { opacity: 0 }, { easing: 'fade' })
                .call(() => {
                    self.btnSummonNode.active = false;
                    self.btnSummonNode.opacity = 255;
                })
                .start();
            panel.show(msg,level);
        });
    };
    // 精灵召唤
    onClickSummon() {
        //精灵任务安全保护
        if (global.Module.TaskData.taskguard(10006))
            return;
        if (this.summoniShow == false || this.isShow == false)
            return;
        this.helpNode[0].active = false;
        global.Module.TaskData.setIsAgree(false);
        global.Instance.MsgPools.send('summon', {level: this.mountainLevel}, function (msg) {
            if (msg.errorID == 0) {
                this.isNeedLock = true;
                this.playRotateEffect(msg,this.mountainLevel);
                global.Instance.AudioEngine.replaySound('iCKGe', false, 1);
            }
        }.bind(this));
    };

    // 精灵远行
    onClickSummonCall(event, type) {
        //精灵投资任务安全保护
        if (global.Module.TaskData.taskguard(10007))
            return;
        let isGoOut = global.Module.SummonData.getIsGoOut();
        if (isGoOut) {
            global.CommonClass.UITip.showTipTxt('精灵派出中,不能远行', global.Enum.TipType.TIP_BAD);
            return;
        }
        this.isShow = false;
        if (this.sumondata) {
            this.helpNode[1].active = false;
            let spirit = this.cloudNode1.getChildByName('spirit');//精灵
            let sprite = spirit.getChildByName('sprite');
            let animation = sprite.getComponent(cc.Animation);
            if (animation == null){
                this.isShow = true;
                global.Instance.MsgPools.send('summonSend', {summonID:this.sumondata.summonID},null);
            }else{
                animation.play('jumpout');
                animation.on('finished', function () {
                    this.isShow = true;
                    global.Instance.MsgPools.send('summonSend', {summonID:this.sumondata.summonID},null);
                }.bind(this));  
            }
               
           
        }
        else {
            global.CommonClass.UITip.showTipTxt('没有精灵, 请先召唤', global.Enum.TipType.TIP_BAD);
        }
        
    };
    btnHelp(){
        this.helpNode[4].active = true;   
        this.helpNode[3].active = false;    
    }
    //普通邮件
    onitemCloudckick(event) {
        // var data = global.Module.TaskData.getHasAcceptTaskData();
        // if (data&&data.state == 1 && (data.actionType == 5 || data.actionType == 7)){
        //     // global.CommonClass.UITip.showTipTxt('正在打开', global.Enum.TipType.TIP_BAD);
        // }
       
        let mailCount = global.Module.SummonData.getPlainCount();
        let mailArr = global.Module.SummonData.getMail();
        let mail = mailArr[mailArr.length - 1];
        if (mail != null && mail.ID >= 0 && mailCount != 0) {
            let uiSummonEvent = global.Manager.UIManager.get('UISummonEvent');
            if (uiSummonEvent != null) {
                global.CommonClass.UITip.showTipTxt('正在打开', global.Enum.TipType.TIP_BAD);
                return;
            }

            global.Manager.UIManager.open('UISummonEvent', null, function (panel) {
                if (panel != null) {
                    panel.showGetReward(mail);
                }
            });


        } else {
            global.CommonClass.UITip.showTipTxt('还没有礼物哟', global.Enum.TipType.TIP_BAD);
        }
    };
    //投资邮件
    onitemCloudckick1(event) {
        this.helpNode[3].active = false;
        let mailCount = global.Module.SummonData.getInvestCount();
        let mailArr = global.Module.SummonData.getMail();
        let mail = mailArr[0];
        if (mail != null && mail.ID >= 0 && mailCount != 0) {
            let uiSummonEvent = global.Manager.UIManager.get('UISummonEvent');
            if (uiSummonEvent != null) {
                global.CommonClass.UITip.showTipTxt('正在打开', global.Enum.TipType.TIP_BAD);
                return;
            }

            global.Manager.UIManager.open('UISummonEvent', null, function (panel) {
                if (panel != null) {
                    panel.showGetReward(mail);
                }
            });


        } else {
            global.CommonClass.UITip.showTipTxt('还没有礼物哟', global.Enum.TipType.TIP_BAD);
        }
    };
    onClickBtn() {
        global.Module.TaskData.setIsAgree(true);
        this.isNeedLock = false;
        cc.Tween.stopAllByTarget(this.summonNode);
        cc.Tween.stopAllByTarget(this.btnSummonNode);
        this.summonNode.opacity = 255;
        this.summonNode.active = true;
        this.btnSummonNode.opacity = 255;
        this.btnSummonNode.active = true;
       
        this.reflashState();
        this.reflashMatrial();
       
        if (global.Module.SummonData.getupLevel()) {
            setTimeout(() => {
                let level = global.Module.SummonData.getCurLevel();
                this.panel.initAngle(level);
            }, 500);
        }
    }
    onClickClose() {
        if (this.isNeedLock == true) {
            return;
        }
        cc.systemEvent.emit('10001');
        global.Manager.UIManager.close1('UISummon');
    }
    // update (dt) {}
}
