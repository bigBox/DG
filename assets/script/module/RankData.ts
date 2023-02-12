//排行榜排名数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class RankData {
    selfID: number;
    ranks: {};
    preciousLowType: number;
    preciousData: any[];
    preciousRank: any[];

    constructor() {
        this.selfID  = 1000;
        this.ranks      = {};

        this.preciousLowType = 4;
        this.preciousData = new Array();
        this.preciousRank = new Array();
  
        this.loadData(); 
    };

    loadData() {
        let data = global.Manager.DBManager.getData("Precious");
        if (data != null)
        { 
            for (let i=0; i<data.length; ++i)
                 this.preciousData.push(data[i]);
        }

        for (let key in this.preciousData)
        {
            let item = this.preciousData[key];
            
            let findRankArray = new Array();
            let perfectRankArray = new Array();
            let ownerRankArray = new Array();
            for (let i=0; i<20; ++i)
            {
                let nameIdx1 = Math.ceil(Math.random()*2000);
                let nameIdx2 = Math.ceil(Math.random()*2000);
                let nameIdx3 = Math.ceil(Math.random()*2000);

                let head1 = Math.ceil(Math.random()*4)+1;
                let head2 = Math.ceil(Math.random()*4)+1;
                let head3 = Math.ceil(Math.random()*4)+1;

                let findItem = { order: i, score: i * 2 + 5, roleInfo: {} };
                findItem.roleInfo = { roleId: 1000 + i, roleName: "F" + nameIdx1.toString(), level: 30 + i }

                let perfectItem = { order: i, score: i * 2 + 5, roleInfo: {} };
                perfectItem.roleInfo = { roleId: 1000 + 20 - i, roleName: "P" + nameIdx2.toString(), level: 13 + i }

                let ownerRankItem = { order: i, score: i + 10, roleInfo: {} };
                ownerRankItem.roleInfo = { roleId: 1000 + 20 + i, roleName: "O" + nameIdx3.toString(), level: 20 + i }
                
                findRankArray.push(findItem);
                perfectRankArray.push(perfectItem);
                ownerRankArray.push(ownerRankItem);
            }
            let itemIdx = parseInt(key);
            let rankItem = {index:itemIdx, itemID:item.ID, findRank:findRankArray, perfectRank:perfectRankArray, ownerRank:ownerRankArray};
            this.preciousRank.push(rankItem);
        }
    };

    getPreciousRankByID(itemID: any, type: number) {
        for (let i=0; i<this.preciousRank.length; ++i)
        {
           
            let item = this.preciousRank[i];
            if (item.itemID == itemID)
            {
                if (type==1)        //findRank
                {
                    return item.findRank;
                }
                else if(type==2)    //perfectRank
                {
                    return item.perfectRank;
                }
                else if(type==3)    //ownerRank
                {
                    return  item.ownerRank;
                }
               
            }
        }
        return null;
    };

    getPreciousData() {
        return this.preciousData;
    };

    getPreciousRank() {
        return this.preciousRank;
    };

    getSelfPreiousRankItem(itemID: any, type: any) {
        let rankItem = this.getPreciousRankByID(itemID, type);
        if (rankItem != null)
        {
            for (let i=0; i<rankItem.length; ++i)
            {
                let rankData = rankItem[i];
                if (rankData.roleInfo.roleId == this.selfID)
                    return rankData;
            }
            
        }
        return null;
    };

    getRankByID(ID: any) {
        for (let i=0; i<this.preciousRank.length; ++i)
        {
            let item = this.preciousRank[i];
            if (item.itemID==ID)
            {
                return item;
            }
        }

        return null;
    };


    getRank(rankType: string | number) {
        return this.ranks[rankType];
    }; 

    getData(rankType: string | number, ID: any) {
        let data = this.ranks[rankType];
        if (data != null) {
            for (let key in data.data) {
                let value = data.data[key];
                if (ID == value.roleInfo.roleId)
                    return value;
            }
        }

        return null;
    };

    getSelfRank(rankType: string | number) {
        if (this.ranks[rankType] != null)
            return this.ranks[rankType].selfInfo;
        else
            return null;
    };
    onFriendSearchRsp (msg:any) {
        if (msg.errorID == 0) {
            let type = 1;
            this.ranks[type] = {};
            this.ranks[type].data  = []; msg.roleInfos;
            for (let i = 0; i < msg.roleInfos.length; i++) {
                let item: any = {roleInfo:null};
                item.roleInfo = msg.roleInfos[i];
                item.roleInfo.roleId = item.roleInfo.roleId.toNumber();
                this.ranks[type].data.push(item)
            }
          
        }
    };
   //好友推荐
    onfriendRecommend(msg) {
        global.Instance.Log.debug("onfriendRecommend", msg);
        if (msg.errorID == 0) {
            this.ranks[1] = {};
            this.ranks[1].data = msg.roleInfos;
        }

    };
    onRoleRankCommonInfoNtf(msg:any) {
        global.Instance.Log.debug('onRoleRankCommonInfoNtf',msg);
        let type = msg.type;
        if (type==null)
            type = 0;
       
        this.ranks[type] = {};

        this.ranks[type].data       = msg.topN;
        for (let key in this.ranks[type].data)
        {
            let item = this.ranks[type].data[key];
            item.roleInfo.roleId = item.roleInfo.roleId.toNumber();

            item.order = item.rankBase.seasonId;
        }

        this.ranks[type].selfInfo        = msg.selfInfo; 
        this.ranks[type].selfInfo.order  = msg.selfRank;
        if (this.ranks[type].selfInfo != null)
            this.ranks[type].selfInfo.roleId = this.ranks[type].selfInfo.roleInfo.roleId.toNumber();
    };

    onRankSelfLstRsp(msg: any) {
        if (msg.errorID == 0)
        {
            let type = msg.type;

            this.ranks[type].data  = msg.ranks;
            for (let key in this.ranks[type].data)
            {
                let item = this.ranks[type].data[key];
                item.roleInfo.roleId = item.roleInfo.roleId.toNumber();
    
                item.order = item.rankBase.seasonId;
            }
        }
    };
}
