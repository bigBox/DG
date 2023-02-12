
const { ccclass, property } = cc._decorator;

@ccclass
export default class IndentifyBagItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = {};
    };

    static create(itemData, parent, position) {
        let filePath = "prefab/component/IdentifyBagItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                parent.addChild(newNode, 999);
                newNode.setPosition(position);
                newNode.setName(itemData.index.toString());

                let itemClass = newNode.getComponent(global.CommonClass.IndentifyBagItem);
                itemClass.setData(itemData);
            }
        });
    };

    // use this for initialization
    onLoad() {

    };


    getData() {
        return this.data;
    };
    reflashHelp(){
        //箭头 helpNode 送去鉴定按钮
        var data = global.Module.TaskData.getHasAcceptTaskData();
        let helpNode = this.node.getChildByName('helpNode');
        if (!data || !helpNode)
            return;
        if (data.state == 1 && data.taskId == 10001 && this.data.itemId == 500401) {
            helpNode.active = true;
            this.node.zIndex = 999;
        }
                
    };
    setData(data) {
        this.data = data;
        this.reflashHelp();
        let spItem = this.node.getChildByName('spItem');
        let iconFile = "images/pictrue/items/default";
        let itemData = global.Manager.DBManager.getItemNew(this.data.itemId);
        if (itemData != null)
            iconFile = itemData.path + itemData.picName;
        global.CommonClass.Functions.setTexture(spItem, iconFile, function () {
            spItem.scale = global.CommonClass.Functions.getToscale(spItem, 150, 150);
        });

        if (itemData != null) {


            let lblName = this.node.getChildByName('lblName').getComponent(cc.Label);
            let lblDate = this.node.getChildByName('lblDate').getComponent(cc.Label);

            let name = itemData.name;
            // if (name.length > 5)
            //     name = name.substr(0, 5);
            lblName.string = name + '';

            let time = parseInt(data.time.value.toString());
            let curData = new Date();
            let curTime = curData.getTime();

            let timePass = curTime - time;
            let day = Math.floor(timePass / (3600 * 24 * 1000));
            if (day > 3) day = 3;
            let dayDec = {};
            dayDec[0] = '今天';
            dayDec[1] = '一天前';
            dayDec[2] = '二天前';
            dayDec[3] = '三天前';
            lblDate.string = dayDec[day] + '发现,看上去很稀罕...';

            let sourceDec = '出生时拥有';
            let factoryData = global.Manager.DBManager.findData('Factory', 'ID', data.source);
            if (factoryData != null)
                sourceDec = factoryData.name;
        }
    };

    btnPut() {
        if (this.data.itemId >= 0) {
            let evt = new cc.Event.EventCustom('onPutItemClick', true);
            evt.setUserData(this.node);
            this.node.dispatchEvent(evt);
        }
    };
}
