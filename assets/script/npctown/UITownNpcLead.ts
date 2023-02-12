import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UITownNpcLead extends UIBase {
    @property({ type: cc.Node, displayName: "ndSpeek", tooltip: "ndSpeek" })
    ndSpeek:cc.Node = null;
    callback: any;
    params: any;
    decs: any[];
    curIdx: number;
    isShowSpeek: boolean;
    constructor(){
        super();
        this.callback = null;
        this.params = null;

        this.decs = [];
        this.curIdx = 0;

        this.isShowSpeek = true;
    };
    onLoad () {}

    start () {

    }
    onEnable() {
        let ndSpeek = this.node.getChildByName('ndSpeek');
        ndSpeek.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        ndSpeek.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        ndSpeek.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        ndSpeek.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        ndSpeek.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);

        //this.show('FirstTalk');
    };

    onDisable() {
        let ndSpeek = this.node.getChildByName('ndSpeek');
        ndSpeek.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        ndSpeek.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        ndSpeek.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        ndSpeek.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        ndSpeek.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            this.btnPage(null, '1');
        }
    };

    showPage(idx) {
        if (this.decs.length > 0) {
            let ndSpeek = this.node.getChildByName('ndSpeek');

            let lblDec = ndSpeek.getChildByName('lblDec').getComponent(cc.RichText);
            lblDec.string = this.decs[idx];
        }
    };

    show(params, callback) {
        this.params = params;
        this.callback = callback;
        let cityTalk = global.Module.TownMapData.randomTown(params.eventID, params.stage,params.result);
        params.talkContent = cityTalk.talk;
        let npcData = global.Manager.DBManager.findData('CityScene', 'ID', params.sceneID);
        let talkBack = this.ndSpeek.getChildByName("talkBack");
        global.CommonClass.Functions.setTexture(talkBack, 'images/pictrue/townNpc/bg'+npcData.key, null);

        this.decs = [];
        this.decs.push(params.talkContent);
     
        if (params.msg) {
            let itemID = params.msg.itemId;
            if (itemID != 0) {
                if (params.eventType == 105 || params.eventType == 103) {
                    // let spItem = this.ndSpeek.getChildByName("spItem");
                    // let lbCount = this.ndSpeek.getChildByName("lbCount").getComponent(cc.Label);
                    // lbCount.string = '';
                    // let data = global.Manager.DBManager.getItemNew(itemID);
                    // let iconFile = data.path + data.picName;
                    // global.CommonClass.Functions.setTexture(spItem, iconFile, function (image) {
                    //     spItem.scale = global.CommonClass.Functions.getToscale(spItem, 280, 280);
                    // }.bind(this));
                    // if (params.msg.itemCount && params.msg.itemCount > 1)
                    //     lbCount.string = "-" + params.msg.itemCount;
                    global.CommonClass.ItemDrop.createOneDrop(itemID, -params.msg.itemCount,null,null,null);//挖矿提示小混混扣钱暂用
                    return;
                } else {
                    let allItems = [];
                    let item = { itemID: params.msg.itemId, itemNum: params.msg.itemCount, type: 0 };
                    allItems.push(item);

                    if (allItems.length > 0) {
                        global.Manager.UIManager.open('DlgCollectDrop', null, function (panel: { show: (arg0: any[]) => void; }) {
                            panel.show(allItems);
                        });
                    }
                }
                   
            }
        }
            
        
     


        this.showSpeek(true);
    };

    showSpeek(isShow) {
        this.isShowSpeek = isShow;
        this.ndSpeek.active = isShow;
        this.showPage(this.curIdx);
    };

    btnPage(event, arg) {
        let flag = parseInt(arg);

        this.curIdx += flag;
        if (this.curIdx >= this.decs.length) {
            this.curIdx = this.decs.length - 1;
            this.showSpeek(false);
        }
        else if (this.curIdx < 0)
            this.curIdx = 0;

        if (this.curIdx < this.decs.length)
            this.showPage(this.curIdx);
    };

    btnClose() {
        global.Manager.UIManager.close('UITownNpcLead');

        if (this.callback)
            this.callback(this.params);
    };

    btnLookBack() {
        this.curIdx--;
        if (this.curIdx <= 0)
            this.curIdx = 0;

        this.showPage(this.curIdx);
    };

    btnClickGuideIcon(event) {
        this.curIdx = 0
        this.showSpeek(true);
    };
    // update (dt) {}
}
