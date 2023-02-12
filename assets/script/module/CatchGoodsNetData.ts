const {ccclass, property} = cc._decorator;
@ccclass
export default class CatchGoodsNetData {
    score: number;
    otherScore: number;
    makeID: number;
    nextMakeID1: number;
    nextMakeID2: number;
    buildID: number;
    makeItems: {};
    isGameRun: boolean;
    flyItems: any;
    flyID: number;
    panel: any;
    dropNum: number;
    constructor() {
        this.score = 0;
        this.otherScore = 0;

        this.makeID = 0;
        this.nextMakeID1 = 0;
        this.nextMakeID2 = 0;
        this.buildID     = 0;
        this.makeItems  = {};
        this.isGameRun  = false;
    
        this.flyItems  = [];        //templateID, dropTimes, dropID
        this.flyID     = 10000;

        this.panel = null;

        this.dropNum = 0;//掉落数量
        
    };
    setPanel (panel: any) {
        this.panel = panel;
    };


    start (panel: any) {
        this.score = 0;
        this.panel = panel;
        this.isGameRun = true;

        this.makeNeeds(this.makeID);
    };

    end () {
        this.flyItems = null;
        this.panel = null;
        this.makeItems = {};
        this.isGameRun = false;

        let uiUnionFight = global.Manager.UIManager.get('UIUnionFight');
        if (uiUnionFight)
            uiUnionFight.reflashBaseInfo();
    };

    setFightBuild (buildID: number) {
        this.buildID = buildID;
    };

    getFightBuild () {
        return this.buildID;
    };

    makeNeeds (makeID: number) {
        this.makeItems = {};
        let data = global.Manager.DBManager.findData('MeetEggMakeData', 'ID', makeID);
        if (data != null) {
            for (let i = 1; i <= 3; ++i) {
                let matrialName = 'matrial' + i.toString();
                let matrialID = data[matrialName];

                if (matrialID > 0) {
                    let numName = 'num' + i.toString();
                    this.makeItems[matrialID] = { count: 0, num: data[numName] };
                }
            }
        }
    };

    clearNeeds () {
        this.makeItems = {};
    };

    getCurCountAndNum () {
        let data = { count: 0, num: 0 }
        for (let key in this.makeItems) {
            let item = this.makeItems[key];
            data.count += item.count;
            data.num += item.num;
        }

        return data;
    };
    //分数
    getScore (isSelf: any) {
        if (isSelf)
            return this.score;
        else 
            return this.otherScore;
    };

    getMakeID () {
        return this.makeID;
    };

    getNextMake (idx: number) {
        if (idx == 1) {
            return this.nextMakeID1;
        }
        else if (idx == 2) {
            return this.nextMakeID2;
        }
    };

    getIsNeedItem (itemID: string | number) {
        let data = this.makeItems[itemID];
        if (data != null)
            return data.count < data.num;

        return false;
    };

    getIsGameRun (){
        return this.isGameRun;
    };

    getMakeItem(itemID: string | number) {
        if (!this.makeItems[itemID])
            return null;

        return this.makeItems[itemID];
    };
    getFlyItems() {
        return this.flyItems;
    };
    popDropItem () {
        let fitItems = null;
        if (this.flyItems.length > 2) {
            let item = this.flyItems[0];
            let targetTime = item.dropItems.targetTime;
            fitItems = item;
        }
        return fitItems;
    };

    removeFlyItem (ID: number) {
        for (let index in this.flyItems) {
            let item = this.flyItems[index];
            if (item.ID == ID)
                this.flyItems.splice(index, 1);
        }
    };
    // 玩家开始接鸡蛋
    onStartBattleMeetEggNtf (msg:any) {     //开始游戏
        global.Instance.Log.debug('开始游戏', msg);
        this.flyItems = [];
        if (msg.errorID == 0) {
            this.makeID = msg.makeID;
            this.nextMakeID1 = msg.nextMakeID1;
            this.nextMakeID2 = msg.nextMakeID2;
            let leftSeconds = 0;
            for (let i = 0; i < msg.dropItems.length; i++) {
                let item = msg.dropItems[i];
                let flyID = this.flyID++;
                let dropItem = {
                    targetTime: global.CommonClass.Functions.getTargetTime(item.leftSeconds),
                    ID: item.timeID,
                    dropID: item.dropID,
                    flyID: flyID
                };
                let templateID = global.Manager.DBManager.findData('MeetEggDropItems', 'ID', item.dropID);
                let newItem = { ID: flyID, dropItems: dropItem, templateID: templateID.subType, leftSeconds: leftSeconds };
                this.flyItems.push(newItem);
            }

        }
    };
    //改变位置
    onBattleChangeMeetXRsp (msg: any) {     
    

    };
    //飞行物产生
    onBattleMeetEggDropNtf (msg:any) {     
        {
            global.Instance.Log.debug('飞行物产生',msg);
            let flyID = this.flyID++;
            let leftSeconds = 0;
            let item = msg.dropItems[0];
            leftSeconds = item.leftSeconds
            let dropItem = {
                targetTime: global.CommonClass.Functions.getTargetTime(item.leftSeconds),
                ID: item.timeID,
                dropID: item.dropID,
                flyID: flyID
            };

            let newItem = { ID: flyID, dropItems: dropItem, templateID: msg.id, direction: msg.directionX ,positionX:msg.positionX,leftSeconds:leftSeconds};
            this.flyItems.push(newItem);
            if (this.panel != null) {
                this.panel.createDropitem();
            }
        }
    };
   //接到了掉落物
    onBattleMeetDropRsp (msg: { errorID: number; makeID: number; totalScore: number; meetItemMap: { map: { [x: string]: { value: any; }; }; }; }) {        //接到了掉落物
        if (msg.errorID == 0) {
            if (msg.makeID > 0) {
                this.makeID = msg.makeID;
                this.makeNeeds(this.makeID);
            }

            this.score = msg.totalScore;

            for (let key in msg.meetItemMap.map) {
                if (this.makeItems[key] != null)
                    this.makeItems[key].count = msg.meetItemMap.map[key].value;
            }
        }
    };
// 积分变化推送
    onBattleMeetScoreNtf (msg: { totalScore: number; }) {
    
        this.otherScore = msg.totalScore;

        if (this.panel != null)
            this.panel.reflashOtherScore(msg.totalScore);
    };
   // 战斗后建筑占领信息更新
    onBattleBuildUpdateNtf (msg: { build: any; }) {
    
       global.Module.GuildBattleData.reflashBuild(msg.build);

       let uiUnionFight = global.Manager.UIManager.get('UIUnionFight');
       if (uiUnionFight)
           uiUnionFight.reflashBuild(msg.build);
    };
    // 接鸡蛋结束
    onBattleMeetEggStopNtf (msg: { roleBattleCD: any[]; captureScore: any; holdScore: any; }) {      //结束游戏
   
        let roleID = global.Module.MainPlayerData.getRoleID();
        let roleBattle = msg.roleBattleCD.map;

        for(let key in roleBattle) {
       
            let value = roleBattle[key].value;
            let isSelf = (roleID==key);
            global.Module.GuildBattleData.setCD(isSelf, value);
        } 

        if (this.panel != null) {
       
            this.panel.gameOver(msg.captureScore, msg.holdScore);
            this.end();
        }

        let uiUnionFight = global.Manager.UIManager.get('UIUnionFight');
        if (uiUnionFight)
            uiUnionFight.reflashBaseInfo();

    };
    // 退出接鸡蛋
    onExitBattleMeetEggRsp (msg: { errorID: number; roleBattleCD: any[]; }) {      
   
        if (msg.errorID == 0) {
            let roleID = global.Module.MainPlayerData.getRoleID();
            let roleBattle = msg.roleBattleCD.map;

            for(let key in roleBattle) {
                let value = roleBattle[key].value;
                let isSelf = (roleID==key);
                global.Module.GuildBattleData.setCD(isSelf, value);
            } 

            let uiUnionFight = global.Manager.UIManager.get('UIUnionFight');
            if (uiUnionFight)
                uiUnionFight.reflashBaseInfo();

            this.end();
        }
    };

}
