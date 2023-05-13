import { _decorator, Component, Node } from 'cc';
import {  HitManager } from './HitManager';
const { ccclass, property } = _decorator;

@ccclass('PlayManager')
export class PlayManager extends Component {
    @property(Node)
    duck:Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    play() {
        // 重置所有组件的状态;
        console.log('开始游戏,重置状态')
        if(this.duck) {
            this.duck.setPosition(0,0,0);
        }
        const hitManager = this.node.getComponent(HitManager);
        if (hitManager) {
            hitManager.reset();
        }
    }
}


