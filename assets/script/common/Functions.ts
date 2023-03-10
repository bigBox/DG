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
        * ???????????????????????????????????????
        * @param {??????*} spSprite 
        * @param {????????????*} picPath 
        * @param { ??????*} callBack 
        * @returns 
        */
    static setCreate(filePath, callBack) {
        
        if (filePath.length == 0) {
            return false;
        }
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
               
                cc.loader.setAutoReleaseRecursively(prefab, true);//????????????????????????
                if (callBack)//???????????????????????????
                    callBack(prefab);
            } else {
                global.Instance.Log.debug("setCreate error", err);
                if (callBack)//??????????????????null
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
     * ??????ID??????????????????????????????
     * @param {*} itemID 
     * @returns 
     */
    static getItemPicPathNew(itemID: number) {
        let item = global.Manager.DBManager.getItemNew(itemID);
        if (item != null)
            return item.path + item.picName;
        return "images/pictrue/items/700000017";//??????????????????
    };
    /**
     * ????????????????????????????????????????????????????????????
     * @param {??????*} spSprite 
     * @param {????????????*} picPath 
     * @param { ??????*} callBack 
     * @returns 
     */
    static setTexture(spSprite, picPath, callBack) {
        if (spSprite == null)//???????????????????????????
            return false;
        if (picPath.length == 0) {//?????????????????????????????????????????????????????????
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
                cc.loader.setAutoReleaseRecursively(spriteFrame, true);//????????????????????????
                if (callBack)//???????????????????????????
                    callBack(spSprite);
            } else {
                global.Instance.Log.debug("setTexture error", err);
                if (callBack)//??????????????????null
                    callBack(null);
            }
        });

        return false;
    };
    static setTexture1(spSprite, picPath, callBack) {
        if (spSprite == null)//???????????????????????????
            return false;
        if (picPath.length == 0) {//?????????????????????????????????????????????????????????
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
               
                if (callBack)//???????????????????????????
                    callBack(spSprite);
            } else {
                global.Instance.Log.debug("setTexture error", err);
                if (callBack)//??????????????????null
                    callBack(null);
            }
        });

        return false;
    };
    static setTextureNew(spSprite, picPath, callBack) {
        if (spSprite == null)//???????????????????????????
            return false;
        if (picPath.length == 0) {//?????????????????????????????????????????????????????????
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
                if (callBack)//???????????????????????????
                    callBack(spSprite);
            } else {
                global.Instance.Log.debug("setTexture error", err);
                if (callBack)//??????????????????null
                    callBack(null);
            }
        });

        return false;
    };

    static setItemTexture(spItem: any, itemID: any, callback: any) {
        let path = this.getItemPicPathNew(itemID);
        Functions.setTexture(spItem, path, callback);
    };
    //??????????????????
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
        var theTime = parseInt(value);// ??? 
        var theTime1 = 0;// ??? 
        var theTime2 = 0;// ?????? 

        if (theTime > 60) {
            theTime1 = parseInt((theTime / 60).toString());
            theTime = parseInt((theTime % 60).toString());

            if (theTime1 > 60) {
                theTime2 = Math.floor(theTime1 / 60);
                theTime1 = Math.floor(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime.toString()) + "???";
        if (theTime1 > 0)
            result = "" + parseInt(theTime1.toString()) + "???" + result;
        if (theTime2 > 0)
            result = "" + parseInt(theTime2.toString()) + "??????" + result;

        return result;
    };
    static formatSeconds2(value) {
        let result = '';
        let theTime = parseInt(value);         // ??? 
        let theTime1 = Math.floor(theTime / 3600);  //???

        if (theTime1 > 0) {
            let theTime2 = Math.floor((theTime % 3600) / 60);
            result += theTime1.toString() + '???' + theTime2.toString() + '???';
        }
        else {
            let theTime3 = Math.floor(theTime / 60);
            if (theTime3 > 0) {
                let theTime4 = parseInt((theTime % 60).toString());
                result += theTime3.toString() + '???' + theTime4.toString() + '???';
            }
            else {
                result += theTime.toString() + '???';
            }
        }

        return result;
    };

    static formatSeconds3(value) {
        let data = {
            time1: 0,//???????????????
            time2: 0,//???????????????
            timeLabel1: '???',//????????????
            timeLabel2: '???',//????????????
            result: '',
        }
        let theTime = parseInt(value);         // ??? 
        let theTime1 = Math.floor(theTime / (60 * 60 * 24));  //???
        if (theTime1 > 0) {
            let theTime2 = Math.floor((theTime % (60 * 60 * 24)) / (60*60));
            data.result += theTime1.toString() + '???' + theTime2.toString() + '???';
            data.time1 = theTime1;
            data.time2 = theTime2;
            data.timeLabel1 = '???';
            data.timeLabel2 = '???';
        } else {
            let theTime3 = Math.floor(theTime / (60 * 60));
            if (theTime3 > 0) {
                let theTime4 = parseInt((theTime % (60 * 60)/60).toString());
                data.result += theTime3.toString() + '???' + theTime4.toString() + '???';
                data.time1 = theTime3;
                data.time2 = theTime4;
                data.timeLabel1 = '???';
                data.timeLabel2 = '???';
            } else {
                let theTime5 = Math.floor(theTime / 60);
                let theTime6 = parseInt((theTime % 60).toString());
                data.result += theTime5.toString() + '???' + theTime6.toString() + '???';
                data.time1 = theTime5;
                data.time2 = theTime6;
                data.timeLabel1 = '???';
                data.timeLabel2 = '???';
            }
        }
        return data;
    };

    static formatMoney(value: number) {
        if (value < 10000)  //???
        {
            return value.toString();
        }
        else if (value < 100000000)  //???
        {
            let out = value / 10000.0;
            //out = Math.floor(out* 100)/100;
            out = Math.floor(out);

            return out.toString() + '???';
        }
        else {
            let out = value / 100000000.0;
            //out = Math.floor(out* 100)/100;
            out = Math.floor(out);

            return out.toString() + '???';
        }
    };

    static runChangeAction(ndNumber)     //??????????????????
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

    //???????????????????????????????????????????????????
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

    static sort(sortArray, comp)              //??????????????????:comp?????????????????????true, ??????????????????:comp???????????????fasle
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
     * ???????????????
     * @param {*} second 
     * @returns 
     */
     static formatMoonCardTime(second) {
        let theTime = parseInt(second);// ??? 
        let theTime1 = 0;// ??? 
        let theTime2 = 0;// ?????? 

        let dayTime = 60 * 60 * 24;
        let hourTime = 60 * 60;
        let divideTime = 60;
        let result = '';

        if (theTime > dayTime) {
            theTime1 = parseInt((theTime / dayTime).toString());
            theTime2 = parseInt(((theTime % dayTime) / hourTime).toString());

            result = parseInt((theTime1).toString()) + "???";
        }
        else if (theTime > hourTime) {
            theTime1 = parseInt((theTime / hourTime).toString());
            theTime2 = parseInt(((theTime % hourTime) / divideTime).toString());

            result = parseInt((theTime1).toString()) + "???";
        }
        else if (theTime > divideTime) {
            theTime1 = parseInt((theTime / divideTime).toString());
            theTime2 = parseInt((theTime % divideTime).toString());

            result = parseInt((theTime1).toString()) + "???";
        }
        else {
            result = "";
        }

        return result;
    };

    static getTargetTime(timeLeft: number)    //????????????
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
        * ?????????minNum???maxNum???????????????
        * ????????????decimalNum????????????????????????????????????????????????
        * ???????????????????????????????????????0-1?????????????????????
        *
        * @minNum???[???????????????Integer]?????????????????????????????????minNum???maxNum?????????????????????
        * @maxNum???[???????????????Integer]??????????????????????????????
        * @decimalNum???[???????????????Integer]???????????????????????????????????????????????????????????????????????????????????????
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

