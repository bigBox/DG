

const {ccclass, property} = cc._decorator;
@ccclass
export default class CellBase extends cc.Component {
    cellSize: cc.Size;
    data: any[];

    constructor() {
        super();
        this.cellSize = cc.size(256, 256);
        this.data = [];
    };

    // use this for initialization
    onLoad () {
    };

    getData() {
        return this.data;
    };

    setData(data) {
        this.data = data;
    };

    getCellSize() {
        return this.cellSize;
    };
}
