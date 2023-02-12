

const {ccclass, property} = cc._decorator;

@ccclass
export default class MaterialUtils extends cc.Component {

    static customCache: any = {}; // 保存自定义材质，避免重复加载
    static MAT: any = {
        // build in
        DEFAULT: {
            custom: false,
            name: "2d-sprite",
        },
        GRAY: {
            custom: false,
            name: "2d-gray-sprite"
        },
        // custom
        COLOR: {
            custom: true,
            name: "basematrial",
        },
    };
    static getMaterial(sp: any, matCfg: any, callBack: any) {
        if (matCfg.custom) {
            let url = "effect/" + matCfg.name;
            if (this.customCache[url]) {
                if (callBack)
                    callBack(false, this.customCache[url]);
                return;
            }
    
            cc.loader.loadRes(url, cc.Material, (err, asset) => {
                if (err) {
                    cc.error(err);
                    if (callBack)
                        callBack(err, null);
                }
                this.customCache[url] = asset;
    
                if (callBack)
                    callBack(false, asset);
            });
        } else {
            let mat = cc.MaterialVariant.createWithBuiltin(matCfg.name, sp);
            if (callBack)
                callBack(false, mat);
        }
    };
    static  useMaterial(sp, matCfg, callBack) {
        this.getMaterial(sp, matCfg, function (err, mat) {
            if (err)
                return;
            mat.setProperty('texture', sp.spriteFrame.getTexture());
            sp.setMaterial(0, mat);
            sp.markForRender(true);

            if (callBack)
                callBack(err, mat);
        });
    };
};
