import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import {  HitManager } from './HitManager';
import { Background } from './Background';
import { Duck } from './Duck';
import { Suction } from './Suction';
const { ccclass, property } = _decorator;

@ccclass('PlayManager')
export class PlayManager extends Component {
    @property(Node)
    duck:Node = null;
    
    @property(Vec2)
    _startPos:Vec2 = new Vec2(0,0);

    @property(Vec2)
    get startPos () {
        return this._startPos;
    }

    set startPos (val:Vec2) {
        this._startPos = val;
        this.resetDuckPos();
    }

    start() {
        this.resetDuckPos();
    }

    update(deltaTime: number) {
        
    }

    play() {
        // 重置所有组件的状态;
        console.log('开始游戏,重置状态')
        this.resetDuckPos();
        const hitManager = this.node.getComponent(HitManager);
        if (hitManager) {
            hitManager.reset();
        }
        const background = this.node.getChildByName('Background');
        const backgroundComp = background.getComponent(Background);
        if (backgroundComp) {
            backgroundComp.reset();
        }

        const duckComp = this.duck?.getComponent(Duck);
        if (duckComp) {
            duckComp.reset();
        }

        const suctionComp = this.duck?.getComponent(Suction);
        if (suctionComp) {
            suctionComp.reset();
        }
    }

    resetDuckPos() {
        if(this.duck) {
            this.duck.setPosition(new Vec3(this._startPos.x,this._startPos.y,0));
        }
    }
}


