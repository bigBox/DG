const {ccclass, property} = cc._decorator;

@ccclass
export default class UIDemoReplace extends cc.Component {

    @property({ type: cc.Node, displayName: "spitem1", tooltip: "替换精灵图左" })
    spitem1: cc.Node = null;
    @property({ type: cc.Node, displayName: "spitem2", tooltip: "替换精灵图右" })
    spitem2: cc.Node = null;
    newDemon: any;
    // LIFE-CYCLE CALLBACKS:
    constructor(){
        super();
    };
    onLoad () {
    }

    start () {
        this.newDemon = global.Module.SummonData.getNewDemon();
        let currentDemon = global.Module.SummonData.getDemonCurrent();

        let iconFile = 'images/plist/summon/' + this.getByName(this.newDemon.element, this.newDemon.level);
        global.CommonClass.Functions.setTexture(this.spitem1, iconFile, null);
        iconFile = 'images/plist/summon/' + this.getByName(currentDemon.element, currentDemon.level);
        global.CommonClass.Functions.setTexture(this.spitem2, iconFile, null);
    };
    //根据精灵等级获取名称
    getByName(element,level){
        let type = '';
        if (element == 1)
            type = 'j';
        if (element == 2)
            type = 'm';
        if (element == 3)
            type = 's';
        if (element == 4)
            type = 'h';
        if (element == 5)
            type = 't';
         let iconFile = ''
        for (let i = 0; i < level; i++) {
            iconFile = iconFile + type
        }
       return iconFile;
    };
    //确定替换精灵
    btnSunmmon(event,val){
        let data = { summonID: this.newDemon.summonID, isRetain: val == 1 }
        global.Instance.MsgPools.send('SummonRetain', data, function (msg) {
            global.Manager.UIManager.close('UIDemoReplace');
        })
    };
}
