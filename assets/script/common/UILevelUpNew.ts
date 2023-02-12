

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILevelUpNew extends cc.Component {
    @property({ type: cc.Node, displayName: "ndTemplate", tooltip: "复制内容" })
    ndTemplate: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeScrollViewContent", tooltip: "滚动节点" })
    nodeScrollViewContent: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: "nodeScrollView", tooltip: "滚动框" })
    nodeScrollView: cc.ScrollView = null;
    
    @property({ type: cc.Label, displayName: "lblNewLevel", tooltip: "等级" })
    lblNewLevel: cc.Label = null;
    items: any;
    callBack: any;
    
    constructor(){
        super();
        this.items = null;
        this.callBack = null;
    };
    onLoad () {

    };

    start () {

    }
    onEnable() {
        let level = global.Module.MainPlayerData.getLevel();
        this.reflash(level);

        global.Instance.AudioEngine.replaySound('levelup', false, 1);
    };

    onDisable() {
        
    };

    reflash(level) {
        this.lblNewLevel.string = (level).toString();
        let items = global.CommonClass.Functions.getOpenItems(level);
        this.reflashItems(items);
    };
    btnMove(event,arg){
    
        let scrollWidth = this.nodeScrollView.node.width;
        let scrollContWidth = this.nodeScrollViewContent.width;
          
        if (scrollWidth > scrollContWidth)
            return;
        let posX =Math.abs(this.nodeScrollViewContent.x);
        if (arg == 1){
            posX -= 750;
        }else{
            posX += 750;
        } 
        let scrollTo = function () {
            this.nodeScrollView.scrollToOffset(cc.v2(posX, 0));
        }
        this.scheduleOnce(scrollTo,0.02);
    };

    reflashItems(items) {
        this.items = items;
        global.Instance.Log.debug('reflashItems',items);
        for (let key in this.items) {
            let name = null;
            let picPath = null;

            let item = this.items[key];

            let newNode:any = cc.instantiate(this.ndTemplate);
            newNode.active = true;
            newNode.setPosition(cc.v2(0, 0));
            this.nodeScrollViewContent.addChild(newNode);
            

            if (item.type == 1) //建筑
            {
                let factory = global.Manager.DBManager.findData('Factory', 'ID', item.ID);
                name = factory.name;
                picPath = 'images/pictrue/mainscene/factory/icons/' + factory.Icons;
            } else if (item.type == 2) //物品
            {
                let goods = global.Manager.DBManager.findData('Items', 'ID', item.ID);
                name = goods.name;
                picPath = goods.path + goods.picName;
            }

            let lblName = newNode.getChildByName('lblName').getComponent(cc.Label);
            if (name != null) {
                lblName.string = name;
            } else {
                lblName.string = "";
            }

            if (picPath != null) {
                let spItem = newNode.getChildByName('spItem');
                global.CommonClass.Functions.setTexture(spItem, picPath,null);
            }
        }
    };

    setCloseCB(callBack) {
        this.callBack = callBack;
    };

    btnClose() {

        if (this.callBack) {
            this.callBack();
        }

        global.Manager.UIManager.close('UILevelUpNew');

        // let uiTask = global.Manager.UIManager.get('UITask');
        // if (uiTask != null) {
        //     uiTask.addrefresh();
        // }
    };

    
    // update (dt) {}
}
