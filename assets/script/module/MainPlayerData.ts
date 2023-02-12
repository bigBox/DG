const { ccclass, property } = cc._decorator;

@ccclass
export default class MainPlayerData {
    private roleID: number;
    private userName: string;
    private signature: string;
    private fiveElem: number;
    private speed: number;
    private serverData: any;
    private oldData: any;
    private age: number;
    private saveData: any;
    private needSaveChange: boolean;
    private isLockDrop: boolean;
    private guideID: number;
    private guideState: number;
    private guildID: number;
    constructor() {
        this.roleID = 0; //第一个角色id，0表示无角色
        this.userName = ''; //用户名
        this.signature = ''; //个人签名
        this.fiveElem = 0;  //金木水火土五元素
        this.speed = 100; //速度
        this.serverData = {};//服务器数据
        this.oldData = {};//与服务器新数据做对比中转
        this.age = 0;//年龄
        this.saveData = {};
        this.needSaveChange = false;//是否需要保存更改
        this.guildID = 0;//俱乐部ID

        this.isLockDrop = false;
        this.guideID = 0;//引导id  ----确定新手引导走到那一步
        this.guideState = 0;//任务引导的导向设置 ---- 第一个任务是否提交
    };
    /**
     * 保存年龄
     * @param age 年龄
     */
    setage(age: number) {
        this.age = age;
    };
    /**
     * 获取年龄
     * @returns 年龄
     */
    getage() {
        return this.age;
    };
    /**
     * 保存服务器数据
     * @param data 数据
     */
    setData(data: any) {
        global.Instance.Log.debug("服务器数据", data)
        this.serverData = data;
    };
    /**
     * 通过下标获取指定服务器数据数据
     * @param key 下标
     * @returns 指定数据
     */
    getDataByKey(key: string | number) {
        return this.serverData[key];
    }
    /**
     * 保存用户ID
     * @param roleID 用户ID
     */
    setRoleID(roleID) {
        this.roleID = roleID;
    };
    /**
     * 获取用户ID
     * @returns 用户ID
     */
    getRoleID() {
        return this.roleID;
    };
    /**
    * 保存俱乐部ID
    * @param guildID 俱乐部ID
    */
    setguildID(guildID: any) {
        this.guildID = parseInt(guildID);
    };
    /**
    * 获取俱乐部ID
    * @param guildID 俱乐部ID
    */
    getguildID() {
        return this.guildID;
    };
    /**
     * 保存引导ID
     * @param guideID 引导ID
     */
    setguideID(guideID: any) {
        this.guideID = guideID;
    };
    /**
     * 获取引导ID
     * @returns 引导ID
     */
    getguideID() {
        return this.guideID;
    };
    /**
     * 保存引导状态
     * @param guideState 引导状态
     */
    setguideState(guideState: any) {
        this.guideState = guideState;
    };
    /**
     * 获取引导状态
     * @returns 引导状态
     */
    getGuideState() {
        return this.guideState;
    };
    /**
     * 保存用户名称
     * @param name 名字
     */
    setRoleName(name: any) {
        this.userName = name;
    };
    /**
     * 获取用户名称
     * @returns 名字
     */
    getRoleName() {
        return this.userName;
    };
    /**
     * 对用户名字过长的做字符分割
     * @param name 名字
     * @returns 名字
     */
    getName(name: string | any[]) {
        if (name.length > 5)
            name = name.slice(0, 4);
        return name;
    };
    /**
     * 保存个人签名
     * @param signature 个人签名
     */
    setSignature(signature: any) {
        this.signature = signature;
    };
    /**
     * 获取个人签名
     * @returns 个人签名
     */
    getSignature() {
        return this.signature || '';
    };
    /**
     * 保存
     * @param fiveElem 用户元素背景
     */
    setFiveElem(fiveElem: any) {
        this.fiveElem = fiveElem;
    };
    /**
     * 获取
     * @returns fiveElem 用户元素背景
     */
    getFiveElem() {
        return this.fiveElem;
    }
    /**
     * 获取中转旧数据
     * @param key 数据下标
     * @returns 数据
     */
    getOldData(key: string | number) {
        return this.oldData[key];
    };
    /**
     * 获取等级
     * @returns 等级数据
     */
    getLevel() {
        return this.getDataByKey('Level') || 1;
    };
    /**
     * 添加等级数据
     * @returns 数据
     */
    addLevel() {
        let key = 'Level';

        if (this.serverData[key] == null)
            this.serverData[key] = 1;

        this.oldData[key] = this.getLevel();

        ++this.serverData[key];

        let data = { Level: this.getLevel() }
        this.onDataChange(data);

        return this.getLevel();
    };
    /**
     *保存 探险 体力值
     * @param value 
     * @returns 
     */
    setMagic(value: any)        //盗墓用
    {
        let key = 'Magic';
        this.oldData[key] = this.serverData[key];

        this.serverData[key] = value;

        let data = { Magic: value }

        if (this.oldData[key] != value)
            this.onDataChange(data);

        return value;
    };
    /**
     *获取 探险 体力值
     * @returns
     */
    getMagic() {
        return this.serverData['Magic'];
    };
    /**
     * 获取用户移动速度
     * @returns 
     */
    getSpeed() {
        return this.speed;
    };
    /**
      * 修改名字接口数据返回
      * @param msg 
      */
    onNameChanged(msg: { errorID: any; req: { name: any; }; }) {
        if (!msg.errorID)
            this.setRoleName(msg.req.name);
    };
    /**
     * 修改签名接口数据返回
     * @param msg 
     */
    onSignatureChanged(msg: { errorID: any; req: { signature: any; }; }) {
        if (!msg.errorID)
            this.setSignature(msg.req.signature);
    };

    onUsePowerBarAddStamina(msg: any) {

    };
    /**
     * 用户信息推送
     * @param msg 
     */
    onPlayerAttrNtf(msg: any) {
        //提前存储之前的用户信息
        for (let key in this.serverData)
            this.oldData[key] = this.serverData[key];

        let changeData = {};
        //给新的用户信息赋值
        for (let key in msg.longDic.map) {
            let value = msg.longDic.map[key].value;
            if (value != null) {
                this.serverData[key] = value;

                changeData[key] = value;
            }
        }

        for (let key in msg.intDic.map) {
            let value = msg.intDic.map[key].value;
            if (value != null) {
                this.serverData[key] = value;

                changeData[key] = value;
            }
        }

        for (let key in msg.strDic.map) {
            let value = msg.strDic.map[key].value;
            if (value != null) {
                this.serverData[key] = value;

                changeData[key] = value;
            }
        }

        for (let key in msg.byteDic.map) {
            let value = msg.byteDic.map[key].value;
            if (value != null) {
                this.serverData[key] = value;

                changeData[key] = value;
            }
        }

        for (let key in msg.uintDic.map) {
            let value = msg.uintDic.map[key].value;
            if (value != null) {
                this.serverData[key] = value;

                changeData[key] = value;
            }
        }

        for (let key in msg.uint64Dic.map) {
            let value = msg.uint64Dic.map[key].value;
            if (value != null) {
                this.serverData[key] = value;

                changeData[key] = value;
            }
        }

        for (let key in msg.doubleDic.map) {
            let value = msg.doubleDic.map[key].value;
            if (value != null) {
                this.serverData[key] = value;

                changeData[key] = value;
            }
        }
        global.Instance.Log.debug('-----------------------------个人信息', msg)
        global.Instance.Log.debug(this.serverData, '')
        global.Instance.Log.debug('推送用户个人信息数据', changeData);
        global.Instance.Log.debug("needSaveChange", this.needSaveChange)
        if (this.needSaveChange)
            this.saveChange(changeData);//保存更改
        else
            this.onDataChange(changeData);//遍历到页面
    };

    setNeedSaveChange(isNeed: any) {
        this.needSaveChange = isNeed;
        this.isLockDrop = !isNeed;
    };

    saveChange(changeData: { [x: string]: any; }) {
        for (let key in changeData)
            this.saveData[key] = changeData[key];
    };

    popSaveChange() {
        this.isLockDrop = false;
        this.needSaveChange = false;

        if (this.saveData) {
            this.onDataChange(this.saveData);
            this.clearChange();
        }
    };

    clearChange() {
        this.saveData = {};
    };

    lockDrop(isLock: any) {
        this.isLockDrop = isLock;
    };

    onDataChange(data: { [x: string]: any; toString: () => any; }) {
        global.Instance.Log.debug(data, '')
        let baseKey = {
            Name: true,//名字
            Gold: true,//金币
            Diamond: true,//钻石
            Level: true,//等级
            Experience: true,//经验
            ShowTable: true,//展厅收藏
            ShowTableLevel: true,//收藏等级
            Stamina: true,//耐力-挖矿用
            Magic: true,//探险用
            Reputation: true,//声誉
            Ecology: true,//生态园
            Boom: true,//繁荣度
            GuildScore: true,//帮会 -帮会得分
        };
        //  <------关于动态修改页面数据---------->
        let UIRoleInfos = global.Manager.UIManager.getMutiPanels('UIRoleInfo');
        for (let uiIdx in UIRoleInfos) {
            let UIRoleInfo = UIRoleInfos[uiIdx];
            if (UIRoleInfo != null) {
                for (let key in data) {
                    if (baseKey[key])
                        UIRoleInfo.reflashByKey(key, true);
                }
            }
        }
        global.Instance.Log.debug('用户个人信息数据', data);
        for (let key in data) {
            if (this.oldData[key] != null)      //判断是否第一次下发
            {
                let value = data[key];
                let diff = value - this.oldData[key];

                if (key == 'Level') {
                    global.Instance.Log.debug("diff", diff)
                    if (diff > 0) {
                        if (!this.isLockDrop) {
                            let UILevelUpNew = global.Manager.UIManager.get('UILevelUpNew');
                            if (UILevelUpNew == null)
                                global.Manager.UIDlgTipManager.addTip(global.Enum.DlgTipType.DLG_LEVELUP, {});
                        }

                        let mainMap = global.Instance.Dynamics['MainMap'];
                        if (mainMap != null)
                            mainMap.onLevelUp(value);

                        global.Proxys.ProxyFactoryGuide.onLevelUp(value);
                    }
                }
                else if (key == 'Experience') {
                    if (diff > 0) {
                        if (!this.isLockDrop)
                            global.Manager.UICoinDropManager.addDrop(global.Enum.CoinType.COIN_EXP, diff);
                    }
                }
                else if (key == 'Gold') {
                    if (diff > 0) {
                        if (!this.isLockDrop)
                            global.Manager.UICoinDropManager.addDrop(global.Enum.CoinType.COIN_MONEY, diff);
                    }
                }
                else if (key == 'Stamina') {
                    // if (diff > 0) {
                    //      if (!this.isLockDrop)
                    //     global.CommonClass.CoinDrop.create(global.Enum.CoinType.COIN_POWER,  diff);
                    // }
                }
                else if (key == 'Diamond') {
                    if (diff > 0) {
                        if (!this.isLockDrop)
                            global.Manager.UICoinDropManager.addDrop(global.Enum.CoinType.COIN_DIAMOND, diff);
                    }
                }
                else if (key == 'Reputation') {
                    if (diff > 0) {
                        if (!this.isLockDrop)
                            global.Manager.UICoinDropManager.addDrop(global.Enum.CoinType.COIN_HONOR, diff);
                    }
                }
                else if (key == 'Ecology') {
                    if (diff > 0) {
                        if (!this.isLockDrop)
                            global.Manager.UICoinDropManager.addDrop(global.Enum.CoinType.COIN_ECOLOGICAL, diff);
                    }
                }
                else if (key == 'ReputationLevel') {

                }
                else if (key == 'GuildScore') {
                    if (diff > 0) {
                        if (!this.isLockDrop)
                            global.Manager.UICoinDropManager.addDrop(global.Enum.CoinType.COIN_UNION, diff);
                    }
                }
            }
            else {

            }
        }

    };


}
