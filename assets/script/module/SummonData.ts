//精灵召唤数据类
const { ccclass, property } = cc._decorator;
@ccclass
export default class SummonData {
    curLevel: number;
    personLevel: number;
    maxLevel: number;
    isGoOut: boolean;
    curElement: number;
    goOutBackTime: number;
    mailGainTime: number;
    mailCount: number;
    mails: any[];
    hasMail: boolean;
    goOutTime: number;
    defSummonID: any;
    mailData: { totalNum: number; trapNum: number; itemArr: {}; };
    demon: {
        current: any; //当前精灵
        newdemon: any; //新精灵
        backdemon: any[];//归来精灵
    };
    uplevel: boolean;//提升等级

    constructor() {
        this.curLevel = 0;  //当前召唤等级
        this.personLevel = 0;
        this.maxLevel = 0;//精灵最大等级
        this.isGoOut = false;//精灵是否外出
        this.curElement = -1;//精灵外出属性
        this.goOutBackTime = 0;
        this.mailGainTime = 0;
        this.mailCount = 0;//邮件个数
        this.defSummonID = 0;//当前使用精灵ID
        this.mails = [];
        this.demon = {
            current: null,//当前精灵
            newdemon: null,//新精灵
            backdemon: [],//归来精灵
        }
        this.uplevel = false;//提升等级
        this.mailData = { totalNum: 0, trapNum: 0, itemArr: {}, };
    };
    setupLevel(isShow) {
        this.uplevel = isShow;
    };
    getupLevel() {
        return this.uplevel;
    };
    getself() {
        return this;
    };
    setMailData() {
        let mailArr = this.getMails();
        this.mailData = { totalNum: 0, trapNum: 0, itemArr: {}, };
        this.mailData.totalNum = mailArr.length;

        for (let i = 0; i < mailArr.length; i++) {
            var mail = mailArr[i];
            let itemData = null;
            let itemID = 11;
            if (mail.rewardType == 11) {
                itemID = 11;
                this.mailData.trapNum += 1
                itemData = this.mailData.itemArr[itemID];
                if (itemData) {
                    this.mailData.itemArr[itemID].contNum += 1;
                } else {
                    this.mailData.itemArr[itemID] = { ID: itemID, contNum: 1 };
                }
            } else {
                for (let key in mail.items) {
                    let value = mail.items[key];
                    itemID = value.ID;
                    itemData = this.mailData.itemArr[itemID];
                    if (itemData) {
                        this.mailData.itemArr[itemID].contNum += value.num;
                    } else {
                        this.mailData.itemArr[itemID] = { ID: itemID, contNum: 1 };
                    }
                }
            }
        }
        this.mailsClear();
    };
    getMailData() {
        return this.mailData;
    }

    //当前精灵
    getDemonCurrent() {
        return this.demon.current;
    };
    //新精灵
    getNewDemon() {
        return this.demon.newdemon;
    };
    //归来精灵
    getBackDemon() {
        return this.demon.backdemon;
    };
    iShowBackDemo(summonID: any) {
        let demoArr = this.getBackDemon();
        for (let i = 0; i < demoArr.length; i++) {
            if (demoArr[i].summonID == summonID && demoArr[i].investReward != null) {
                return true;
            }
        }
        return false;
    };


    /**
     * 精灵召唤数量
     * @returns 
     */
    getPersonLevel() {
        return this.personLevel;
    };
    getDefSummonID() {
        return this.defSummonID;
    };
    //自己的精灵的最大等级
    getCurLevel() {
        let curLevel = this.curLevel + 1
        if (curLevel >= 4)
            return 4;
        if (curLevel <= 1)
            return 1;
        return curLevel;
    };
    //等级
    setLevel(level: number) {
        this.setupLevel(true);
        this.curLevel = level;
    };
    //外出精灵属性
    getCurElement() {
        return this.curElement;
    };
    //精灵邮件
    getMails() {
        return this.mails;
    };
    //指定邮件
    getMailByID(mailID: any) {
        for (let key in this.mails) {
            let mail = this.mails[key];
            if (mail.ID == mailID)
                return mail;
        }
        return null;
    };
    //邮件数量
    getMailNum() {
        return this.mails.length;
    };
    getMail() {
        let arr = [];
        for (let i = 0; i < this.mails.length; i++) {
            let mail = this.mails[i];
            if (mail.rewardType != 11) {
                arr.push(mail)
            } else {
                if (mail.targetTime == -1)
                    arr.push(mail)
            }
        }
        return arr;
    }
    /**
     * 精灵外出邮件数量
     * @returns 
     */
    getMailCount() {
        let count = 0;
        for (let i = 0; i < this.mails.length; i++) {
            let mail = this.mails[i];
            if (mail.rewardType != 11) {
                ++count;
            } else {
                if (mail.targetTime == -1)
                    ++count;
            }

        }
        return count;
    };
    /**普通邮件
    * 精灵外出邮件数量
    * @returns 
    */
    getPlainCount() {
        let count = 0;
        for (let i = 0; i < this.mails.length; i++) {
            let mail = this.mails[i];
            if (mail.rewardType != 11) {
                ++count;
            }
        }
        return count;
    }
    /**投资邮件
   * 精灵外出邮件数量
   * @returns 
   */
    getInvestCount() {
        let count = 0;
        for (let i = 0; i < this.mails.length; i++) {
            let mail = this.mails[i];
            if (mail.rewardType == 11) {
                if (mail.targetTime == -1)
                    ++count;
            }
        }
        return count;
    }
    //精灵是否外出
    getIsGoOut() {
        return this.isGoOut;
    };
    //剩余时间
    getGoOutLeftTime() {
        let data = new Date();
        let time = data.getTime();
        let leftTime = this.goOutBackTime - time;
        if (leftTime < 0)
            leftTime = 0;
        return leftTime;
    };

    //获取未读邮件
    getHasUnReadMail() {
        return this.mails.length > 0;
    };
    //获取投资邮件
    getinvestmentMail() {
        let arr = [];
        let mailMent = this.demon.backdemon;
        for (let i = 0; i < mailMent.length; i++) {
            let panel = mailMent[i];
            for (let key in panel.mails) {
                let value = panel.mails[key];
                let mail: any = this.makeMail(value, panel.element);
                mail.summonID = panel.summonID;
                if (mail.rewardType == 11 && mail.targetTime != -1) {
                    arr.push(mail);
                }
            }
        }
        return arr;

    };

    selfUpdate(dt: any) {
        if (this.isGoOut) {
            if (this.demon.current == null || this.demon.current.countDown == 0) {
                this.personLevel = 0;
                this.isGoOut = false;

                let panel = global.Manager.UIManager.get('UISummon');
                if (panel != null)
                    panel.onGoOutBack();
            }
            let panel = global.Manager.UIManager.get('UISummon');
            if (panel != null)
                panel.ontime();

        }
    };
    mailsClear() {
        let Arr = [];
        for (let i = 0; i < this.mails.length; i++) {
            if (this.mails[i].rewardType == 11) {
                Arr.push(this.mails[i])
            }
        }
        this.mails = Arr;
    }
    makeMail(mail, curElement) {
        let data = {
            title: mail.title,
            ID: mail.index,
            first: mail.first,
            configMailID: mail.configMailID,
            positionX: mail.positionX,
            positionY: mail.positionY,
            eventId: mail.terrainId,
            rewardType: mail.rewardType,
            curElement: curElement,
            targetTime: 0,
            returnTime: '',
            items: [],
        };
        global.Instance.Log.debug('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', mail)
        data.title = mail.title;
        data.ID = mail.index;
        data.first = mail.first;
        data.configMailID = mail.configMailID;
        data.positionX = mail.positionX;
        data.positionY = mail.positionY;
        data.eventId = mail.terrainId;
        data.rewardType = mail.rewardType;
        data.returnTime = mail.returnTime

        if (mail.investCountDown <= 0)
            data.targetTime = mail.investCountDown;
        else
            data.targetTime = global.CommonClass.Functions.getTargetTime(mail.investCountDown);

        let items = [];
        if (mail.rewardGold > 0) {
            items.push({ ID: 1, num: mail.rewardGold });
        }

        for (let key in mail.rewardItem.map) {
            let value = mail.rewardItem.map[key];
            items.push({ ID: value.key, num: value.value });
        }

        data.items = items;

        return data;
    };
    //是否保留精灵
    onSummonRetainRsp(msg) {
        global.Instance.Log.debug('onSummonRetainRsp', msg)
        if (msg.errorID == 0) {
            let NewDemon = this.getNewDemon();
            // if (NewDemon.summonID == msg.req.summonID)
            if (msg.req.isRetain) {
                this.demon.current = NewDemon;
                this.defSummonID = msg.req.summonID;
                // this.setLevel(NewDemon.level);
                let UISummon = global.Manager.UIManager.get('UISummon');
                if (UISummon) {
                    UISummon.reflashBackOut();
                    // UISummon.getPanel();
                }

            }
            this.demon.newdemon = null;
        }

    };
    /**
     * 精灵信息
     * @param msg 
     */
    onSummonInfoRsp(msg: any) {
        if (msg.errorID == 0) {
            this.demon.current = null;//当前精灵
            this.demon.newdemon = null;//新精灵
            this.demon.backdemon = [];//归来精灵
            this.setLevel(msg.curLevel);
            this.mails = [];
            this.curElement = msg.curElement;//精灵远行的属性
            this.defSummonID = msg.defSummonID;//当前默认精灵
            for (let i = 0; i < msg.summons.length; i++) {
                let panel = msg.summons[i];
                if (panel) {
                    if ((panel.summonID == msg.defSummonID || panel.summonID == msg.curSummonID)) {
                        this.demon.current = panel;
                    } else {
                        if (panel.mailCount == 0) {
                            this.demon.newdemon = panel;
                        }
                    }
                    if (panel.investReward != null) {
                        this.demon.backdemon.push(panel);
                    }
                }

            }
            if (this.demon.current == null) {
                this.goOutBackTime = 0;
                this.isGoOut = false;
                this.mailCount = 0;
            } else {
                let current = this.demon.current
                this.goOutBackTime = global.CommonClass.Functions.getTargetTime(current.countDown);
                this.isGoOut = current.countDown > 0;
                this.mailCount = current.mailCount;
            }
            let panel = this.demon.current
            if (panel)
                for (let key in panel.mails) {
                    let value = panel.mails[key];
                    let mail = this.makeMail(value, panel.element);
                    if (mail.rewardType == 11)
                        this.mails.unshift(mail)
                    else
                        this.mails.push(mail);
                }

            this.personLevel = msg.summons.length;
            let mainMap = global.Instance.Dynamics["MainMap"];
            if (mainMap != null) {
                mainMap.reflashDemonMail();
            }
            let UISummon = global.Manager.UIManager.get('UISummon');
            if (UISummon) {
                UISummon.reflashState();
                UISummon.reflashMatrial();
                UISummon.reflashBackOut();
            }


        }
    };
    /**
     * 精灵召唤
     * @param {*} msg 
     */
    onSummonRsp(msg: { errorID: number; element: number; summonID: any; level: number; countDown: any; sendTime: any; }) {
        this.setupLevel(false);
        if (msg.errorID == 0 && msg.summonID != 0) {
            let genData = {
                countDown: msg.countDown,
                element: msg.element,
                investReward: null,
                level: msg.level,
                mailCount: 0,
                mails: [],
                sendTime: msg.sendTime,
                summonID: msg.summonID,
            }
            this.setLevel(msg.level);
            if (this.demon.current == null) {
                this.demon.current = genData;
            } else {
                this.demon.newdemon = genData;
                this.personLevel += 1;
            }

        } else {
            this.setLevel(0);
        }
    };
    //精灵远行返回
    onSummonSendRsp(msg: { errorID: number; countDown: number; mailCount: number; }) {
        global.Instance.Log.debug("精灵远行返回", msg)
        if (msg.errorID == 0) {
            this.setLevel(0);
            let roleId = global.Module.MainPlayerData.getRoleID();
            global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, null);
        }
    };
    onSummonMailNtf(msg: { mail: any; }) {
        global.Instance.Log.debug('onSummonMailNtf', msg);

        let mail = this.makeMail(msg.mail, this.demon.current.curElement);
        this.mails.push(mail);
        let UISummon = global.Manager.UIManager.get('UISummon');
        if (UISummon) {
            UISummon.cloudLabel();
        }
    };

    onSummonMailRewardRsp(msg: { errorID: number; req: { index: any; }; hasNewMail: boolean; }) {
        global.Instance.Log.debug('领取精灵奖励', msg)
        if (msg.errorID == 0) {
            for (let i = 0; i < this.mails.length; ++i) {
                let mail = this.mails[i];
                if (mail.ID == msg.req.index) {
                    global.Instance.Log.debug('onSummonMailRewardRsp ----领取精灵奖励---------', mail)
                    this.mails.splice(i, 1);
                    break;
                }
            }


        }
    };
    onSummonMailFirstRsp(msg: { errorID: number; index: any; }) {
        if (msg.errorID == 0) {
            let mail = this.getMailByID(msg.index);
            if (mail != null)
                mail.first = 1;
        }
    };
    //是否投资精灵
    onSummonInvestRsp(msg: { errorID: number; req: { gaveUp: any; index: any; }; investCountDown: any; }) {
        global.Instance.Log.debug('投资', msg)
        
        if (msg.errorID == 0) {
            if (!msg.req.gaveUp) {
                let mail = this.getMailByID(msg.req.index);
                mail.targetTime = global.CommonClass.Functions.getTargetTime(msg.investCountDown);

            } else {
                global.Instance.Log.debug('投资1', msg)
            }
            let roleId = global.Module.MainPlayerData.getRoleID();
            global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, null);
           
        }
    };
    onSummonFastMailRsp(msg: any) {
        global.Instance.Log.debug('精灵外出一键返回', msg)
        this.demon.current.countDown = 0;
        for (let i = 0; i < msg.mailList.length; i++) {
            let mail = this.makeMail(msg.mailList[i], this.demon.current.curElement);
            if (mail.rewardType == 11)
                this.mails.unshift(mail)
            else
                this.mails.push(mail);
        }
        let UISummon = global.Manager.UIManager.get('UISummon');
        if (UISummon) {
            UISummon.cloudLabel();
        }
    };
    onSummonAllMailRewardRsp(msg: any) {
        global.Instance.Log.debug('邮件一键领取', msg)

    };
    onSummonInvestRewardRsp(msg: any) {
        global.Instance.Log.debug('精灵投资返回', msg)
        let roleId = global.Module.MainPlayerData.getRoleID();
        global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, null);

    };
    onSummonInvestRewardRsps(msg: any) {
        global.Instance.Log.debug('精灵投资捡漏返回', msg)

    };
}
