import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UITownNpcTalk extends UIBase {
    @property({ type: cc.Node, displayName: "ndSpeek", tooltip: "ndSpeek" })
    ndSpeek:cc.Node = null;
    @property({ type: cc.Node, displayName: "bottomNode", tooltip: "同意拒绝页面" })
    bottomNode:cc.Node = null;
    @property({ type: cc.Node, displayName: "bottomNode1", tooltip: "给钱反抗页面" })
    bottomNode1:cc.Node = null;

    callback: any;
    params: any;
    decs: any[];
    curIdx: number;
    isShowSpeek: boolean;
    isShow: boolean;
    constructor(){
        super();
        this.callback = null;
        this.params = null;

        this.decs = [];
        this.curIdx = 0;
        this.isShow = false;
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
    setIsShow(isShow){
        this.isShow = isShow;     
    }

    show(params,isShow, callback) {
        this.curIdx = 0;
        this.isShow = false;
        this.params = params;
        this.callback = callback;
        let cityTalk = global.Module.TownMapData.randomTown(params.eventID, params.stage,params.result);
        params.talkContent = cityTalk.talk;
        let npcData = global.Manager.DBManager.findData('CityScene', 'ID', params.sceneID);
        let talkBack = this.ndSpeek.getChildByName("talkBack");
        
        global.CommonClass.Functions.setTexture(talkBack, 'images/pictrue/townNpc/bg'+npcData.key, null);

        this.decs = [];
        this.decs.push(params.talkContent);
      
        
        npcData = global.Manager.DBManager.findData('CityNpcEvent', 'ID', params.eventID);

        let spNpc = this.ndSpeek.getChildByName("spNpc");
        switch (npcData.npc) {
            case 1:
                global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/npcqiuxiang', null);
                break;
            case 2:
                global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/npctangbohu', null);
                break;
            case 3:
                global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/npcshiliujie', null);
                break;
            case 4:
                global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/npchudie', null);
                break;
            case 5:
                global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/npcduyuesheng', null);
                break;
            case 6:
                global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/npclishutong', null);
                break;
            case 7:
                if(params.stage == 3&&params.result == 1){
                    global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/win', null);
                }else{
                    global.CommonClass.Functions.setTexture(spNpc, 'images/pictrue/townNpc/npcxiaohunhun', null);
                }
               
                break;
        }

        this.showSpeek(true);
        this.bottomNode.active = false;
        this.bottomNode1.active = false;
        if(isShow == true){
            if(params.eventType == 105)
            this.bottomNode1.active = true;
            else
            this.bottomNode.active = true;  
        }
       
       
    };

    showSpeek(isShow) {
        this.isShowSpeek = isShow;
        this.ndSpeek.active = isShow;
        this.showPage(this.curIdx);
    };

    btnPage(event, arg) {
        this.btnClose();
    };

    btnClose() {
        global.Manager.UIManager.close('UITownNpcTalk');
       
        let params= this.params;
        let self = this;
        if (params.msg&&this.isShow==true) {
            let itemID = params.msg.itemId;
            if (itemID != 0) {
                let allItems = [];
                let item = { itemID: params.msg.itemId, itemNum: params.msg.itemCount, type: 0 };
                allItems.push(item);

                if (allItems.length > 0) {
                    global.Manager.UIManager.open('DlgCollectDrop', null, function (panel: any) {
                        panel.show(allItems);
                        if (self.callback)
                            panel.reflash(self.params, self.callback)
                    });
                    return;
                }
            }
        }
        if (this.callback)
        this.callback(this.params);
    };
    onPageClick(event, arg) {
        let index = parseInt(arg);
        let self = this;
        global.Instance.MsgPools.send('npcRobbery', { itemId: 2, itemCount: 1000, isAgree: index }, function (msg) {
            if (msg.errorID == 0) {
                if (index == 0) {
                    self.params.msg = msg;
                    global.Manager.UIManager.close('UITownNpcTalk');
                    if (this.callback) {
                        this.callback(self.params, msg);
                    }
                }
            };
        }.bind(this));
        if (index == 1) {
            global.Manager.UIManager.close('UITownNpcTalk');
        } 
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
