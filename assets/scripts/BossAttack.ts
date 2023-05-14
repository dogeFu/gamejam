import { _decorator, Component, Node,Prefab,instantiate,Vec3,Vec2, CCInteger,Collider2D,Contact2DType,Label } from 'cc';
const { ccclass, property } = _decorator;

const radio = 720/1280;
@ccclass('BossAttack')
export class BossAttack extends Component {
    @property({
        type:Prefab,
        tooltip:'子弹预制体'
    })
    bullet:Prefab = null;

    @property({
        type:CCInteger,
        tooltip:'发射速度'
    })
    speed:number = 1;

    @property({
        type:CCInteger,
        tooltip:'子弹数量'
    })
    maxBulletCount:number = 1;

    @property({
        type:Vec2,
        tooltip:'子弹发射起始范围区间'
    })
    area:Vec2 = new Vec2(100,100);

    @property({
        type:CCInteger,
        tooltip:'子弹发射间隔[0,该值]'
    })
    timeout:number = 2000;

    weaponList:Node[] = [];
    handle:any;

    @property({
        type:Node,
        tooltip:'duck节点'
    })
    duckNode:Node = null;

    start() {
        // 给boss添加碰撞回调
        const collider = this.node.getComponent(Collider2D);
        if (collider){
            collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginB, this);
        }
    }

    onBeginB(selfCollider, otherCollider, contact) {
        const selfNode = selfCollider.node;
        let otherNode = otherCollider.node;
        const boss = this.node
        if (selfNode === boss || otherNode === boss){
            otherNode = selfNode === boss ? otherNode : selfNode;
        }
        if(otherNode.name === 'weapon') {
            // @ts-ignore
            window.PlayManager.onBossHit();
        }
    }

    update(deltaTime: number) {
        this.shot();
        this.updateBullet(deltaTime);
    }

    shot() {
        if (this.weaponList.length < this.maxBulletCount) {
            if (this.handle) return;
            this.handle = setTimeout(()=>{
                const weapon = instantiate(this.bullet)
                this.node.parent.addChild(weapon);
                // 设置随机位置
                const pos = this.getStartPos();
                weapon.setPosition(pos);// 都从右边出来
                this.weaponList.push(weapon);
                // 获取duck节点的碰撞组件
                const collider = weapon.getComponent(Collider2D);
                if (collider){
                    collider.on(Contact2DType.BEGIN_CONTACT,(selfCollider, otherCollider, contact)=>{
                        const selfNode = selfCollider.node;
                        let otherNode = otherCollider.node;
                        if (selfNode === weapon || otherNode === weapon){
                            otherNode = selfNode === weapon ? otherNode : selfNode;
                        }
                        if(otherNode.name === 'duck' || otherNode.name === 'weapon') {
                            console.log('boss 武器命中duck');
                            this.hideWeapon(weapon);
                            contact.disable = true;
                        }
                    }, this);
                }
                this.handle = null;
            },Math.random()*this.timeout)
        }
    }

    getStartPos() {
        const pos = this.node.position;
        const x = Math.random()* this.area.x;
        const y = Math.random()* this.area.y;
        return new Vec3(pos.x+x,pos.y+y,0);
    }

    updateBullet(deltaTime: number) {
        this.weaponList.forEach((weapon)=>{
            // 往对角线方向打！
            const offset = this.speed;
            weapon.setPosition(new Vec3(weapon.position.x - offset,weapon.position.y - offset*radio,0));
            // 超出屏幕后销毁
            if (weapon.position.x < - 1280/2 -10 || weapon.position.y < -720/2 -10) {
                this.hideWeapon(weapon);
            }
        })
    }

    hideWeapon(weapon:Node) {
        weapon.removeFromParent();
        this.weaponList.splice(this.weaponList.indexOf(weapon),1);
        console.log('移除boss子弹');
    }

    reset() {
        this.weaponList.forEach((weapon)=>{
            weapon.removeFromParent();
        })
        this.weaponList = [];
    }
}


