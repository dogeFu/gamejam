import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayManager')
export class PlayManager extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    play() {
        // 重置所有组件的状态;
        console.log('开始游戏,重置状态')
    }
}


