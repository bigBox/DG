import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UITownThings extends UIBase {
    @property({ type: cc.Node, displayName: "ndSpeek", tooltip: "ndSpeek" })
    ndSpeek: cc.Node = null;
    @property({ type: cc.Label, displayName: "lblQuestion", tooltip: "lblQuestion" })
    lblQuestion: cc.Label = null;
    @property({ type: cc.Node, displayName: "lblAnswers", tooltip: "lblAnswers" })
    lblAnswers: any = [];
    @property({ type: cc.Toggle, displayName: "toggleAnswers", tooltip: "toggleAnswers" })
    toggleAnswers: any = [];
    params: any;
    callback: any;
    constructor() {
        super();
        this.params = null;
        this.callback = null;
    };
    onLoad() { }

    start() {

    }

    show(params, callback) {
        this.params = params;
        this.callback = callback;

        let npcData = global.Manager.DBManager.findData('CityScene', 'ID', params.sceneID);
        let talkBack = this.ndSpeek.getChildByName("talkBack");
        global.CommonClass.Functions.setTexture(talkBack, 'images/pictrue/townNpc/bg'+npcData.key, null);
        let eventContent = JSON.parse(params.eventContent);

        // 题目
        this.lblQuestion.string = "需要" + eventContent.itemCount + "金币";//poetryData.question;
       
        
    };

    onPageClick(event, arg) {
        this.toggleAnswers[0].interactable = false;
        this.toggleAnswers[1].interactable = false;

        let index = parseInt(arg);
            global.Instance.MsgPools.send('npcOnThings', { answer: index }, function (msg) {
                if (msg.errorID == 0) {
                    if (msg.req.answer == 1) {
                        if (this.callback) {
                            this.callback(this.params, true);
                        }
                    } else {
                        if (this.callback) {
                            this.callback(this.params, false);
                        }
                    }
                };
            }.bind(this));

      
        global.Manager.UIManager.close('UITownThings');
    };
    // update (dt) {}
}
