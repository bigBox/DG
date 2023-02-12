const {ccclass} = cc._decorator;

@ccclass
export default class GameData extends cc.Component{
    private dropPosition: any;
    private lockItemDrop: boolean;
    private lockCoinDrop: boolean;
    private openLockSocket: boolean;
    private sceneEntered: boolean;
    private account: string;
    private password: string;

    private lockMsgName: any;
    private moonCardLeft: number;
    private canRewardCard: boolean;
    private canRewardMoonCard: boolean;
    private coinDropTargetPos: any;
    private costTime: number;
    private dropData: any;
    private itemGetCount: number;
    private isMaskSound: number;
    private playGameTime: number;
    private expDropMode: number;
    private isShowFactoryName: boolean;
    private isFirstLogin: boolean;
    private isNeedCert: boolean;
    private isAdult: boolean;
    private age: number;
    private isAcceptTask: boolean;
    private heartbeatInterval: number;
    private heartTargetTime: number;
    private platformType: number;
    private clientData: any;
    private userInfo: any;
    private version: number;
    private isNeedUpdate: boolean;
    private dropInstance: any;
    
    constructor () {
        super();
        this.dropPosition = null;
        this.lockItemDrop = false;
        this.lockCoinDrop = false;
        this.openLockSocket = true;
        
        this.sceneEntered = false;

        this.account = '';//账号
        this.password = '';//密码

        this.lockMsgName = null;

        this.moonCardLeft = 0;
        this.canRewardCard = false;//每日奖励
        this.canRewardMoonCard = false;//月卡

        this.coinDropTargetPos = {};

        this.costTime = 0;

        this.dropData = {};             //[roleID] = {[itemID]={needShow, count}}

        this.itemGetCount = 0;
        this.isMaskSound = 0;

        this.playGameTime = 0;
        this.expDropMode = 1;
        this.isShowFactoryName = false;
        this.isFirstLogin = false;    //第一次登陆true
        this.isNeedCert = true; //未实名认证为false
        this.isAdult = false; //年龄是否到达
        this.age = 0;//年龄
        this.isAcceptTask = false;
        this.heartbeatInterval = 0;
        this.heartTargetTime = 0;
        this.platformType =0;// 登录类型 0自有平台登录 1  QQ登录  2 微信登录 
        this.clientData = {};
        this.userInfo = {};//微信登陆数据
        this.version = 1;//版号
        this.isNeedUpdate = false;//是否更新
        this.dropInstance = null;
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide.bind(this));
    };

    start() {

    };
    setage (age: number) {
        this.age = age;  
    };
    getage () {
        return this.age;  
    };
    setisNeedUpdate (msg: boolean) {
        this.isNeedUpdate = msg;
    };
    getisNeedUpdate () {
        return this.isNeedUpdate;
    };
    getversion () {
        return this.version;
    };
    setuserInfo (msg: any) {
        this.userInfo = msg;
    };
    getuserInfo () {
        return this.userInfo;
    };
    setAccountInfo (account: string, password: string, platformType: number) {
        this.account = account;
        this.password = password;
        this.platformType = platformType
    };

    getAccount () {
        return this.account;
    };

    getPassword () {
        return this.password;
    };
    getPlatform () {
        return this.platformType;
    };

    setSceneEntered (entered: boolean) {
        this.sceneEntered = entered;
    };

    getSceneEntered () {
        return this.sceneEntered;
    };

    getClientData (key: string | number) {
        if (this.clientData[key] != null)
            return this.clientData[key];

        return 0;
    };

    setHeartbeatTime (interval: number) {
        this.heartTargetTime = global.CommonClass.Functions.getTargetTime(interval);
        this.heartbeatInterval = interval;
    };

    getHeartLeftTime () {
        let leftTime = global.CommonClass.Functions.getLeftTime(this.heartTargetTime);
        return leftTime;
    };

    setClientData (clientData: any[]) {
        let items = clientData.map;
        for (let key in items) {
            let item = items[key]
            this.clientData[item.key] = item.value;
        }
    };
    setIsNeedCert (isNeedCert: boolean) {
        this.isNeedCert = isNeedCert;
    };
    getIsNeedCert () {
        return this.isNeedCert;
    };
    setFirstLogin (isFirst: boolean) {
        this.isFirstLogin = isFirst;
    };

    getIsFirstLogin () {
        return this.isFirstLogin;
    };

    isInOtherHome () {
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        return roleInfo != null;
    };
    /**
     * 商会音乐
     * @param {true* false} isMask 进去出来
     * @param {*} isMaskScene 
     */
    setMaskSound (isMask: number, isMaskScene: any) {
        this.isMaskSound = isMask;

        let backMusic = '';
        let scene = cc.director.getScene();
        let data = { ID: 3, name: 'LoginScene', backMusic: 'login', volume: 0.5 }
        if (scene.name) {
            let data = global.Manager.DBManager.findData('SceneMusic', 'name', scene.name);
            if (data != null)
                backMusic = data.backMusic;
        }
        data.volume = 0.5

        if (isMaskScene != null) {
            if (isMaskScene)
                global.Instance.AudioEngine.stopMusic(backMusic);
            else
                global.Instance.AudioEngine.playMusic(backMusic, true, data.volume);
        }
    };

    getMaskSound () {
        return this.isMaskSound;
    };

    getIsAdult () {
        return this.isAdult;
    };

    setIsAdult (isAdult: boolean) {
        this.isAdult = isAdult;
    };

    requestBaseData () {
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null) {
            panel.show(true);
            panel.setProgress(0.88, 2);
        }
        let roleID = global.Module.MainPlayerData.getRoleID();
        //packageItem  请求物品列表
        let packageTypeNum = global.Module.PackageData.getPackageTypeNum();
        global.Instance.Log.debug('requestBaseData',packageTypeNum)
        for (let i = 1; i <= packageTypeNum; ++i) {
            let data = { col: i };
            global.Instance.MsgPools.send('packageItem', data,null);
        }
        global.Instance.MsgPools.send('packageItem', { col: 100 },null);
        //引导
        // cc.Instance.MsgPools.send('guideInfo', {}, function (msg) {
        //     let building = msg.building.map;
        //     let common = msg.common.map;

        //     cc.Proxys.ProxyGuide.setData(common);
        //     cc.Proxys.ProxyFactoryGuide.setData(building);
        // });

        //请求好友信息
        global.Instance.MsgPools.send('friendList', {}, null);
        //请求精灵信息
        global.Instance.MsgPools.send('summonInfo', {},null);
        //请求任务列表
        global.Instance.MsgPools.send('taskList', {},null);
         //请求成长任务阶段
         global.Instance.MsgPools.send('TaskStateList', {},null);
        //请求工会信息
        global.Instance.MsgPools.send('guildList', {}, function (msg: { errorID: number; guilBaseInfo: any; }) {
         if (msg.errorID == 0 && msg.guilBaseInfo !=null) {
            global.Instance.MsgPools.send('guildTaskList', {},null); //请求工会列表
         }
        });
         
        
        // 获取金额
        global.Instance.MsgPools.send('showTableMoney', {}, function (msg: any) {
            global.Instance.Log.debug("showTableMoney",msg)
        });
        // 每日奖励
        global.Instance.MsgPools.send('monthCard', {}, function () {

        });
        // 生态园
        global.Instance.MsgPools.send('parkInfo', { roleId: roleID }, function () {
        });


        //场景位置记录
        if (!global.Module.GameData.getIsAdult()) {
            global.Instance.MsgPools.send('scenePosition', { roleId: roleID }, function (msg: { errorID: any; }) {
                if (!msg.errorID) {
                    global.Module.GameData.loadLocalDropData();
                    global.CommonClass.Functions.loadScene("MainScene", null);
                }
            });
        } else {
            global.Manager.UIManager.open('DlgAdult', null, null);
        }
    };

    setDropInstance (instance: any) {
        this.dropInstance = instance;
    };

    getDropInstance () {
        return this.dropInstance;
    };

    getDropStartPos () {
        if (this.dropInstance != null) {
            let worldPosition = this.dropInstance.convertToWorldSpaceAR(cc.v2(0, 0));
            let root = global.CommonClass.Functions.getRoot();
            let position = root.convertToNodeSpaceAR(worldPosition);

            this.dropPosition = position;
        }
        else
            this.dropPosition = cc.v2(0, 200);

        return this.dropPosition;
    };

    setDropTargetPos (coinType: string | number, worldPosition: any) {
        this.coinDropTargetPos[coinType] = worldPosition;
    };

    getDropTargetPos (coinType: string | number) {
        let scene = cc.director.getScene();

        let dropPos = this.coinDropTargetPos[coinType];
        if (dropPos != null) {
            let root = global.CommonClass.Functions.getRoot();
            let position = root.convertToNodeSpaceAR(dropPos);

            return position;
        }
        else {
            let ndRoleInfo = scene.getChildByName('Canvas').getChildByName('UIRoleInfo');
            if (ndRoleInfo != null) {
                let ndCoinsPos = ndRoleInfo.getChildByName('ndCoinsPos');

                if (ndCoinsPos != null) {
                    let ndCoin = ndCoinsPos.getChildByName('coin' + coinType.toString());
                    if (ndCoin != null) {
                        let worldPosition = ndCoin.convertToWorldSpaceAR(cc.v2(0, 0));

                        let root = global.CommonClass.Functions.getRoot();
                        let position = root.convertToNodeSpaceAR(worldPosition);

                        return position;
                    }
                    else {
                        return cc.v2(0, scene.getContentSize().height / 2);
                    }
                }
                else {
                    return cc.v2(0, scene.getContentSize().height / 2);
                }
            }
        }

        return null;
    };

    setExpDropMode (mode: number)   //0.曲线飞,1.直线飞
    {
        this.expDropMode = mode;
    };

    getExpDropMode () {
        return this.expDropMode;
    };

    getNeedShowDropDec (itemID: string | number) {
        //return true;

        let roleID = global.Module.MainPlayerData.getRoleID();
        //let roleID = 11;
        let dropData = this.dropData[roleID];

        if (dropData != null) {
            if (dropData[itemID] == null) {
                let itemData = global.Manager.DBManager.getItemNew(itemID);
                if (itemData != null) {
                    //return itemData.dropCount>0;

                    return false;
                }
                else {
                    return false;
                }
            }
            else {
                return dropData[itemID].needShow;
            }
        }

        return false;
    };

    addDropCount (itemID: string | number, count: any) {
        let roleID = global.Module.MainPlayerData.getRoleID();
        //let roleID = 11;
        let dropData = this.dropData[roleID];

        if (dropData[itemID] == null) {
            dropData[itemID] = { count: count, needShow: true };
        }
        else {
            // if (dropData[itemID].needShow)
            // {
            dropData[itemID].count += count;
            // }
        }

        let itemData = global.Manager.DBManager.getItemNew(itemID);
        if (itemData != null) {
            // if (dropData[itemID].count > itemData.dropCount)
            // {
            dropData[itemID].needShow = false;
            //}
        }

        this.dropData[roleID] = dropData;

        this.saveToLocalDropData();
    };

    getIsFirstDrop (itemID: string | number) {
        let roleID = global.Module.MainPlayerData.getRoleID();
        let dropData = this.dropData[roleID];
        let item = dropData[itemID];

        return (item && item.count <= 1);
    };

    loadLocalDropData () {
        this.dropData = JSON.parse(cc.sys.localStorage.getItem('itemDropData'));

        let roleID = global.Module.MainPlayerData.getRoleID();
        // let roleID = 11;
        if (this.dropData == null)
            this.dropData = {};
        if (this.dropData[roleID] == null)
            this.dropData[roleID] = {};

        let getCountData = JSON.parse(cc.sys.localStorage.getItem('itemGetCount'));
        if (getCountData != null)
            this.itemGetCount = getCountData.count;
    };

    saveToLocalDropData () {
        cc.sys.localStorage.setItem('itemDropData', JSON.stringify(this.dropData));
    };

    getIsShowFactoryName () {
        return this.isShowFactoryName;
    };
    //调用当前页面方法
    setIsShowFactoryName (isShow: boolean) {
        this.isShowFactoryName = isShow;

        let scene = cc.director.getScene();
        let sceneName = scene.name;
       //显示隐藏建筑名称
        let curMap = null;
        if (sceneName == "MainScene")
            curMap = global.Instance.Dynamics["MainMap"];
        else if (sceneName == 'WorldMapScene')
            curMap = global.Instance.Dynamics["WorldMap"];
        else if (sceneName == 'FarmParkScene')
            curMap = global.Instance.Dynamics["FarmParkMap"];
        else if (sceneName == 'PlayerScene')//好友页面
            curMap = global.Instance.Dynamics["FriendMap"];
        if (curMap != null)
            curMap.showFactoryName(isShow);
    };

    showTaskHelp () {
    
    };

    hideTaskHelp () {
       
        global.Manager.UIManager.close('UIUnionTaskSpeek');
    };

    openLockSocketOp (isOpen: boolean)       //true 开启等待
    {
        this.openLockSocket = isOpen;
    };

    lockSocketBackOp (name: string, isLock: { toString: () => string; }) {
        global.Instance.Log.debug('lock ' + name + ' isLock ' + isLock.toString() , ' this.lockMsgName ' + this.lockMsgName);

        if (isLock) {
            if (this.lockMsgName == null && this.openLockSocket) {
                global.Instance.Log.debug('数据通信遮罩框','lockSocketBackOp 开')
                this.lockMsgName = name;
                let clickAnim = global.Manager.UIManager.getResident('clickAnim');
                clickAnim.showReflash(true)
            }
        }
        else {
            if (this.lockMsgName != null && this.lockMsgName == name) {
                global.Instance.Log.debug('数据通信遮罩框','lockSocketBackOp 关')
                this.lockMsgName = null;
                let clickAnim = global.Manager.UIManager.getResident('clickAnim');
                clickAnim.showReflash(false)
            }
        }
    };

    getLockSocketMsgName () {
        return this.lockMsgName;
    };

    getMoonCardLeft () {
        return this.moonCardLeft;
    };

    getCanRewardCard () {
        return this.canRewardCard;
    };

    getCanRewardMoonCard () {
        return this.canRewardMoonCard;
    };

    addItemGetCount (count: number) {
        this.itemGetCount += count;

        cc.sys.localStorage.setItem('itemGetCount', JSON.stringify({ count: this.itemGetCount }));
    };

    getItemGetCount () {
        return this.itemGetCount;
    };
    showHelp (key: string) {
        let helpCount = global.Module.GameData.getClientData(key + 'Help');
        if (helpCount == null)
            helpCount = 0;

        if (helpCount < 3) {
            global.Manager.UIManager.open('DlgHelp', null, function (panel: { show: (arg0: any) => void; }) {
                panel.show(key);
            });

            global.Instance.MsgPools.send('changeClientData', { key: (key + 'Help'), value: (helpCount + 1) },null);
        }
    };

    onGameHide () {
        // this.saveToLocalDropData();
        //cc.Module.FarmParkData.saveToLocal();
        // cc.Module.FishPoolData.saveToLocal();
        // cc.Module.SummonData.saveToLocal();
    };

    selfUpdate (dt: number) {
        if (this.moonCardLeft > 0)
            this.moonCardLeft -= dt;
        else
            this.moonCardLeft = 0;

        let leftTime = this.getHeartLeftTime();
        if (this.heartbeatInterval > 0 && leftTime <= 0) {
            let data = {};
            global.Instance.MsgPools.send('heartbeatInfo', data,null);

            this.setHeartbeatTime(this.heartbeatInterval);
        }
    };

    onHeartbeatInfoRsp (msg: any) {

    };
   //防沉迷提示
    onHeartbeatCfgNtf (msg: { interval: any; tip: string | any[]; }) {
        this.setHeartbeatTime(msg.interval);

        if (msg.tip.length > 0) {
            global.Manager.UIManager.open('DlgAdultTip', null, function (panel: { setDec: (arg0: any) => void; }) {
                panel.setDec(msg.tip);
            });
        }
    };

    onClosebbsNtf (msg: any) {
        global.Manager.UIManager.close('UIForum');
    };

    onGmCommandRsp (msg: any) {

    };

    onCheckWordRsp (msg: any) {

    };

    onMonthCarddRsp (msg: { leftSeconds: number; isDrawedToday: any; isMonthCardDrawedToday: any; }) {//月卡奖励
        global.Instance.Log.debug('月卡奖励 onMonthCarddRsp ',msg)
        this.moonCardLeft = msg.leftSeconds;
        this.canRewardCard = !msg.isDrawedToday;
        this.canRewardMoonCard = !msg.isMonthCardDrawedToday;
    };

    onMonthCardDrawdRsp (msg: { errCode: any; req: { type: number; }; }) {
        global.Instance.Log.debug('月卡奖励 onMonthCardDrawdRsp ',msg)
        if (!msg.errCode) {
            if (msg.req.type == 1)
                this.canRewardCard = false;
            else if (msg.req.type == 2)
                this.canRewardMoonCard = false;

                global.CommonClass.UITip.showTipTxt('奖励领取成功', global.Enum.TipType.TIP_GOOD);
        }
        else {
            global.CommonClass.UITip.showTipTxt('不能领取', global.Enum.TipType.TIP_BAD);
        }
    };
    //登录推送
    onLoginEnd () {
        global.Instance.Log.debug("cc.Module.GameData.getIsNeedCert()",global.Module.GameData.getIsNeedCert())
        if (global.Module.GameData.getIsNeedCert()) {
            global.Manager.UIManager.open('UIRealauthen',null,null);
        }else if (global.Module.GameData.getisNeedUpdate()) {
            global.Manager.UIManager.open('DlgAdultConfirm', null, function (panel: { setTxt: (arg0: string) => void; }) {
                if (panel)
                    panel.setTxt('非节假日未成年人每日累计游戏时间不得超过1.5小时，法定节假日每日累计游戏时间不得超过3小时。');
            })
        }else{
            this.requestBaseData();
        }
        
    };

    onChangeClientDataRsp (msg: { errCode: any; req: { key: string | number; value: any; }; }) {
        if (!msg.errCode) {
            this.clientData[msg.req.key] = msg.req.value;
        }
    };

    logicUpdate (dt: any) {
        this.selfUpdate(dt);
        global.Module.FarmData.selfUpdate(dt);
        global.Module.FarmParkData.selfUpdate(dt);
        // global.Module.FishPoolData.selfUpdate(dt);
        global.Module.MakeGoodsData.selfUpdate(dt);
        global.Module.PlayerMapData.selfUpdate(dt);
        global.Module.SummonData.selfUpdate(dt);
        global.Module.UnionData.selfUpdate(dt);
        global.Module.IdentifyData.selfUpdate(dt);
        global.Module.GuildBattleData.selfUpdate(dt);

        global.Manager.UIPaoPaoTipManager.updateCallback(dt);
        global.Manager.UICoinDropManager.updateCallback(dt);
    };

    startLogicUpdate () {
        this.schedule(this.logicUpdate, 0.1, cc.macro.REPEAT_FOREVER, 0);
    };


    // update (dt) {}
}
