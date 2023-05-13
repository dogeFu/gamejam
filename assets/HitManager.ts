import { Canvas } from 'cc';
import { _decorator, CCInteger, Component, Node,Prefab,instantiate,Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HitManager')
export class HitManager extends Component {
    @property({
        type:Node
    })
    canvas:Node = null;

    @property({
        type:Prefab,
        tooltip:'收集物预制体'
    })
    collectorAsset:Prefab = null;

    @property({
        type:Prefab,
        tooltip:'障碍物预制体'
    })
    barrierAsset:Prefab = null;

    @property({
        type:CCInteger,
        tooltip:'同屏最多的收集物数量'
    })
    collectorNum:number = 1;

    @property({
        type:CCInteger,
        tooltip:'收集物速度'
    })
    collectorSpeed:number = 1;

    @property({
        type:CCInteger,
        tooltip:'同屏最多的障碍物数量'
    })
    barrierNum:number = 1;

    @property({
        type:CCInteger,
        tooltip:'障碍物速度'
    })
    barrierSpeed:number = 1;

    public collectorList:Node[] = [];
    public barrierList:Node[] = [];
    
    start() {

    }

    // 随机生成最多
    update(deltaTime: number) {
        if (this.collectorList.length < this.collectorNum) {
            this.addCollector();
        }
        this.collectorList.forEach((collector) => {

        });
    }

    addCollector() {
        const collector = instantiate(this.collectorAsset);
        this.node.addChild(collector);
        // 随机位置
        collector.position = new Vec2(0,0);
        this.collectorList.push(collector);
    }
}


