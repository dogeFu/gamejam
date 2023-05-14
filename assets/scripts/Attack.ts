import { _decorator, Component, Node,Prefab,instantiate,Vec3, CCInteger, Collider2D,Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Attack')
export class Attack extends Component {
    @property({
        type:Prefab,
        tooltip:'击中特效'
    })
    eff:Prefab = null;

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
                this.hideWeapon(false);
            }
        }
    }

    shot() {
        // 判断是否还有剩余的羽毛
        // @ts-ignore
        if (!this.weaponNode && window.PlayManager.duckWeaponCount !== 0) {
            this.weaponNode = instantiate(this.weapon);
            this.weaponNode.parent = this.root;
            this.weaponNode.position = new Vec3(this.node.position);
            // 获取duck节点的碰撞组件
            const collider = this.weaponNode.getComponent(Collider2D);
            if (collider){
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
            // 更新UI
            // @ts-ignore
            window.PlayManager.duckAttack();
        }
    }

    // 击中boss或者boss武器时取消;
    onBeginContact(selfCollider, otherCollider, contact) {
        console.log('onBeginContact');
        
        const selfNode = selfCollider.node;
        let otherNode = otherCollider.node;
        if (selfNode === this.weaponNode || otherNode === this.weaponNode){
            otherNode = selfNode === this.weaponNode ? otherNode : selfNode;
        }
        console.log('duck 武器命中目标',otherNode.name);
        if(otherNode.name === 'boss' || otherNode.name=== 'bossWeapon') {
            contact.disable = true;
            this.hideWeapon(otherNode.name === 'boss');
        }
    }
    hideWeapon(hit:boolean) {
        if(hit) {
            // 击中目标要更新状态
            this.showHitEff(this.weaponNode)
        }
        this.weaponNode.removeFromParent();
        this.weaponNode = null;
        // 打完了子弹，输了
        // @ts-ignore
        if(window.PlayManager.duckWeaponCount === 0) {
            // @ts-ignore
            window.PlayManager.duckAttack();
        }
    }

    showHitEff(target:Node){
        if (this.eff) {
            const pos = target.position;
            const particle = instantiate(this.eff);
            particle.parent = target.parent;
            particle.setPosition(pos);
            setTimeout(()=>{
                if (particle) {
                    particle.removeFromParent();
                }
            },100)
        }
    }
}


