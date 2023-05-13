import { _decorator, Component, Node,Prefab,instantiate,Vec3, CCInteger, Vec2 } from 'cc';
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
    speed:number = 10;

    // boss在右上角
    @property(Vec2) 
    targetPos:Vec2 = new Vec2(1280/2,720/2);

    weaponNode:Node = null;

    start() {

    }

    update(deltaTime: number) {
        if (this.weaponNode) {
            // 更新位置
            const offset = this.speed;
            const pos = this.node.getWorldPosition();
            const dir = new Vec2(this.targetPos).subtract(new Vec2(pos.x,pos.y));
            const radio = dir.y/dir.x;
            const weaponPos = this.weaponNode.position;
            this.weaponNode.setPosition(new Vec3(weaponPos.x+offset,weaponPos.y+radio*offset,0));
            // const x = pos.x + weaponPos.x;
            // const y = pos.y + weaponPos.y;
            // if (x > 1280/2 || y > 720/2) {
            //     this.weaponNode.removeFromParent();
            //     this.weaponNode = null;
            // }
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


