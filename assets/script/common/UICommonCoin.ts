
const { ccclass, property } = cc._decorator;

@ccclass
export default class UICommonCoin extends cc.Component {
    coins: Map<any, any>;
    constructor() {
        super();
        //this.coins = new Array;
        this.coins = new Map();
    };
    @property({ type: cc.Node, displayName: "coin", tooltip: "" })
    coin: cc.Node = null;
    @property({ type: cc.Node, displayName: "diamond", tooltip: "" })
    diamond: cc.Node = null;
    @property({ type: cc.Node, displayName: "power", tooltip: "" })
    power: cc.Node = null;
    @property({ type: cc.Node, displayName: "magic", tooltip: "" })
    magic: cc.Node = null;

    // use this for initialization
    onLoad() {

        this.coins["coin"] = this.coin;
        this.coins["diamond"] = this.diamond;
        this.coins["power"] = this.power;
        this.coins["magic"] = this.magic;

        let event = new cc.Event.EventCustom('onShowCoin', true);
        event.setUserData(this);
        this.node.dispatchEvent(event);

        global.Manager.UICoinManager.addPanel(this);
    };
    onDestroy() {
        //cc.Instance.Log.debug("exit");
    };

    showCoin(args) {
        for (let j in this.coins) {
            let coin = this.coins[j];
            coin.active = false;
        };

        let beginPos = this.node.getChildByName("ndCoins").getChildByName("Start").getPosition();
        let width = beginPos.x;
        for (let i = 0; i < arguments.length; ++i) {

            let key = arguments[i];
            let ndCoin = this.coins[key];
            if (ndCoin) {
                let posX = width;
                ndCoin.x = (posX);
                ndCoin.y = (beginPos.y);
                ndCoin.active = true;
                width += ndCoin.getContentSize().width;
                this.reflash(key);
            }
        };
    };

    reflash(name) {
        let ndCoin = this.coins[name];
        if (name == "coin") {
            let lblNumber = ndCoin.getChildByName("lblNumber");
            lblNumber.getComponent(cc.Label).string = global.Module.MainPlayerData.getCoin().toString();
        } else if (name == "diamond") {
            let lblNumber = ndCoin.getChildByName("lblNumber");
            lblNumber.getComponent(cc.Label).string = global.Module.MainPlayerData.getDianomd().toString();
        } else if (name == "magic") {
            let lblNumber = ndCoin.getChildByName("lblProgress");
            let magic = global.Module.MainPlayerData.getMagic();
            let maxMagic = global.Module.MainPlayerData.getMaxMagic();
            lblNumber.getComponent(cc.Label).string = magic.toString() + '/' + maxMagic.toString();
            let progress = ndCoin.getChildByName("progressBar");
            progress.getComponent(cc.ProgressBar).progress = magic / maxMagic;
        }
        else if (name == "power") {
            let lblNumber = ndCoin.getChildByName("lblProgress");
            let power = global.Module.MainPlayerData.getPower();
            let maxPower = global.Module.MainPlayerData.getMaxPower();
            lblNumber.getComponent(cc.Label).string = power.toString() + '/' + maxPower.toString();
            let progress = ndCoin.getChildByName("progressBar");
            progress.getComponent(cc.ProgressBar).progress = power / maxPower;
        }
    };

    addClick(event, arg) {
        if (arg == "diamond") {

        }
    };

    onEnable() {
        //cc.Instance.Log.debug("onEnable....");
    };

    onDisable() {
        //cc.Instance.Log.debug("onDisable....");
    };
    // update (dt) {}
}
