

const { ccclass, property } = cc._decorator;

@ccclass
export default class UserData extends cc.Component {
    @property({ type: cc.Integer, displayName: "iData", tooltip: "iData" })
    public iData: number = 0;
    @property()
    public sData: string = "";
}
