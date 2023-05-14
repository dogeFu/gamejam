import { _decorator, Component, Node,Prefab,instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Barrier')
export class Barrier extends Component {
    @property(Prefab)
    eff:Prefab = null;
    
    // 播放收集效果
    hit() {
        // 移除掉身上的组件
        this.node.components.forEach((comp)=>{
            this.node.removeComponent(comp);
        })
        if (this.eff) {
            const pos = this.node.position;
            // 创建粒子实例
            const particle = instantiate(this.eff);
            particle.parent = this.node.parent;
            particle.setPosition(pos);
            particle.setScale(0.3,0.3,1);
            setTimeout(()=>{
                if (particle) {
                    particle.removeFromParent();
                }
                if (this.node) {
                    this.node.removeFromParent();
                }
            },1000)
        }else {
            this.node.removeFromParent();
        }
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


