//苏州府数据类

const { ccclass, property } = cc._decorator;

@ccclass
export default class TownNpcData {
    npcs: {};
    curVisitNpc: number;

    constructor() {
        this.npcs = {};
        this.curVisitNpc = 0;
    };
  

    getNpcs(mapID: string | number) {
        if (this.npcs[mapID])
            return this.npcs[mapID];

        return [];
    };

    getNpc(npcID: any) {
        for (let key in this.npcs) {
            let npc = this.npcs[key];
            if (npc.ID == npcID)
                return npc;
        }

        return null;
    };

    setVisitValue(npcID: any, visit: any) {
        for (let key in this.npcs) {
            let npcs = this.npcs[key];
            for (let key in npcs) {
                let npc = npcs[key];
                if (npc.ID == npcID) {
                    npc.visit = visit;
                }
            }
        }
    };

    onNpcListRsp(msg: { req: { cityID: any; }; visits: { map: { [x: string]: { value: any; }; }; }; }) {
        let mapID = msg.req.cityID;
        this.npcs[mapID] = [];

        for (let key in msg.visits.map) {
            let value = msg.visits.map[key].value;
            let item = { ID: key, visit: value }
            this.npcs[mapID].push(item);
        }
    };

    onNpcVisitRsp(msg: { errorID: number; npcID: any; }) {
        global.Instance.Log.debug('onNpcVisitRsp', msg)
        if (msg.errorID == 0) {
            this.curVisitNpc = msg.npcID;
        }
    };

    onNpcTriggerEventRsp(msg: any) {

    };

    onNpcOnPoetryInfoRsp(msg: any) {

    };

    onNpcOnPoetryRsp(msg: { errorID: number; visitValue: any; }) {
        if (msg.errorID == 0) {
            this.setVisitValue(this.curVisitNpc, msg.visitValue);
        }
    };

    onNpcOnThingsRsp(msg: { errorID: number; }) {
        if (msg.errorID == 0) {

        }
    };
    //赛马下注
    onNpcRaceHorses(msg){
        global.Instance.Log.debug('赛马下注返回 onNpcRaceHorses',msg)
    };
    //打劫
    onNpcRobbery(msg){
        global.Instance.Log.debug('小混混打劫 onNpcRobbery',msg)
    };
}
