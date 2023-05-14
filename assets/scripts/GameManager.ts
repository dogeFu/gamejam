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

    handle:any;

    start() {
        // @ts-ignore
        window.GameManager = this;
    }

    update(deltaTime: number) {

    }

    stopGame(win:boolean) {
        console.log('游戏结束');
        if (this.handle) return;
        // 结束游戏
        if (this.playRoot) {
            const playManager = this.playRoot.getComponent(PlayManager);
            playManager.stop(win);
        }
        this.handle = setTimeout(()=>{
            if (this.loginRoot) {
                this.loginRoot.active = true;
                const loginUiManager = this.loginRoot.getComponent(LoginUiManager);
                loginUiManager.stopGame(win);
            }
            if (this.playRoot) {
                this.playRoot.active = false;
            }
            this.handle = null
        },1000)
    }

    playGame() {
        if (this.handle) {
            clearTimeout(this.handle)
            this.handle = null;
        }
        this.handle = null;
        console.log('游戏开始');
        // 开始游戏
        if (this.loginRoot) {
            this.loginRoot.active = false;
        }
        if (this.playRoot) {
            this.playRoot.active = true;
            setTimeout(()=>{

                const playManager = this.playRoot.getComponent(PlayManager);
                playManager.play();
            })
        }
    }

    
}