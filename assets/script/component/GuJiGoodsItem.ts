
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuJiGoodsItem extends cc.Component {
    @property({ type: cc.Prefab, displayName: "GuJiNode", tooltip: "GuJiNode" })
    GuJiNode: cc.Prefab=null;
    itemType: number;
    item: any;
    isAnimation: any;
    static create(itemData, parent, position, callback) {
        let filePath = "prefab/component/GuJiGoodsItem";
        cc.loader.loadRes(filePath, function (err, newGood) {
            if (err == null) {
                let newNode = cc.instantiate(newGood);
                let itemClass = newNode.getComponent(global.CommonClass.GuJiGoodsItem);
                newNode.setPosition(position);

                itemClass.setItem(itemData);
                parent.addChild(newNode);

                if (callback)
                    callback(newNode);
            }
        })
    };

    constructor() {
        super();
        this.itemType = 0;
        this.item = null;
        this.isAnimation = false;
    };
    getImage(item,ID) {
        let itemType = item.type;
        let path = 'images/plist/tomB/common/';
        let rand = 1;
     
        if (itemType == 0) {      //挖去地貌表皮，漏出宝物
            return '';
        } else if (itemType == 1) {    //树林
            // flow.active = true
            if (ID == 2)
                rand = Math.floor(Math.random() * 4) + 1;
            else
                rand = Math.floor(Math.random() * 5) + 1;
            return path + 'tree' + rand.toString();
        }else if(itemType == -2){//拾取宝物 水挖过
            return '';
        }else{
            if (ID == 1) {
                path = 'images/plist/tomB/saiwai/';
                if (itemType == 2) {       //草从
                    rand = Math.floor(Math.random() * 3) + 1;
                    return path + 'grass' + rand.toString();
                }
                else if (itemType == 3) {//石头
                    rand = Math.floor(Math.random() * 5) + 1;
                    return path + 'stone' + rand.toString();
                }
                else if (itemType == 4) {//水草
                    rand = Math.floor(Math.random() * 4) + 1;
                    return path + 'water' + rand.toString();
                } else {
                    return '';
                }
            } else if (ID == 2) {
                path = 'images/plist/tomB/saiwai/';
                if (itemType == 2) {       //草从
                    rand = Math.floor(Math.random() * 2) + 1;
                    return path + 'grass' + rand.toString();
                }
                else if (itemType == 3) {//石头
                    path = 'images/plist/tomB/chama/';
                    rand = Math.floor(Math.random() * 4) + 1;
                    return path + 'stone' + rand.toString();
                }
                else if (itemType == 4) {//水草
                    rand = Math.floor(Math.random() * 3) + 1;
                    return path + 'water' + rand.toString();
                } else if (itemType == 5) {//废墟
                    path = 'images/plist/tomB/chama/';
                    rand = Math.floor(Math.random() * 6) + 1;
                    return path + 'ruins' + rand.toString();
                }
                else {
                    return '';
                }
            } else if (ID == 3) {
                path = 'images/plist/tomB/xixia/';
                if (itemType == 2) {       //草从
                    rand = Math.floor(Math.random() * 4) + 1;
                    return path + 'grass' + rand.toString();
                }
                else if (itemType == 3) {//石头
                    rand = Math.floor(Math.random() * 4) + 1;
                    return path + 'stone' + rand.toString();
                }
                else if (itemType == 4) {//水草
                    path = 'images/plist/tomB/saiwai/';
                    rand = Math.floor(Math.random() * 3) + 1;
                    return path + 'water' + rand.toString();
                } else if (itemType == 5) {//废墟
                    rand = Math.floor(Math.random() * 4) + 1;
                    return path + 'ruins' + rand.toString();
                }
                else {
                    return '';
                }
            } else if (ID == 4) {
                path = 'images/plist/tomB/loulan/';
                if (itemType == 2) {       //草从
                    rand = Math.floor(Math.random() * 6) + 1;
                    return path + 'grass' + rand.toString();
                }
                else if (itemType == 3) {//石头
                    rand = Math.floor(Math.random() * 9) + 1;
                    return path + 'stone' + rand.toString();
                }
                else if (itemType == 4) {//水草
                    path = 'images/plist/tomB/saiwai/';
                    rand = Math.floor(Math.random() * 3) + 1;
                    return path + 'water' + rand.toString();
                } else if (itemType == 5) {//废墟
                    rand = Math.floor(Math.random() * 5) + 1;
                    return path + 'ruins' + rand.toString();
                }
                else {
                    return '';
                }
            }
        }
        
    };

    getItemType() {
        return this.itemType;
    };

    getItem() {
        return this.item;
    };

    setItem(item) {
        this.itemType = 0;
        this.item = null;
        if (item == null)
            return;
        this.node.active = true;
        let proxy = global.Proxys.ProxyGuJi;

        this.itemType = item.type;
        this.item = item;

        let itemType = item.type;
        let isOpen = item.isOpen;

        let ndItem = this.node.getChildByName('ndItem');
        let spGoods = ndItem.getChildByName('spGoods');
        let spMask = ndItem.getChildByName('spMask');
        let ndParticle = ndItem.getChildByName('ndParticle');
        let spSel = ndItem.getChildByName('spSel');
       
        spSel.active = false;
        spGoods.active = isOpen && !proxy.getIsWarter(item);
        spMask.active = !isOpen;
        ndParticle.active = false;
        let onDragEvent = this.node.getChildByName("onDragEvent")
        let data = global.Manager.DBManager.findData('RobFunc', 'ID', itemType);
        if (data != null&&onDragEvent) {
            onDragEvent.y = data.positionY
        }
        let contentData = global.Proxys.ProxyGuJi.getContentData();
        let ID =contentData.ID
        let image = this.getImage(item,ID);
        spGoods.scale = 1
        if (image.length > 0) {
            
            global.CommonClass.Functions.setTexture(spGoods, image, function (event) {
                if(event){
                    if (event.width > 300)
                        spGoods.scale = 130 / event.width
                }
            });
        } else {
            global.CommonClass.Functions.setTexture(spGoods, '', null);
            spGoods.active = false
        }
        let RobInitdata = global.Manager.DBManager.findData('RobInit', 'ID', (item.idx + contentData.RobID));
        if (RobInitdata.type == 100) {//拾取宝物 水挖过 
            let rand = Math.floor(Math.random() * 5);
            if (rand == 1 && !(ndItem.getChildByName('GuJiNode'))) {
                let newNode = cc.instantiate(this.GuJiNode);
                ndItem.addChild(newNode, cc.macro.MAX_ZINDEX);
            }
        }

    };
    setlabel(x,y){
        this.node.getChildByName('lblGoods').getComponent(cc.Label).string = +x +','+y
    };
    setIsAnimation(isShow) {
        this.node.scale = 0;
        this.isAnimation = isShow;
    };


    showSelect(isShow) {
        let ndItem = this.node.getChildByName('ndItem');
        let spSel = ndItem.getChildByName('spSel');
        spSel.active = isShow;
        if (isShow == true) {
            let scaleTo1 = cc.scaleTo(0.5, 1.1);
            let scaleTo2 = cc.scaleTo(0.5, 1.0);
            let seq = cc.sequence(scaleTo1, scaleTo2);
            let rep = cc.repeatForever(seq);
            spSel.runAction(rep);
        } else {
            spSel.scale = 1.0;
            spSel.stopAllActions();
        }
    };

    openItem(isRunAction) {
        let ndItem = this.node.getChildByName('ndItem');
        let spGoods = ndItem.getChildByName('spGoods');
        let spMask = ndItem.getChildByName('spMask');
        let ndParticle = ndItem.getChildByName('ndParticle');

        spGoods.active = this.itemType != 11 && this.itemType != 21;
        ndParticle.active = true;
        spMask.active = false;

        if (isRunAction) {
            let animation = spGoods.getComponent(cc.Animation);
            animation.stop();

            let animState = animation.play("mapObjUp");
            animState.wrapMode = cc.WrapMode.Normal;
        }
    };

    closeItem() {
        let ndItem = this.node.getChildByName('ndItem');

        let spMask = ndItem.getChildByName('spMask');
        let spGoods = ndItem.getChildByName('spGoods');
        let ndParticle = ndItem.getChildByName('ndParticle');

        spMask.active = true;
        spGoods.active = false;
        ndParticle.active = false;
    };
    isPicked(worldPoint) {
        let onDragEvent = this.node.getChildByName('onDragEvent');
        // let spMask = ndItem.getChildByName('spMask');

        if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(worldPoint, onDragEvent, 1, 1)) {
            return true;
        }
        return false;
    };

    update(){
        if (this.isAnimation == false) {
            let isAnimation = global.Proxys.ProxyGuJi.getIsAnimation();
            if (isAnimation == true) {
                this.isAnimation = true;
               
                let animation = this.node.getComponent(cc.Animation);
                animation.stop();
                animation.play('mapObjUp');
            }
        }
        if(global.Proxys.ProxyGuJi.getGuJI()){
            this.node.active = false;
            global.Proxys.ProxyGuJi.put(this.node);
        }
    };

}
