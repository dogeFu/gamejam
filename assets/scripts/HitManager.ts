import { _decorator, CCInteger, Component, Node,
    Prefab,instantiate,Vec3,PhysicsSystem2D,Contact2DType,ParticleSystem } from 'cc';
import { Collector } from './Collector';
import { Barrier } from './Barrier';
const { ccclass, property } = _decorator;

import { Audios } from './Audios';

const width = 1280;

@ccclass('HitManager')
export class HitManager extends Component {

    @property({
        type:Prefab,
        tooltip:'收集物预制体'
    })
    collectorAsset:Prefab = null;

    @property({
        type:Prefab,
        tooltip:'障碍物-减羽毛'
    })
    barrierAsset:Prefab = null;

    @property({
        type:Prefab,
        tooltip:'障碍物-死亡'
    })
    barrierDieAsset:Prefab = null;

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
    barrierDieNode :Node = null;
    public throwSwitch = false;

    public AudioComponent: Audios;

    reset() {
        this.stopThrow();
        this.updateCollector(-this.collected);
    }

    hitTest :Record<string,Function> = {
        duck: (selfCollider,otherCollider,contact)=>{
            const hitNode = otherCollider.node;
            contact.disable = true;
            if(hitNode.name === 'collector') {
                // 收集物
                this.hitCollector(hitNode);
            }else if(hitNode.name === 'barrier') {
                this.hitBarrier(hitNode,false);
            }else if (hitNode.name === 'barrierDie') {
                this.hitBarrier(hitNode,true);
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
                this.hitBarrier(selfCollider.node,false)
            }
        },
        barrierDie:(selfCollider,otherCollider,contact)=>{
            const hitNode = otherCollider.node
            if(hitNode.name === 'duck') {
                this.hitBarrier(selfCollider.node,true)
            }
        },
    }

    hitCollector(collector:Node) {
        // collector.removeFromParent();
        this.collectorList.splice(this.collectorList.indexOf(collector),1);
        const comp = collector.getComponent(Collector);
        if (comp) {
            comp.hit()
        }
        this.updateCollector(1);
        this.AudioComponent.playEffect(0);
    }

    hitBarrier(barrier:Node,die:boolean) {
        // 障碍物
        this.barrierList.splice(this.barrierList.indexOf(barrier),1);
        // barrier.removeFromParent();
        const comp = barrier.getComponent(Barrier);
        if (comp) {
            comp.hit()
        }
        this.AudioComponent.playEffect(1);
        if (die) {
            // @ts-ignore
            window.GameManager.stopGame(false,'被撞死了鸭');
        }else {
            // 羽毛减1
            this.updateCollector(-1);
        }
    }

    start() {
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            // PhysicsSystem2D.instance.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            // PhysicsSystem2D.instance.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }

        this.AudioComponent = this.getComponent(Audios);
    }

    // 
    onBeginContact(selfCollider, otherCollider, contact) {
        console.log('onBeginContact');
        const selfNode = selfCollider.node;
        this.hitTest[selfNode.name]?.(selfCollider, otherCollider, contact)
    }

    onEndContact(selfCollider, otherCollider, contact) {
        console.log('onEndContact');
        // debugger;
    }

    // 随机生成最多
    update(deltaTime: number) {
        // debugger;
        this.doThrow();
    }

    addCollector() {
        if (this.addCollectorHandle) {
            return;
        }
        // 1秒内随机时间生成一个收集物
        this.addCollectorHandle = setTimeout(() => {
            const collector = instantiate(this.collectorAsset);
            this.node?.addChild(collector);
            
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
            this.node?.addChild(barrier);
            this.barrierList.push(barrier);
            this.addBarrierHandle = null;
        },this.random() * 1000);
        
        // 生产会挂掉的障碍物
        setTimeout(() => {
            if (!this.throwSwitch) return;
            if (!this.barrierDieNode && this.barrierDieAsset) {
                const barrier = instantiate(this.barrierDieAsset);
                const y = this.getY();
                barrier.setPosition(new Vec3(width/2,y,0));// 都从右边出来
                this.node?.addChild(barrier);
                this.barrierDieNode = barrier;
            }
        },this.random() * 2000);
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
        // @ts-ignore
        window.PlayManager?.updateCollected(this.collected)
    }

    // 停止投送
    stopThrow() {
        this.throwSwitch = false;
        if (this.addBarrierHandle) {
            clearTimeout(this.addBarrierHandle)
            this.addBarrierHandle = null;
        }
        if (this.addCollectorHandle) {
            clearTimeout(this.addCollectorHandle)
            this.addCollectorHandle = null;
        }
        this.collectorList.forEach(node=>node.setParent(null))
        this.barrierList.forEach(node=>node.setParent(null))
        this.collectorList = [];
        this.barrierList = [];
        if (this.barrierDieNode) {
            this.barrierDieNode.removeFromParent();
            this.barrierDieNode = null;
        }
    }

    // 开始投送
    startThrow() {
        this.throwSwitch = true;
    }

    doThrow() {
        if (!this.throwSwitch) return;
        if (this.collectorList.length < this.collectorNum) {
            this.addCollector();
        }
        const cLength = this.collectorList.length;
        for (let index = cLength - 1; index >=0; index--) {
            const collector = this.collectorList[index];
            collector.setPosition(new Vec3(collector.position.x - this.collectorSpeed,collector.position.y,0));
            // 超出屏幕后销毁
            if (collector.position.x < - width/2 -10) {
                this.collectorList.splice(index,1);
                collector.removeFromParent();
            }
        }
 

        if (this.barrierList.length < this.barrierNum) {
            this.addBarrier();
        }
        const bLength = this.barrierList.length;
        for (let index = bLength - 1; index >=0; index--) {
            const barrier = this.barrierList[index];
            barrier.setPosition(new Vec3(barrier.position.x - this.barrierSpeed,barrier.position.y,0));
            // 超出屏幕后销毁
            if (barrier.position.x < - width/2 -10) {
                this.barrierList.splice(index,1);
                barrier.removeFromParent();
            }
        }

        if(this.barrierDieNode) {
            const barrier = this.barrierDieNode;
            barrier.setPosition(new Vec3(barrier.position.x - this.barrierSpeed/2,barrier.position.y,0));
            // 超出屏幕后销毁
            if (barrier.position.x < - width/2 -10) {
                barrier.removeFromParent();
                this.barrierDieNode = null;
            }
        }
    }
}


