import { _decorator, Component, Node,Prefab,instantiate,Vec3, CCInteger, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Attack')
export class Attack extends Component {
    @property({
        type:Node,
        tooltip:'根节点，用来挂子弹'
    })
    root:Node = null;

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

    @property({
        type:Node,
        tooltip:'boss节点'
    })
    bossBode:Node = null;

    weaponNode:Node = null;

    start() {

    }

    update(deltaTime: number) {
        if (this.weaponNode) {
            // 更新位置
            const offset = this.speed;
            // 人物位置
            const pos = this.node.position;
            const bossPos = this.bossBode.position;
            const dir = new Vec3(bossPos).subtract(pos);
            const radio = dir.y/dir.x;
            const weaponPos = this.weaponNode.position;
            this.weaponNode.setPosition(new Vec3(weaponPos.x+offset,weaponPos.y+radio*offset,0));
            const x = weaponPos.x;
            const y = weaponPos.y;
            if (x > 1280/2 || y > 720/2) {
                this.weaponNode.removeFromParent();
                this.weaponNode = null;
            }
        }
    }

    shot() {
        if (!this.weaponNode) {
            this.weaponNode = instantiate(this.weapon);
            this.weaponNode.parent = this.root;
            this.weaponNode.position = new Vec3(this.node.position);
        }
    }

    // 击中boss时移除武器
    onHit() {

    }
}


