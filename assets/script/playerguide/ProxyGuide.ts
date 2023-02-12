

const {ccclass, property} = cc._decorator;

@ccclass
export default class ProxyGuide extends cc.Component {
    guideInfo: {};
    curGuide: any;
    isFinishGuide: boolean;
    lockCenter: boolean;
    guideSpineNpc: any;

    constructor() {
        super();
        this.guideInfo = {};

        let guides = global.Manager.DBManager.getData('NewGuide');
        for (let idx in guides) {
            let value = guides[idx];
            let obj = { ID: value.ID, isFinish: false, isOpen: false, arg: 0, exData: '' };
            this.guideInfo[value.guideKey] = obj;
        }
        this.curGuide = null;
        this.isFinishGuide = false;
        this.lockCenter = false;
        this.guideSpineNpc = null;
    };
    setData (serverData) {
        let count = 0;
        for (let key in serverData) {
            let value = serverData[key].value;

            let guide = this.guideInfo[key];
            if (guide != null) {
                guide.isFinish = value.isFinish;
                guide.isOpen = value.isOpen;              //适用于到达一定条件才开启的引导
                guide.arg = value.arg;
                guide.exData = value.exData;

                if (guide.isOpen)
                    this.curGuide = guide.ID;
            }

            ++count;
        }

        if (count <= 0) {
            this.curGuide = 1;
            let guide = global.Manager.DBManager.findData('NewGuide', 'ID', this.curGuide);

            if (guide != null)
                this.setGuideOpen(guide.guideKey, true);
        }
        else {
            global.Module.GuideTaskData.updateByGuide(this.curGuide);
        }

    };

    getGuide(key) {
        return this.guideInfo[key];
    };

    getIsFinish(key) {
        return true;
    };

    getIsOpen(key) {
        if (global.Module.GuideTaskData.getIsFinishAll())
            return false;

        let value = this.getGuide(key);
        if (value != null)
            return value.isOpen;

        return false;
    };

    setGuideArg(key, arg) {
        let value = this.getGuide(key);
        if (value != null) {
            let finish = 0;
            if (value.isFinish) finish = 1;

            let open = 0;
            if (value.isOpen) open = 1;

            let data = { type: 0, key: key, isFinish: finish, isOpen: open, arg: arg, exData: value.exData };
          

            value.arg = arg;
            return true;
        }
    };

    setGuideExData(key, exData) {
        let value = this.getGuide(key);
        if (value != null) {
            let finish = 0;
            if (value.isFinish) finish = 1;

            let open = 0;
            if (value.isOpen) open = 1;

            let data = { type: 0, key: key, isFinish: finish, isOpen: open, arg: value.arg, exData: exData };
          
            value.exData = exData;
        }
    };

    getCurrentGuide () {
        let data = global.Manager.DBManager.findData('NewGuide', 'ID', this.curGuide);
        return data;
    };

    setGuideFinish(key, isFinish)      //finish了自动将open变成false
    {
        let value = this.getGuide(key);
        if (value != null) {
            let finish = 0;
            if (isFinish) finish = 1;

            let open = 0;
            if (value.isOpen && !isFinish) open = 1;

            let data = { type: 0, key: key, isFinish: finish, isOpen: open, arg: value.arg, exData: value.exData };
          

            value.isFinish = (finish != 0);
            value.isOpen = (open != 0);

            //this.reflashNewGuide(value.ID);
        }
    };

    setGuideOpen(key, isOpen)      //open了自动将finish变成false
    {
        let value = this.getGuide(key);
        if (value != null) {
            let open = 0;
            if (isOpen) open = 1;

            let finish = 0;
            if (value.isFinish && !isOpen) finish = 1;

            let data = { type: 0, key: key, isFinish: finish, isOpen: open, arg: 0, exData: value.exData };
           

            value.isFinish = (finish != 0);
            value.isOpen = (open != 0);

            this.curGuide = value.ID;
            //  cc.Module.GuideTaskData.updateByGuide(value.ID);

            //  this.reflashNewGuide(value.ID);
        }


    };

    getSpeekNpcSpine() {
        return this.guideSpineNpc;
    };

    reflashFactoryHelp(guideKey, isGuideStart) {
        let data = global.Manager.DBManager.findData('NewGuide', 'guideKey', guideKey);
        if (data != null) {
            let scene = cc.director.getScene();
            let map = null;

            if (scene.name == "WorldMapScene")
                map = global.Instance.Dynamics["WorldMap"];
            else if (scene.name == "MainScene")
                map = global.Instance.Dynamics["MainMap"];

            if (map != null) {
                map.reflashFactoryGuide(data.centerBuild, isGuideStart);
            }
        }
    };

    jumpGuide(guideID) {
        let guide = global.Manager.DBManager.findData('NewGuide', 'ID', guideID);
        if (guide != null) {
            this.setGuideFinish(guide.guideKey, true);
            this.reflashFactoryHelp(guide.guideKey, false);

            /*if (guide.UI.length>0)
            {
                let panel = cc.Manager.UIManager.get(guide.UI);
                if (panel!=null)
                    panel.reflashGuide();
            }*/
        }
    };

    reflashOldHelp(oldGuideID) {
        let guide = global.Manager.DBManager.findData('NewGuide', 'ID', oldGuideID);
        if (guide.UI.length > 0) {
            let panel = global.Manager.UIManager.get(guide.UI);
            if (panel != null)
                panel.reflashGuide();
        }
    };

    reflashNewGuide(guideID) {
        let guide = global.Manager.DBManager.findData('NewGuide', 'ID', guideID);
        if (guide == null) {
            return false;
        }
        else {
            this.setGuideOpen(guide.guideKey, true);

            if (guide.guideKey == 'FindPaint')
                this.setGuideArg('FindPaint', 0);

            this.reflashFactoryHelp(guide.guideKey, true);

            global.Module.GuideTaskData.updateByGuide(guide.ID);

            let data = global.Manager.DBManager.findData('NewGuide', 'ID', guide.ID);
            if (data != null && data.scene.length > 0) {
                let scene = cc.director.getScene();
                let sceneName = scene.name;

                if (sceneName != data.scene) {
                    global.CommonClass.Functions.loadScene(data.scene,null);
                }
            }

            if ((guide.guideKey == 'HarvestPlant' || guide.guideKey == 'PlantDrag'))
                this.lockCenter = true;

            this.centerCurrentScene();

            this.lockCenter = false;

            if (guide.UI.length > 0) {
                let panel = global.Manager.UIManager.get(guide.UI);
                if (panel != null)
                    panel.reflashGuide();
            }

            // if (data.scene=='MainScene')
            //{
            let guideSpeak = global.Manager.UIManager.get('UIGuideSpeak');
            if (guideSpeak != null)
                guideSpeak.reflashGuide();
            // }
        }

        return true;

    };

    stepNextGuide(guideKey)        //guideKey 当前引导是guidekey时候跳到下一步引导 null的时候强制跳到下一步 
    {
        if (guideKey != null && !this.getIsOpen(guideKey))
            return false;

        this.jumpGuide(this.curGuide);

        ++this.curGuide;

        this.reflashNewGuide(this.curGuide);

        return true;
    };

    goToGuide(guideKey) {
        let data = global.Manager.DBManager.findData('NewGuide', 'guideKey', guideKey);
        if (data != null) {
            this.jumpGuide(this.curGuide);

            let oldGuide = this.curGuide;

            this.curGuide = data.ID;

            this.reflashOldHelp(oldGuide);
            this.reflashNewGuide(this.curGuide);

            return this.curGuide;
        }

        return 0;
    };

    centerCurrentScene() {
        let scene = cc.director.getScene();
        let sceneName = scene.name;

        let guide = global.Manager.DBManager.findData('NewGuide', 'ID', this.curGuide);
        if (guide != null && guide.centerBuild > 0) {
            if (sceneName == guide.scene) {
                let dragLayer = null;
                let mapData = null;

                if (scene.name == "WorldMapScene") {
                    dragLayer = global.CommonClass.DragLayer.getDragLayer('WorldMap');
                    mapData = global.Module.MainMapData;
                }
                else if (scene.name == "MainScene") {
                    dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
                    dragLayer.scaleItemLayer(0.25);
                    mapData = global.Module.MainMapData;
                }
                else if (scene.name == "FarmParkScene") {
                    dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
                    mapData = global.Module.FarmParkData;
                }

                if (dragLayer != null) {
                    if (!this.lockCenter) {
                        let scale = dragLayer.getItemScale();
                        let factory = mapData.getFactory(guide.centerBuild);
                        if (factory != null) {
                            let position = cc.v2(factory.position.x * scale, factory.position.y * scale);
                            dragLayer.setDragItemPosition(position);

                            return true;
                        }
                    }
                }
            }
        }

        return false;
    };

    onLevelUp(level) {
        let data = global.Manager.DBManager.findData('NewGuide', 'level', level);

        for (let key in data) {
            let value = data[key];

            if (this.getIsFinish(value.guideKey))
                continue;

            if (value.guideKey == 'NewFactory') {
                this.setGuideOpen(key, true);

                let panel = global.Manager.UIManager.get('UINewFactory');
                if (panel != null)
                    panel.reflashGuide();
            }
            else if (value.guideKey == 'LeaveDig') {
                if (this.getIsFinish('DigGold'))
                    this.setGuideOpen(value.guideKey, true);

                let panel = global.Manager.UIManager.get('UIDigGold');
                if (panel != null)
                    panel.reflashGuide();
            }
            else if (value.guideKey == 'LeaveGuJi') {
                if (this.getIsFinish('GuJi'))
                    this.setGuideOpen(value.guideKey, true);

                let panel = global.Manager.UIManager.get('UIGuJi');
                if (panel != null)
                    panel.reflashGuide();
            }
            else if (value.guideKey == 'Plant' || value.guideKey == 'Animal') {
                this.setGuideOpen(value.guideKey, true);

                let farm = global.Proxys.ProxyFarm.getFarm();
                if (farm != null)
                    farm.reflashGuide();
            }
            else if (value.guideKey == 'ShowRoom') {
                this.setGuideOpen(value.guideKey, true);
                this.setGuideArg(value.guideKey, 1);
            }
            else if (value.guideKey == 'MakeGoods') {
                this.setGuideOpen(value.guideKey, true);
            }

        }
    };
}
