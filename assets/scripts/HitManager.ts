import { _decorator, CCInteger, Component, Node,
    Prefab,instantiate,Vec3,PhysicsSystem2D,Contact2DType,Label } from 'cc';
const { ccclass, property } = _decorator;

const width = 1280;

@ccclass('HitManager')
export class HitManager extends Component {
    @property({
        type:Label
    })
    maoLabel:Label = null;

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
    addCollectorHandle:any;
    addBarrierHandle:any;
    collected:number = 0;

    reset() {
        if (this.addBarrierHandle) {
            clearTimeout(this.addBarrierHandle)
        }
        if (this.addCollectorHandle) {
            clearTimeout(this.addCollectorHandle)
        }
        this.collectorList.forEach(node=>node.removeFromParent())
        this.barrierList.forEach(node=>node.removeFromParent())
        this.collectorList = [];
        this.barrierList = [];

        this.updateCollector(-this.collected);
    }
    hitTest :Record<string,Function> = {
        duck: (selfCollider,otherCollider,contact)=>{
            const hitNode = otherCollider.node;
            if(hitNode.name === 'collector') {
                // 收集物
                this.hitCollector(hitNode);
            }else if(hitNode.name === 'barrier') {
                this.hitBarrier(hitNode);
            }
        },
        collector:(selfCollider,otherCollider,contact)=>{
            const hitNode = otherCollider.node
            if(hitNode.name === 'duck') {
                this.hitCollector(selfCollider.node)
            }
        },
        barrier:(selfCollider,otherCollider,contact)=>{
            const hitNode = otherCollider.node
            if(hitNode.name === 'duck') {
                this.hitBarrier(selfCollider.node)
            }
        },
    }

    hitCollector(collector:Node) {
        this.collectorList.splice(this.collectorList.indexOf(collector),1);
        collector.removeFromParent();
        this.updateCollector(1);
        
    }

    hitBarrier(barrier:Node) {
        // 障碍物
        this.barrierList.splice(this.barrierList.indexOf(barrier),1);
        barrier.removeFromParent();
        // @ts-ignore
        window.GameManager.stopGame(false);
    }

    start() {
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            // PhysicsSystem2D.instance.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            // PhysicsSystem2D.instance.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }
    // 
    onBeginContact(selfCollider, otherCollider, contact) {
        console.log('onBeginContact');
        const selfNode = selfCollider.node;
        this.hitTest[selfNode.name]?.(selfCollider, otherCollider, contact)
    }

    onEndContact(selfCollider, otherCollider, contact) {
        console.log('onEndContact');
        debugger;
    }

    // 随机生成最多
    update(deltaTime: number) {

        // debugger;
        if (this.collectorList.length < this.collectorNum) {
            this.addCollector();
        }
        this.collectorList.forEach((collector) => {
            // 根据收集物速度移动
            collector.setPosition(new Vec3(collector.position.x - this.collectorSpeed,collector.position.y,0));
            // 超出屏幕后销毁
            if (collector.position.x < - width/2 -10) {
                this.collectorList.splice(this.collectorList.indexOf(collector),1);
                collector.removeFromParent();
            }
        });

        if (this.barrierList.length < this.barrierNum) {
            this.addBarrier();
        }
        this.barrierList.forEach((barrier) => {
            // 根据障碍物速度移动
            barrier.setPosition(new Vec3(barrier.position.x - this.barrierSpeed,barrier.position.y,0));
            // 超出屏幕后销毁
            if (barrier.position.x < - width/2 -10) {
                barrier.removeFromParent();
                this.barrierList.splice(this.barrierList.indexOf(barrier),1);
            }
        });
    }

    addCollector() {
        if (this.addCollectorHandle) {
            return;
        }
        // 1秒内随机时间生成一个收集物
        this.addCollectorHandle = setTimeout(() => {
            const collector = instantiate(this.collectorAsset);
            this.canvas?.addChild(collector);
            
            const y = this.getY();
            collector.setPosition(new Vec3(width/2,y,0));// 都从右边出来
            this.collectorList.push(collector);
            this.addCollectorHandle = null;
        },this.random() * 1000);
    }

    addBarrier() {
        // 1秒内随机时间生成一个障碍物
        if (this.addBarrierHandle) {
            return;
        }
        this.addBarrierHandle = setTimeout(() => {
            const barrier = instantiate(this.barrierAsset);
            const y = this.getY();
            barrier.setPosition(new Vec3(width/2,y,0));// 都从右边出来
            this.canvas?.addChild(barrier);
            this.barrierList.push(barrier);
            this.addBarrierHandle = null;
        },this.random() * 1000);
    }

    // 生成[-360,360]y轴随机位置
    getY() {
        return this.random() * 680 - 340;
    }

    // return 0-1
    random() {
        // 生成[0,1]的随机数
        const random = Math.random();
        // console.log('随机数',random);
        return random;
    }

    updateCollector(count:number) {
        this.collected+=count;
        const str = `X ${this.collected}`
        if (this.maoLabel) {
            this.maoLabel.string = str;
        }
        console.log('收集物数量：',this.collected);
    }
}


