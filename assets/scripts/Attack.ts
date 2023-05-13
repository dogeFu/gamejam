import { _decorator, Component, Node,Prefab,instantiate,Vec3, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Attack')
export class Attack extends Component {
    @property({
        type:Prefab,
        tooltip:'武器预制体'
    })
    weapon:Prefab = null;

    @property({
        type:CCInteger,
        tooltip:'发射速度'
    })
    speed:number = 1;

    weaponNode:Node = null;
    start() {

    }

    update(deltaTime: number) {
        if (this.weaponNode) {
            // 更新位置
            const offset = deltaTime * this.speed;
            const pos = this.weaponNode.position;
            this.weaponNode.setPosition(new Vec3(pos.x+offset,pos.y,0));
        }
    }

    shot() {
        if (!this.weaponNode) {
            this.weaponNode = instantiate(this.weapon);
            this.weaponNode.parent = this.node;
            this.weaponNode.position = new Vec3(0,0,0);
        }
    }

    // 击中boss时移除武器
    onHit() {

    }
}


