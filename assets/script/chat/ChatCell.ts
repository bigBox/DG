

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatCell extends cc.Component {
    data: {};
    exHeight: number;
    cellSize: cc.Size;

    constructor() {
        super();
        this.data = {};
        this.exHeight = 0;
    };

    // use this for initialization
    onLoad() {
      
    };

    getData() {
        return this.data;
    };

    setData(data)  //data:{level:level, name:xx, content:yy}
    {
        this.data = data;
        let lblName = this.node.getChildByName('lblName');
        lblName.getComponent(cc.Label).string = data.name;
        let lblLevel = this.node.getChildByName('ndLevel').getChildByName('lblLevel');
        lblLevel.getComponent(cc.Label).string = data.level.toString();

        let lblContent = this.node.getChildByName('lblContent');
        let oldSize = lblContent.getContentSize();

        let lblClass = lblContent.getComponent(cc.Label);
        lblClass.string = data.content;
        let newSize = lblContent.getContentSize();

        this.exHeight = newSize.height-oldSize.height;
    };

    getCellSize()
    {
        let box = this.node.getBoundingBox();
        this.cellSize = cc.size(box.width, box.height+this.exHeight);
        
        return this.cellSize;
    };

    // update (dt) {}
}
