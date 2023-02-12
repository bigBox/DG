
//界面管理器

import { ConfigPath } from "../common/global";

export default class UIManager {
    panels: {};
    multiPanels: any[];
    persistPanels: {};
    lockOp: {};
    resident: {};

    constructor() {
        this.panels = {};
        this.multiPanels = [];
        this.persistPanels = {};
        this.resident = {};

        this.lockOp = {};
    };

    create(className: string, parent: { addChild: (arg0: any) => void; }, callback: (arg0: any) => void) {
        let self = this;

        if (parent == null)
            parent = global.CommonClass.Functions.getRoot();

        let panelClass = ConfigPath[className];
        let filePath = panelClass.filePath;
        global.CommonClass.Functions.setCreate(filePath, function (prefab) {
            if (prefab != null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode);

                let panel = newNode.getComponent(className);
                self.multiPanels.push({ panel: panel, className: className });

                if (callback != null)
                    callback(panel);
            }
        })
    };

    delete(panel: { node: { removeFromParent: () => void; }; }) {
        let num = this.multiPanels.length;

        for (let idx = 0; idx < num; ++idx) {
            let item = this.multiPanels[idx];
            if (panel == item.panel) {
                panel.node.removeFromParent();
                this.multiPanels.splice(idx, 1);
                return true;
            }
        }

        return false;
    };

    pushMutiPanel(name: any, panel: any) {
        this.multiPanels.push({ panel: panel, className: name });
    };

    popMutiPanel(name: any) {
        let num = this.multiPanels.length;
        for (let idx = num - 1; idx >= 0; --idx) {
            let item = this.multiPanels[idx];
            if (item.className == name) {
                this.multiPanels.splice(idx, 1);
                return true;
            }
        }
    };

    getMutiPanels(name: any) {
        let panels = [];
        let num = this.multiPanels.length;
        for (let idx = 0; idx < num; ++idx) {
            let item = this.multiPanels[idx];
            if (item.className == name)
                panels.push(item.panel);
        }

        return panels;
    };

    getMutiPanel(name: any, step: number)//step表示第几个0是第一个 -1倒数第一个
    {
        if (!step)
            step = 0;

        let num = this.multiPanels.length;

        if (step >= 0) {
            let count = 0;
            for (let idx = 0; idx < num; ++idx) {
                let item = this.multiPanels[idx];
                if (item.className == name) {
                    if (count >= step) {
                        return item.panel;
                    }
                    else {
                        count++;
                    }
                }
            }
        }
        else {
            let count = 0;
            for (let idx = num - 1; idx >= 0; --idx) {
                let item = this.multiPanels[idx];
                if (item.className == name) {
                    if (count >= step) {
                        return item.panel;
                    }
                    else {
                        count++;
                    }
                }
            }
        }
    };

    open(className: string, parent: any, callback: any) {
        let self = this;
        let panel = this.get(className);

        if (parent == null)
            parent = global.CommonClass.Functions.getRoot();
        if (panel == null && !this.lockOp[className]) {
            this.lockOp[className] = true;
            let panelClass = ConfigPath[className];
            global.Instance.Log.debug("open", className)
            let filePath = panelClass.filePath;

            global.CommonClass.Functions.setCreate(filePath, function (prefab) {
                if (prefab != null) {
                    global.Instance.Log.debug("open", filePath);
                    let newNode = cc.instantiate(prefab);
                    if (newNode != null) {
                        if (parent != null)
                            parent.addChild(newNode);

                        if (panelClass.zOrder)
                            newNode.zIndex = (panelClass.zOrder);
                        else
                            newNode.zIndex = (global.Enum.PanelZOrder.PanelZ_DEFAULT);

                        let panelComp = newNode.getComponent(panelClass.name);
                        self.panels[className] = panelComp;
                        self.lockOp[className] = false;
                        // if (panel.reflashGuide)
                        // panel.reflashGuide();

                        if (callback != null)
                            callback(panelComp);
                    }
                    // cc.Proxys.ProxyFactoryGuide.executeGuide(className);
                }
                else {
                    if (callback != null)
                        callback(null);
                }
            });
        }
        else {
            if (panel && panel.node != null) {
                if (parent != null && panel.node.parent != parent)
                    parent.addChild(panel.node);

                if (callback != null)
                    callback(panel);
            }
        }
    };

    show(className: any, isShow: any) {
        let panel = this.get(className);
        if (panel != null)
            panel.node.active = isShow;
    };

    get(className: string) {
        let panel = null;
        for (let key in this.panels) {
            if (key == className) {
                panel = this.panels[key];
                break;
            }
        }

        return panel;
    };

    add(className: string, panel: any) {
        if (this.get(className) == null) {
            this.panels[className] = panel;
        }
    };
    getResident(className: string) {
        let panel = null;
        for (let key in this.resident) {
            if (key == className) {
                panel = this.resident[key];
                break;
            }
        }

        return panel;
    };
    addResident(className: string, panel: any){
        if (this.getResident(className) == null) {
            this.resident[className] = panel;
        }
    }

    remove(className: string) {
        for (let key in this.panels) {
            if (key == className)
                delete this.panels[key];
        }
    };

    close(className: any) {
        let panel = this.get(className);
        if (panel != null) {
            if (panel.node != null)
                panel.node.removeFromParent();
            this.remove(className);
            
        }
    };
    close1(className: any) {
        let panel = this.get(className);

        if (panel != null) {
            if (panel.node != null)
                panel.node.destroy();

            this.remove(className);
        }
    };
    addPersistUI(className: string, callback: (arg0: any) => void) {
        global.Instance.Log.debug('addPersistUI',className)
        let panelClass = ConfigPath[className];
        let filePath = panelClass.filePath;

        let self = this;

        global.CommonClass.Functions.setCreate(filePath, function (prefab) {
            if (prefab != null) {
                let newNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(newNode);

                let panelComp = newNode.getComponent(panelClass.name);
                self.persistPanels[className] = panelComp;

                if (callback)
                    callback(panelComp);

            }
        });
    };

    getPersistUI(className: string) {
        let panel = null;
        for (let key in this.persistPanels) {
            if (key == className) {
                panel = this.persistPanels[key];
                break;
            }
        }

        return panel;
    };

    clear() {
        this.panels = {};
        this.multiPanels = [];
        this.lockOp = {};
    };
    clearRemove(){
        for (let key in this.panels) {
            let panel = this.panels[key]
            if (panel&&key!='UIMainScene'&&key!='UINewFactory') {
                if (panel.node != null)
                    panel.node.removeFromParent();
                this.remove(key);
            }
        }
  
    }
    //获取子对象
    getChild(ele: { name: any; children: string | any[]; }, name: any) {
        if (name == null)
            return null;
        if (ele.name === name) {
            // 先访问根节点, 若找到则返回该节点
            return ele;
        }

        for (let i = 0; i < ele.children.length; i++) {
            if (this.getChild(ele.children[i], name)) {
                return this.getChild(ele.children[i], name);
            };
        }
        return null;
    };
    coortrans(node: { parent: { convertToWorldSpaceAR: (arg0: any) => any; }; position: any; }, node1: { convertToNodeSpaceAR: (arg0: any) => any; }) {
        //  世界坐标 = 父节点.convertToWorldSpaceAR(子节点坐标)；
        let worldPoint = node.parent.convertToWorldSpaceAR(node.position);
        // 世界坐标转换为本地坐标
        let localPoint = node1.convertToNodeSpaceAR(worldPoint);
        return localPoint;

    };

}
