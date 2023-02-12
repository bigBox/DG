

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendChooseData extends cc.Component {
    sortType: number;
    friends: any;
    curSelID: number;
    maxFriend: any;

    constructor() {
        super();
        this.sortType = 1;          //1 按等级优先  2 按财富优先 3声望优先
        this.friends = null;

        this.curSelID = -1;

    };

    // use this for initialization
    onLoad() {

    };

    synchronFriendData() {
        let data = global.Module.FriendData.getFriendData();
        this.friends = data.slice();

        this.listSort(this.sortType);
    };

    getFriendData() {
        return this.friends;
    };

    getMaxFriendNum() {
        return this.maxFriend;
    };

    getFrindByIndex(index) {
        let value = this.friends[index];
        return value;
    };

    getFriendIndex(ID) {
        for (let k = 0; k < this.friends.length; ++k) {
            let value = this.friends[k];
            let roleID = value.roleInfo.roleId;
            if (roleID == ID)
                return k;
        }

        return null;
    };

    getSelectID() {
        return this.curSelID;
    };

    setSelectID(ID) {
        this.curSelID = ID;
    };

    getSelectFriend() {
        return this.getFriend(this.curSelID);
    };

    isSelf(ID) {
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        return mainRoleID == ID;
    };

    getSelf() {
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

    getFriend(ID) {
        for (let k in this.friends) {
            let value = this.friends[k];
            let roleID = value.roleInfo.roleId;
            if (roleID == ID)
                return value;
        }

        return null;
    };

    listSort(type) {
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

}
