

const {ccclass, property} = cc._decorator;

@ccclass
export default class UITown extends cc.Component {
    @property({ type: cc.Label, displayName: "lblName", tooltip: "名称" })
    lblName: cc.Label = null;
    isLock: boolean;

    constructor(){
        super();
    };
   
    onLoad () {
        // let mapID = global.Module.TownMapData.getID();
        // if (mapID == 1001)
        //     this.lblName.string = '苏州府';
        // if (mapID == 1002)
        //     this.lblName.string = '上海滩';
    };

    start () {
    };
    onDisable() {
    };
    btnClose() {
        global.CommonClass.Functions.loadScene("WorldMapScene",null);
    };

    // update (dt) {}
}
