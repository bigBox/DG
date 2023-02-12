//公会数据类

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionData {
    ID: number;
    members: any[];
    titleDec: any[];
    allUnion: any[];
    unionTitleDec: any[];
    activeLevelDec: any[];
    selCondition: Map<any, any>;
    selfUnion: {
        id: number,
        index: number,
        activeLevel: number,
        memberMax: number,
        needLevel: number,
        sorce: number,
        sorceAll: number,
        level: number,
        experience: any,
        activeTime: any,
        summary: any,
        innerSummary: any
    };
    applyList: any[];
    rankList: any[];
    selfRank: any;
    shearchs: any;
    curTempData: any;

    constructor() {
        this.ID = 10005;                //自己的工会ID
        this.members = new Array();     //{ID, name, level, weekPay, AllPay, title, isOnline}
        this.titleDec = new Array();
        this.allUnion = new Array();    //{ID, name, level, memberNum, onlineAll, sorce, sorceAll, needLevel, activeLevel, titleID, note}
        this.unionTitleDec = new Array();
        this.activeLevelDec = new Array();
        this.selCondition = new Map();
        this.selfUnion={
            id: 0,
            index: 0,
            activeLevel: 0,
            memberMax: 0,
            needLevel: 0,
            sorce: 0,
            sorceAll: 0,
            level: 0,
            experience: 0,
            activeTime: 0,
            summary: 0,
            innerSummary: 0
        }
        this.applyList = [];

        this.rankList = [];
        this.selfRank = {};
        this.shearchs = null;

        this.loadData();

    };

    loadData() {
        /*for (let i=0; i<20; ++i)
        {
            //let data = {}
            this.members.push({id:i, name:"name"+i.toString(), level:20-i, weekPay:i*20, AllPay:i*20+10*i, title:i%4, isOnline:i%2});
        }*/

        this.titleDec.push('吧主');
        this.titleDec.push('副吧主');
        this.titleDec.push('资深');
        this.titleDec.push('吧友');

        this.unionTitleDec.push("菜鸟");
        this.unionTitleDec.push("高手");
        this.unionTitleDec.push("精英");

        this.activeLevelDec.push("丙");
        this.activeLevelDec.push("乙");
        this.activeLevelDec.push("甲");

        //{ID, name, level, memberNum, memberMax, onlineAll, sorce, sorceAll, needLevel, activeLevel, title, note}
        /*for (let j=0; j<100; ++j)
        {
            //let info = {ID:j+10000, name:"工会"+j.toString(), headID:1, level:2+j, exp:30, nextExp:100, weChat:13874111, QQ:94222043,
            //outNote:"这里要填外部公告", inNote:"这里要填内部公告", activeDiamond:100, activeTime:-1};

            this.allUnion.push({index:j, ID:j+10000, name:"工会"+j.toString(), level:2+j, 
                                memberNum:j*20%100+10, memberMax:j%30+100, onlineAll:j*20%100,  headID:1,
                                sorce:j*10, sorceAll:j*30, needLevel:20+j, activeLevel:j%3, title:j%3, 
                                outNote:"这个是公告", inNote:"这里要填内部公告", activeDec:"2018.8.8(周六)18:30竞标赛",
                                activeDiamond:100, activeTime:-1,
                                exp:30,nextExp:130, weChat:13874111, QQ:94222043});
        }*/
    };

    setSelfUnion(data) {
        this.selfUnion = data;

        if (this.selfUnion != null && this.selfUnion.id != 0) {
            this.selfUnion.id = this.selfUnion.id;

            let idx = 1;
            this.selfUnion.index = idx;
            this.selfUnion.activeLevel = idx % 3;
            this.selfUnion.memberMax = 100;
            this.selfUnion.needLevel = 1;
            this.selfUnion.sorce = idx * 10;
            this.selfUnion.sorceAll = idx * 18;

            global.Instance.Log.debug('self union ' , this.selfUnion.id.toString());
        }

        global.Instance.Log.debug('setSelfUnion ' , data.id.toString());
    };

    getSelfUnion() {
        return this.selfUnion;
    };

    setSelfUnionExp(exp: any) {
        if (this.selfUnion != null)
            this.selfUnion.experience = exp;
    };

    setSelfUnionLevel(level: any) {
        if (this.selfUnion != null)
            this.selfUnion.level = level;
    };

    setMembers(data: { [x: string]: any; }) {
        this.members = [];

        for (let key in data) {
            let value = data[key];
            let memberValue = this.memberValue(value, key)
            this.members.push(memberValue);
        }
    };
    memberValue(value,key){

        value.baseInfo.roleId = parseInt(value.baseInfo.roleId);

        let idx = key;
        value.weekPay = Number(idx) * 20;
        value.allPay = value.weekPay * 4;
        value.isOnline = Number(idx) % 3 != 2;
        return value;
    };

    getMembers() {
        return this.members;
    };

    deleteMemeber(ID: any) {
        for (let i = 0; i < this.members.length; ++i) {
            if (this.members[i].baseInfo.roleId == ID) {
                this.members.splice(i, 1);
                return this.members;
            }
        }

        return this.members;
    };

    addMemeber(member: { weekPay: number; allPay: number; isOnline: boolean; }) {
        let idx = this.members.length;
        member.weekPay = idx * 20;
        member.allPay = member.weekPay * 4;
        member.isOnline = idx % 3 != 2;

        this.members.push(member);
    };

    getMemberByID(ID: any) {
        for (let i = 0; i < this.members.length; ++i) {
            if (this.members[i].baseInfo.roleId == ID) {
                return this.members[i];
            }
        }

        return null;
    };

    getMySelf() {
        var mainRoleID = global.Module.MainPlayerData.getRoleID();
        return this.getMemberByID(mainRoleID);
    };

    setApplys(data: { [x: string]: any; }) {
        this.applyList = [];
        for (let key in data) {
            let value = data[key];
            value.baseInfo.roleId = value.baseInfo.roleId.toNumber();

            this.applyList.push(value);
        }
    };

    getApplys() {
        return this.applyList;
    };

    deleteApply(ID: any) {
        for (let i = 0; i < this.applyList.length; ++i) {
            if (this.applyList[i].baseInfo.roleId == ID) {
                this.applyList.splice(i, 1);
                return this.applyList;
            }
        }

        return this.applyList;
    };

    selfUpdate() {
        let data = this.getSelfUnion();
        if (data != null && data.activeTime > 0)
            --data.activeTime;
    };
    setSelCondition(conditon: Map<any, any>) {
        this.selCondition = conditon;
    };

    getSelCondition() {
        return this.selCondition;
    };

    getUnion(ID: any) {
        for (let i = 0; i < this.rankList.length; ++i) {
            let item = this.rankList[i];
            if (item.id == ID)
                return item;
        }
        return null;
    };

    getSelfRank() {
        if (this.selfRank.id > 0)
            return this.selfRank;
        else
            return null;
    };

    getTitleDec(title: number) {
        if (title > 0 && title <= this.titleDec.length)
            return this.titleDec[title - 1];

        return "";
    };

    getUnionTitleDec(title: number) {
        if (title > 0 && title < this.unionTitleDec.length)
            return this.unionTitleDec[title - 1];

        return "";
    };

    getUnionActiveDec(level: number) {
        if (level >= 0 && level < this.activeLevelDec.length)
            return this.activeLevelDec[level];

        return "";
    };

    getRankList() {
        return this.rankList;
    };

    setTempData(data: any) {
        this.curTempData = data;
    };

    getTempData() {
        return this.curTempData;
    };

    sortUnions(sortType: number) {
        //{ID, name, level, memberNum, onlineAll, sorce, sorceAll, needLevel, activeLevel, title, note}
        global.CommonClass.Functions.sort(this.rankList, function (lhs: { id: number; level: number; curMemberNums: number; }, rhs: { id: number; level: number; curMemberNums: number; }) {
            if (sortType == 1)
                return lhs.id > rhs.id;
            else if (sortType == 2)
                return lhs.level > rhs.level;
            else if (sortType == 3)
                return lhs.curMemberNums > rhs.curMemberNums;
            else if (sortType == 4)
                return lhs.curMemberNums > rhs.curMemberNums;
            /*else if(sortType==5)
                return lhs.sorceAll>rhs.sorceAll;
            else if(sortType==6)
                return lhs.needLevel>rhs.needLevel;
            else if(sortType==7)
                return lhs.activeLevel>rhs.activeLevel;*/

            return false;
        });

        for (let idx = 0; idx < this.rankList.length; ++idx) {
            let item = this.rankList[idx];
            item.index = idx;
        }

        return this.rankList;
    };

    reverseUnions() {
        this.rankList.reverse();

        for (let idx = 0; idx < this.rankList.length; ++idx) {
            let item = this.rankList[idx];
            item.index = idx;
        }

        return this.rankList;
    };

    getOnlineNum() {
        let onLineNum = 0;
        for (let key in this.members) {
            let value = this.members[key];
            if (value.isOnline)
                onLineNum++;
        }
        return onLineNum;
    };

    sortMembers(sortType: number) {
        //{ID, name, level, weekPay, AllPay, title}
        global.CommonClass.Functions.sort(this.members, function (lhs: { baseInfo: { roleId: number; level: number; }; weekPay: number; AllPay: number; guildPost: number; }, rhs: { baseInfo: { roleId: number; level: number; }; weekPay: number; AllPay: number; guildPost: number; }) {
            if (sortType == 1)
                return lhs.baseInfo.roleId > rhs.baseInfo.roleId;
            else if (sortType == 2)
                return lhs.baseInfo.level > rhs.baseInfo.level;
            else if (sortType == 3)
                return lhs.weekPay > rhs.weekPay;
            else if (sortType == 4)
                return lhs.AllPay > rhs.AllPay;
            else if (sortType == 5)
                return lhs.guildPost < rhs.guildPost;

            return false;
        });

        return this.members;
    };

    setActiveTime(activeTime: any) {
        let data = this.getSelfUnion();
        data.activeTime = activeTime;
    };

    getShearch(idx: string | number) {
        global.Instance.Log.debug('',this.shearchs)
        if (this.shearchs != null)
            return this.shearchs[idx];

        return null;
    };

    onGuildListRsp(msg: any) {
        if (msg.errorID == 0) {
            if(msg.guilBaseInfo.id == global.Module.MainPlayerData.getguildID()){
                this.setSelfUnion(msg.guilBaseInfo);
                this.setMembers(msg.members);
            }
           
        };
    };
    //创建公会请求
    onCreateGuildRsp(msg: { errorID: number; guildBaseInfo: any; }) {
        if (msg.errorID == 0) {
            global.Module.MainPlayerData.setguildID(msg.guildBaseInfo.id);
            this.setSelfUnion(msg.guildBaseInfo);
            global.Proxys.ProxyUnion.reflashRank();
        }
    };

    onGuildApplyRsp(msg: any) {

    };

    onGuildApplyNtf(msg: { applyInfo: { baseInfo: { roleName: string; roleId: any; }; guildInfo: { name: string; }; }; }) {
        global.Instance.Log.debug('','onGuildApplyNtf');

        let self = this;
        if (msg.applyInfo != null) {
            let info = '玩家 ' + msg.applyInfo.baseInfo.roleName + ' 申请加入商会 ' + msg.applyInfo.guildInfo.name;
            global.CommonClass.UIDialog.create("申请加入商会", info, function (isYes: any) {
                if (isYes) {
                    let roleID = msg.applyInfo.baseInfo.roleId;

                    let data = { roleId: roleID, agree: true };
                    global.Instance.MsgPools.send('guildApprove', data, function (msg: { errorID: number; }) {
                        if (msg.errorID == 0) {
                            global.Proxys.ProxyUnion.reflashAllOpen();
                        }
                        else {
                            if (msg.errorID == 234) {
                                global.CommonClass.UITip.showTipTxt('被批准成员已经有商会了', global.Enum.TipType.TIP_BAD);
                            }
                        }
                    });
                }
            });
        }
    };

    onGuildApplyListRsp(msg: { errorID: number; applies: any; }) {
        if (msg.errorID == 0) {
            this.setApplys(msg.applies);
        };
    };

    onGuildApproveRsp(msg: { errorID: number; req: { roleId: { toNumber: () => any; }; agree: any; }; memberInfo: any; }) {
        if (msg.errorID == 0) {
            if (msg.req != null) {
                let roleId = msg.req.roleId.toNumber();
                this.deleteApply(roleId);

                if (msg.req.agree) {
                    this.addMemeber(msg.memberInfo);
                    global.Proxys.ProxyUnion.reflashRank();
                }
            }
        }
    };

    onGuildApproveNtf(msg: { guild: { chairman: { baseInfo: { roleName: string; }; }; name: string; }; }) {
        global.Instance.Log.debug('onGuildApproveNtf', msg.guild);
        if (msg.guild != null) {
            global.Module.MainPlayerData.setguildID(msg.guild);
            let info = '会长 ' + msg.guild.chairman.baseInfo.roleName + ' 同意你加入商会 ' + msg.guild.name;
            global.CommonClass.UIDialog.create("加入商会", info,null);
        }
    };
    onQuitGuildRsp(msg: { errorID: number; }) {
        if (msg.errorID == 0) {
            //let data = {id:0};
            this.setSelfUnion(null);

            global.Proxys.ProxyUnion.reflashRank();
        }
    };

    onQuitGuildNtf(msg: any) {
        global.Instance.Log.debug('','onQuitGuildNtf');
        // let info = '玩家'
        global.Proxys.ProxyUnion.reflashAll();
    };

    onGuildAdjustPostRsp(msg: { errorID: number; memberInfo: { baseInfo: { roleId: any; }; guildPost: any; }; }) {
        if (msg.errorID == 0) {
            let member = this.getMemberByID(msg.memberInfo.baseInfo.roleId);
            if (member != null)
                member.guildPost = msg.memberInfo.guildPost;
        }
    };

    onGuildKickRsp(msg: { errorID: number; req: { roleId: { toNumber: () => any; }; }; }) {
        if (msg.errorID == 0) {
            let id = msg.req.roleId.toNumber();
            this.deleteMemeber(id);

            this.setSelfUnion(null);
            global.Proxys.ProxyUnion.reflashRank();
        }
    };

    onGuildModifySummaryRsp(msg: { errorID: number; type: number; summary: any; }) {
        if (msg.errorID == 0) {
            let data = this.getSelfUnion();
            if (msg.type == 1)
                data.summary = msg.summary;
            else if (msg.type == 2)
                data.innerSummary = msg.summary;
        }
    };

    onGuildMemberListRsp(msg: { errorID: number; members: any; }) {
        if (msg.errorID == 0) {
            this.setMembers(msg.members);
        }
    };

    onGuildLstdRsp(msg: { topN: any; selfInfo: any; selfRank: any; }) {
        this.rankList = [];

        let severDataToLocal = function (idx: number, value: { rankBase: { id: { toNumber: () => any; }; }; name: any; members: any; level: any; honor: any; }) {
            let item = {
                index: idx,
                id: value.rankBase.id.toNumber(),
                name: value.name,
                memberMax: 100,
                curMemberNums: value.members,
                activeLevel: idx % 3,
                level: value.level,
                needLevel: 1,
                sorce: value.honor,
                summary: '公告',
            };

            return item;
        }

        let data = msg.topN;
        for (let key in data) {
            let idx = parseInt(key);
            let value = data[key];

            let item = severDataToLocal(idx, value);
            this.rankList.push(item);
        }
          
        let selfData = msg.selfInfo;
        if(selfData)
        this.selfRank = severDataToLocal(msg.selfRank, selfData);
    };

    onGuildSearchRsp(msg: { errorID: number; guilds: any; }) {
        if (msg.errorID == 0) {
            this.shearchs = msg.guilds;
            for (let key in this.shearchs) {
                let value = this.shearchs[key];
                value.id = value.id.toNumber();

                let idx = parseInt(key);
                value.index = idx;
                value.activeLevel = idx % 3;
                value.memberMax = 100;
                value.needLevel = 1;
                value.sorce = idx * 10;
                value.sorceAll = idx * 18;
            }
        }
    };
    onGuildAttrClientNtf(msg: { intDic: { [x: string]: any; }; }) {
        this.selfUnion.activeLevel = msg.intDic['Level'];

    };
}
