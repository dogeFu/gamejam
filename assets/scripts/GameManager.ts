import { _decorator, CCInteger, Component, Node } from 'cc';
import { LoginUiManager } from './LoginUiManager';
import { PlayManager } from './PlayManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    loginRoot:Node = null;

    @property(Node)
    playRoot:Node = null;

    @property(CCInteger)
    collectTarget:number = 3;

    start() {
        // @ts-ignore
        window.GameManager = this;
    }

    update(deltaTime: number) {

    }

    stopGame(win:boolean) {
        console.log('游戏结束');
        // 结束游戏
        if (this.playRoot) {
            this.playRoot.active = false;
            const playManager = this.playRoot.getComponent(PlayManager);
            playManager.stop();
        }
        if (this.loginRoot) {
            this.loginRoot.active = true;
            const loginUiManager = this.loginRoot.getComponent(LoginUiManager);
            loginUiManager.stopGame(win);
        }
    }

    playGame() {
        console.log('游戏开始');
        // 开始游戏
        if (this.loginRoot) {
            this.loginRoot.active = false;
        }
        if (this.playRoot) {
            this.playRoot.active = true;
            const playManager = this.playRoot.getComponent(PlayManager);
            playManager.play();
        }
    }

    updateCollected(count :number) {
        console.log('收集物数量：',count);
        if (count >= this.collectTarget) {
            if (this.playRoot) {
                this.playRoot.active = true;
                const hit = this.playRoot.getComponent('HitManager');
                if (hit) {
                    // @ts-ignore
                    hit.stopThrow()
                }
                setTimeout(()=>{
                    const boss = this.playRoot.getChildByName('boss')
                    if (boss) {
                        boss.active = true;
                    }
                })
            }
        }
    }
}