import { _decorator, Component, Node, Vec3,CCBoolean, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoundChecker')
export class BoundChecker extends Component {
    @property(Node)
    target:Node = null;

    @property(CCInteger)
    bottom:number = -360;

    // x：下边界
    // y：上边界
    @property(CCInteger)
    top:number = 360;

    start() {

    }

    update(deltaTime: number) {
        // this.target.position = new Vec3(this.target.position.x, this.target.position.y - 10,0)
        const pos = this.target.position;
        if (pos.y < this.bottom || pos.y > this.top) {
            // @ts-ignore
            window.GameManager.stopGame(false)
        }
    }
}


