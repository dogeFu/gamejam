import { _decorator, Component, Node,Prefab,instantiate,Vec3, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

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

    weaponList:Node[] = [];
    handle:any;
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
                this.node.addChild(weapon);
                // 设置随机位置
                const y = this.getY();
                weapon.setPosition(new Vec3(-20,y,0));// 都从右边出来
                this.weaponList.push(weapon);
                this.handle = null;
            },Math.random()*1000)
        }
    }

    getY() {
        return Math.random() * 680 - 340;
    }

    updateBullet(deltaTime: number) {
        this.weaponList.forEach((weapon)=>{
            weapon.setPosition(new Vec3(weapon.position.x - this.speed*deltaTime,weapon.position.y,0));
            // 超出屏幕后销毁
            if (weapon.position.x < - 1280/2 -10) {
                weapon.removeFromParent();
                this.weaponList.splice(this.weaponList.indexOf(weapon),1);
            }
        })
    }
}


