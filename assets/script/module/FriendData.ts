//好友数据
const {ccclass, property} = cc._decorator;
@ccclass
export default class FriendData {
    maxFriend: number;
    sortType: number;
    friends: any[];
    applies: any[];
    roleInfos:any[];

    constructor () {
        this.maxFriend = 100;
        this.sortType = 1;          //1 按等级优先  2 按财富优先 3声望优先

        this.friends = new Array();
        this.applies = new Array();//好友申请列表
        this.roleInfos = new Array();
    };

    // use this for initialization
    onLoad () {

    };

    getFriendData () {
        return this.friends;
    };

    getAppliesData () {
        return this.applies;
    };
    getRoleInfosData(){
        return this.roleInfos;
    };

    getMaxFriendNum () {
        return this.maxFriend;
    };

    getFrindByIndex(index: string | number) {
        let value = this.friends[index];
        return value;
    };

    getFriendIndex (ID: any) {
        for (let k = 0; k < this.friends.length; ++k) {
            let value = this.friends[k];
            let roleID = value.roleInfo.roleId;
            if (roleID == ID)
                return k;
        }

        return null;
    };

    isSelf (ID: any) {
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        return mainRoleID == ID;
    };

    getSelf () {
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        for (let k in this.friends) {
            let value = this.friends[k];
            let roleID = value.roleInfo.roleId;
            if (roleID == mainRoleID) {
                return value;
            }
        }

        return null;
    };

    getFriend (ID: any) {
        for (let k in this.friends) {
            let value = this.friends[k];
            let roleID = value.roleInfo.roleId;
            if (roleID == ID)
                return value;
        }

        return null;
    };

    getApply (ID: any) {
        for (let k in this.applies) {
            let value = this.applies[k];
            let roleID = value.roleInfo.roleId;
            if (roleID == ID)
                return value;
        }

        return null;
    };

    listSort (type: number) {
        this.sortType = type;

        global.CommonClass.Functions.sort(this.friends, function (lhs, rhs) {
            if (lhs.relation != rhs.relation) {
                return (lhs.relation < rhs.relation);
            }
            else {
                if (type == 1)        //等级优先
                {
                    return (lhs.roleInfo.level > rhs.roleInfo.level);
                }
                else if (type == 2)    //馆藏优先
                {
                    return (lhs.roleInfo.showTable > rhs.roleInfo.showTable);
                }
                else if (type == 3)    //声望优先
                {
                    return (lhs.roleInfo.reputationLevel > rhs.roleInfo.reputationLevel);
                }
            }
        });

        return this.friends;
    };

    rankSort (type: number) {
        let self = this;

        this.sortType = type;

        let rankData = this.friends.slice();
        global.CommonClass.Functions.sort(rankData, function (lhs, rhs) {
            if (self.sortType == 1)         //等级优先
            {
                if (lhs.relation == 0) {
                    return true;
                }
                else if (rhs.relation == 0) {
                    return false;
                }
                else {
                    if (lhs.roleInfo.level != rhs.roleInfo.level)
                        return (lhs.roleInfo.level > rhs.roleInfo.level);
                    else {
                        if (lhs.roleInfo.showTable != rhs.roleInfo.showTable)
                            return (lhs.roleInfo.showTable > rhs.roleInfo.showTable);
                        else
                            return true;
                    }
                }
            }
            else                        //财富优先
            {
                if (lhs.relation == 0) {
                    return true;
                }
                else if (rhs.relation == 0) {
                    return false;
                }
                else {
                    if (lhs.roleInfo.showTable != rhs.roleInfo.showTable)
                        return (lhs.roleInfo.showTable > rhs.roleInfo.showTable);
                    else {
                        if (lhs.roleInfo.level != rhs.roleInfo.level)
                            return (lhs.roleInfo.level > rhs.roleInfo.level);
                        else
                            return true;
                    }
                }
            }

        });

        for (let i = 0; i < rankData.length; ++i) {
            let value = rankData[i];
            value.index = i + 1;
        }

        return rankData;
    };

    setRelation (ID: any, relation: any) {
        for (let i = 0; i < this.friends.length; ++i) {
            if (this.friends[i].ID == ID) {
                this.friends[i].relation = relation;
                return;
            }
        }
    };
    //好友推荐
    onfriendRecommend(msg) {
        global.Instance.Log.debug("onfriendRecommend",msg)
        this.roleInfos =[];
        if(msg.errorID==0){
            this.roleInfos = msg.roleInfos;
        }
       
    };
    onFriendListRsp (msg: { friends: any[]; applies: any[]; }) {
        this.friends = msg.friends;
        global.Instance.Log.debug("onFriendListRsp",msg)
        for (let key in this.friends) {
            var value = this.friends[key];
            value.index = parseInt(key);

            value.roleInfo.roleId = value.roleInfo.roleId.toNumber();

            //  value.roleInfo.fortune  = Math.ceil(Math.rand())%100;
            value.roleInfo.headID = Math.ceil(Math.random()*4) + 1;

            if (value.roleInfo.roleId == 10) {
                value.relation = 0;
                value.roleInfo.headID = 0;
            }
            else if (this.isSelf(value.roleInfo.roleId)) {
                value.relation = 1;             //自己
            }
            else {
                value.relation = 2;             //好友
            }

        }
        this.listSort(this.sortType);
        cc.systemEvent.emit('applies');
        this.applies = msg.applies;
        for (let key in this.applies) {
            var value = this.applies[key];
            value.index = parseInt(key);
            value.roleInfo.roleId = value.roleInfo.roleId.toNumber();
            value.roleInfo.headID = Math.ceil(Math.random()*4) + 1;
        }
    };
    //好友申请列表
    onFriendApplyRsp (msg: { errorID: any; }) {      //申请返回
        global.Instance.Log.debug("好友申请返回",msg)
    };

    reflashPanel (type: number) { //1.排行, 2.申请
        let data = {};
        global.Instance.MsgPools.send('friendList', data, function (msg: { errorID: any; }) {
            if (!msg.errorID) {
                let panel = global.Manager.UIManager.get('UIFriend');
                if (panel != null) {
                    let friends = global.Module.FriendData.getFriendData();
                    panel.reflashFriends(friends);
                }
            }
        });
    };

   

    onRemoveFriendRsp (msg: { errorID: any; }) { //移除好友返回  (要刷新列表)
        if (!msg.errorID)
            this.reflashPanel(1);
    };

    onFriendApproveRsp (msg: { errorID: any; }) {  //是否同意好友申请 (要刷新列表)
        if (!msg.errorID)
            this.reflashPanel(2);
    };

    onFriendApplyNtfRsp (msg: { errorID: any; applies: any; }) {  //收到好友申请消息  (要刷新列表)
        global.Instance.Log.debug("收到好友申请消息",msg)
        if (!msg.errorID) {
            let value = msg.applies[0];
            value.index = this.applies.length;
            value.roleInfo.roleId = value.roleInfo.roleId.toNumber();
            value.roleInfo.headID = Math.ceil(Math.random()*4) + 1;
            this.applies.push(value);
            cc.systemEvent.emit('applies');
        }
    };

    onFriendApproveNtfRsp (msg: any) { //收到是否同意申请消息(要刷新列表)
        global.Instance.Log.debug("收到是否同意申请消息",msg)
        this.reflashPanel(2);
    };
}
