import { _decorator, Component, Node,Prefab,instantiate,Vec3,Vec2, CCInteger } from 'cc';
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
        tooltip:'子弹区间'
    })
    area:Vec2 = new Vec2(100,100);

    @property({
        type:CCInteger,
        tooltip:'发射间隔（最大）'
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
                weapon.removeFromParent();
                this.weaponList.splice(this.weaponList.indexOf(weapon),1);
                console.log('移除boss子弹');
            }
        })
    }
}


