const {ccclass, property} = cc._decorator;

@ccclass
export default class UIData extends cc.Component {
    data: any;

    constructor () {
        super();
        this.data = null;
    };

    onLoad() {
    };

    setData(data) {
        this.data = data;
    };

    getData() {
        return this.data;
    };

    // update (dt) {}
}
