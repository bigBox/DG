
const { ccclass, property } = cc._decorator;
@ccclass
export default class FriendItem extends cc.Component {

    @property({ type: cc.Node, displayName: "引导节点", tooltip: "提示的引导节点" })
    helpNode: cc.Node = null;
    constructor() {
        super();
    };
    static create(friendData, parent, position, callback) {
        let filePath = "prefab/component/FriendItem";
        global.CommonClass.Functions.setCreate(filePath, function (prefab) {
            if (prefab != null) {
                let newNode = cc.instantiate(prefab);
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position);
                newNode.tagEx = friendData.roleInfo.roleId;
                let itemClass = newNode.getComponent(global.CommonClass.FriendItem);
                itemClass.setData(friendData);

                if (callback)
                    callback(itemClass);
            }
        });
    };

    // use this for initialization
    onLoad() {

    };
    setData(friendData) {
        if (friendData != null) {
            var data = global.Module.TaskData.getHasAcceptTaskData();
            let roleId = friendData.roleInfo.roleId;
            let scene = cc.director.getScene();
            if (roleId == 10) {
                if (data && data.taskId == 10009 && data.state == 1)
                    if (this.helpNode && scene.name != 'PlayerScene')
                        this.helpNode.active = true;
            }
            let title = friendData.roleInfo.reputationLevel;
            if (title <= 0)
                title = 1;
            let fortune = global.Manager.DBManager.findData('ShowTableLevel', 'Id', title);

            let lblName = this.node.getChildByName('lblName');
            let lblLevel = this.node.getChildByName('lblLevel');
            let lblDecLabel = this.node.getChildByName('lblDecLabel');
            let lblFortune = this.node.getChildByName('lblFortune');
            if (lblName)
                lblName.getComponent(cc.Label).string = global.Module.MainPlayerData.getName(friendData.roleInfo.roleName);
            if (lblLevel)
                lblLevel.getComponent(cc.Label).string = friendData.roleInfo.level.toString() + '级';
            if (lblDecLabel)
                lblDecLabel.getComponent(cc.Label).string = friendData.roleInfo.signature;
            if (lblFortune)
                lblFortune.getComponent(cc.Label).string = fortune.name;

            let spFiveElem = this.node.getChildByName('spFiveElem');
            if (spFiveElem) {
                let fiveElem = friendData.roleInfo.fiveEle;
                let ID = 400010005 + fiveElem
                let iconFile = 'images/pictrue/items/' + ID.toString();
                global.CommonClass.Functions.setTexture(spFiveElem, iconFile, null);
            }
            this.showSelect(false);
            this.setMode(global.Enum.FriendMode.MODE_LEVEL);

            this.node.tagEx = friendData.roleInfo.roleId;
        }
    };
    showSelect(isShow) {
        let spHead = this.node.getChildByName('spHead');
        let spHeadSel = this.node.getChildByName('spHeadSel');

        if (spHead != null)
            spHead.active = !isShow;

        if (spHeadSel != null)
            spHeadSel.active = isShow;
    };
    setMode(mode) {

    };

    btnClick() {
        let evt = new cc.Event.EventCustom('onFriendItemClick', true);
        evt.setUserData(this.node);
        this.node.dispatchEvent(evt);
    };
    update(){
        let lblName = this.node.getChildByName('lblName');
        let lblLevel = this.node.getChildByName('lblLevel');
        let lblLevelNode = this.node.getChildByName('lblLevelNode');
        let lblMoneyNode = this.node.getChildByName('lblMoneyNode');
        let lblFortune = this.node.getChildByName('lblFortune');
        if (!lblLevelNode || !lblLevel || !lblName || !lblMoneyNode || !lblFortune)
            return;
        lblLevelNode.width = lblLevel.width + 20;
        lblLevelNode.x = lblName.x + lblName.width + 20;
        lblLevel.x = lblName.x + lblName.width + 20 + lblLevelNode.width / 2;

        lblMoneyNode.x = lblLevelNode.x + lblLevelNode.width + 20;
        lblFortune.x = lblLevelNode.x + lblLevelNode.width + 20 + lblMoneyNode.width / 2;

    }
}
