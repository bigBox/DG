import UIBase from "../common/UIBase";
//成长任务详情

const { ccclass, property } = cc._decorator;
@ccclass
export default class UITaskHelp extends UIBase {
    @property({ type: cc.Node, displayName: "lblTitle1", tooltip: "lblTitle1" })
    lblTitle1: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: "scrollView", tooltip: "帮助滚动" })
    scrollView: cc.ScrollView = null;

    @property({ type: cc.Label, displayName: "content", tooltip: "帮助内容" })
    content: cc.Label = null;

    data: any;
    constructor() {
        super();
        this.data = null;
    };
    onLoad() {

    };

    start() {

    };
    show(data) {
        if (this.data != null)
            return;
        this.data = data;
        global.Manager.UIManager.close('UIFirstTalk');
        let cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);

        {
            this.lblTitle1.getComponent(cc.Label).string = cfgData.title1;
            global.Instance.Log.debug('帮助内容', cfgData)
            let helpDec = cfgData.helpDec1.split("&");
            let str = '';
            for (let i = 0; i < helpDec.length; i++) {
                if (helpDec.length > 1)
                    str += (i + 1) + "." + helpDec[i] + '\n';
                else
                    str += helpDec[i] + '\n';
            }

            this.content.string = str;
        }
        global.Instance.Log.debug('', this.data)
    };

    onClose() {
        global.Manager.UIManager.close('UITaskHelp');

    };
    // update (dt) {}
}
