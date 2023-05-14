import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Collector')
export class Collector extends Component {
    @property(ParticleSystem)
    eff:ParticleSystem = null;
    
    // 播放收集效果
    collected() {
        // 移除掉身上的组件
        this.node.components.forEach((comp)=>{
            this.node.removeComponent(comp);
        })
        if(this.eff) {
            this.eff.play();
        }
        // this.node.removeFromParent();
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


