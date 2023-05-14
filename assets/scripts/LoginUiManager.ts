import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoginUiManager')
export class LoginUiManager extends Component {
    @property({
        type:Node
    })
    stopTip:Node = null;

    @property({
        type:Node
    })
    winTip:Node = null;

    @property({
        type:Node
    })
    title:Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    stopGame(win:boolean) {
        if (win) {
            this.winTip.active = true;
            this.stopTip.active = false;
        }
        else {
            this.stopTip.active = true;
            this.winTip.active = false;
        }
        this.title.active = false;
    }
}


