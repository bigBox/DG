

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRank extends cc.Component {
    @property({ type: cc.Label, displayName: "titleLabel", tooltip: "titleLabel" })
    titleLabel: cc.Label[] = [];
    @property({ type: cc.Node, displayName: "spBackNode", tooltip: "spBackNode" })
    spBackNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "subNode", tooltip: "subNode" })
    subNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "findEndNode", tooltip: "findEndNode" })
    findEndNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "selfItemNode", tooltip: "selfItemNode" })
    selfItemNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndTemplateNode1", tooltip: "ndTemplateNode1" })
    ndTemplateNode1: cc.Node = null;
    @property({ type: cc.Node, displayName: "treadNodeArr", tooltip: "treadNodeArr" })
    treadNodeArr: any = [];
    @property({ type: cc.Node, displayName: "ndTemplateNode2", tooltip: "ndTemplateNode2" })
    ndTemplateNode2: cc.Node = null;
    @property({ type: cc.EditBox, displayName: "nameCodeExid", tooltip: "nameCodeExid" })
    nameCodeExid: cc.EditBox = null;
    @property({ type: cc.Node, displayName: "leaveNode", tooltip: "好友申请返回" })
    leaveNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "wholeNode", tooltip: "批量处理好友申请" })
    wholeNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "加好友任务引导" })
    helpNode: cc.Node = null;
    curData: any;
    curRankArr: any[];
    titleArr: string[];
    curRankType: number;
    curSortType: number;
    selfItemPos: cc.Vec2;
    selItem: any;
    friends: any;


    constructor() {
        super();
        this.curData = null;
        //global.Enum.RankType.COLLECTION = 7:馆藏;global.Enum.RankType.LEVEL = 10:等级;1:寻好友;3:好友申请
        this.curRankArr = [global.Enum.RankType.COLLECTION, global.Enum.RankType.LEVEL, 1,3];
        this.titleArr = ['馆藏', '等级', '寻好友'];
        this.curRankType = 0;

        this.curSortType = 0;
        this.selfItemPos = cc.v2(0, 0);

        this.selItem = null;
    };



    onLoad() { }

    start() {

    }
    onEnable() {
        let self = this;

        this.node.on('onAddFriendClick', function (event) {
            self.onAddFriendClick(event);
        });

        this.node.on('onDelFriendClick', function (event) {
            self.onDelFriendClick(event);
        });

        global.Module.GameData.setMaskSound(true,null);
    };

    onDisable() {
        this.node.off('onAddFriendClick');
        this.node.off('onDelFriendClick');

        global.Module.GameData.setMaskSound(false,null);
    };
  

    show(rankType) {
        this.curRankType = rankType;
        if(this.curRankArr[0]==rankType){
            this.titleArrLabel(0);
            this.onPageClick(0);
        }else if(this.curRankArr[1]==rankType){
            this.titleArrLabel(1);
            this.onPageClick(1);
        }else{
            this.titleArrLabel(2);
            if(this.curRankArr[2]==rankType)
            this.onPageClick(2);
            else
            this.onApplication();
        }

    };
    reflashShow(rankType) {
        this.curData = global.Module.RankData.getRank(rankType);
        global.Instance.Log.debug('UIRank', this.curData)
        this.reflashRanks(this.curData.data);
        this.reflashSelf(this.curData.selfInfo);
        this.reflashHelp();
    };
    reflashHelp() {
        if (this.helpNode) {
            this.helpNode.active = false;
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if (!data)
                return;
            if (data && data.taskId == '10008' && data.state == 1)
                this.helpNode.active = true;
        }
    };
    reflashRoleInfos(data) {
        for (let i = 0; i < this.treadNodeArr.length; i++)
            this.treadNodeArr[i].active = false;

        let itemNode = this.ndTemplateNode2;


        let itemSpace = 12;
        let ndView = this.findEndNode.getChildByName('scroll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemSize = itemNode.getContentSize();
        let itemNum = data.length;
        let sizeWidth = ndItems.getContentSize().width;
        ndItems.setContentSize(sizeWidth, (itemSize.height + itemSpace) * itemNum);
        ndItems.removeAllChildren();
        let itemPosY = -itemSize.height / 2;
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        global.Instance.Log.debug('好友数据', data);
        for (let key in data) {
            let rankData = data[key];
            let newNode: any = cc.instantiate(itemNode);
            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.setPosition(cc.v2(0, itemPosY));
            newNode.tagEx = rankData.ID;
            newNode.active = true;

            let itemClass = newNode.getComponent(global.CommonClass.RankndItem);
            itemClass.reflash(key, rankData);
            itemClass.setMode(this.curRankArr[this.curRankType]);

            let roleID = rankData.roleId;
            let isSelf = (roleID == mainRoleID);
            if (isSelf) {
                this.selfItemPos = cc.v2(0, -itemPosY - itemSize.height / 2);
            }

            itemPosY -= (itemSize.height + itemSpace);
        }
    }
    scrollToSelf() {
        let scroll = this.spBackNode.getChildByName('scroll');
        let viewClass = scroll.getComponent(cc.ScrollView);
        viewClass.stopAutoScroll();
        viewClass.scrollToOffset(this.selfItemPos, 0);
    };

    reflashSelf(data) {
        let selfItemNode: any = this.selfItemNode
        let itemClass = selfItemNode.getComponent(global.CommonClass.RankItem);
        itemClass.setData(data);
        itemClass.setMode(this.curRankArr[this.curRankType]);
    };

    reflashRanks(data) {
        for (let i = 0; i < this.treadNodeArr.length; i++)
            this.treadNodeArr[i].active = false;

        let itemNode = this.ndTemplateNode1;
        if (this.curRankType > 1) {
            itemNode = this.ndTemplateNode2;
            this.treadNodeArr[2].active = true;
        } else {
            this.treadNodeArr[0].active = true;
            this.treadNodeArr[1].active = true;
        }

        let itemSpace = 12;
        let ndView = this.spBackNode.getChildByName('scroll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemSize = itemNode.getContentSize();
        let itemNum = data.length;
        let sizeWidth = ndItems.getContentSize().width;
        ndItems.setContentSize(sizeWidth, (itemSize.height + itemSpace) * itemNum);
        ndItems.removeAllChildren();
        let itemPosY = -itemSize.height / 2;
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        global.Instance.Log.debug('好友数据', data);
        for (let key in data) {
            let rankData = data[key];
            let newNode: any = cc.instantiate(itemNode);
            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.setPosition(cc.v2(0, itemPosY));
            newNode.tagEx = rankData.ID;
            newNode.active = true;

            let itemClass = newNode.getComponent(global.CommonClass.RankndItem);
            itemClass.setData(key, rankData);
            itemClass.setMode(this.curRankArr[this.curRankType]);

            let roleID = rankData.roleInfo.roleId;
            let isSelf = (roleID == mainRoleID);
            if (isSelf) {
                this.selfItemPos = cc.v2(0, -itemPosY - itemSize.height / 2);
            }

            itemPosY -= (itemSize.height + itemSpace);
        }
    };
    FlipBtnclick(event, num) {
        if (this.helpNode)
            this.helpNode.active = false;
        let arg = this.curRankType;
        num = parseInt(num);
        arg += num;
        if (arg == -1)
            arg = this.titleArr.length - 1;
        if (arg == this.titleArr.length)
            arg = 0;
        this.onPageClick(arg);
    };
    titleArrLabel(arg){
        let argRight = arg+1;
        if (argRight == this.titleArr.length)
            argRight = 0;
        let argLeft = arg-1;
        if (argLeft == -1)
            argLeft = this.titleArr.length-1;
        this.titleLabel[0].string = this.titleArr[argLeft];
        this.titleLabel[1].string = this.titleArr[arg];
        this.titleLabel[2].string = this.titleArr[argRight];
    };
    //好友申请
    onApplication(){
        this.curRankType = 3;
        let self = this;
        this.findEndNode.active = false;
        this.selfItemNode.active = false;
        this.subNode.active = true;
        this.spBackNode.active = true;
        this.leaveNode.active = true;   
        this.wholeNode.active = true;
        global.Instance.MsgPools.send('friendList', {}, function (msg) {
            let applies = global.Module.FriendData.getAppliesData();
            self.reflashRanks(applies);
        });
    }
    //馆藏等级寻好友
    onPageClick(arg) {
        this.subNode.active = false;
        this.spBackNode.active = false;
        this.findEndNode.active = false;
        this.selfItemNode.active = false;
        this.leaveNode.active = false;
        this.wholeNode.active = false;
        this.curRankType = parseInt(arg);
        this.titleArrLabel(arg);
        let self = this;
        let data = { type: this.curRankArr[this.curRankType] };
       
       if (this.curRankType == 2) {//寻好友
            this.subNode.active = true;
            this.findEndNode.active = true;
            
            global.Instance.MsgPools.send('friendRecommend', {}, function (msg) {
                self.friends = global.Module.RankData.getRank(1);
                self.reflashRoleInfos(self.friends.data);
            });
        } else {
            this.subNode.active = true;
            this.spBackNode.active = true;
            this.selfItemNode.active = true;
            global.Instance.MsgPools.send('rankTop', data, function (msg) {
                self.reflashShow(data.type);
            });
        }
    };
    refresh(){
        global.Instance.MsgPools.send('friendRecommend', {}, function (msg) {
            this.friends = global.Module.RankData.getRank(1);
            this.reflashRoleInfos(this.friends.data);
        }.bind(this));
    };
    //搜索玩家
    onfineclick(event, icontype) {
        let txtName = this.nameCodeExid.string;
        let name = txtName;
        let data = { name: name };
        let self = this;
        global.Instance.MsgPools.send('friendSearch', data, function (msg) {
            if (msg.errorID == 0) {
                let order = 1;
                self.friends = msg.roleInfos;
                let uiRank = global.Manager.UIManager.get('UIRank');
                if (uiRank)
                    uiRank.reflashRoleInfos(self.friends);
            }
        });
    };
   
  
    //退出好友申请
    leaveBtn() {
        this.curRankType = 1;
        this.spBackNode.active = false;
        this.selfItemNode.active = false;
        this.subNode.active = true;
        this.findEndNode.active = true;
    };

    btnRank(event, arg) {
        this.onPageClick(arg);
    };

    btnSelfRank(evnet, arg) {
        let self = this;
        let data = { type: this.curRankArr[this.curRankType] };
        global.Instance.MsgPools.send('rankSelfLst', data, function (msg) {
            self.reflashShow(data.type);
            self.scrollToSelf();
        });
    };
    btnClose(evnet, arg) {
        global.Manager.UIManager.close('UIRank');
    };
     //同意拒绝好友申请批量
     onfriendApprove(event,arg){
        let applies = global.Module.FriendData.getAppliesData();
        let data = { targetRoleId: [], agree: true }; //同意
        if (arg == 2)
            data.agree = false;//拒绝
        for (let i = 0; i < applies.length; i++)
            data.targetRoleId.push(applies[i].roleInfo.roleId)
        if(data.targetRoleId.length ==0)
        return;
        let ndView = this.spBackNode.getChildByName('scroll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let self = this
        global.Instance.MsgPools.send('friendApprove', data, function (event) {
            global.Instance.Log.debug('friendApprove', event);
            if (event.errorID == 0) {
                for (let i = 0; i < ndItems.children.length; i++) {
                    let newNode: any =ndItems.children[i];
                    let itemClass = newNode.getComponent(global.CommonClass.RankndItem);
                    itemClass.onApprove(data.agree)
                }
            } else {
                for (let i = 0; i < ndItems.children.length; i++) {
                    let newNode: any =ndItems.children[i];
                    let itemClass = newNode.getComponent(global.CommonClass.RankndItem);
                    itemClass.onApprove(null)
                }
            }
        });
    }
    onAddFriend(){
        let data = { roleId: [], applyType: 1 };
        if (global.Module.TaskData.taskguard(10008))//加好友任务保护
            return;

        let ndView = this.findEndNode.getChildByName('scroll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        for (let i = 0; i < ndItems.children.length; i++) {
            let newNode: any = ndItems.children[i];
            data.roleId.push(newNode.tagEx);
        }
        if (data.roleId.length != 0) {
            global.Instance.MsgPools.send('friendApply', data, function (msg) {
                if (!msg.errorID) {
                    global.CommonClass.UITip.showTipTxt('发送添加好友请求成功', global.Enum.TipType.TIP_GOOD);
                    for (let i = 0; i < ndItems.children.length; i++) {
                        let newNode: any = ndItems.children[i];
                        let itemClass = newNode.getComponent(global.CommonClass.RankndItem);
                        itemClass.onAddFriend();
                    }
                }
                else if (msg.errorID == 183) {
                    global.CommonClass.UITip.showTipTxt('已经请求或被请求过!', global.Enum.TipType.TIP_BAD);
                }

            });
        }
    };
    //添加好友
    onAddFriendClick(event) {
        let item = event.getUserData();
        let roleID = item.node.tagEx;
        if (global.Module.TaskData.taskguard(10008))//加好友任务保护
            return;
        let value = global.Module.RankData.getData(this.curRankArr[this.curRankType], roleID);
        if (value != null) {
            let data = { roleId: [roleID], applyType: 1 };
            global.Instance.MsgPools.send('friendApply', data, function (msg) {
                if (!msg.errorID) {
                    global.CommonClass.UITip.showTipTxt('发送添加好友请求成功', global.Enum.TipType.TIP_GOOD);
                }
                else if (msg.errorID == 183) {
                    global.CommonClass.UITip.showTipTxt('已经请求或被请求过!', global.Enum.TipType.TIP_BAD);
                }
                let btnAddFriend = item.node.getChildByName('btnAddFriend');
                btnAddFriend.active = false;
            });
        }

    };
    //删除好友
    onDelFriendClick(event) {
        let item = event.getUserData();
        let roleID = item.node.tagEx;
        let value = global.Module.RankData.getData(this.curRankArr[this.curRankType], roleID);

        if (value != null) {
            global.CommonClass.UIDialog.create("删除好友", "是否将好友" + value.roleInfo.roleName + "删除?", function (isYes) {
                if (isYes) {
                    let data = { roleId: roleID };
                    global.Instance.MsgPools.send('friendRemove', data, function (msg) {
                        if (!msg.errorID) {
                            global.CommonClass.UITip.showTipTxt('删除好友成功!', global.Enum.TipType.TIP_GOOD);

                            let btnDelFriend = item.node.getChildByName('btnDelFriend');
                            let btnAddFriend = item.node.getChildByName('btnAddFriend');
                            btnDelFriend.active = false;
                            btnAddFriend.active = true;
                        }
                    });
                }
            });
        }
    };
    // update (dt) {}
}
