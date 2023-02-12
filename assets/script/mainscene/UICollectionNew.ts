

const { ccclass, property } = cc._decorator;

@ccclass
export default class UICollectionNew extends cc.Component {
    @property({ type: cc.Node, displayName: "nodeTemplate", tooltip: "nodeTemplate" })
    nodeTemplate: cc.Node = null;
    @property({ type: cc.Node, displayName: "svContent", tooltip: "加载节点" })
    svContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "collection", tooltip: "图鉴按钮" })
    collectionNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "任务引导" })
    helpNode: any = [];
    @property({ type: cc.Node, displayName: "svScrollView", tooltip: "滚动节点" })
    svScrollView: cc.Node = null;
    
    type: number;
    chooseId: number;

    constructor() {
        super();
        this.type = 0;
        this.chooseId = -1;
    };

    // use this for initialization
    onLoad() {
        this.nodeTemplate.active = false;
        this.refreshSV();
        this.svScrollView.on('scroll-ended', this.onScollup, this);
    };

    onEnable() {
        global.Module.GameData.setMaskSound(true,null);
        cc.systemEvent.on('10001', this.reflashHelp, this);
        this.reflashHelp();
    };
    reflashHelp(){
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.state == 1 && data.taskId == 10017)
            this.helpNode[0].active = true;
        if (data.state == 1 && data.taskId == 10020)
            this.helpNode[2].active = true;
    };
    onDisable() {
        cc.systemEvent.off('10001', this.reflashHelp, this);
        global.Module.GameData.setMaskSound(false,null);
    };
    colleisShow(isShow){
        this.helpNode[2].active = false;
        this.collectionNode.active = isShow;
    };
    show() {

    };
    handbookClick() {
        global.Instance.MsgPools.send('bookInfo', {}, function (msg) {
            if (msg.errorID != 0)
                return;
            this.colleisShow(false);
            global.Manager.UIManager.open('UIHandBook02', null, function (panel) {
                if (panel != null)
                    panel.show(0);
            }.bind(this));
        }.bind(this));
    };
    refreshSV() {
        let data = global.Module.CollectData.getData();
        this.svContent.removeAllChildren();
        for (let key in data) {
            let collectData = data[key];
            let nodeInstance:any = cc.instantiate(this.nodeTemplate);
            nodeInstance.active = true;
            let collectionData = global.Manager.DBManager.findData('CollectionData', 'ID', key);
            nodeInstance.getChildByName("nameLabel").getComponent(cc.Label).string = collectionData.name;
            let count = global.Module.CollectData.getMinCount(key);
            nodeInstance.getChildByName("ProgressBar").getComponent(cc.ProgressBar).progress = (count / collectData.items.length);
            let spIcon = nodeInstance.getChildByName("spIcon")
            global.CommonClass.Functions.setTexture(spIcon,collectionData.path+collectionData.picName,null);
            nodeInstance && nodeInstance.on('touchend', function () {
                this.helpNode[0].active = false;
                global.Manager.UIManager.open('UICollectionPrize', null, function (panel) {
                    if (panel != null) {
                        panel.show(collectData);
                        this.colleisShow(false);
                    }
                }.bind(this));
            }.bind(this));
            this.svContent.addChild(nodeInstance);
        }
    };
    onScollup(event){
        let num =  Math.ceil(event.content.y);
        let num1 = num % 302;
        let num2 = Math.floor(num / 302)
        let offset = event.content.y;
        if (num1 > 185) {
            offset = (num2 + 1) * 302-12
        } else {
            offset = num2 * 302-12
        }
        let scrollView = this.svScrollView.getComponent(cc.ScrollView);
        scrollView.scrollToOffset(cc.v2(0, offset),0.5);
    };
    btnClose(evnet, arg) {
        global.Manager.UIManager.close('UICollectionNew');
    };
}
