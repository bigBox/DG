
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIHelp extends cc.Component {

    static filePath: "prefab/common/";
    arg: number;
    exArg: any;
    constructor() {
        super();
        this.arg = 0;
    };

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {};

    start() {

    };

    onEnable() {

    };

    onDisable() {

    };

    setExArg(arg) {
        this.exArg = arg;
    };

    btnHelp(event, arg) {
        let helpKey = arg;

        if (helpKey == 'MakeGoodsHelp') {
            helpKey = 'MakeGoods' + this.exArg.toString();
        }
        let helps = global.Manager.DBManager.findDatas('illustrate', 'key', helpKey);
        let lenNum = helps.length
        if (helpKey == 'MainSceneHelp')
            lenNum += 1
        if (lenNum > 1) {
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if (data) {
                let contentData = global.Proxys.ProxyGuJi.getContentData();

                
                if (data.state == 1 && (data.taskId == 10003)&&contentData.ID == 2) {
                    let date = JSON.parse(cc.sys.localStorage.getItem('10003'));
                    if (date == null)
                        date = []
                    if (date.indexOf(0) == -1) {
                        date.push(0)
                        cc.sys.localStorage.setItem('10003', JSON.stringify(date));
                    }

                }
            }
            let uiGuJi = global.Manager.UIManager.get('UIGuJi');
            if (uiGuJi)
                uiGuJi.isndHelp(false);
            global.Manager.UIManager.open('UIHelpList', null, function (panel) {
                panel.show(helpKey);
            });
        } else {
            let helpData = global.Manager.DBManager.findData('illustrate', 'ID', helps[0].ID);
            global.Manager.UIManager.open('UIHelpSpeek', null, function (panel) {
                panel.show(helpData);
            });

        }
        
    };
}
