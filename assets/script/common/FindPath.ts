

const {ccclass, property} = cc._decorator;

@ccclass
export default class FindPath {
    condition: any;
    map: { rowNum: number; colNum: number; data: any[]; };

    constructor() {
        this.map = { rowNum: 0, colNum: 0, data: new Array() };
        this.condition = null;
    };

    // use this for initialization
    onLoad() {

        //this.setMap([]);
        //this.searchRoad(0,0, 0, 3);
    };

    setMap(map) {
        this.map = map;

        /* this.map.rowNum = 5,
         this.map.colNum = 5,
         this.map.data = 
         [
             0, 1, 1, 0, 0,
             0, 0, 1, 0, 1,
             0, 1, 0, 0, 0,
             0, 0, 0, 1, 0,
             0, 1, 0, 1, 0,
         ];*/
    };

    setMapCell(idx, vaule) {
        let maxIdx = this.map.rowNum * this.map.colNum;

        if (idx < maxIdx)
            this.map.data[idx] = vaule;
    };

    setPassCondition(condition) {
        this.condition = condition;
    };

    passCondition(item) {
        return (item == 0 || item == null);
    };

    //其中的MAP.arr是二维数组
    search(startX, startY, endX, endY) {
        let openList = [];   //开启列表
        let closeList = [];  //关闭列表
        let result = [];      //结果数组
        let resultIdx = -1;   //结果数组在开启列表中的序号

        openList.push({ x: startX, y: startY, G: 0 });//把当前点加入到开启列表中，并且G是0

        var about = true;//因为需要阶梯走入所以用这个对XY,正存倒存判断
        do {
            let currentPoint = openList.pop();
            closeList.push(currentPoint);
            let surroundPoint = this.surroundPoint(currentPoint, about);
            about = !about
            for (let i in surroundPoint) {
                let item = surroundPoint[i];                //获得周围的四个点
                if (this.existList(item, closeList) < 0) {
                    //g 到父节点的位置
                    //如果是上下左右位置的则g等于10，斜对角的就是14
                    let g = currentPoint.G + ((currentPoint.x - item.x) * (currentPoint.y - item.y) == 0 ? 10 : 14);
                    if (this.existList(item, openList) < 0) {
                        //如果不在开启列表中
                        //计算H，通过水平和垂直距离进行确定
                        item['H'] = Math.abs(endX - item.x) * 10 + Math.abs(endY - item.y) * 10;
                        item['G'] = g;
                        item['F'] = item.H + item.G;
                        item['parent'] = currentPoint;
                        openList.push(item);
                    }
                    else {                                  //存在在开启列表中，比较目前的g值和之前的g的大小
                        let index = this.existList(item, openList);
                        //如果当前点的g更小
                        if (g < openList[index].G) {
                            openList[index].parent = currentPoint;
                            openList[index].G = g;
                            openList[index].F = g + openList[index].H;
                        }
                    }
                }
            }
            //如果开启列表空了，没有通路，结果为空
            if (openList.length == 0)
                break;
            openList.sort(this.sortF);//这一步是为了循环回去的时候，找出  F 值最小的, 将它从 "开启列表" 中移掉
        } while ((resultIdx = this.existList({ x: endX, y: endY }, openList)) < 0);
        //判断结果列表是否为空
        if (resultIdx < 0) {
            result = [];
        }
        else {
            let currentObj = openList[resultIdx];
            do {
                //把路劲节点添加到result当中
                result.unshift({
                    x: currentObj.x,
                    y: currentObj.y
                });
                currentObj = currentObj.parent;
            } while (currentObj.x != startX || currentObj.y != startY);

        }

        // for (let key in result) {
        //     let item = result[key];
        //         global.Instance.Log.debug('( ', item.x+ item.y+ ' )->>');
        // }
        return result;
    };

    //用F值对数组排序
    sortF(a, b) {
        return b.F - a.F;
    };

    //获取周围四个点的值
    surroundPoint(curPoint, about) {
        let x = curPoint.x, y = curPoint.y;

        let surrounds = [];

        let self = this;

        let condition = this.condition;
        if (condition == null)
            condition = this.passCondition;

        let canPass = function (item) {
            let idx = item.x * self.map.colNum + item.y;
            return (item.x >= 0 &&                            //判断是否在地图上
                item.y >= 0 &&
                item.x < self.map.rowNum &&
                item.y < self.map.colNum &&
                condition(self.map.data[idx]));            //判断是否可以通过
        };
        {
            if (canPass({ x: x, y: y - 1 }))
                surrounds.push({ x: x, y: y - 1 });

            if (canPass({ x: x + 1, y: y }))
                surrounds.push({ x: x + 1, y: y });

            if (canPass({ x: x, y: y + 1 }))
                surrounds.push({ x: x, y: y + 1 });

            if (canPass({ x: x - 1, y: y }))
                surrounds.push({ x: x - 1, y: y });
        }
        // if (about) {
        //     if (canPass({ x: x, y: y - 1 }))
        //         surrounds.push({ x: x, y: y - 1 });

        //     if (canPass({ x: x + 1, y: y }))
        //         surrounds.push({ x: x + 1, y: y });

        //     if (canPass({ x: x, y: y + 1 }))
        //         surrounds.push({ x: x, y: y + 1 });

        //     if (canPass({ x: x - 1, y: y }))
        //         surrounds.push({ x: x - 1, y: y });
        // } else {
        //     if (canPass({ x: x, y: y - 1 }))
        //         surrounds.unshift({ x: x, y: y - 1 });

        //     if (canPass({ x: x + 1, y: y }))
        //         surrounds.unshift({ x: x + 1, y: y });

        //     if (canPass({ x: x, y: y + 1 }))
        //         surrounds.unshift({ x: x, y: y + 1 });

        //     if (canPass({ x: x - 1, y: y }))
        //         surrounds.unshift({ x: x - 1, y: y });
        // }


        return surrounds;
    };

    //判断点是否存在在列表中，是的话返回的是序列号
    existList(point, list) {
        for (let i in list) {
            if (point.x == list[i].x && point.y == list[i].y) {
                return Number(i);
            }
        }
        return -1;
    };
}
