
const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgOver extends cc.Component {
    @property({ type: cc.Node, displayName: "content", tooltip: "结算滚动框" })
    nodeSVContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "contentC", tooltip: "结算滚动框" })
    nodeSVContentC: cc.Node = null;
    @property({ type: cc.Node, displayName: "contentA", tooltip: "结算滚动框" })
    nodeSVContentA: cc.Node = null;
    @property({ type: cc.Node, displayName: "viewNode", tooltip: "viewNode" })
    viewNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndTemplate", tooltip: "ndTemplateNode" })
    ndTemplateNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndTemplate1", tooltip: "ndTemplateNode" })
    ndTemplateNode1: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: "itemscrollView", tooltip: "itemscrollView" })
    itemscrollView: cc.ScrollView = null;
    @property({ type: cc.Label, displayName: "lblScore", tooltip: "得分" })
    lblScoreLabel: cc.Label = null;
    @property({ type: cc.SpriteFrame, displayName: "levelspriteFrame", tooltip: "得分" })
    levelspriteFrame: any = [];


    callback: any;
    rowItemCounts: number;
    itemHeight: number;
    spacingY: number;
    items: any[];
    itemDatas: any;
    myself: any;
    topMax: number;
    bottomMax: number;
    lastListY: number;
    itemArr: any[];
    data: any;

    constructor() {
        super();
        this.callback = null;
        this.itemDatas = [];//预加载的item的数据
        this.myself = null;//个人数据
        this.rowItemCounts = 0; //当前可视区域内部填充满需要的item数量
        this.items = [];//创建的item节点的数组
        this.topMax = 0; //顶部最大Y
        this.bottomMax = 0; //底部最小Y
        this.lastListY = -1;//上一次listnode的Y坐标
        this.itemHeight = 0; //itemprefab的高度
        this.spacingY = 0;

    }

    start() {

    };
    reflashItems() {
        this.items = [];
        this.itemArr = [];
        this.nodeSVContentC.removeAllChildren();
        this.nodeSVContentA.removeAllChildren();
        let itemDatas = this.itemDatas;
        let height = this.ndTemplateNode.height;
        this.itemHeight = height;
        this.rowItemCounts = Math.ceil(this.viewNode.height / (height + this.spacingY));
        if (this.myself) {
            let item = this.myself;
            item.index = Number(item.rankId - 1);
            this.setData(this.ndTemplateNode, item);
        }

        //加载rowitemCounts + 10个item 
        for (let i = 0; i < this.rowItemCounts + 6; ++i) {
            if (typeof itemDatas[i] == 'undefined')
                break
            let newNode: any = cc.instantiate(this.ndTemplateNode);
            let newNodebg: any = cc.instantiate(this.ndTemplateNode1);
            let item = this.itemDatas[i];
            item.index = Number(i);
            this.setData(newNode, item);

            newNode.__itemID = i;
            this.items.push(newNode);
            this.nodeSVContentC.addChild(newNode);
            newNode.x = 0;
            newNode.y = - (height / 2 + i * (height + this.spacingY));

            newNodebg.__itemID = i;
            this.itemArr.push(newNodebg);
            this.nodeSVContentA.addChild(newNodebg);
            newNodebg.x = 0;
            newNodebg.y = - (height / 2 + i * (height + this.spacingY));
        }
        //设置list的高度 不设置无法滑动
        this.nodeSVContent.height = 20 + (itemDatas.length) * height + (itemDatas.length) * this.spacingY;
        this.topMax = (5 * height + 4 * this.spacingY);
        this.bottomMax = -(this.viewNode.height + this.topMax);
        global.Instance.Log.debug('', this.bottomMax);
        this.lastListY = this.nodeSVContent.y;
    };
    setData(newNode, data) {
        let rankNode = newNode.getChildByName('1');
        let levelNode = newNode.getChildByName('levelLabel');
        let lblScore = newNode.getChildByName('lblScore');
        let levelLabel = levelNode.getComponent(cc.Label);
        let lblName = newNode.getChildByName('lblName').getComponent(cc.Label);
        rankNode.active = (data.index < 3);
        levelNode.active = !(data.index < 3);
        if (data.index > this.itemDatas.length) {
            levelLabel.string = '未上榜';
        } else {
            levelLabel.string = data.index + 1;
        }

        lblName.string = data.name;
        lblScore.getComponent(cc.Label).string = data.score;
        let Labelcolor = cc.color(255, 255, 255, 255);
        let LabelOutlinecolor = cc.color(50, 66, 79, 255);
        if (data.index == 0) {
            Labelcolor = cc.color(255, 188, 5, 255);
            LabelOutlinecolor = cc.color(83, 43, 0, 255);
            rankNode.getComponent(cc.Sprite).spriteFrame = this.levelspriteFrame[0]
        } else if (data.index == 1) {
            Labelcolor = cc.color(212, 209, 200, 255);
            LabelOutlinecolor = cc.color(78, 70, 61, 255);
            rankNode.getComponent(cc.Sprite).spriteFrame = this.levelspriteFrame[1]
        } else if (data.index == 2) {
            Labelcolor = cc.color(246, 127, 45, 255);
            LabelOutlinecolor = cc.color(91, 28, 10, 255);
            rankNode.getComponent(cc.Sprite).spriteFrame = this.levelspriteFrame[2]
        }

        lblScore.color = Labelcolor;
        lblScore.getComponent(cc.LabelOutline).color = LabelOutlinecolor;



    };
    show(data, callback) {
        this.callback = callback;
        this.data = data;
        this.lblScoreLabel.string = '得分: ' + data.totalScore;
        this.itemscrollView.scrollToOffset(cc.v2(0, 0));
        this.itemDatas = data.ranks;
        this.myself = data.myself
        this.reflashItems();
    };
    btnCloseOver() {
        if (this.callback)
            this.callback();
        global.Manager.UIManager.close('DlgOver');
    };

    update() {
        //判断是否往下滑动
        let isDown = this.nodeSVContent.y > this.lastListY;
        if (this.lastListY == -1)
            return;
        let countOfItems = this.items.length;
        let dataLen = this.itemDatas.length;
        for (let i in this.items) {
            let newNode = this.items[i];
            let itemPos = this.nodeSVContentC.convertToWorldSpaceAR(newNode.position);
            itemPos.y -= this.viewNode.height / 2;
            itemPos = this.viewNode.convertToNodeSpaceAR(itemPos);

            let newNode1 = this.itemArr[i];

            if (isDown) {
                if (itemPos.y > this.topMax) {
                    let newId = newNode.__itemID + countOfItems;
                    if (newId >= dataLen) return;
                    newNode.__itemID = newId;
                    newNode.y = newNode.y - countOfItems * this.itemHeight - (countOfItems) * this.spacingY;
                    let item = this.itemDatas[newNode.__itemID];
                    item.index = parseInt(newNode.__itemID);
                    this.setData(newNode, item);
                    newNode1.__itemID = newNode.__itemID;
                    newNode1.y = newNode.y;
                    newNode1.index = newNode.index;
                }
            } else {
                if (itemPos.y < this.bottomMax) {
                    let newId = newNode.__itemID - countOfItems;
                    if (newId < 0) return;
                    newNode.__itemID = newId;
                    newNode.y = newNode.y + countOfItems * this.itemHeight + (countOfItems) * this.spacingY;
                    let item = this.itemDatas[newNode.__itemID];
                    item.index = parseInt(newNode.__itemID);
                    this.setData(newNode, item);

                    newNode1.__itemID = newNode.__itemID;
                    newNode1.y = newNode.y;
                    newNode1.index = newNode.index;
                }
            }
        }
        //存储下当前listnode的Y坐标 
        this.lastListY = this.nodeSVContent.y
    };
}
