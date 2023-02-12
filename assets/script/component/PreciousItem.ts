
const { ccclass, property } = cc._decorator;

@ccclass
export default class PreciousItem extends cc.Component {
    static className: string = 'PreciousItem';
    @property({ type: cc.Node, displayName: "spBlue", tooltip: "蓝框" })
    spBlue: cc.Node = null;
    @property({ type: cc.Node, displayName: "spRed", tooltip: "红框" })
    spRed: cc.Node = null;
    @property({ type: cc.Node, displayName: "check", tooltip: "检测" })
    check: cc.Node = null;
    
    @property({ type: cc.Node, displayName: "spItem", tooltip: "宝物" })
    spItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "spHorNode", tooltip: "左右板子" })
    spHorNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "spVerNode", tooltip: "上下板子" })
    spVerNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "goldLabel", tooltip: "价格" })
    goldLabel: cc.Label = null;
    item: any;
    isShowButtom: boolean;
    blockvalue: number;
    halfBlockValue: number;

    constructor() {
        super();
        this.item = null;
        this.isShowButtom = true;
        this.blockvalue = 25;//方块数值大小
        this.halfBlockValue = 12.5;//方块数值的一半
    };
    goldsion(gold) {
        var goldLabel
        var goldlog;
        if (gold < 10000) {
            goldLabel = gold
        } else if (gold < 100000000) {
            goldlog = Math.round(gold / 10000);
            goldLabel = goldlog + "万";//万 W
        } else if (gold > 100000000000) {
            goldlog = Math.round(gold / 100000000);
            goldLabel = goldlog + "亿";//亿 Y
        } else if (gold > 1000000000000) {
            goldlog = Math.round(gold / 100000000000);
            goldLabel = goldlog + "兆";//兆 Z
        }
        return goldLabel;
    };

    setItem(item, callback) {
        this.item = item;
        var istype = false;
        if (item.templateID == '500021005') {
            istype = true;
        }
     
        let itemData = global.Manager.DBManager.getItemNew(item.templateID);
        let iconFile = "images/pictrue/items/default";
        let preciousData = global.Manager.DBManager.findData('THandBook', 'ID', item.templateID);
        //设置坐标
        let positon = cc.v2(0, 0);
        let positon1 = cc.v2(0, 0);
        let positon2 = cc.v2(0, 0);
        if (preciousData != null) {
            iconFile = preciousData.path + item.templateID;
            this.spItem.scale = preciousData.scale1;
          
            if (item.templateID == 500020001) {
                positon = cc.v2(0, 2);
                positon1 = cc.v2(0, -20);
                positon2 = cc.v2(0, -10);
                this.node.setPosition(positon);
            }
            if(preciousData.name.indexOf("木板") == -1&&preciousData.name.indexOf("纤绳") == -1){
                positon =  cc.v2(0, 0);
                positon1 = cc.v2(0, 0);
                positon2 = cc.v2(0, 0);
                // cc.log(item.templateID,'---------',preciousData)
                // cc.log('adjustUp',preciousData.adjustUp)
                // -20
                positon.y = preciousData.adjustRight-20
                // positon.x = 0
                // *preciousData.scale1
            }
            this.check.setPosition(positon2);
            this.spRed.setPosition(positon);
            this.spBlue.setPosition(positon);
            this.spItem.setPosition(positon);
            this.spHorNode.setPosition(positon1);
            this.spVerNode.setPosition(positon);

        }

        var doorW = 0;
        var doorH = 0;
        if (item.direction == 0) {
            doorW = 20;
            doorH = this.blockvalue * item.num;
        } else if (item.direction == 1) {
            doorW = preciousData.doorW;
            doorH = preciousData.doorH;
            if (item.num != 1) {
                doorW = this.blockvalue * item.num;
                doorH = 30;
            }
        }
        // this.check.active = true
        this.spItem.active = item.num == 1 ? true : false;
        this.spVerNode.active = (item.num != 1 && item.direction == 0) ? true : false;
        this.spHorNode.active = (item.num != 1 && item.direction == 1) ? true : false;
        let self = this;
        if (item.num == 1) {
            global.CommonClass.Functions.setTexture(this.spItem, iconFile, function (spImage) {
                if (spImage == null)
                    return;
                let boxSize = cc.size(doorW, preciousData.doorH);
                let boxSize1 = cc.size(doorW, preciousData.doorH);
                self.node.setContentSize(boxSize);
                self.spBlue.setContentSize(boxSize);
                self.spRed.setContentSize(boxSize);
                self.check.setContentSize(boxSize1);
                if (callback)
                    callback(self.node);
            });
        }else if(item.direction == 1){
            iconFile = "images/pictrue/items/500020101";
            global.CommonClass.Functions.setTexture(this.spHorNode, iconFile, function (spImage) {
                if (spImage == null)
                    return;
                
                let positon1 = cc.v2(0, -20);
                self.spHorNode.setPosition(positon1);
                let size1 = cc.size(self.blockvalue * item.num,42);
                let size2 = cc.size(self.blockvalue * item.num+35,42);
                self.node.setContentSize(size1);
                self.spHorNode.setContentSize(size2);
                let boxSize = cc.size(doorW, 25);
                let boxSize1 = cc.size(doorW, 10);
                self.spBlue.setContentSize(boxSize);
                self.spRed.setContentSize(boxSize);
                self.check.setContentSize(boxSize1);
                if (callback)
                    callback(self.node);
            });
        } else {
            for (let i = 0; i < this.spVerNode.children.length; i++)
                this.spVerNode.children[i].active = false
            var spNode = this.spVerNode;
            for (let i = 0; i < item.num; i++) {
                if (item.direction == 0) {
                    iconFile = "images/pictrue/items/500021004";
                    if (istype == true) {
                        iconFile = "images/pictrue/items/500021005";
                    }
                }
                let itemNode = spNode.children[i];
                if (!itemNode) {
                    itemNode = cc.instantiate(this.spItem);
                    itemNode.active = false;
                    spNode.addChild(itemNode);
                }
                itemNode.active = true;
                global.CommonClass.Functions.setTexture(itemNode, iconFile, function (spImage) {
                    if (spImage == null)
                        return;
                });
                if (i == item.num - 1) {
                    let size = spNode.getContentSize();
                    self.node.setContentSize(size);
                    let boxSize = cc.size(doorW, doorH);
                    self.spBlue.setContentSize(boxSize);
                    self.spRed.setContentSize(boxSize);
                    self.check.setContentSize(boxSize);
                    if (callback)
                    callback(this.node);
                }
            }
        }

        self.showSuitFlag(null, null);
        self.showCanPut(0);
        self.showValue();
    };
    goldNum(isShow) {
        let itemData = global.Manager.DBManager.getItemNew(this.item.templateID);
        this.node.getChildByName('gold').active = isShow;
        this.node.getChildByName('gold').setPosition(0, -0);
        if(isShow){
            if (this.goldLabel)
                this.goldLabel.string = this.goldsion(itemData.gold);
        }
       
    };
    setPicAss(item) {

    };

    getItem() {
        return this.item;
    };

    setWithPutOnAction(item, callback) {
        this.setItem(item, callback);
    };

    showSuitFlag(color, isPlayAnimation) {        //null 表示隐藏
        if (color != null) {
            if (isPlayAnimation) {
                let animation = this.node.getComponent(cc.Animation);

                let animState = animation.getAnimationState('fadeInOut');
                if (!animState.isPlaying) {
                    animation.play('fadeInOut');

                    animState.wrapMode = cc.WrapMode.Loop;
                    animState.repeatCount = 2;
                }
            }
        }
    };
    showCanPut(mode) {     //0.都不显示 1.可以放置 2.不可以放置
        this.spBlue.active = mode == 1;
        this.spRed.active = mode == 2;
    };
    showValue() {

    };
    showButtom(isShow) {
        this.isShowButtom = isShow;
    };

    showInfo(isShow) {

    };

    playPutAction(isPut, callback) {

    };

    playMoneyFly(callback) {
        let spMoneyFly = this.node.getChildByName('spMoneyFly');
        let curPos = spMoneyFly.getPosition();
        curPos.y += 100;

        global.CommonClass.ItemDrop.createAndDrop2(1, 0, curPos, this.node, null, null, callback);

    };

}
