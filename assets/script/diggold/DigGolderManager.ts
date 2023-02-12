//挖矿角色管理

let Common = window["Common"]
const {ccclass, property} = cc._decorator;

@ccclass
export default class DigGolderManager{
    players: any[];
    mainPlayer: any;
    map: any;

    constructor() {
        this.players = new Array(); //{id, body}
        this.mainPlayer = null;
        this.map     = null;
    };

    setMap(map: any) {
        this.map = map;
    };

    setMainPlayer(playerID: any, object: { getComponent: (arg0: any) => any; }) {
        //this.mainPlayer = {ID:playerID, object:object};
        
        let mainPlayer = object.getComponent(global.CommonClass.DigGolderMainPlayer);
        this.mainPlayer = {ID:playerID, object:mainPlayer};

        mainPlayer.setMapOwner(this.map);
        mainPlayer.getData().setID(playerID);

        return mainPlayer;
    };

    getMainPlayer() {
        return this.mainPlayer.object;
    };

    addPlayer(playerID: any) {
        let digGolder = this.getPlayer(playerID);
        if (digGolder != null)
            return digGolder;

        let obj = {ID:playerID, object:null};

        let player = this.map.getPlayerInstance();
        let newNode = cc.instantiate(player);
        newNode.active = true;
        this.map.node.addChild(newNode);
        
        digGolder = newNode.getComponent(global.CommonClass.DigGolderPlayer);
        obj.object = digGolder;
        digGolder.setMapOwner(this.map);
        digGolder.getData().setID(playerID);

        this.players.push(obj);

        return digGolder;
    };
    removePlayer(playerID: any) {
        for (let idx=0; idx<this.players.length; ++idx)
        {
            let data = this.players[idx];
            let player = data.object;
            if (data.ID==playerID)
            {
                let mainRoleID      =  global.Module.MainPlayerData.getRoleID();
                if (mainRoleID != data.ID)
                {
                    player.node.removeFromParent();
                    this.players.splice(idx, 1);
                }
                break;
            }
        }
    };

    getPlayer(playerID: any) {
        if (this.mainPlayer!=null && this.mainPlayer.ID==playerID)
            return this.mainPlayer.object;

        for (let idx=0; idx<this.players.length; ++idx)
        {
            let player = this.players[idx];
            if (player.ID==playerID)
               return player.object;
        }
    };
    getPlayerNum() {
        return this.players.length;
    };

    clearOtherPlayer() {
        for (let idx=0; idx<this.players.length; ++idx)
        {
            let data = this.players[idx];
            let player = data.object;
            player.node.removeFromParent();
        }

        this.players = [];
    };

    clear() {
        this.players = []; //{id, body}
        this.mainPlayer = null;
        this.map     = null;
    };
}
