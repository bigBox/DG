const {ccclass, property} = cc._decorator;
//菱形图片判断
@ccclass
export default class Geometry {

    static isPointInTriangle(P: any, A: any, B: any, C: any) {
        let PA = A.sub(P);
        let PB = B.sub(P);
        let PC = C.sub(P);
        let t1 = PA.cross(PB);
        let t2 = PB.cross(PC);
        let t3 = PC.cross(PA);

        let isShow:boolean = (t1>=0&&t2>=0&&t3>=0)||(t1<=0&&t2<=0&&t3<=0)
            
        return isShow;
    };

    static isLineCorss(aa: { x: number; y: number; }, bb: { x: number; y: number; }, cc: { x: number; y: number; }, dd: { x: number; y: number; }) {
        if ( Math.max(aa.x, bb.x)<Math.min(cc.x, dd.x))  
            return false;  
    
        if ( Math.max(aa.y, bb.y)<Math.min(cc.y, dd.y) )  
            return false;  
        
        if ( Math.max(cc.x, dd.x)<Math.min(aa.x, bb.x) )  
            return false;  
        
        if ( Math.max(cc.y, dd.y)<Math.min(aa.y, bb.y) )  
            return false;  
        
        let mult = function(pa: { x: number; y: number; },pb: { y: number; x: number; },pc: { x: number; y: number; })
        {
            return (pa.x-pc.x)*(pb.y-pc.y)-(pb.x-pc.x)*(pa.y-pc.y);  
        }

        if ( mult(cc, bb, aa)*mult(bb, dd, aa)<0 )  
            return false;  
        
        if ( mult(aa, dd, cc)*mult(dd, bb, cc)<0 )  
            return false;  
     
        return true;  
    };

    static checkSlantingSpIsInPoint(worldPoint: { x: any; y: number; }, ndSp: { getContentSize: () => any; convertToWorldSpaceAR: (arg0: cc.Vec2) => any; }, ratioW: number, ratioH: number) {     //ratioW 左边/右边比例 ratioH 上边/下边比例
        ratioW = ratioW/(ratioW+1);
        ratioH = ratioH/(ratioH+1);
        
        let size    = ndSp.getContentSize();

        let p1 = ndSp.convertToWorldSpaceAR(cc.v2(0,(1-ratioH)*size.height));       //左边 
        let p2 = ndSp.convertToWorldSpaceAR(cc.v2(size.width*ratioW, size.height)); //上边
        let p3 = ndSp.convertToWorldSpaceAR(cc.v2(size.width, ratioH*size.height)); //右边
        let p4 = ndSp.convertToWorldSpaceAR(cc.v2((1-ratioW)*size.width,0));        //下边

        let offset = cc.v2(0,0);
        offset.x = (p3.x-p1.x)/2;
        offset.y = (p2.y-p4.y)/2;

        p1 = p1.sub(offset);
        p2 = p2.sub(offset);
        p3 = p3.sub(offset);
        p4 = p4.sub(offset);
        
        if (global.CommonClass.Geometry.isPointInTriangle(cc.v2(worldPoint.x, worldPoint.y), 
            cc.v2(p1.x, p1.y), cc.v2(p2.x, p2.y), cc.v2(p3.x, p3.y))
            || 
            global.CommonClass.Geometry.isPointInTriangle(cc.v2(worldPoint.x, worldPoint.y), 
            cc.v2(p3.x, p3.y), cc.v2(p4.x, p4.y), cc.v2(p1.x, p1.y)))
        {
            return true;
        }

        return false;
    };
    //菱形适配
    static checkSlantingSpIsCross(ndSp1: { getContentSize: () => any; anchorX: any; anchorY: any; convertToWorldSpaceAR: (arg0: cc.Vec2) => any; }, ratioW1: number, ratioH1: number, ndSp2: { getContentSize: () => any; anchorX: any; anchorY: any; convertToWorldSpaceAR: (arg0: cc.Vec2) => any; }, ratioW2: number, ratioH2: number) {
        let size1 = ndSp1.getContentSize();
        ratioW1 = ratioW1/(ratioW1+1);
        ratioH1 = ratioH1/(ratioH1+1);

        let rectArray1 = new Array();
        rectArray1.push(cc.v2(0,(1-ratioH1)*size1.height));
        rectArray1.push(cc.v2(ratioW1*size1.width, size1.height));
        rectArray1.push(cc.v2(size1.width, ratioH1*size1.height));
        rectArray1.push(cc.v2((1-ratioW1)*size1.width, 0));
        for (let i=0; i<rectArray1.length; ++i)
        {
            let anchorX = ndSp1.anchorX;
            let anchorY = ndSp1.anchorY;
            
            rectArray1[i].x -= size1.width*anchorX;
            rectArray1[i].y -= size1.height*anchorY;

            let pt = ndSp1.convertToWorldSpaceAR(cc.v2(rectArray1[i].x, rectArray1[i].y));
            rectArray1[i].x = pt.x;
            rectArray1[i].y = pt.y;
        }

        let size2 = ndSp2.getContentSize();
        ratioW2 = ratioW2/(ratioW2+1);
        ratioH2 = ratioH2/(ratioH2+1);
        let rectArray2 = new Array();
        rectArray2.push(cc.v2(0,(1-ratioH2)*size2.height));
        rectArray2.push(cc.v2(ratioW2*size2.width, size2.height));
        rectArray2.push(cc.v2(size2.width, ratioH2*size2.height));
        rectArray2.push(cc.v2((1-ratioW2)*size2.width, 0));
        for (let j=0; j<rectArray2.length; ++j)
        {
            let anchorX = ndSp2.anchorX;
            let anchorY = ndSp2.anchorY;

            rectArray2[j].x -= size2.width*anchorX;
            rectArray2[j].y -= size2.height*anchorY;
            let pt = ndSp2.convertToWorldSpaceAR(cc.v2(rectArray2[j].x, rectArray2[j].y));
            rectArray2[j].x = pt.x;
            rectArray2[j].y = pt.y;
        }

        let isCross = false;
        for (let k1=0; k1<rectArray1.length; ++k1)
        {
            for (let k2=0; k2<rectArray2.length; ++k2)
            {
                let nextIdx1 = k1+1;
                if (nextIdx1>=rectArray1.length)nextIdx1=0;
                let nextIdx2 = k2+1;
                if (nextIdx2>=rectArray2.length)nextIdx2=0;

                if (global.CommonClass.Geometry.isLineCorss(rectArray1[k1], rectArray1[nextIdx1], rectArray2[k2], rectArray2[nextIdx2]))
                {
                    isCross = true;
                    break;
                }
            }
        }
       
        if (!isCross)
        {
            isCross = (global.CommonClass.Geometry.isPointInTriangle(rectArray2[0], rectArray1[0], rectArray1[1], rectArray1[2])
                        || global.CommonClass.Geometry.isPointInTriangle(rectArray2[0], rectArray1[2], rectArray1[3], rectArray1[0])
                        || global.CommonClass.Geometry.isPointInTriangle(rectArray1[0], rectArray2[0], rectArray2[1], rectArray2[2])
                        || global.CommonClass.Geometry.isPointInTriangle(rectArray1[0], rectArray2[2], rectArray2[3], rectArray2[0]));
        }

        return isCross;
    };
}