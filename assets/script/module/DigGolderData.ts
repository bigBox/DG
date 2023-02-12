

const {ccclass, property} = cc._decorator;

@ccclass
export default class DigGolderData extends cc.Component {
    ID: number;
    speed: number;
    direct: number;
    digData: { curStandIdx: number; curDigIdx: number; digPerTime: number; timeDig: number; };
    constructor(){
        super();
        this.ID         = 0;
        this.name       = "";
        this.speed      = 400.0;
        this.direct     = 0;
        this.digData = {curStandIdx:-1, curDigIdx:-1, digPerTime:0, timeDig:0};
    };

    onLoad () {};
    setData(data)      //{ID, name}
    {
        this.ID         = data.ID;
        this.name       = data.name;
    };

    setID(ID)
    {
        this.ID = ID;
    };

    getID()
    {
        return this.ID;
    };

    setName(name)
    {
        this.name = name;
    };

    getName()
    {
        return this.name;
    };

    setSpeed(speed)
    {
        this.speed = speed;
    };

    getSpeed()
    {
        return this.speed;
    };

    setCurDigIdx(digIdx)
    {
        if (this.digData.curDigIdx != digIdx)
        {
            this.digData.curDigIdx = digIdx;

            if (digIdx < 0)
            {
                this.digData.timeDig = 0;
                this.digData.digPerTime = 0;
            }
            else
            {
                let item = global.Proxys.ProxyDigGold.getMapItem(digIdx);
                if (item != null)
                    this.digData.digPerTime = item.digPerTime;
            }
        }
    };

    getCurDigIdx()
    {
        return this.digData.curDigIdx;
    };

    getCurStandIdx()
    {
        return this.digData.curStandIdx;
    };

    getDirect()
    {
        return this.direct;
    };

    setDirect(direct)
    {
        this.direct = direct;
    };

    digMine(time)
    {
        let item = this.digData;
        item.timeDig += time;

        let timeLeft = item.digPerTime-item.timeDig; 
        return timeLeft;
    };

    clearDigTime()
    {
        this.digData.timeDig = 0;
    };

    getDigData()
    {
        return this.digData;
    };

    getCurDigItem()
    {
        let mapData = global.Proxys.ProxyDigGold.getMapData();

        if (this.digData!=null && this.digData.curDigIdx>=0)
        {
            return mapData[this.digData.curDigIdx];
        }

        return null;
    };

    start () {

    };
    // update (dt) {}
}
