import MakeGoods from "../factorys/MakeGoods";
import TaskBuild from "../factorys/TaskBuild";
import Union from "../factorys/Union";
import WorldMapEnter from "../factorys/WorldMapEnter";
import Demon from "../mainscene/Demon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Functions extends cc.Component {
    static sceneName: string;
    
    constructor() {
        super();
        Functions.sceneName = '';
    };
    static getRoot() {
        return cc.director.getScene().getChildByName('Canvas');
    };
    static getSceneName(){
       return this.sceneName;
    }

    static loadScene(sceneName, callBack) {
        global.Manager.UITipManager.clearTips();
        global.Manager.UICoinManager.clearCoins();

        global.Module.GameData.setDropInstance(null);
        global.Manager.UIManager.clear();
        if(sceneName == 'MainScene'){
            global.Module.PlayerMapData.setRoleInfo(null);
        }
        if (!(this.sceneName == 'LoginScene' && sceneName == 'MainScene') && (sceneName != 'GuJiScene')) {
            let panel = global.Manager.UIManager.getPersistUI('UIProgress');
            if (panel != null) {
                panel.show(true);
               
                if (sceneName == 'LoginScene')
                    panel.setMode(true, 1, null);
                panel.setProgress(0.88, 2);
            }
        }
        if (this.sceneName == 'WorldMapScene' && (sceneName != 'GuJiScene') && (sceneName != 'WorldMapScene')) {
            global.Proxys.ProxyGuJi.releasePicture();
        }
        let callBackFun = function () {
            let clickAnim = global.Manager.UIManager.getResident('clickAnim');
            if (sceneName != 'MainScene') {
                setTimeout(() => {
                    if (clickAnim)
                        clickAnim.reflashEntry();
                }, 500);
            }
            if (clickAnim)
                clickAnim.reflashPosEntry();
            if (callBack)
                callBack();
        }
        global.Instance.AudioEngine.stopAll();

        this.sceneName = sceneName
        cc.director.loadScene(sceneName, callBackFun);

        let data = global.Manager.DBManager.findData('SceneMusic', 'name', sceneName);
        global.Instance.Log.debug('loadScene', sceneName)
        if (data != null)
            global.Instance.AudioEngine.playMusic(data.backMusic, true, data.volume);
    };

    static changeScene(sceneName) {
        let scene = cc.director.getScene();

        if (scene.name != sceneName)
            Functions.loadScene(sceneName, null);
    };
    static getChildTagEx(node, tagEx) {
        for (let i = 0; i < node.children.length; i++) {
            let itemNode = node.children[i];
            if (itemNode.tagEx == tagEx) {
                return itemNode;
            }
        }

    };
    hasKeyOfMap(curMap, key) {
        var hasItem = false;
        curMap.forEach(function (item, k, mapObj) {
            if (k == key) {
                hasItem = true;
                return;
            }
        })

        return hasItem;
    };

    static splitNumbers(strNumbers, space) {
        if (strNumbers.length <= 0)
            return [];

        let numbers = strNumbers.split(space);
        let items = [];

        for (let key in numbers) {
            let value = parseInt(numbers[key]);
            items.push(value);
        }

        return items;
    };

    composeNumbers(numbers, space) {
        let res = '';
        let count = numbers.length;
        for (let i = 0; i < count; ++i) {
            let value = numbers[i];
            res += value.toString();

            if (i != count - 1) {
                res += space;
            }
        }
        return res;
    };
    /**
        * 根据图片路径加载预制体节点
        * @param {节点*} spSprite 
        * @param {图片路径*} picPath 
        * @param { 返回*} callBack 
        * @returns 
        */
    static setCreate(filePath, callBack) {
        
        if (filePath.length == 0) {
            return false;
        }
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
               
                cc.loader.setAutoReleaseRecursively(prefab, true);//销毁场景销毁资源
                if (callBack)//加载成功返回该节点
                    callBack(prefab);
            } else {
                global.Instance.Log.debug("setCreate error", err);
                if (callBack)//加载失败返回null
                    callBack(null);
            }
        });

        return false;
    };
    createMask(parent) {
        let filePath = "prefab/common/MaskPanel";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);
            }
        });
    };
    /**
     * 传入ID获得物品总表图片路径
     * @param {*} itemID 
     * @returns 
     */
    static getItemPicPathNew(itemID: number) {
        let item = global.Manager.DBManager.getItemNew(itemID);
        if (item != null)
            return item.path + item.picName;
        return "images/pictrue/items/700000017";//通用碎片路径
    };
    /**
     * 根据图片路径加载图片到节点并返回成功失败
     * @param {节点*} spSprite 
     * @param {图片路径*} picPath 
     * @param { 返回*} callBack 
     * @returns 
     */
    static setTexture(spSprite, picPath, callBack) {
        if (spSprite == null)//节点不存在返回失败
            return false;
        if (picPath.length == 0) {//图片路径不存在返回失败，并清空节点图片
            let spComponent = spSprite.getComponent(cc.Sprite);
            spComponent.spriteFrame = null;
            return false;
        }
        cc.loader.loadRes(picPath, cc.SpriteFrame, function (err, spriteFrame) {
            if (err == null) {
               
                if (spSprite != null) {
                    let spComponent = spSprite.getComponent(cc.Sprite);
                    if (spComponent) {
                        spComponent.spriteFrame = spriteFrame;
                    }
                }
                cc.loader.setAutoReleaseRecursively(spriteFrame, true);//销毁场景销毁资源
                if (callBack)//加载成功返回该节点
                    callBack(spSprite);
            } else {
                global.Instance.Log.debug("setTexture error", err);
                if (callBack)//加载失败返回null
                    callBack(null);
            }
        });

        return false;
    };
    static setTexture1(spSprite, picPath, callBack) {
        if (spSprite == null)//节点不存在返回失败
            return false;
        if (picPath.length == 0) {//图片路径不存在返回失败，并清空节点图片
            let spComponent = spSprite.getComponent(cc.Sprite);
            spComponent.spriteFrame = null;
            return false;
        }
        cc.loader.loadRes(picPath, cc.SpriteFrame, function (err, spriteFrame) {
            if (err == null) {
               
                if (spSprite != null) {
                    let spComponent = spSprite.getComponent(cc.Sprite);
                    if (spComponent) {
                        spComponent.spriteFrame = spriteFrame;
                    }
                }
               
                if (callBack)//加载成功返回该节点
                    callBack(spSprite);
            } else {
                global.Instance.Log.debug("setTexture error", err);
                if (callBack)//加载失败返回null
                    callBack(null);
            }
        });

        return false;
    };
    static setTextureNew(spSprite, picPath, callBack) {
        if (spSprite == null)//节点不存在返回失败
            return false;
        if (picPath.length == 0) {//图片路径不存在返回失败，并清空节点图片
            let spComponent = spSprite.getComponent(cc.Sprite);
            spComponent.spriteFrame = null;
            return false;
        }
        cc.loader.loadRes(picPath, cc.SpriteFrame, function (err, spriteFrame) {
            if (err == null) {
                if (spSprite != null) {
                    let spComponent = spSprite.getComponent(cc.Sprite);
                    if (spComponent) {
                        spComponent.spriteFrame = spriteFrame;
                    }
                }
                if (callBack)//加载成功返回该节点
                    callBack(spSprite);
            } else {
                global.Instance.Log.debug("setTexture error", err);
                if (callBack)//加载失败返回null
                    callBack(null);
            }
        });

        return false;
    };

    static setItemTexture(spItem: any, itemID: any, callback: any) {
        let path = this.getItemPicPathNew(itemID);
        Functions.setTexture(spItem, path, callback);
    };
    //图片材质去色
    static grayTexture(spSprite, isGray) {
        if (spSprite != null) {
            if (isGray)
                global.CommonClass.MaterialUtils.useMaterial(spSprite, global.CommonClass.MaterialUtils.MAT.GRAY, null);
            else
                global.CommonClass.MaterialUtils.useMaterial(spSprite, global.CommonClass.MaterialUtils.MAT.DEFAULT, null);
        }
    };

    setAtlas(spSprite, atlasPath, atlasName, callBack) {
        cc.loader.loadRes(atlasPath, cc.SpriteAtlas, function (err, atlas) {
            if (err == null) {
                var frame = atlas.getSpriteFrame(atlasName);
                var sprite = spSprite.getComponent(cc.Sprite);
                sprite.spriteFrame = frame;
                if (callBack)
                    callBack();
            }
            else {
            }
        });

        return false;
    };

    static formatSeconds(value) {
        var theTime = parseInt(value);// 秒 
        var theTime1 = 0;// 分 
        var theTime2 = 0;// 小时 

        if (theTime > 60) {
            theTime1 = parseInt((theTime / 60).toString());
            theTime = parseInt((theTime % 60).toString());

            if (theTime1 > 60) {
                theTime2 = Math.floor(theTime1 / 60);
                theTime1 = Math.floor(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime.toString()) + "秒";
        if (theTime1 > 0)
            result = "" + parseInt(theTime1.toString()) + "分" + result;
        if (theTime2 > 0)
            result = "" + parseInt(theTime2.toString()) + "小时" + result;

        return result;
    };
    static formatSeconds2(value) {
        let result = '';
        let theTime = parseInt(value);         // 秒 
        let theTime1 = Math.floor(theTime / 3600);  //时

        if (theTime1 > 0) {
            let theTime2 = Math.floor((theTime % 3600) / 60);
            result += theTime1.toString() + '时' + theTime2.toString() + '分';
        }
        else {
            let theTime3 = Math.floor(theTime / 60);
            if (theTime3 > 0) {
                let theTime4 = parseInt((theTime % 60).toString());
                result += theTime3.toString() + '分' + theTime4.toString() + '秒';
            }
            else {
                result += theTime.toString() + '秒';
            }
        }

        return result;
    };

    static formatSeconds3(value) {
        let data = {
            time1: 0,//第一个时间
            time2: 0,//第二个时间
            timeLabel1: '天',//时间单位
            timeLabel2: '时',//时间单位
            result: '',
        }
        let theTime = parseInt(value);         // 秒 
        let theTime1 = Math.floor(theTime / (60 * 60 * 24));  //天
        if (theTime1 > 0) {
            let theTime2 = Math.floor((theTime % (60 * 60 * 24)) / (60*60));
            data.result += theTime1.toString() + '天' + theTime2.toString() + '时';
            data.time1 = theTime1;
            data.time2 = theTime2;
            data.timeLabel1 = '天';
            data.timeLabel2 = '时';
        } else {
            let theTime3 = Math.floor(theTime / (60 * 60));
            if (theTime3 > 0) {
                let theTime4 = parseInt((theTime % (60 * 60)/60).toString());
                data.result += theTime3.toString() + '时' + theTime4.toString() + '分';
                data.time1 = theTime3;
                data.time2 = theTime4;
                data.timeLabel1 = '时';
                data.timeLabel2 = '分';
            } else {
                let theTime5 = Math.floor(theTime / 60);
                let theTime6 = parseInt((theTime % 60).toString());
                data.result += theTime5.toString() + '分' + theTime6.toString() + '秒';
                data.time1 = theTime5;
                data.time2 = theTime6;
                data.timeLabel1 = '分';
                data.timeLabel2 = '秒';
            }
        }
        return data;
    };

    static formatMoney(value: number) {
        if (value < 10000)  //万
        {
            return value.toString();
        }
        else if (value < 100000000)  //亿
        {
            let out = value / 10000.0;
            //out = Math.floor(out* 100)/100;
            out = Math.floor(out);

            return out.toString() + '万';
        }
        else {
            let out = value / 100000000.0;
            //out = Math.floor(out* 100)/100;
            out = Math.floor(out);

            return out.toString() + '亿';
        }
    };

    static runChangeAction(ndNumber)     //数字变化动画
    {
        if (ndNumber.getNumberOfRunningActions() > 0)
            return false;

        let scale = ndNumber.scale;
        let oldColor = ndNumber.color;

        //  let lblNumber = ndNumber.getComponent(cc.Label);

        let targetScale = scale + 0.3;
        //  ndNumber.color  = cc.color(255, 0, 0, 255);

        let scaleOut = cc.scaleTo(0.2, targetScale);
        let scaleIn = cc.scaleTo(0.2, scale);

        let callBack = function () {
            ndNumber.color = oldColor;
        };
        let endFunction = cc.callFunc(callBack);

        let seq1 = cc.sequence(scaleOut, scaleIn, endFunction);
        ndNumber.runAction(seq1);
    };

    isSpriteOutCircle(sprite, circlePosition, circleR) {
        let position = sprite.getPosition();
        let size = sprite.getContentSize();
        size.width *= sprite.scale;
        size.height *= sprite.scale;

        let posArray = new Array();
        posArray.push(cc.v2(position.x - size.width / 2, position.y - size.height / 2));
        posArray.push(cc.v2(position.x - size.width / 2, position.y + size.height / 2));
        posArray.push(cc.v2(position.x + size.width / 2, position.y - size.height / 2));
        posArray.push(cc.v2(position.x + size.width / 2, position.y + size.height / 2));
        for (let k in posArray) {
            let pos = posArray[k];
            let dis = pos.sub(circlePosition).mag();

            if (dis > circleR)
                return true;
        }
        return false;
    };

    addFadeInOutAnima(ndTarget, isPlay, callBack) {
        let animation = ndTarget.getComponent(cc.Animation);
        if (animation == null)
            animation = ndTarget.addComponent(cc.Animation);

        cc.loader.loadRes("rawanim/fadeInOut", function (err, clip) {
            if (err == null) {
                ndTarget.getComponent(cc.Animation).addClip(clip, "fadeInOut");

                if (isPlay)
                    animation.play('fadeInOut');

                if (callBack)
                    callBack(animation);
            }
        });
    };

    static nodePositionToRoot(node) {
        let worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));

        let root = Functions.getRoot();
        let position = root.convertToNodeSpaceAR(worldPos);

        return position;
    };

    //当前节点位置转到相对目标节点的位置
    static nodePositionToTarget(node, ndTarget) {
        let worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        let position = ndTarget.convertToNodeSpaceAR(worldPos);

        return position;
    };

    static setNodePosToTarget(node: any, ndTarget: any, offset: any) {
        if (node != null && ndTarget != null && ndTarget.parent != null) {
            let worldPos = ndTarget.convertToWorldSpaceAR(cc.v2(0, 0));
            let nodePos = node.parent.convertToNodeSpaceAR(worldPos);

            if (offset != null) {
                nodePos.x += offset.x;
                nodePos.y += offset.y;
            }
            node.setPosition(nodePos);
        }
    };
    static setNodePosToTarget1(node: any, ndTarget: any, offset: any,posY) {
        if (node != null && ndTarget != null && ndTarget.parent != null) {
            let worldPos = ndTarget.convertToWorldSpaceAR(cc.v2(0, 0));
            let nodePos = node.parent.convertToNodeSpaceAR(worldPos);

            if (offset != null) {
                nodePos.x += offset.x;
                nodePos.y += offset.y;
            }
            if(nodePos.y>0)
            nodePos.y -=(posY+40)
            else
            nodePos.y +=posY
            node.setPosition(nodePos);
        }
    };
    static setNodePosToTar(node, ndTarget) {
        let worldPos = ndTarget.convertToWorldSpaceAR(cc.v2(0, 0));
        let nodePos = node.parent.convertToNodeSpaceAR(worldPos);
        return nodePos;
    };

    static filterItemData(itemDatas, condition) {
        let resItems = new Array();
        for (let key in itemDatas) {
            if (condition == null || condition(itemDatas[key])) {
                resItems.push(itemDatas[key]);
            }
        }

        return resItems;
    };

    getItemSampleName(itemID) {
        let item = global.Manager.DBManager.getItemNew(itemID);
        let name = item.name;
        if (name.length > 5) {
            let sName = name.slice(0, 4);
            sName += '...';
            return sName;
        }
        return name;
    };

    static getFactoryClassType(factoryTempID) {
        let factoryData = global.Manager.DBManager.findData("Factory", 'ID', factoryTempID);

        if (factoryData != null) {
            if (factoryData.type == 'union') {
                return Union;
            }
            else if (factoryData.type == 'makeGoods') {
                return MakeGoods;
            }
            else if (factoryData.type == 'demon') {
                return Demon;
            }
            else if (factoryData.type == 'task') {
                return TaskBuild;
            }
            else if (factoryData.type == 'worldMapEnter') {
                return WorldMapEnter;
            }
            else {
                return global.CommonClass.FactoryBase;
            }
        }
    };

    static sort(sortArray, comp)              //从大到小排序:comp要返回大的值是true, 从小到大排序:comp返回的值是fasle
    {
        let len = sortArray.length;
        let bigIdx = 0;
        let temp = null;
        let isBig = true;

        for (let i = 0; i < len - 1; i++) {
            bigIdx = i;
            for (let j = i + 1; j < len; j++) {
                if (comp == null)
                    isBig = sortArray[j] > sortArray[bigIdx];
                else
                    isBig = comp(sortArray[j], sortArray[bigIdx]);

                if (isBig) {
                    bigIdx = j;
                }
            }

            if (bigIdx != i) {
                temp = sortArray[i];
                sortArray[i] = sortArray[bigIdx];
                sortArray[bigIdx] = temp;
            }
        }
    };

    static logServerError(msg) {
        let value = global.Manager.DBManager.findData('ServerError', msg.errorID, null);
        if (value != null)
            global.Instance.Log.debug('ServerError:  ', value.text);
    };

    fillNullData(data) {
        if (data == null)
            return 0;

        for (let key in data) {
            let vaule = data[key];
            if (vaule == null)
                data[key] = 0;
        }

        return data;
    };
    /**
     * 秒数转时间
     * @param {*} second 
     * @returns 
     */
     static formatMoonCardTime(second) {
        let theTime = parseInt(second);// 秒 
        let theTime1 = 0;// 分 
        let theTime2 = 0;// 小时 

        let dayTime = 60 * 60 * 24;
        let hourTime = 60 * 60;
        let divideTime = 60;
        let result = '';

        if (theTime > dayTime) {
            theTime1 = parseInt((theTime / dayTime).toString());
            theTime2 = parseInt(((theTime % dayTime) / hourTime).toString());

            result = parseInt((theTime1).toString()) + "天";
        }
        else if (theTime > hourTime) {
            theTime1 = parseInt((theTime / hourTime).toString());
            theTime2 = parseInt(((theTime % hourTime) / divideTime).toString());

            result = parseInt((theTime1).toString()) + "时";
        }
        else if (theTime > divideTime) {
            theTime1 = parseInt((theTime / divideTime).toString());
            theTime2 = parseInt((theTime % divideTime).toString());

            result = parseInt((theTime1).toString()) + "分";
        }
        else {
            result = "";
        }

        return result;
    };

    static getTargetTime(timeLeft: number)    //剩余时间
    {
        let data = new Date();
        let time = data.getTime();
        let targetTime = time + timeLeft * 1000;
        return targetTime;
    };

    static getLeftTime(targetTime: number) {
        let data = new Date();
        let time = data.getTime();
        let leftTime = Math.ceil((targetTime - time) / 1000);

        return leftTime;
    };

    static getLeftTimeExact(targetTime: number) {
        let data = new Date();
        let time = data.getTime();
        let leftTime: number = (targetTime - time) / 1000;

        return leftTime;
    };

    isScrollViewAt(scrollView: { getComponent: (arg0: typeof cc.ScrollView) => any; }, mode: number)  //mode:1 is at top   mode:2 is at buttom mode:3 is at left mode:4 is at right
    {
        let viewClass = scrollView.getComponent(cc.ScrollView);
        let offset = viewClass.getScrollOffset();
        let maxOffset = viewClass.getMaxScrollOffset();

        if (mode == 1) {
            return offset.y <= 0.0001;
        }
        else if (mode == 2) {
            return offset.y >= maxOffset.y;
        }
        else if (mode == 3) {
            return offset.x <= 0.0001;
        }
        else if (mode == 4) {
            return offset.x >= maxOffset.x;
        }

        return false;
    };

    static getOpenItems(level: any) {
        let items = [];

        let factorys = global.Manager.DBManager.getData('Factory');
        for (let key in factorys) {
            let factory = factorys[key];
            //&& factory.userData != -1
            if (factory.levelRequire == level && factory.userData != -1&&factory.scene != 'FarmParkScene'&& factory.isShowLevel != 0) {
                let newFactory = { type: 1, ID: factory.ID, name: factory.name };
                items.push(newFactory);
            }
        }

        let makeItems = global.Manager.DBManager.getData('ManufactureMakeData');
        for (let key in makeItems) {
            let makeItem = makeItems[key];
            if (makeItem.levelRequire == level) {
                let newItem = { type: 2, ID: makeItem.ID, name: makeItem.name };
                items.push(newItem);
            }
        }

        return items;
    };

    /***************************************
        * 生成从minNum到maxNum的随机数。
        * 如果指定decimalNum个数，则生成指定小数位数的随机数
        * 如果不指定任何参数，则生成0-1之间的随机数。
        *
        * @minNum：[数据类型是Integer]生成的随机数的最小值（minNum和maxNum可以调换位置）
        * @maxNum：[数据类型是Integer]生成的随机数的最大值
        * @decimalNum：[数据类型是Integer]如果生成的是带有小数的随机数，则指定随机数的小数点后的位数
        *
        ****************************************/
     static randomNum(minNum: number, maxNum: number, decimalNum: number) {
        var max = 0, min = 0;
        minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
        switch (arguments.length) {
            case 1:
                return Math.floor(Math.random() * (max + 1));
                break;
            case 2:
                return Math.floor(Math.random() * (max - min + 1) + min);
                break;
            case 3:
                return (Math.random() * (max - min) + min).toFixed(decimalNum);
                break;
            default:
                return Math.random();
                break;
        }
    };
    static getToscale(node, width, height) {
        let scaleX = width /  node.width;
        let scaleY = height /  node.height;
        scaleX = Number(scaleX.toFixed(2));
        scaleY = Number(scaleY.toFixed(2));
        let scale = scaleX;
        if (scaleX > scaleY) {
            scale = scaleY;
        }
        return scale * 1;
    };
}

