

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bomb extends cc.Component {
    cell: any;

    constructor()
    {
        super();
        this.cell = null;
    };

    // use this for initialization
    onLoad() {
    };

    setCell(cell)
    {
        this.cell = cell;
    };

    getCell()
    {
        return this.cell;
    };

    // update (dt) {}
}
