import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


class GameManager {
    public duck: Node = null;

    setDuck(duck:Node) {
        this.duck = duck;
    }

    start() {

    }

    stop() {
        console.log('游戏结束');
        // 结束游戏
    }

    next() {

    }
}


export default new GameManager();
