
import UIBase from "./UIBase";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ProxyBase {
    
    panel: UIBase = null;
    constructor() {
    }
    setPanel(panel: UIBase) {
        this.panel = panel;
    };
    getPanel() {
        return this.panel;
    };
    onLoadPanel(panel: any) { //need overwrite by child
        this.setPanel(panel);
    };
    // update (dt) {}
}
