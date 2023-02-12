

const {ccclass, property} = cc._decorator;

@ccclass
export default class TownScene extends cc.Component {
  
    
    onLoad () {
        let dragLayer:any = this.node.getChildByName('DragLayer');
        let layerClass = dragLayer.getComponent(global.CommonClass.DragLayer);

        let mapID = global.Module.TownMapData.getID();
        layerClass.loadDragItem('prefab/npctown/TownMap'+mapID.toString());
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null)
            panel.setProgress(1, 0.4);
    }
    
    start () {

    }

    // update (dt) {}
}
