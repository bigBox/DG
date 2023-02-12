
const {ccclass, property} = cc._decorator;
@ccclass
export default class UICollectionPrize extends cc.Component {
    @property({ type: cc.ProgressBar, displayName: "ProgressBar", tooltip: "进度条" })
    ratePro: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "numLabel", tooltip: "百分比" })
    ProLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "numLabel2", tooltip: "左比例" })
    LeftRatioLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "numLabel3", tooltip: "右比例" })
    RightRatioLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "titleLabel", tooltip: "名字" })
    titleLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "rareNode", tooltip: "稀有宝物标头" })
    rareNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "rarenameLabel", tooltip: "稀有宝物数量" })
    rarenameLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "rarelistNode", tooltip: "稀有列表" })
    rarelistNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "plainNode", tooltip: "普通宝物标头" })
    plainNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "plainnameLabel", tooltip: "普通宝物数量" })
    plainnameLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "plainlistNode", tooltip: "普通列表" })
    plainlistNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "baseMap1", tooltip: "稀有宝物item" })
    baseMap1: cc.Node = null;
    @property({ type: cc.Node, displayName: "baseMap2", tooltip: "普通宝物item" })
    baseMap2: cc.Node = null;
    @property({ type: cc.Node, displayName: "mineNode", tooltip: "兑换界面，进入自己的显示" })
    mineNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "friendNode", tooltip: "偷给界面，进入好友的显示" })
    friendNode: cc.Node = null;

    data: any;//宝物数据
    element: any;//选中宝物数据

    constructor() {
        super();
        this.data = null;
        this.element = null;
    };
    onLoad() {
       
        this.reflashHelp();
    };
    reflashHelp(){
        //箭头 helpNode 套装
        var data = global.Module.TaskData.getHasAcceptTaskData();
        let helpNode = this.node.getChildByName('HelpNode');
        if (!data || !helpNode)
            return;
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        if (data.state == 1 && (data.taskId == 10017))
            if (helpNode.getChildByName('helpNode') && (roleInfo == null))
                helpNode.getChildByName('helpNode').active = true;
    };
    start () {
    };
    show(data) {
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        this.friendNode.active = false;
        this.mineNode.active = true;
        this.data = data;
        let colleData = global.Manager.DBManager.findData('CollectionData', 'ID', data.id);
        this.titleLabel.string = colleData.name;
        let count = global.Module.CollectData.getMinCount(data.id);
        this.ratePro.progress = (count / data.items.length);
        this.ProLabel.string =Math.floor(this.ratePro.progress*100) +'%';
        this.LeftRatioLabel.string = count;
        this.RightRatioLabel.string = '/'+ data.items.length;
        let rareNum = 0;
        let plainNum = 0;
        let i = 0;
        let self = this;
        let callBack = function () {
            const element = data.items[i];
            let itemDBData = global.Manager.DBManager.getItemNew(element.id);
           
            if (itemDBData.isRare == 2) {
                rareNum++;
            } else {
                plainNum++;
            }
            self.createNode(itemDBData,element);
            i++;
            if (i == data.items.length) {
                self.rareNode.active = rareNum > 0 ? true : false;
                self.plainNode.active = plainNum > 0 ? true : false;
                // if (rareNum > 0)
                //     self.rarenameLabel.string = '宝物（残破）- ' + rareNum + '个'
                // if (plainNum > 0)
                //     self.plainnameLabel.string = '普通宝物（残破）- ' + plainNum + '个'

            } else {
                callBack();
            }
        }
        callBack();
    };
    createNode (itemDBData,element){
        let newNode = null;
        if (itemDBData.isRare == 2)
            newNode = cc.instantiate(this.baseMap1);
        else
            newNode = cc.instantiate(this.baseMap2);
        newNode.active = true;
        let spItem = newNode.getChildByName('spItem')
        global.CommonClass.Functions.setItemTexture(spItem, element.id, function (image) {
            spItem.scale = global.CommonClass.Functions.getToscale(spItem,132,135);
        }.bind(this));
        newNode.getChildByName('numLabel').getComponent(cc.Label).string = element.count;
        newNode.element = element;
        newNode && newNode.on('touchstart', this.onFriendClick.bind(this));
        if (itemDBData.isRare == 2) {
            this.rarelistNode.addChild(newNode);
        } else {
            this.plainlistNode.addChild(newNode);
        }
    };
    onFriendClick(event) {
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        if (roleInfo == null)
            return;
        this.element = event.target.element;
        this.showFriend();
    };
   
    showFriend(){
        this.friendNode.active = true;
        let data= global.Module.PackageData.getItem(this.element.id);
        let baseMap = this.friendNode.getChildByName('baseMap');
        let spItem = this.friendNode.getChildByName('spItem');
        let countLabel1 = this.friendNode.getChildByName('numLabel1').getComponent(cc.Label);
        let countLabel2 = this.friendNode.getChildByName('numLabel2').getComponent(cc.Label);
        global.CommonClass.Functions.setItemTexture(spItem, this.element.id,  function (image) {
            spItem.scale = global.CommonClass.Functions.getToscale(spItem,132,135); 
        }.bind(this));
        countLabel1.string = '好友拥有X' + this.element.count;
        countLabel2.string = '自己拥有X' + data.Count;
        let botton1 =this.friendNode.getChildByName('botton1');
        let botton2 =this.friendNode.getChildByName('botton2');
        let botton3 =this.friendNode.getChildByName('botton3');
        let botton4 =this.friendNode.getChildByName('botton4');
        let Label1 =this.friendNode.getChildByName('Label1');
        let Label2 =this.friendNode.getChildByName('Label2');
        let Label3 =this.friendNode.getChildByName('Label3');
        let Label4 =this.friendNode.getChildByName('Label4');
        botton1.active = (this.element.count!=0);
        Label1.active = (this.element.count!=0);
        botton3.active = (this.element.count==0);
        Label3.active = (this.element.count==0);

        botton2.active = (data.Count!=0);
        Label2.active = (data.Count!=0);
        botton4.active = (data.Count==0);
        Label4.active = (data.Count==0);
        
    };
    showResult(){
        let data = global.Module.CollectData.getDataID(this.data.id);
        this.data = data;
        let count = global.Module.CollectData.getMinCount(data.id);
        this.ratePro.progress = (count / data.items.length);
        this.ProLabel.string = this.ratePro.progress*100+'%';
        this.LeftRatioLabel.string = count;
        this.RightRatioLabel.string = '/'+ data.items.length;
        let rareNum = 0;
        let plainNum = 0;
        for (let i = 0; i < data.items.length; i++) {
            const element = data.items[i];
            let itemDBData = global.Manager.DBManager.getItemNew(element.id);
            let newNode = null;
            if (itemDBData.isRare == 2) {
                newNode = this.rarelistNode.children[rareNum];
                rareNum++;
            } else {
                newNode = this.plainlistNode.children[plainNum];
                plainNum++;
            }
            newNode.active = true;
            newNode.element = element;
            if (this.element)
                if (this.element.id == element.id) {
                    this.element = element;
                    this.showFriend();
                }
            let spItem = newNode.getChildByName('spItem')
            global.CommonClass.Functions.setItemTexture(spItem, element.id,null);
            newNode.getChildByName('numLabel').getComponent(cc.Label).string = element.count;
        }
    };
    //套装 兑换
    onClickGetReward(event) {
        let id = this.data.id;
        let count = global.Module.CollectData.getMinCount(id);
        if (count < this.data.items.length) {
            return;
        }
        //套装任务安全保护
        if (global.Module.TaskData.taskguard(10017))
            return;
        let helpNode = this.node.getChildByName('HelpNode');
        if (helpNode.getChildByName('helpNode'))
            helpNode.getChildByName('helpNode').active = false;
        let roleId = global.Module.MainPlayerData.getRoleID();
        global.Instance.MsgPools.send('collectionReward', { id: id }, function (msg) {
            if (msg.errorID == 0) {
                global.Instance.MsgPools.send('collectionList', { type: this.type ,roleId:roleId },null);
            }
        }.bind(this));

    };
    // 取
    onClickGet() {
        let otherInfo = global.Module.PlayerMapData.getRoleInfo();
        let data = { roleId: otherInfo.roleId, ItemId: this.element.id, Count: -1, ps: "#01" };
        global.Instance.MsgPools.send('itemInteract', data, function (msg) {
            global.Instance.Log.debug('onClickGet', msg);
            if (!msg.errorID) {
                global.Instance.MsgPools.send('collectionList', { type: this.type ,roleId: otherInfo.roleId },null);
            }
        }.bind(this));
    };
    // 送
    onClickSend() {
        let roleId = global.Module.MainPlayerData.getRoleID();
        let otherInfo = global.Module.PlayerMapData.getRoleInfo();
        let data = { roleId: otherInfo.roleId, ItemId: this.element.id, Count: 1 };
        global.Instance.MsgPools.send('itemInteract', data, function (msg) {
            global.Instance.Log.debug('onClickSend', msg);
            if (!msg.errorID) {
                global.Instance.MsgPools.send('collectionList', { type: this.type ,roleId: otherInfo.roleId },null);
            }
        }.bind(this));
    };
    btnClose(evnet, arg) {
        let panel = global.Manager.UIManager.get("UICollectionNew");
        if (panel)
            panel.colleisShow(true);
        global.Manager.UIManager.close('UICollectionPrize');
    };
}
